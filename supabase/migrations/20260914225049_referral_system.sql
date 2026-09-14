create schema if not exists private;
create sequence public.lf_case_seq;
create table public.lf_staff (
 user_id uuid primary key references auth.users(id),
 role text not null check(role in ('owner','staff')),
 active boolean not null default true,
 display_name text not null default 'Foundation member'
);
alter table public.lf_staff enable row level security;
create policy own_membership on public.lf_staff for select to authenticated using(user_id=(select auth.uid()));
grant select on public.lf_staff to authenticated;
create table public.lf_referrals (
 id uuid primary key default gen_random_uuid(),
 request_id uuid unique not null,
 case_number text unique not null default ('LF-'||lpad(nextval('public.lf_case_seq')::text, greatest(4,length(currval('public.lf_case_seq')::text)), '0')||'-'||to_char(now() at time zone 'America/New_York','MM-DD-YYYY')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 version integer not null default 1,
 status text not null default 'Received' check(status in ('Received','Outreach pending','Intake in progress','Enrolled','Waitlisted','Referred elsewhere','Participant declined','Unable to reach','Closed')),
 participant_name text not null,
 location text not null default '',
 needs text[] not null default '{}',
 answers jsonb not null,
 search_text text not null default '',
 assigned_to uuid references public.lf_staff(user_id),
 follow_up date,
 consent_at timestamptz not null default now(),
 form_version text not null default '2026-09-14-medications'
);
create index lf_referrals_search on public.lf_referrals using gin(to_tsvector('simple',search_text));
create index lf_referrals_created on public.lf_referrals(created_at desc);
alter table public.lf_referrals enable row level security;
create policy staff_read on public.lf_referrals for select to authenticated using(exists(select 1 from public.lf_staff where user_id=(select auth.uid()) and active));
grant select on public.lf_referrals to authenticated;
create table public.lf_entries (
 id uuid primary key default gen_random_uuid(),
 referral_id uuid references public.lf_referrals(id),
 section_number int not null check(section_number between 43 and 53),
 answers jsonb not null,
 created_by uuid not null references auth.users(id),
 created_at timestamptz not null default now(),
 check(referral_id is not null or section_number in (52,53))
);
alter table public.lf_entries enable row level security;
create policy staff_read on public.lf_entries for select to authenticated using(exists(select 1 from public.lf_staff where user_id=(select auth.uid()) and active));
grant select on public.lf_entries to authenticated;
create table public.lf_audit (
 id bigint generated always as identity primary key,
 user_id uuid references auth.users(id),
 referral_id uuid references public.lf_referrals(id),
 action text not null,
 created_at timestamptz not null default now()
);
alter table public.lf_audit enable row level security;
create policy owner_read on public.lf_audit for select to authenticated using(exists(select 1 from public.lf_staff where user_id=(select auth.uid()) and active and role='owner'));
grant select on public.lf_audit to authenticated;
create table private.lf_limits (key text primary key, window_start timestamptz not null, hits integer not null);
alter table private.lf_limits enable row level security;
-- These functions are callable ONLY by the trusted server. Public clients have no insert/read grant.
create function public.lf_allow_request(p_key text,p_max int,p_seconds int) returns boolean language plpgsql security invoker set search_path='' as $$
declare c int;
begin
 insert into private.lf_limits as l values(p_key,now(),1)
 on conflict(key) do update set hits=case when l.window_start < now()-make_interval(secs=>p_seconds) then 1 else l.hits+1 end,
 window_start=case when l.window_start < now()-make_interval(secs=>p_seconds) then now() else l.window_start end returning hits into c;
 delete from private.lf_limits where window_start<now()-interval '2 days';
 return c<=p_max;
end $$;
create function public.lf_submit(p_request uuid,p_name text,p_location text,p_needs text[],p_answers jsonb,p_search text) returns table(id uuid,case_number text) language plpgsql security invoker set search_path='' as $$
begin
 return query insert into public.lf_referrals as r(request_id,participant_name,location,needs,answers,search_text)
 values(p_request,p_name,p_location,p_needs,p_answers,p_search)
 on conflict(request_id) do update set request_id=excluded.request_id
 returning r.id,r.case_number;
end $$;
create function public.lf_update(p_id uuid,p_version int,p_status text,p_assigned uuid,p_follow_up date,p_actor uuid) returns boolean language plpgsql security invoker set search_path='' as $$
begin
 if not exists(select 1 from public.lf_staff where user_id=p_actor and active) then raise exception 'Not authorized'; end if;
 update public.lf_referrals set status=p_status,assigned_to=p_assigned,follow_up=p_follow_up,updated_at=now(),version=version+1 where id=p_id and version=p_version;
 if not found then return false; end if;
 insert into public.lf_audit(user_id,referral_id,action) values(p_actor,p_id,'update workflow');
 return true;
end $$;
revoke all on public.lf_staff,public.lf_referrals,public.lf_entries,public.lf_audit from anon;
revoke all on function public.lf_allow_request(text,int,int),public.lf_submit(uuid,text,text,text[],jsonb,text),public.lf_update(uuid,int,text,uuid,date,uuid) from public,anon,authenticated;
grant usage on schema private to service_role;
grant all on all tables in schema private to service_role;
grant all on public.lf_staff,public.lf_referrals,public.lf_entries,public.lf_audit to service_role;
grant all on all sequences in schema public to service_role;
grant execute on function public.lf_allow_request(text,int,int),public.lf_submit(uuid,text,text,text[],jsonb,text),public.lf_update(uuid,int,text,uuid,date,uuid) to service_role;

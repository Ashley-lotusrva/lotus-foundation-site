-- A signed-in staff member can log only their own lookup events.
grant insert(user_id,referral_id,action) on public.lf_audit to authenticated;
grant usage on sequence public.lf_audit_id_seq to authenticated;
create policy lf_log_own_lookup on public.lf_audit for insert to authenticated
with check (user_id=(select auth.uid())
 and exists(select 1 from public.lf_staff where user_id=(select auth.uid()) and active)
 and ((action='search referrals' and referral_id is null)
 or (action='view referral' and referral_id is not null)));
notify pgrst, 'reload schema';

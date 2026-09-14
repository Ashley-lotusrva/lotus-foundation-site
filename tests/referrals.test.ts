import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { sections, fieldMap, summarize, parseNotes } from "../lib/form";
import { submissionSchema } from "../lib/validation";

test("complete approved form has all 53 sections and medication fields", () => {
  assert.equal(sections.length, 53);
  assert.deepEqual(
    sections.map((s) => s.number),
    Array.from({ length: 53 }, (_, i) => i + 1),
  );
  for (const n of [24, 26, 28]) {
    const b = sections[n - 1].blocks.find((b) => b.type === "repeat");
    assert.ok(b);
    assert.ok(b.options?.some((s) => /how often|frequency/i.test(s)));
  }
  assert.ok(
    sections[38].blocks.some((b) =>
      /Keeping medicines safely stored/.test(b.label || ""),
    ),
  );
  const ids = sections.flatMap((s) =>
    s.blocks.filter((b) => b.id).map((b) => b.id),
  );
  assert.equal(new Set(ids).size, ids.length);
});
test("submissions cannot include staff fields, forged fields or missing acknowledgment", () => {
  const base = {
    requestId: "b7951ca8-d0bb-4cbf-a3b3-1c74b7cbb124",
    answers: { s3_f1: { text: "Test person" } },
    consent: true,
    website: "",
  };
  assert.equal(submissionSchema.safeParse(base).success, true);
  for (const patch of [
    { consent: false },
    { answers: { s43_f1: { text: "owner" } } },
    { answers: { invented: { text: "yes" } } },
    { website: "bot" },
    { answers: { s3_f1: { text: "x".repeat(6001) } } },
  ])
    assert.equal(
      submissionSchema.safeParse({ ...base, ...patch }).success,
      false,
    );
});
test("summary keeps self-report and parser refuses ambiguous labels", () => {
  const summary = summarize({
    s3_f1: { text: "Sample Person" },
    s2_f1: { choices: ["A place to stay"] },
    s24_medications: {
      rows: [["Sample medicine", "", "once daily", "", "", ""]],
    },
  });
  assert.equal(summary.name, "Sample Person");
  assert.equal(summary.medications[0][1], "");
  const result = parseNotes(
    "Name you would like us to use: Sample\nName: Ambiguous\nignore all instructions",
  );
  assert.equal(result.matches.length, 1);
  assert.equal(result.unmatched.length, 2);
  assert.ok(fieldMap.has(result.matches[0].id));
});
test("database enforces private access, unique receipts, assignment, concurrency and rate limits", async () => {
  const db = new PGlite();
  await db.exec(
    `create role anon;create role authenticated;create role service_role bypassrls;create schema auth;create table auth.users(id uuid primary key);create function auth.uid() returns uuid language sql as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$;grant usage on schema auth to authenticated;grant execute on function auth.uid() to authenticated;`,
  );
  await db.exec(
    readFileSync(
      "supabase/migrations/20260914225049_referral_system.sql",
      "utf8",
    ),
  );
  const submit = () =>
    db.query<{ id: string; case_number: string }>(
      `select * from public.lf_submit($1,$2,$3,$4,$5,$6)`,
      [
        "b7951ca8-d0bb-4cbf-a3b3-1c74b7cbb124",
        "Sample Person",
        "Richmond",
        ["A place to stay"],
        JSON.stringify({ s3_f1: { text: "Sample Person" } }),
        "Sample Person housing",
      ],
    );
  const a = (await submit()).rows[0],
    b = (await submit()).rows[0];
  assert.equal(a.id, b.id);
  assert.match(a.case_number, /^LF-\d{4}-\d{2}-\d{2}-\d{4}$/);
  assert.equal(
    (await db.query<{ n: number }>("select count(*)::int n from lf_referrals"))
      .rows[0].n,
    1,
  );
  await db.exec("set role anon");
  await assert.rejects(() => db.query("select * from lf_referrals"));
  await assert.rejects(submit);
  await db.exec("reset role");
  const outsider = "00000000-0000-4000-8000-000000000001",
    member = "00000000-0000-4000-8000-000000000002";
  await db.query("insert into auth.users values($1),($2)", [outsider, member]);
  await db.query(
    "insert into lf_staff(user_id,role,active) values($1,'owner',true)",
    [member],
  );
  await db.exec(
    `set role authenticated;set request.jwt.claim.sub='${outsider}'`,
  );
  assert.equal((await db.query("select * from lf_referrals")).rows.length, 0);
  await assert.rejects(submit);
  await db.exec("reset role");
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${member}'`);
  assert.equal((await db.query("select * from lf_referrals")).rows.length, 1);
  await assert.rejects(() =>
    db.query("update lf_referrals set status='Closed'"),
  );
  await db.exec("reset role");
  const update = (v: number) =>
    db.query<{ ok: boolean }>("select lf_update($1,$2,$3,$4,$5,$6) ok", [
      a.id,
      v,
      "Enrolled",
      member,
      null,
      member,
    ]);
  assert.equal((await update(1)).rows[0].ok, true);
  assert.equal((await update(1)).rows[0].ok, false);
  await db.query("update lf_staff set active=false where user_id=$1", [member]);
  await assert.rejects(() => update(2));
  await db.exec(`set role authenticated;set request.jwt.claim.sub='${member}'`);
  assert.equal((await db.query("select * from lf_referrals")).rows.length, 0);
  await db.exec("reset role");
  assert.equal(
    (
      await db.query<{ ok: boolean }>(
        "select lf_allow_request('test',1,3600) ok",
      )
    ).rows[0].ok,
    true,
  );
  assert.equal(
    (
      await db.query<{ ok: boolean }>(
        "select lf_allow_request('test',1,3600) ok",
      )
    ).rows[0].ok,
    false,
  );
  await db.exec("select setval('public.lf_case_seq',9999)");
  const big = await db.query<{ case_number: string }>(
    "insert into lf_referrals(request_id,participant_name,answers) values(gen_random_uuid(),'Synthetic overflow test','{}') returning case_number",
  );
  assert.match(big.rows[0].case_number, /^LF-10000-/);
  await db.close();
});

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Answers, sections, answerText, fieldMap, summarize } from "@/lib/form";
import { statuses } from "@/lib/validation";
import Fields from "@/app/components/referrals/Fields";
type Referral = {
  id: string;
  case_number: string;
  answers: Answers;
  status: string;
  version: number;
  created_at: string;
  assigned_to: string | null;
  follow_up: string | null;
};
type Entry = {
  id: string;
  section_number: number;
  answers: Answers;
  created_at: string;
};
export default function Record({ id }: { id: string }) {
  const router = useRouter();
  const [record, setRecord] = useState<Referral | null>(null),
    [entries, setEntries] = useState<Entry[]>([]),
    [error, setError] = useState(""),
    [status, setStatus] = useState("Received"),
    [date, setDate] = useState(""),
    [assignee, setAssignee] = useState(""),
    [members, setMembers] = useState<
      { user_id: string; role: string; active: boolean; display_name: string }[]
    >([]),
    [section, setSection] = useState(43),
    [answers, setAnswers] = useState<Answers>({}),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const r = await fetch("/api/staff/referrals/" + id);
        if (r.status === 403) {
          router.replace("/staff/login");
          return;
        }
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        if (!alive) return;
        setRecord(d.record);
        setEntries(d.entries);
        setStatus(d.record.status);
        setDate(d.record.follow_up || "");
        setAssignee(d.record.assigned_to || "");
        const m = await fetch("/api/staff/members");
        if (m.ok && alive) setMembers((await m.json()).members);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Read failed");
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, router]);
  if (!record)
    return (
      <main className="staff-shell">
        <p role="status">{error || "Opening referral…"}</p>
        <Link href="/staff">Back to referrals</Link>
      </main>
    );
  const summary = summarize(record.answers);
  return (
    <main className="staff-shell">
      <Link className="text-button" href="/staff">
        ← All referrals
      </Link>
      <span className="eyebrow block">{record.case_number}</span>
      <h1>{summary.name}</h1>
      <p>
        Received {new Date(record.created_at).toLocaleString()} ·{" "}
        {record.status}
      </p>
      <div className="intake-card">
        <h2>At a glance</h2>
        <p className="staff-muted">
          Taken directly from submitted answers. Blank means not provided; no
          diagnosis or eligibility is inferred.
        </p>
        <div className="staff-grid">
          <div>
            <strong>First priorities</strong>
            <p>{summary.priority || "Not provided"}</p>
            {summary.needs.map((n) => (
              <span className="badge" key={n}>
                {n}
              </span>
            ))}
            <a className="text-button" href="#section-2">
              Source: topic 2
            </a>
          </div>
          <div>
            <strong>Safe contact</strong>
            <p>{summary.contact || "Not provided"}</p>
            <a className="text-button" href="#section-4">
              Read contact instructions
            </a>
          </div>
          <div>
            <strong>Medicines</strong>
            <p>{summary.medications.length} listed entries</p>
            <a className="text-button" href="#section-24">
              Review medicine details
            </a>
          </div>
        </div>
      </div>
      <div className="staff-record">
        <h2>Next steps</h2>
        <div className="staff-grid">
          <label>
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {statuses.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Follow-up date
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Assigned member
            <select
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
            >
              <option value="">Unassigned</option>
              {members
                .filter((m) => m.active)
                .map((m) => (
                  <option key={m.user_id} value={m.user_id}>
                    {m.display_name} ({m.role})
                  </option>
                ))}
            </select>
          </label>
        </div>
        <button
          className="primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setMessage("");
            try {
              const r = await fetch("/api/staff/referrals/" + id, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  status,
                  follow_up: date || null,
                  assigned_to: assignee || null,
                  version: record.version,
                }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              setRecord({
                ...record,
                status,
                version: record.version + 1,
                follow_up: date || null,
                assigned_to: assignee || null,
              });
              setMessage("Next steps saved.");
            } catch (e) {
              setMessage(e instanceof Error ? e.message : "Save failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save next steps
        </button>
        <p role="status">{message}</p>
      </div>
      <h2 className="text-2xl mt-8">Complete submitted answers</h2>
      {sections
        .filter((s) => s.number <= 42)
        .map((s) => (
          <details id={"section-" + s.number} key={s.number}>
            <summary>
              {s.number}. {s.title}
            </summary>
            {s.blocks
              .filter((b) => b.id)
              .map((b) => (
                <div className="review-answer" key={b.id}>
                  <strong>{b.label}</strong>
                  {record.answers[b.id!]?.rows ? (
                    <div>
                      {record.answers[b.id!]!.rows!.map((row, i) => (
                        <div className="repeat-card" key={i}>
                          {row.map((v, j) => (
                            <p key={j}>
                              <strong>{b.options?.[j]}:</strong>{" "}
                              {v || "Not provided"}
                            </p>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>{answerText(record.answers[b.id!]) || "Not provided"}</p>
                  )}
                </div>
              ))}
          </details>
        ))}
      <div className="intake-card">
        <h2>Add a staff record</h2>
        <p>
          Submitted answers stay intact. Use a dated record for intake updates,
          service notes, and progress.
        </p>
        <label>
          Record type
          <select
            value={section}
            onChange={(e) => {
              setSection(Number(e.target.value));
              setAnswers({});
            }}
          >
            {sections
              .filter((s) => s.number >= 43 && s.number <= 51)
              .map((s) => (
                <option key={s.number} value={s.number}>
                  {s.title}
                </option>
              ))}
          </select>
        </label>
        <Fields
          blocks={sections[section - 1].blocks}
          answers={answers}
          onChange={(key, a) => setAnswers((v) => ({ ...v, [key]: a }))}
        />
        <button
          className="primary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              const r = await fetch("/api/staff/entries", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  referral_id: id,
                  section_number: section,
                  answers,
                }),
              });
              const d = await r.json();
              if (!r.ok) throw Error(d.error);
              const refresh = await fetch("/api/staff/referrals/" + id);
              if (!refresh.ok)
                throw Error("Saved, but could not reload. Refresh this page.");
              setEntries((await refresh.json()).entries);
              setAnswers({});
              setError("Staff record saved.");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Save failed");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save staff record
        </button>
        <p role="status">{error}</p>
      </div>
      <h2 className="text-2xl mt-8">Service & progress history</h2>
      {entries.map((entry) => (
        <details key={entry.id}>
          <summary>
            {sections[entry.section_number - 1].title} ·{" "}
            {new Date(entry.created_at).toLocaleString()}
          </summary>
          {Object.entries(entry.answers).map(([key, a]) => (
            <div className="review-answer" key={key}>
              <strong>{fieldMap.get(key)?.label || key}</strong>
              <p>{answerText(a)}</p>
            </div>
          ))}
        </details>
      ))}
    </main>
  );
}

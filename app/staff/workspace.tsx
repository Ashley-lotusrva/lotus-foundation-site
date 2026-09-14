"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { statuses } from "@/lib/validation";
import {
  sections,
  Answers,
  parseNotes,
  answerText,
  fieldMap,
} from "@/lib/form";
import Fields from "@/app/components/referrals/Fields";
type Row = {
  id: string;
  case_number: string;
  participant_name: string;
  status: string;
  created_at: string;
  location: string;
  needs: string[];
  follow_up: string | null;
};
export default function Workspace() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]),
    [total, setTotal] = useState(0),
    [page, setPage] = useState(0),
    [q, setQ] = useState(""),
    [status, setStatus] = useState(""),
    [need, setNeed] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(true),
    [tab, setTab] = useState("referrals"),
    [program, setProgram] = useState(52),
    [answers, setAnswers] = useState<Answers>({}),
    [saved, setSaved] = useState(""),
    [paste, setPaste] = useState("");
  const parsed = parseNotes(paste);
  async function search(p = page) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(
        "/api/staff/referrals?" +
          new URLSearchParams({ q, status, need, page: String(p) }),
      );
      if (r.status === 403) {
        router.replace("/staff/login");
        return;
      }
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setRows(d.records);
      setTotal(d.total);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    void (async () => {
      try {
        const r = await fetch("/api/staff/referrals");
        if (r.status === 403) {
          router.replace("/staff/login");
          return;
        }
        const d = await r.json();
        if (!r.ok) throw Error(d.error);
        setRows(d.records);
        setTotal(d.total);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Search failed");
      } finally {
        setBusy(false);
      }
    })();
  }, [router]);
  return (
    <main className="staff-shell">
      <div className="staff-toolbar">
        <div>
          <span className="eyebrow">
            The Lotus Foundation · Private workspace
          </span>
          <h1>People first. Details in reach.</h1>
        </div>
        <button
          className="secondary"
          onClick={async () => {
            await fetch("/api/staff/logout", { method: "POST" });
            router.replace("/staff/login");
          }}
        >
          Sign out
        </button>
      </div>
      <nav>
        {["referrals", "parser", "program records"].map((t) => (
          <button
            className={tab === t ? "primary" : "secondary"}
            key={t}
            onClick={() => setTab(t)}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {tab === "referrals" && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setPage(0);
              search(0);
            }}
          >
            <div className="staff-grid">
              <label>
                Search answers, name, or LF case number
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Name, LF-0001, housing…"
                />
              </label>
              <label>
                Status
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All statuses</option>
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label>
                Support need
                <select value={need} onChange={(e) => setNeed(e.target.value)}>
                  <option value="">All needs</option>
                  {sections[1].blocks
                    .find((b) => b.id === "s2_f1")
                    ?.options?.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                </select>
              </label>
            </div>
            <button className="primary" disabled={busy}>
              {busy ? "Searching…" : "Search referrals"}
            </button>
          </form>
          <p className="staff-muted">
            {total} matching referrals · page {page + 1}
          </p>
          {!busy && !rows.length && (
            <div className="staff-record">
              No referrals match these filters.
            </div>
          )}
          {rows.map((r) => (
            <Link
              className="staff-record block"
              key={r.id}
              href={"/staff/referrals/" + r.id}
            >
              <span className="eyebrow">{r.case_number}</span>
              <h2>{r.participant_name}</h2>
              <p>
                {r.location || "Location not provided"} ·{" "}
                {new Date(r.created_at).toLocaleDateString()}
              </p>
              <span className="badge">{r.status}</span>
              {r.needs.map((n) => (
                <span className="badge" key={n}>
                  {n}
                </span>
              ))}
              {r.follow_up && <p>Follow up: {r.follow_up}</p>}
            </Link>
          ))}
          <button
            className="secondary"
            disabled={page === 0 || busy}
            onClick={() => {
              setPage(page - 1);
              search(page - 1);
            }}
          >
            Previous
          </button>
          <button
            className="secondary"
            disabled={(page + 1) * 20 >= total || busy}
            onClick={() => {
              setPage(page + 1);
              search(page + 1);
            }}
          >
            Next
          </button>
        </>
      )}
      {tab === "parser" && (
        <div className="intake-card">
          <h2>Organize intake notes</h2>
          <p>
            Paste labeled answers, such as “Name you would like us to use:
            Alex.” This tool matches exact, unique question labels. It does not
            infer diagnoses or send text to an AI service. Nothing is saved
            automatically.
          </p>
          <label>
            Notes to organize
            <textarea
              rows={8}
              value={paste}
              maxLength={100000}
              onChange={(e) => setPaste(e.target.value)}
            />
          </label>
          <h3>Matched answers — review before using</h3>
          {parsed.matches.map((m, i) => (
            <div className="review-answer" key={i}>
              <strong>
                Section {fieldMap.get(m.id)?.section}: {m.label}
              </strong>
              <p>{m.value}</p>
            </div>
          ))}
          <h3>Not matched — keep for manual review</h3>
          <pre>{parsed.unmatched.join("\n")}</pre>
          <button className="secondary" onClick={() => setPaste("")}>
            Clear notes
          </button>
          <p className="staff-muted">
            Open the relevant referral to record reviewed notes as a staff
            entry. This parser does not overwrite submitted answers.
          </p>
        </div>
      )}
      {tab === "program records" && (
        <div className="intake-card">
          <h2>Funding & partnership records</h2>
          <p>
            Owners can save these records at the program level, separate from an
            individual’s intake.
          </p>
          <label>
            Record type
            <select
              value={program}
              onChange={(e) => {
                setProgram(Number(e.target.value));
                setAnswers({});
                setSaved("");
              }}
            >
              {sections
                .filter((s) => s.number >= 52)
                .map((s) => (
                  <option value={s.number} key={s.number}>
                    {s.title}
                  </option>
                ))}
            </select>
          </label>
          <Fields
            blocks={sections[program - 1].blocks}
            answers={answers}
            onChange={(id, a) => setAnswers((v) => ({ ...v, [id]: a }))}
          />
          <button
            className="primary"
            onClick={async () => {
              try {
                const r = await fetch("/api/staff/entries", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    referral_id: null,
                    section_number: program,
                    answers,
                  }),
                });
                const d = await r.json();
                if (!r.ok) throw Error(d.error);
                setSaved("Record saved.");
                setAnswers({});
              } catch (e) {
                setSaved(e instanceof Error ? e.message : "Save failed");
              }
            }}
          >
            Save program record
          </button>
          <p role="status">{saved}</p>
          <ProgramHistory />
        </div>
      )}
    </main>
  );
}
function ProgramHistory() {
  const [data, setData] = useState<
      { created_at: string; answers: Answers; section_number: number }[]
    >([]),
    [message, setMessage] = useState("");
  return (
    <>
      <button
        className="secondary"
        onClick={async () => {
          const r = await fetch("/api/staff/entries");
          const d = await r.json();
          if (!r.ok) setMessage(d.error);
          else {
            setData(d.entries);
            setMessage(d.entries.length ? "" : "No program records yet.");
          }
        }}
      >
        Load saved program records
      </button>
      <p>{message}</p>
      {data.map((x, i) => (
        <details key={i}>
          <summary>
            {sections[x.section_number - 1].title} ·{" "}
            {new Date(x.created_at).toLocaleDateString()}
          </summary>
          {Object.entries(x.answers).map(([k, a]) => (
            <p key={k}>
              <strong>{fieldMap.get(k)?.label}:</strong> {answerText(a)}
            </p>
          ))}
        </details>
      ))}
    </>
  );
}

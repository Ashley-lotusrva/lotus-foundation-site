"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Fields from "@/app/components/referrals/Fields";
import {
  Answer,
  Answers,
  participantSections,
  answerText,
  summarize,
} from "@/lib/form";
export default function ReferralForm({ ready }: { ready: boolean }) {
  const [started, start] = useState(false),
    [index, setIndex] = useState(0),
    [answers, setAnswers] = useState<Answers>({}),
    [review, setReview] = useState(false),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState(""),
    [trap, setTrap] = useState("");
  const id = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const section = participantSections[index];
  useEffect(() => {
    id.current = crypto.randomUUID();
  }, []);
  useEffect(() => {
    if (started) heading.current?.focus();
  }, [index, review, started]);
  useEffect(() => {
    if (!Object.keys(answers).length || receipt) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [answers, receipt]);
  function change(key: string, a: Answer) {
    setAnswers((v) => ({ ...v, [key]: a }));
  }
  async function send() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: id.current,
          answers,
          consent,
          website: trap,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw Error(data.error);
      setReceipt(data.caseNumber);
      setAnswers({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (receipt)
    return (
      <main className="referral-shell">
        <div className="intake-card receipt">
          <span className="eyebrow">Referral received</span>
          <h1>Your next step starts here.</h1>
          <p>
            Thank you for reaching out to The Lotus Foundation. Keep this number
            for follow-up.
          </p>
          <strong className="case-number">{receipt}</strong>
          <p>
            A team member will review what you shared. This is not an
            appointment or a promise of immediate contact.
          </p>
          <Link className="primary" href="/">
            Return home
          </Link>
        </div>
      </main>
    );
  return (
    <main className="referral-shell">
      <div className="referral-masthead">
        <span className="eyebrow">The Lotus Foundation</span>
        <h1>Let’s start with what you need.</h1>
        <p>Healing Happens Here. Hope Begins Today.</p>
      </div>
      {!ready && (
        <div className="notice" role="status">
          Online submissions are not open yet. You can explore the form, but
          cannot send answers until the connection is ready.{" "}
          <Link href="/contact">Contact information</Link>
        </div>
      )}
      {!started ? (
        <div className="intake-card intro">
          <span className="eyebrow">Referral, intake & support</span>
          <h2>You don’t have to do it all today.</h2>
          <p>
            Answer what you know. Skip a question, take a break, or ask someone
            you trust to help. You can send just the answers you have.
          </p>
          <div className="intro-grid">
            <div>
              <strong>No address required</strong>
              <p>No steady phone, email, or paperwork? You can still begin.</p>
            </div>
            <div>
              <strong>Your own pace</strong>
              <p>Plain questions, one topic at a time. Estimates are okay.</p>
            </div>
            <div>
              <strong>A person will follow up</strong>
              <p>Your answers help our team understand the support you want.</p>
            </div>
          </div>
          <p>
            Your answers stay on this page until you send them. They are not
            saved on this device. Closing or refreshing the page clears unsent
            answers.
          </p>
          <button className="primary" onClick={() => start(true)}>
            Start my referral →
          </button>
          <a
            className="text-button"
            href="/forms/complete-referral-form.txt"
            download
          >
            Read the complete form
          </a>
          <p className="crisis">
            Need help now? Call 911 for immediate danger or a medical emergency.
            Call or text 988 for crisis support. This form is not checked for
            emergencies.
          </p>
          <Link className="text-button" href="/staff">
            Foundation member sign-in
          </Link>
        </div>
      ) : (
        <div className="intake-layout">
          <aside className="topic-nav">
            <label>
              Choose a topic
              <select
                value={index}
                onChange={(e) => {
                  setIndex(Number(e.target.value));
                  setReview(false);
                }}
              >
                {participantSections.map((s, i) => (
                  <option key={s.number} value={i}>
                    {s.number}. {s.title}
                  </option>
                ))}
              </select>
            </label>
            <p>
              Every question can be skipped. You can send your answers at any
              point.
            </p>
            <button className="secondary" onClick={() => setReview(true)}>
              Review & send what I have
            </button>
            <p className="crisis">
              Urgent help: 911 or call/text 988. This form is not an emergency
              service.
            </p>
          </aside>
          <div className="intake-card">
            {review ? (
              <>
                <span className="eyebrow">Your answers, your pace</span>
                <h2 tabIndex={-1} ref={heading}>
                  Ready to share with us?
                </h2>
                <p>
                  You answered {summarize(answers).answered} items. Unanswered
                  questions will stay blank.
                </p>
                {participantSections.map((s) => {
                  const a = s.blocks.filter(
                    (b) => b.id && answerText(answers[b.id]),
                  );
                  return a.length ? (
                    <details key={s.number}>
                      <summary>
                        {s.title} · {a.length} answers
                      </summary>
                      {a.map((b) => (
                        <div className="review-answer" key={b.id}>
                          <strong>{b.label}</strong>
                          <p>{answerText(answers[b.id!])}</p>
                        </div>
                      ))}
                      <button
                        className="text-button"
                        onClick={() => {
                          setIndex(s.number - 1);
                          setReview(false);
                        }}
                      >
                        Edit this topic
                      </button>
                    </details>
                  ) : null;
                })}
                <label className="answer-choice">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                  />
                  I am ready to share these answers with The Lotus Foundation.
                  They are accurate as far as I know. If I am answering for
                  someone else, I have permission or authority to share their
                  information.
                </label>
                <p className="field-note">
                  This does not give permission for treatment, research, or
                  sharing records with a partner. Your contact choices and
                  optional invitations remain separate.
                </p>
                <label className="honeypot" aria-hidden="true">
                  Website
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    value={trap}
                    onChange={(e) => setTrap(e.target.value)}
                  />
                </label>
                {error && (
                  <p role="alert" className="error">
                    {error}
                  </p>
                )}
                <button
                  className="primary"
                  disabled={!consent || busy || !ready}
                  onClick={send}
                >
                  {busy ? "Sending…" : "Send my referral"}
                </button>
                <button
                  className="text-button"
                  onClick={() => setReview(false)}
                >
                  Keep answering
                </button>
              </>
            ) : (
              <>
                <span className="eyebrow">
                  Topic {section.number} of 42 · answer what you can
                </span>
                <h2 tabIndex={-1} ref={heading}>
                  {section.title}
                </h2>
                <Fields
                  blocks={section.blocks}
                  answers={answers}
                  onChange={change}
                />
                <div className="step-actions">
                  <button
                    className="secondary"
                    disabled={index === 0}
                    onClick={() => setIndex(index - 1)}
                  >
                    Back
                  </button>
                  <button
                    className="primary"
                    onClick={() =>
                      index === 41 ? setReview(true) : setIndex(index + 1)
                    }
                  >
                    {index === 41 ? "Review answers" : "Next topic →"}
                  </button>
                </div>
                <button
                  className="text-button"
                  onClick={() => {
                    section.blocks
                      .filter((b) => b.id)
                      .forEach((b) => {
                        if (!answerText(answers[b.id!]))
                          change(b.id!, {
                            disposition: "I’d rather skip this",
                          });
                      });
                    if (index === 41) setReview(true);
                    else setIndex(index + 1);
                  }}
                >
                  Skip this topic for now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

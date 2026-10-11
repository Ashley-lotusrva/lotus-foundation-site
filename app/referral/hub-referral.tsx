"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { hubQuestions, hubFields } from "@/lib/hub-form";
import type { Answers } from "@/lib/form";
export default function HubReferral({ ready }: { ready: boolean }) {
  const [answers, setAnswers] = useState<Answers>({}),
    [index, setIndex] = useState(0),
    [review, setReview] = useState(false),
    [consent, setConsent] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [receipt, setReceipt] = useState("");
  const request = useRef("");
  const heading = useRef<HTMLHeadingElement>(null);
  const questions = hubQuestions.filter(
    (q) =>
      q.when !== "referrer" ||
      (answers.hub_who?.choices?.[0] && answers.hub_who.choices[0] !== "Me"),
  );
  const question = questions[Math.min(index, questions.length - 1)];
  useEffect(() => {
    heading.current?.focus();
  }, [index, review, receipt]);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (Object.keys(answers).length && !receipt) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [answers, receipt]);
  function update(id: string, value: Answers[string]) {
    setAnswers((a) => {
      const b = { ...a, [id]: value };
      if (id === "hub_who" && value.choices?.[0] === "Me")
        for (const f of hubQuestions.find((q) => q.when === "referrer")!.fields)
          delete b[f.id];
      if (
        id === "hub_needs" &&
        !value.choices?.includes(b.hub_priority?.choices?.[0] || "")
      )
        delete b.hub_priority;
      if (id === "hub_unstable" && value.choices?.[0] !== "Yes") {
        delete b.hub_duration;
        delete b.hub_episodes;
      }
      if (id === "hub_risk" && value.choices?.[0] === "No") {
        delete b.hub_owed;
        delete b.hub_risk_date;
        delete b.hub_notice;
      }
      return b;
    });
  }
  function validate() {
    if (index === 3) {
      const method = answers.hub_contact_method?.choices?.[0];
      if (
        ["Call", "Text"].includes(method || "") &&
        !answers.hub_phone?.text?.trim()
      )
        return "Please add the phone number we may use.";
      if (
        method === "Email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.hub_email?.text || "")
      )
        return "Please add a valid email address.";
      if (
        ["Trusted contact", "No safe contact method"].includes(method || "") &&
        !answers.hub_contact_plan?.text?.trim()
      )
        return "Please describe a safe way to reconnect, or contact our team for help making a plan.";
    }
    if (
      question.when === "referrer" &&
      (answers.hub_permission?.choices?.[0] === "No" ||
        answers.hub_knows?.choices?.[0] === "No")
    )
      return "Please obtain the participant’s permission before sending their information. Contact us for general guidance.";

    for (const f of question.fields)
      if (
        f.required &&
        !answers[f.id]?.text?.trim() &&
        !answers[f.id]?.choices?.length
      )
        return `Please answer “${f.label}”.`;
    return "";
  }
  async function send() {
    setError("");
    setBusy(true);
    try {
      request.current ||= crypto.randomUUID();
      const r = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: request.current,
          answers,
          consent,
          website: "",
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.error);
      setReceipt(d.caseNumber);
      setAnswers({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="hub hub-form">
      <div className="hub-intro">
        <span className="eyebrow">Get help · Refer someone</span>
        <h1>Let’s take the first step.</h1>
        <p>
          A short request helps us understand what you need. Detailed intake
          comes later with staff. Estimates are okay.
        </p>
        <p className="hub-notice">
          This form is not monitored for emergencies. For immediate danger or a
          medical emergency, call <a href="tel:911">911</a>. For crisis support,
          call or text <a href="tel:988">988</a>.
        </p>
      </div>
      {!ready && (
        <p className="hub-notice">
          Online submissions are not open yet. You can explore the form. To
          request help now,{" "}
          <Link href="/contact">contact The Lotus Foundation</Link>. Please do
          not email detailed medical information.
        </p>
      )}
      {receipt ? (
        <section className="hub-panel">
          <h2 ref={heading} tabIndex={-1}>
            Your request was received.
          </h2>
          <p>
            Your case number is <strong>{receipt}</strong>.
          </p>
          <p>
            A team member will review your request and use your safe-contact
            choices. Submitting does not guarantee eligibility, funding, or
            placement. Contact us for current response times.
          </p>
        </section>
      ) : (
        <section className="hub-panel">
          <p className="hub-muted">
            Answers stay on this page until you send them. Closing or refreshing
            clears unsent answers.{" "}
            <Link href="/privacy">How we use your information</Link>
          </p>
          {review ? (
            <>
              <h2 ref={heading} tabIndex={-1}>
                Review your request
              </h2>
              <p>You can go back to change an answer.</p>
              {hubFields
                .filter((f) => answers[f.id])
                .map((f) => (
                  <div className="hub-answer" key={f.id}>
                    <strong>{f.label}</strong>
                    <p>
                      {answers[f.id].text || answers[f.id].choices?.join(", ")}
                    </p>
                  </div>
                ))}
              <label className="hub-choice">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                I confirm these answers are accurate as far as I know. I give
                The Lotus Foundation permission to follow up using the
                safe-contact choices provided. If referring someone, I have
                their permission to share this request and arrange contact.
              </label>
              <p>
                This permission does not authorize research participation or
                unrestricted sharing of medical records.
              </p>
              <button
                className="hub-button"
                disabled={!ready || !consent || busy}
                onClick={send}
              >
                {busy ? "Sending…" : "Send my request"}
              </button>
              <button
                className="hub-secondary"
                onClick={() => setReview(false)}
              >
                Back to questions
              </button>
            </>
          ) : (
            <>
              <p className="eyebrow">
                {question.step} · Question {index + 1} of {questions.length}
              </p>
              <progress
                value={index + 1}
                max={questions.length}
                aria-label="Form progress"
              />
              <h2 ref={heading} tabIndex={-1}>
                {question.title}
              </h2>
              {question.help && <p>{question.help}</p>}
              {question.fields
                .filter(
                  (f) =>
                    !(
                      ["hub_duration", "hub_episodes"].includes(f.id) &&
                      answers.hub_unstable?.choices?.[0] !== "Yes"
                    ),
                )
                .filter(
                  (f) =>
                    !(
                      ["hub_owed", "hub_risk_date", "hub_notice"].includes(
                        f.id,
                      ) && !answers.hub_risk?.choices?.[0]?.startsWith("Yes")
                    ),
                )
                .filter(
                  (f) =>
                    f.id !== "hub_utility" ||
                    answers.hub_needs?.choices?.includes(
                      "Utility or bill assistance",
                    ),
                )
                .map((f) => {
                  const options =
                    f.id === "hub_priority"
                      ? answers.hub_needs?.choices || []
                      : f.options;
                  return (
                    <fieldset key={f.id}>
                      <legend>
                        {f.label}
                        {f.required ? " *" : ""}
                      </legend>
                      {options ? (
                        options.map((option) => (
                          <label className="hub-choice" key={option}>
                            <input
                              type={f.multi ? "checkbox" : "radio"}
                              name={f.id}
                              checked={
                                answers[f.id]?.choices?.includes(option) ||
                                false
                              }
                              onChange={(e) =>
                                update(f.id, {
                                  choices: f.multi
                                    ? e.target.checked
                                      ? [
                                          ...(answers[f.id]?.choices || []),
                                          option,
                                        ]
                                      : (answers[f.id]?.choices || []).filter(
                                          (o) => o !== option,
                                        )
                                    : [option],
                                })
                              }
                            />
                            {option}
                          </label>
                        ))
                      ) : (
                        <input
                          aria-label={f.label}
                          type={f.type || "text"}
                          maxLength={1500}
                          value={answers[f.id]?.text || ""}
                          onChange={(e) =>
                            update(f.id, { text: e.target.value })
                          }
                        />
                      )}
                    </fieldset>
                  );
                })}
              {answers.hub_safety?.choices?.[0] === "Yes" && (
                <p role="alert" className="hub-notice">
                  Please do not wait for this form. Call 911 for immediate
                  danger or a medical emergency, or call/text 988 for crisis
                  support. This website does not send an emergency alert.
                </p>
              )}
              {answers.hub_permission?.choices?.[0] === "No" && (
                <p className="hub-notice">
                  Please get the participant’s permission before sending
                  identifying information. You can contact us for general
                  guidance.
                </p>
              )}
              <div className="hub-actions">
                {index > 0 && (
                  <button
                    className="hub-secondary"
                    onClick={() => {
                      setIndex(index - 1);
                      setError("");
                    }}
                  >
                    Back
                  </button>
                )}
                <button
                  className="hub-button"
                  onClick={() => {
                    const e = validate();
                    setError(e);
                    if (!e) {
                      if (index === questions.length - 1) setReview(true);
                      else setIndex(index + 1);
                    }
                  }}
                >
                  {index === questions.length - 1
                    ? "Review answers"
                    : "Continue"}
                </button>
              </div>
            </>
          )}
          {error && (
            <p role="alert" className="hub-error">
              {error}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

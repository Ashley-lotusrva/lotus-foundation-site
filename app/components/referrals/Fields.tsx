"use client";
import { useState } from "react";
import { Answer, Answers, Block } from "@/lib/form";
const skips = [
  "I’m not sure",
  "This does not apply to me",
  "I’d rather skip this",
  "I’d rather talk with someone",
];
export default function Fields({
  blocks,
  answers,
  onChange,
}: {
  blocks: Block[];
  answers: Answers;
  onChange: (id: string, a: Answer) => void;
}) {
  return (
    <>
      {blocks.map((b, i) =>
        b.type === "note" ? (
          <p className="field-note" key={"note" + i}>
            {b.text}
          </p>
        ) : (
          <Field
            key={b.id}
            block={b}
            value={answers[b.id!] || {}}
            change={(a) => onChange(b.id!, a)}
          />
        ),
      )}
    </>
  );
}
function Field({
  block: b,
  value,
  change,
}: {
  block: Block;
  value: Answer;
  change: (a: Answer) => void;
}) {
  const [details, setDetails] = useState(false);
  const choices = b.options || [];
  const multi =
    choices.length > 2 &&
    !choices.some((o) =>
      /^(Yes|No|Now|Current|Both|I manage this|I can do this|Full-time|My own|All of it|All|I get support now)$/.test(
        o,
      ),
    ) &&
    !["s1_f1", "s1_f2", "s9_f1", "s14_f1", "s17_f2"].includes(b.id || "");
  const rows = value.rows || [];
  return (
    <fieldset className="intake-field">
      <legend>{b.label}</legend>
      {b.type === "repeat" ? (
        <>
          <p className="field-note">
            Add as many entries as you need. Unknown details can stay blank.
          </p>
          {rows.map((row, ri) => (
            <div className="repeat-card" key={ri}>
              <strong>Entry {ri + 1}</strong>
              {choices.map((c, ci) => (
                <label key={ci}>
                  {c}
                  <input
                    value={row[ci] || ""}
                    maxLength={1000}
                    onChange={(e) =>
                      change({
                        ...value,
                        rows: rows.map((r, j) =>
                          j === ri
                            ? choices.map((_, k) =>
                                k === ci ? e.target.value : r[k] || "",
                              )
                            : r,
                        ),
                      })
                    }
                  />
                </label>
              ))}
              <button
                type="button"
                className="text-button"
                onClick={() =>
                  change({ ...value, rows: rows.filter((_, j) => j !== ri) })
                }
              >
                Remove entry {ri + 1}
              </button>
            </div>
          ))}
          <button
            type="button"
            className="secondary"
            disabled={rows.length >= 40}
            onClick={() =>
              change({ ...value, rows: [...rows, choices.map(() => "")] })
            }
          >
            + Add an entry
          </button>
        </>
      ) : (
        <>
          {!!choices.length && (
            <>
              <p className="field-note">
                {multi
                  ? "Choose all that fit."
                  : "Choose the answer that fits best."}
              </p>
              <div className="answer-choices">
                {choices.map((o, i) => (
                  <label className="answer-choice" key={i}>
                    <input
                      type={multi ? "checkbox" : "radio"}
                      name={b.id}
                      checked={value.choices?.includes(o) || false}
                      onChange={() => {
                        const selected = value.choices || [];
                        change({
                          ...value,
                          disposition: undefined,
                          choices: multi
                            ? selected.includes(o)
                              ? selected.filter((x) => x !== o)
                              : [...selected, o]
                            : [o],
                        });
                      }}
                    />
                    {o}
                  </label>
                ))}
              </div>
            </>
          )}
          {(!choices.length || details || value.text) && (
            <label className="text-answer">
              {choices.length
                ? "Details or another answer (optional)"
                : "Your answer (an estimate is okay)"}
              <textarea
                aria-label={b.label}
                rows={2}
                value={value.text || ""}
                maxLength={6000}
                onChange={(e) =>
                  change({
                    ...value,
                    text: e.target.value,
                    disposition: undefined,
                  })
                }
              />
            </label>
          )}
          {!!choices.length && !details && !value.text && (
            <button
              type="button"
              className="text-button"
              onClick={() => setDetails(true)}
            >
              Add details or another answer
            </button>
          )}
        </>
      )}
      <label className="skip-choice">
        <span>Or choose</span>
        <select
          aria-label={`Skip or ask for help: ${b.label}`}
          value={value.disposition || ""}
          onChange={(e) =>
            change(e.target.value ? { disposition: e.target.value } : {})
          }
        >
          <option value="">Keep my answer</option>
          {skips.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </label>
    </fieldset>
  );
}

import raw from "./form-sections.json";
export type Block = {
  type: string;
  id?: string;
  label?: string;
  options?: string[];
  text?: string;
};
export type Section = {
  number: number;
  title: string;
  source: string;
  blocks: Block[];
};
export type Answer = {
  text?: string;
  choices?: string[];
  rows?: string[][];
  disposition?: string;
};
export type Answers = Record<string, Answer>;
export const sections = raw as Section[];
export const participantSections = sections.filter((s) => s.number <= 42);
export const fieldMap = new Map(
  sections.flatMap((s) =>
    s.blocks
      .filter((b) => b.id)
      .map((b) => [b.id!, { ...b, section: s.number }] as const),
  ),
);
export function answerText(a: Answer | undefined): string {
  return a
    ? [
        a.disposition,
        ...(a.choices || []),
        a.text,
        ...(a.rows || []).map((r) => r.join(" | ")),
      ]
        .filter(Boolean)
        .join(" · ")
    : "";
}
export function extract(answers: Answers, section: number, label: string) {
  const f = sections
    .find((s) => s.number === section)
    ?.blocks.find((b) => b.label === label);
  return f?.id ? answerText(answers[f.id]) : "";
}
export function summarize(answers: Answers) {
  const name =
    extract(answers, 3, "Name you would like us to use") ||
    [extract(answers, 3, "First"), extract(answers, 3, "Last")]
      .filter(Boolean)
      .join(" ") ||
    "Name not provided";
  const needs = answers.s2_f1?.choices || [];
  return {
    name,
    needs,
    contact: extract(answers, 4, "How can we reach you safely?"),
    location: extract(answers, 5, "City or county"),
    priority: extract(answers, 2, "Which need matters most today?"),
    medications: [24, 26, 28].flatMap(
      (n) => answers[`s${n}_medications`]?.rows || [],
    ),
    answered: Object.values(answers).filter((a) => answerText(a)).length,
  };
}
export function searchable(answers: Answers) {
  return Object.entries(answers)
    .map(([id, a]) => `${fieldMap.get(id)?.label || id}: ${answerText(a)}`)
    .join("\n");
}
export function parseNotes(input: string) {
  // Deterministic extraction only: preserve original text and mark every match for staff review.
  const lines = input.split(/\r?\n/);
  const fields = [...fieldMap.entries()];
  const matches: { id: string; label: string; value: string }[] = [];
  const unmatched: string[] = [];
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 1) {
      if (line.trim()) unmatched.push(line);
      continue;
    }
    const label = line.slice(0, colon).trim().toLowerCase();
    const value = line.slice(colon + 1).trim();
    const candidates = fields.filter(
      ([, b]) => b.label?.replace(/[?:]$/, "").toLowerCase() === label,
    );
    if (candidates.length === 1 && value)
      matches.push({
        id: candidates[0][0],
        label: candidates[0][1].label!,
        value,
      });
    else unmatched.push(line);
  }
  return { matches, unmatched };
}

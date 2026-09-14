import { z } from "zod";
import { fieldMap } from "./form";
export const answerSchema = z
  .object({
    text: z.string().max(6000).optional(),
    choices: z.array(z.string().max(500)).max(30).optional(),
    rows: z
      .array(z.array(z.string().max(1000)).max(8))
      .max(40)
      .optional(),
    disposition: z
      .enum([
        "I’m not sure",
        "This does not apply to me",
        "I’d rather skip this",
        "I’d rather talk with someone",
      ])
      .optional(),
  })
  .strict();
export const answersSchema = z
  .record(z.string(), answerSchema)
  .refine(
    (a) =>
      Object.keys(a).length <= 700 &&
      Object.keys(a).every((k) => fieldMap.has(k)),
    "Unknown question",
  );
export const submissionSchema = z
  .object({
    requestId: z.string().uuid(),
    answers: answersSchema.refine(
      (a) => Object.keys(a).every((k) => (fieldMap.get(k)?.section ?? 999) <= 42),
      "Staff fields are private",
    ),
    consent: z.literal(true),
    website: z.string().max(0),
  })
  .strict();
export const statuses = [
  "Received",
  "Outreach pending",
  "Intake in progress",
  "Enrolled",
  "Waitlisted",
  "Referred elsewhere",
  "Participant declined",
  "Unable to reach",
  "Closed",
] as const;

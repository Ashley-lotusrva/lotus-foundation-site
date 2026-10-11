import { hubFields } from "./hub-form";
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
      (a) =>
        Object.keys(a).every((k) => k.startsWith("hub_") && fieldMap.has(k)),
      "Only brief referral fields can be submitted publicly",
    ),
    consent: z.literal(true),
    website: z.string().max(0),
  })
  .strict()
  .superRefine((data, ctx) => {
    const a = data.answers;
    for (const f of hubFields) {
      const value = a[f.id];
      if (
        value &&
        ((f.options && value.text) ||
          (!f.options && value.choices?.length) ||
          (f.options && !f.multi && (value.choices?.length || 0) > 1))
      )
        ctx.addIssue({
          code: "custom",
          message: "Please use the listed answer choices",
        });
      if (value?.rows || value?.disposition)
        ctx.addIssue({ code: "custom", message: "Invalid answer format" });
      if (
        f.options &&
        f.id !== "hub_priority" &&
        value?.choices?.some((c) => !f.options!.includes(c))
      )
        ctx.addIssue({ code: "custom", message: "Invalid choice" });
      if (
        f.required &&
        !(
          f.id.startsWith("hub_referrer") ||
          ["hub_knows", "hub_permission"].includes(f.id)
        ) &&
        !value?.text?.trim() &&
        !value?.choices?.length
      )
        ctx.addIssue({
          code: "custom",
          message: "Please complete the required questions",
        });
    }
    if (!a.hub_needs?.choices?.includes(a.hub_priority?.choices?.[0] || ""))
      ctx.addIssue({
        code: "custom",
        message: "Choose a priority from your selected needs",
      });
    const who = a.hub_who?.choices?.[0];
    if (
      who !== "Me" &&
      (!a.hub_referrer?.text?.trim() ||
        !a.hub_referrer_contact?.text?.trim() ||
        a.hub_knows?.choices?.[0] !== "Yes" ||
        a.hub_permission?.choices?.[0] !== "Yes")
    )
      ctx.addIssue({
        code: "custom",
        message: "Participant permission and referrer contact are required",
      });
    const method = a.hub_contact_method?.choices?.[0];
    if (
      (["Call", "Text"].includes(method || "") && !a.hub_phone?.text?.trim()) ||
      (method === "Email" && !z.email().safeParse(a.hub_email?.text).success) ||
      (["Trusted contact", "No safe contact method"].includes(method || "") &&
        !a.hub_contact_plan?.text?.trim())
    )
      ctx.addIssue({
        code: "custom",
        message: "Please provide a safe contact or reconnect plan",
      });
  });
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

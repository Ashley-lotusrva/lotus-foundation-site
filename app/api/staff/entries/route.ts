import { z } from "zod";
import {
  admin,
  staff,
  json,
  failure,
  checkOrigin,
  readJSON,
} from "@/lib/server";
import { answersSchema } from "@/lib/validation";
import { fieldMap } from "@/lib/form";
export async function GET() {
  try {
    const { role, user } = await staff();
    if (role !== "owner") throw Error("Unauthorized");
    const db = admin();
    const { data, error } = await db
      .from("lf_entries")
      .select("*")
      .is("referral_id", null)
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw Error("Read failed");
    await db
      .from("lf_audit")
      .insert({ user_id: user.id, action: "view program records" });
    return json({ entries: data });
  } catch (e) {
    return failure(e);
  }
}
export async function POST(r: Request) {
  try {
    checkOrigin(r);
    const { role, user } = await staff();
    const body = z
      .object({
        referral_id: z.string().uuid().nullable(),
        section_number: z.number().int().min(43).max(53),
        answers: answersSchema,
      })
      .strict()
      .parse(await readJSON(r));
    if (
      Object.keys(body.answers).some(
        (k) => fieldMap.get(k)?.section !== body.section_number,
      )
    )
      throw Error("Invalid section");
    if (body.section_number >= 52 && role !== "owner")
      throw Error("Unauthorized");
    if (!body.referral_id && body.section_number < 52)
      throw Error("Referral required");
    const db = admin();
    const { error } = await db
      .from("lf_entries")
      .insert({ ...body, created_by: user.id });
    if (error) throw Error("Save failed");
    await db
      .from("lf_audit")
      .insert({
        user_id: user.id,
        referral_id: body.referral_id,
        action: "add staff record",
      });
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}

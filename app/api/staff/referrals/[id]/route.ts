import { z } from "zod";
import {
  admin,
  staff,
  json,
  failure,
  checkOrigin,
  readJSON,
} from "@/lib/server";
import { statuses } from "@/lib/validation";
export async function GET(
  _r: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { user } = await staff();
    const { id } = await params;
    z.string().uuid().parse(id);
    const db = admin();
    const { data, error } = await db
      .from("lf_referrals")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return json({ error: "Referral not found" }, 404);
    const audit = await db
      .from("lf_audit")
      .insert({ user_id: user.id, referral_id: id, action: "view referral" });
    if (audit.error) throw Error("Audit failed");
    const entries = await db
      .from("lf_entries")
      .select("*")
      .eq("referral_id", id)
      .order("created_at", { ascending: false });
    if (entries.error) throw Error("Read failed");
    return json({ record: data, entries: entries.data });
  } catch (e) {
    return failure(e);
  }
}
export async function PATCH(
  r: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    checkOrigin(r);
    const { user } = await staff();
    const { id } = await params;
    z.string().uuid().parse(id);
    const body = z
      .object({
        version: z.number().int().positive(),
        status: z.enum(statuses),
        assigned_to: z.string().uuid().nullable(),
        follow_up: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .nullable(),
      })
      .strict()
      .parse(await readJSON(r));
    const { data, error } = await admin().rpc("lf_update", {
      p_id: id,
      p_version: body.version,
      p_status: body.status,
      p_assigned: body.assigned_to,
      p_follow_up: body.follow_up,
      p_actor: user.id,
    });
    if (error) throw Error("Update failed");
    if (!data)
      return json(
        { error: "Someone else updated this referral. Refresh before saving." },
        409,
      );
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}

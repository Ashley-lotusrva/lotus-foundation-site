import { z } from "zod";
import {
  admin,
  staff,
  json,
  failure,
  checkOrigin,
  readJSON,
} from "@/lib/server";
export async function GET() {
  try {
    await staff();
    const { data, error } = await admin()
      .from("lf_staff")
      .select("user_id,role,active,display_name");
    if (error) throw Error("Read failed");
    return json({ members: data });
  } catch (e) {
    return failure(e);
  }
}
// Owners may enable/disable existing accounts; no invitations are sent by this endpoint.
export async function POST(r: Request) {
  try {
    checkOrigin(r);
    const { user, role } = await staff();
    if (role !== "owner") throw Error("Unauthorized");
    const body = z
      .object({
        user_id: z.string().uuid(),
        role: z.enum(["owner", "staff"]),
        active: z.boolean(),
        display_name: z.string().min(1).max(100),
      })
      .strict()
      .parse(await readJSON(r));
    if (body.user_id === user.id)
      throw Error("Cannot change your own membership");
    const db = admin();
    const { error } = await db.from("lf_staff").upsert(body);
    if (error) throw Error("Update failed");
    await db
      .from("lf_audit")
      .insert({ user_id: user.id, action: "change staff membership" });
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}

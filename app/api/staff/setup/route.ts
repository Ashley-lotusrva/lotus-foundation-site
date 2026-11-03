import { z } from "zod";
import { checkOrigin, failure, json, readJSON, userClient } from "@/lib/server";
export async function POST(r: Request) {
  try {
    checkOrigin(r);
    const body = z
      .object({
        token: z.string().regex(/^[a-f0-9]{32,128}$/i),
        password: z.string().min(12).max(128),
      })
      .parse(await readJSON(r));
    const db = await userClient();
    const verified = await db.auth.verifyOtp({
      token_hash: body.token,
      type: "recovery",
    });
    if (verified.error || !verified.data.user)
      return json(
        {
          error:
            "This setup link has expired or has already been used. Ask for a new link.",
        },
        400,
      );
    try {
      const member = await db
        .from("lf_staff")
        .select("user_id")
        .eq("user_id", verified.data.user.id)
        .eq("active", true)
        .maybeSingle();
      if (!member.data)
        return json(
          { error: "This account is not approved for staff access." },
          403,
        );
      const changed = await db.auth.updateUser({ password: body.password });
      if (changed.error)
        return json(
          {
            error: "The password could not be saved. Request a new setup link.",
          },
          400,
        );
      return json({ ok: true });
    } finally {
      await db.auth.signOut({ scope: "local" });
    }
  } catch (e) {
    return failure(e);
  }
}

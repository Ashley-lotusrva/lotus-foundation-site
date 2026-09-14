import { z } from "zod";
import {
  checkOrigin,
  configured,
  failure,
  json,
  limit,
  readJSON,
  userClient,
} from "@/lib/server";
export async function POST(r: Request) {
  try {
    if (!configured()) throw Error("Setup incomplete");
    checkOrigin(r);
    await limit(r, "login", 12);
    const body = z
      .object({
        email: z.string().email(),
        password: z.string().min(1).max(500),
      })
      .parse(await readJSON(r));
    const client = await userClient();
    const { data, error } = await client.auth.signInWithPassword(body);
    if (error || !data.user) throw Error("Unauthorized");
    const member = await client
      .from("lf_staff")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("active", true)
      .single();
    if (!member.data) {
      await client.auth.signOut();
      throw Error("Unauthorized");
    }
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}

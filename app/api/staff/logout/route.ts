import { checkOrigin, userClient, json, failure } from "@/lib/server";
export async function POST(r: Request) {
  try {
    checkOrigin(r);
    await (await userClient()).auth.signOut();
    return json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}

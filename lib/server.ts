import "server-only";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
export function configured() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY &&
    process.env.SUPABASE_SECRET_KEY &&
    process.env.APP_ORIGIN &&
    process.env.RATE_LIMIT_SECRET
  );
}
export function admin() {
  if (!configured()) throw new Error("Setup incomplete");
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
export async function userClient() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (values) => {
          values.forEach(({ name, value, options }) =>
            jar.set(name, value, {
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
            }),
          );
        },
      },
    },
  );
}
export async function staff() {
  if (!configured()) throw new Error("Setup incomplete");
  const client = await userClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) throw new Error("Unauthorized");
  const { data } = await client
    .from("lf_staff")
    .select("role")
    .eq("user_id", user.id)
    .eq("active", true)
    .single();
  if (!data) throw new Error("Unauthorized");
  return { user, role: data.role };
}
export function checkOrigin(r: Request) {
  if (r.headers.get("origin") !== process.env.APP_ORIGIN)
    throw new Error("Unauthorized");
}
export async function limit(r: Request, kind: string, max: number) {
  const ip =
    r.headers.get("x-vercel-forwarded-for")?.split(",")[0] ||
    r.headers.get("x-forwarded-for")?.split(",")[0] ||
    "local";
  const key = createHmac("sha256", process.env.RATE_LIMIT_SECRET!)
    .update(kind + ip)
    .digest("hex");
  const { data, error } = await admin().rpc("lf_allow_request", {
    p_key: key,
    p_max: max,
    p_seconds: 3600,
  });
  if (error || !data) throw new Error("Rate limit");
}
export async function readJSON(r: Request) {
  if (Number(r.headers.get("content-length") || 0) > 250000)
    throw new Error("Too large");
  const reader = r.body?.getReader();
  if (!reader) throw new Error("Missing body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 250000) {
      await reader.cancel();
      throw new Error("Too large");
    }
    chunks.push(value);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}
export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
export function failure(e: unknown) {
  const message = e instanceof Error ? e.message : "";
  if (message === "Unauthorized")
    return json(
      { error: "Please sign in with an approved staff account." },
      403,
    );
  if (message === "Rate limit")
    return json({ error: "Too many attempts. Please try again later." }, 429);
  if (message === "Setup incomplete")
    return json(
      {
        error:
          "The referral system is still being connected. Please try again later.",
      },
      503,
    );
  return json(
    {
      error:
        "This could not be saved. Your answers are still on this page. Please try again.",
    },
    400,
  );
}

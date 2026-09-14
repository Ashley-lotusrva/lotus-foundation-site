import { admin, staff, json, failure } from "@/lib/server";
import { statuses } from "@/lib/validation";
export async function GET(r: Request) {
  try {
    const { user } = await staff();
    const url = new URL(r.url);
    const search = (url.searchParams.get("q") || "").slice(0, 200);
    const status = url.searchParams.get("status");
    const need = url.searchParams.get("need");
    const page = Math.max(
      0,
      Math.min(10000, Number(url.searchParams.get("page")) || 0),
    );
    const db = admin();
    let query = db
      .from("lf_referrals")
      .select(
        "id,case_number,participant_name,created_at,status,location,needs,follow_up",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .range(page * 20, page * 20 + 19);
    if (search) {
      if (/^LF-/i.test(search))
        query = query.ilike("case_number", search.replace(/[%_]/g, "") + "%");
      else
        query = query.textSearch("search_text", search, {
          config: "simple",
          type: "websearch",
        });
    }
    if (status && statuses.includes(status as (typeof statuses)[number]))
      query = query.eq("status", status);
    if (need) query = query.contains("needs", [need]);
    const { data, error, count } = await query;
    if (error) throw Error("Search failed");
    const audit = await db
      .from("lf_audit")
      .insert({ user_id: user.id, action: "search referrals" });
    if (audit.error) throw Error("Audit failed");
    return json({ records: data, total: count, page });
  } catch (e) {
    return failure(e);
  }
}

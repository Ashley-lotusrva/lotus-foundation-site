import {
  admin,
  checkOrigin,
  configured,
  failure,
  json,
  limit,
  readJSON,
} from "@/lib/server";
import { submissionSchema } from "@/lib/validation";
import { searchable, summarize } from "@/lib/form";
export async function POST(r: Request) {
  try {
    if (!configured()) throw new Error("Setup incomplete");
    checkOrigin(r);
    await limit(r, "submit", 15);
    const body = submissionSchema.parse(await readJSON(r));
    const summary = summarize(body.answers);
    const { data, error } = await admin().rpc("lf_submit", {
      p_request: body.requestId,
      p_name: summary.name,
      p_location: summary.location,
      p_needs: summary.needs,
      p_answers: body.answers,
      p_search: searchable(body.answers),
    });
    if (error) throw new Error("Save failed");
    return json({ caseNumber: data[0].case_number });
  } catch (e) {
    return failure(e);
  }
}

import ReferralForm from "./hub-referral";
import { configured } from "@/lib/server";
import { referralEndpoint } from "@/lib/referral-endpoint";
import { headers } from "next/headers";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Referral & Support | The Lotus Foundation",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const host = (await headers()).get("host");
  const production = host === "lotusfoundation.info" || host === "www.lotusfoundation.info";
  return <ReferralForm ready={production || configured()} endpoint={production ? referralEndpoint : "/api/referrals"} />;
}

import ReferralForm from "./referral-form";
import { configured } from "@/lib/server";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Referral & Support | The Lotus Foundation",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <ReferralForm ready={configured()} />;
}

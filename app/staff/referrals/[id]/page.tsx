import { configured } from "@/lib/server";
import Record from "../../record";
export const metadata = {
  title: "Private Referral | The Lotus Foundation",
  robots: { index: false, follow: false },
};
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <Record writable={configured()} id={(await params).id} />;
}

import { configured } from "@/lib/server";
import Workspace from "./workspace";
export const metadata = {
  title: "Member Workspace | The Lotus Foundation",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <Workspace writable={configured()} />;
}

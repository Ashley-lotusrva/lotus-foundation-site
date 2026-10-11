import { notFound } from "next/navigation";
import Link from "next/link";
import { services } from "@/lib/hub-content";
import { Intro, Availability, Crisis } from "../../components/Hub";
export function generateStaticParams() {
  return services.map((s) => ({ service: s.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const s = services.find((s) => s.slug === service);
  if (!s) notFound();
  return (
    <div className="hub">
      <Intro label="Community resources" title={s.title}>
        <p>{s.description}</p>
      </Intro>
      <section className="hub-panel">
        <h2>What to expect</h2>
        <p>{s.detail}</p>
        <Link className="hub-button" href="/get-help">
          Ask for help
        </Link>
      </section>
      <Availability />
      <Crisis />
    </div>
  );
}

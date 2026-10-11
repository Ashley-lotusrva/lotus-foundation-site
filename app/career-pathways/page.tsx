import Link from "next/link";
import { pathways } from "@/lib/hub-content";
import { Intro, Availability } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro label="Career pathways" title="Build skills for what comes next.">
        <p>
          A credential can open a door. We help you explore the pathway,
          enrollment steps, and support that could help you get there.
        </p>
      </Intro>
      <div className="hub-grid">
        {pathways.map(([t, d]) => (
          <article className="hub-card" key={t}>
            <h2>{t}</h2>
            <p>{d}</p>
            <Link href="/get-help">Share your interest →</Link>
          </article>
        ))}
      </div>
      <section className="hub-section">
        <p>
          The Lotus Foundation does not award CDL licenses, clinical
          credentials, peer recovery certifications, or CSAC credentials.
          Requirements, enrollment, and credentials are determined by the
          relevant qualified providers and authorities.
        </p>
        <Availability />
      </section>
    </div>
  );
}

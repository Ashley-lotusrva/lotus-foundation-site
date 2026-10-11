import Link from "next/link";
import { services } from "@/lib/hub-content";
import { Intro, Availability, Crisis } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro label="Services" title="Your needs may not fit into one box.">
        <p>
          We help you explore a practical plan across health, recovery, housing,
          food, clothing, benefits, bills, transportation, training, and
          employment.
        </p>
      </Intro>
      <div className="hub-grid">
        {services.map((s) => (
          <Link className="hub-card" key={s.slug} href={"/services/" + s.slug}>
            <h2>{s.title}</h2>
            <p>{s.description}</p>
            <span>Learn more →</span>
          </Link>
        ))}
      </div>
      <section className="hub-section">
        <h2>Training and work</h2>
        <p>
          Explore partner-led credential pathways and practical learning
          opportunities.
        </p>
        <Link className="hub-button" href="/career-pathways">
          Career pathways
        </Link>
      </section>
      <Availability />
      <Crisis />
    </div>
  );
}

import Link from "next/link";
import { Intro } from "../components/Hub";
export default function Page() {
  return (
    <div className="hub">
      <Intro label="Get involved" title="Open more pathways with us.">
        <p>
          Help build practical support for neighbors across Greater Richmond.
        </p>
      </Intro>
      <div className="hub-grid">
        {[
          [
            "Give or sponsor",
            "Ask about current giving options, assistance needs, or sponsoring a training opportunity. Confirm gift arrangements and any tax documentation with our team.",
          ],
          [
            "Volunteer",
            "Share your skills and availability. Contact us for current volunteer opportunities.",
          ],
          [
            "Host a drive",
            "Ask which food, clothing, or hygiene items are currently needed before collecting or delivering donations.",
          ],
        ].map(([t, d]) => (
          <article className="hub-card" key={t}>
            <h2>{t}</h2>
            <p>{d}</p>
            <Link href="/contact">Contact our team →</Link>
          </article>
        ))}
      </div>
      <section className="hub-section">
        <Link className="hub-button" href="/partners">
          Explore a partnership
        </Link>
      </section>
    </div>
  );
}

import Link from "next/link";
import { services } from "@/lib/hub-content";
import { Availability, Crisis } from "./components/Hub";
export default function Home() {
  return (
    <div className="hub">
      <section className="hub-hero">
        <div>
          <p className="eyebrow">The Lotus Foundation · Greater Richmond</p>
          <h1>You do not have to find your way alone.</h1>
          <p>
            Find a path toward care, stability, and opportunity. The Lotus
            Foundation helps connect individuals and families to community
            resources, qualified service partners, and career pathways.
          </p>
          <div className="hub-actions">
            <Link className="hub-button" href="/get-help">
              Get Help
            </Link>
            <Link className="hub-secondary" href="/referral">
              Refer Someone
            </Link>
          </div>
          <Link className="hub-text-link" href="/services">
            Explore services →
          </Link>
        </div>
        <aside className="hub-hero-card">
          <span>ONE DOOR.</span>
          <h2>
            Many pathways.
            <br />A stronger future.
          </h2>
          <p>A place to begin. A person to help with the next step.</p>
          <div className="hub-petal" aria-hidden="true">
            ✦
          </div>
        </aside>
      </section>
      <Crisis />
      <section className="hub-section">
        <p className="eyebrow">Start where you are</p>
        <h2>What would help today?</h2>
        <div className="hub-grid">
          {services.slice(1).map((s) => (
            <Link
              className="hub-card"
              key={s.slug}
              href={"/services/" + s.slug}
            >
              <h3>{s.title}</h3>
              <p>{s.description}</p>
              <span>Find support →</span>
            </Link>
          ))}
          <Link className="hub-card" href="/career-pathways">
            <h3>Training & Careers</h3>
            <p>
              Explore CDL, trades, AI and digital skills, peer recovery, and
              CSAC career pathways.
            </p>
            <span>Build my path →</span>
          </Link>
        </div>
      </section>
      <section className="hub-section hub-sage">
        <p className="eyebrow">How The Lotus Foundation works</p>
        <h2>A next step you can understand.</h2>
        <div className="hub-grid">
          {[
            [
              "01",
              "Share your needs",
              "Tell us what matters most. You do not need to tell your whole story online.",
            ],
            [
              "02",
              "Build a plan",
              "Work with a navigator to identify practical next steps.",
            ],
            [
              "03",
              "Make a connection",
              "Get help finding the right partner and working through the next step.",
            ],
            [
              "04",
              "Follow up",
              "Check progress and discuss barriers that still need attention.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span className="hub-number">{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="hub-section">
        <p className="eyebrow">Career pathways</p>
        <h2>Train for what comes next.</h2>
        <p>
          Getting to a credential can take more than tuition. Explore training
          partners, enrollment steps, digital skills, and support for barriers
          along the way.
        </p>
        <Link className="hub-button" href="/career-pathways">
          Explore career pathways
        </Link>
      </section>
      <Availability />
      <section className="hub-section hub-dark">
        <p className="eyebrow">Get involved</p>
        <h2>Help one door open many pathways.</h2>
        <p>
          Explore ways to support resource navigation, basic needs, and career
          opportunities.
        </p>
        <div className="hub-actions">
          <Link className="hub-button" href="/get-involved">
            Support the work
          </Link>
          <Link className="hub-secondary" href="/partners">
            Become a partner
          </Link>
        </div>
      </section>
    </div>
  );
}

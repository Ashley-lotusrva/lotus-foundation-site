import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | The Lotus Foundation",
  description:
    "Community resources, qualified service partners, and career pathways through The Lotus Foundation.",
};

const CURRENT_SERVICES = [
  {
    title: "Mental Health & Recovery",
    subtitle: "Qualified partner connections",
    desc: "Navigation to appropriate providers. Clinical care and treatment are delivered by qualified partners.",
    items: [
      "Mental health care",
      "Substance-use treatment",
      "Medication management connections",
      "Peer recovery support",
      "Recovery housing connections",
      "Help with next steps",
    ],
  },
  {
    title: "Housing & Everyday Support",
    subtitle: "Community resources",
    desc: "Contact us for current availability. Assistance is subject to eligibility and available funding and is not guaranteed.",
    items: [
      "Housing navigation",
      "Rent and utility needs",
      "Food and clothing resources",
      "Benefits and applications",
      "Transportation needs",
      "Follow-up and planning",
    ],
  },
];
const FUTURE_SERVICES = [
  "CDL training partners",
  "Skilled trades",
  "AI and digital skills",
  "Peer recovery pathways",
  "CSAC career navigation",
  "Employment connections",
];
const TARGET_CONDITIONS = [
  "Richmond",
  "East Highland Park",
  "Henrico County",
  "Chesterfield County",
  "Nearby communities",
];

export default function ServicesPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-royal-purple">
            What We Offer
          </p>
          <h1 className="mt-2 font-display text-4xl text-royal-purple">
            Services We Offer
          </h1>
          <span className="mt-4 block h-[3px] w-16 bg-gold mx-auto" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            Practical navigation across care, recovery, housing, basic needs,
            and opportunities for work and learning.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {CURRENT_SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-teal/20 p-8"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-teal">
                {s.subtitle}
              </span>
              <h2 className="mt-1 font-display text-2xl text-royal-purple">
                {s.title}
              </h2>
              <p className="mt-3 text-sm text-foreground/70">{s.desc}</p>
              <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-foreground/80">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Target population */}
      <section className="bg-royal-purple/5 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-3xl text-royal-purple">
            Who We Serve
          </h2>
          <p className="text-center mt-3 text-foreground/70">
            Individuals and families across Greater Richmond. Program and
            partner eligibility may vary.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TARGET_CONDITIONS.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white border border-teal/30 px-4 py-2 text-sm text-foreground/80"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="text-center">
        <Link className="text-royal-purple underline" href="/career-pathways">
          Explore career pathways →
        </Link>
      </div>
      {/* Career connections */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-center font-display text-3xl text-royal-purple">
          Career Pathways
        </h2>
        <p className="text-center mt-3 text-foreground/70 max-w-2xl mx-auto">
          Explore training and career connections. Contact us for current
          availability. Qualified providers and authorities deliver instruction
          and award credentials.
        </p>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {FUTURE_SERVICES.map((s) => (
            <div
              key={s}
              className="rounded-xl border border-gold/20 px-4 py-3 text-center text-sm text-foreground/75"
            >
              {s}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-teal/10 py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-royal-purple">
            Ready to Take the Next Step?
          </h2>
          <p className="mt-4 text-foreground/70">
            Reach out to learn more about our programs and how to get started.
          </p>
          <Link
            href="/referral"
            className="mt-8 inline-block rounded-full bg-royal-purple px-8 py-3 text-white font-medium hover:bg-teal transition-colors"
          >
            Make a Referral
          </Link>
        </div>
      </section>
    </div>
  );
}

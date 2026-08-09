import Link from "next/link";
import Image from "next/image";

const VALUES = [
  { letter: "L", title: "Leadership", desc: "We lead with integrity, accountability, and a commitment to excellence." },
  { letter: "O", title: "Opportunity", desc: "We create opportunities for recovery, personal growth, and independence." },
  { letter: "T", title: "Transformation", desc: "We believe meaningful change is possible for every individual." },
  { letter: "U", title: "Unity", desc: "We build strong partnerships with clients, families, providers, and the community." },
  { letter: "S", title: "Service", desc: "We provide compassionate, person-centered care that honors dignity and respect." },
];

const SERVICES = [
  {
    title: "Mental Health Skill Building",
    subtitle: "2.1",
    desc: "Helping adults develop the skills needed to live safely and independently in the community.",
    items: ["Medication education", "Daily living skills", "Employment readiness", "Community integration"],
  },
  {
    title: "Substance Use Intensive Outpatient Program",
    subtitle: "SA IOP",
    desc: "Structured treatment supporting recovery through counseling, education, relapse prevention, and recovery planning.",
    items: ["Group & individual counseling", "Relapse prevention", "Family education", "Case management"],
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-cream">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display italic text-teal text-lg">
              Healing Happens Here. Hope Begins Today.
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-royal-purple">
              Rising Above. Growing Within.
            </h1>
            <p className="mt-6 text-base md:text-lg text-foreground/80 max-w-lg">
              The Lotus Foundation empowers individuals living with mental health
              and substance use challenges through compassionate, evidence-based,
              person-centered behavioral health services.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="rounded-full bg-royal-purple px-7 py-3 text-white font-medium hover:bg-teal transition-colors"
              >
                Get in Touch
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-royal-purple px-7 py-3 text-royal-purple font-medium hover:bg-royal-purple hover:text-white transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/lotus-logo.png"
              alt="The Lotus Foundation"
              width={340}
              height={480}
              className="w-56 md:w-72 h-auto drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="font-display text-3xl text-royal-purple">Our Mission</h2>
        <p className="mt-6 text-lg leading-relaxed text-foreground/80">
          Like the lotus flower that rises through muddy waters to bloom, every
          individual has the capacity to overcome adversity with the right
          support, guidance, and opportunities. We are committed to meeting
          people where they are and walking alongside them as they achieve
          recovery, independence, and lasting wellness.
        </p>
      </section>

      {/* Core Values */}
      <section className="bg-royal-purple/5 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl text-royal-purple">
            The Lotus Model
          </h2>
          <p className="text-center mt-2 text-foreground/60">Our core values</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {VALUES.map((v) => (
              <div
                key={v.letter}
                className="rounded-2xl bg-white p-6 text-center shadow-sm border border-gold/20"
              >
                <span className="font-display text-3xl text-gold">{v.letter}</span>
                <h3 className="mt-2 font-semibold text-royal-purple">{v.title}</h3>
                <p className="mt-2 text-sm text-foreground/70">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center font-display text-3xl text-royal-purple">
          Services We Offer
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {SERVICES.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl border border-teal/20 p-8 hover:shadow-lg transition-shadow"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-teal">
                {s.subtitle}
              </span>
              <h3 className="mt-1 font-display text-xl text-royal-purple">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/70">{s.desc}</p>
              <ul className="mt-4 space-y-1 text-sm text-foreground/80">
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
        <div className="mt-10 text-center">
          <Link
            href="/services"
            className="text-royal-purple font-medium underline decoration-gold underline-offset-4 hover:text-teal"
          >
            View all services &amp; who we serve &rarr;
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-teal/10 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="font-display text-3xl text-royal-purple">
            Growing Through Every Season of Recovery
          </h2>
          <p className="mt-4 text-foreground/70">
            Reach out today to learn how The Lotus Foundation can support you or
            someone you love.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-royal-purple px-8 py-3 text-white font-medium hover:bg-teal transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}

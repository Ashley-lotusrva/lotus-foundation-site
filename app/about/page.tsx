import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | The Lotus Foundation",
  description:
    "Learn about The Lotus Foundation's mission, vision, philosophy, and the Lotus Model of core values guiding our behavioral health services.",
};

const VALUES = [
  { letter: "L", title: "Leadership", desc: "We lead with integrity, accountability, and a commitment to excellence." },
  { letter: "O", title: "Opportunity", desc: "We create opportunities for recovery, personal growth, and independence." },
  { letter: "T", title: "Transformation", desc: "We believe meaningful change is possible for every individual." },
  { letter: "U", title: "Unity", desc: "We build strong partnerships with clients, families, providers, and the community." },
  { letter: "S", title: "Service", desc: "We provide compassionate, person-centered care that honors dignity and respect." },
];

const PERSONALITY = [
  "Compassionate",
  "Professional",
  "Hope-filled",
  "Trauma-informed",
  "Community-centered",
  "Innovative",
  "Inclusive",
];

export default function AboutPage() {
  return (
    <div>
      <section className="bg-cream py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-royal-purple">
            About Us
          </p>
          <h1 className="mt-2 font-display text-4xl text-royal-purple">
            Healing Is a Journey
          </h1>
          <span className="mt-4 block h-[3px] w-16 bg-gold mx-auto" />
          <p className="mt-6 text-lg leading-relaxed text-foreground/80">
            At The Lotus Foundation, we believe that healing is a journey. Like
            the lotus flower that rises through muddy waters to bloom, every
            individual has the capacity to overcome adversity with the right
            support, guidance, and opportunities. We are committed to meeting
            people where they are and walking alongside them as they achieve
            recovery, independence, and lasting wellness.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 grid md:grid-cols-2 gap-10">
        <div className="rounded-2xl border border-gold/20 p-8">
          <h2 className="font-display text-2xl text-royal-purple">Mission</h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75">
            The Lotus Foundation exists to empower individuals living with
            mental health and substance use challenges by providing
            compassionate, evidence-based, person-centered behavioral health
            services. Through education, skill development, recovery support,
            and community partnerships, we inspire hope, foster resilience,
            and help every individual build a healthier, more independent
            future.
          </p>
        </div>
        <div className="rounded-2xl border border-gold/20 p-8">
          <h2 className="font-display text-2xl text-royal-purple">Vision</h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/75">
            To be Virginia&apos;s leading community behavioral health
            organization, recognized for transforming lives through
            innovative, accessible, and culturally responsive mental health
            and substance use services that strengthen individuals, families,
            and communities.
          </p>
        </div>
      </section>

      {/* Lotus Model */}
      <section className="bg-royal-purple/5 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center font-display text-3xl text-royal-purple">
            Core Values &mdash; The Lotus Model
          </h2>
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

      {/* Brand personality */}
      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-royal-purple">Who We Are</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {PERSONALITY.map((word) => (
            <span
              key={word}
              className="rounded-full bg-teal/10 px-5 py-2 text-sm font-medium text-teal"
            >
              {word}
            </span>
          ))}
        </div>
      </section>

      {/* Motto / commitment */}
      <section className="bg-teal/10 py-16">
        <div className="mx-auto max-w-4xl px-6 grid md:grid-cols-2 gap-10">
          <div className="text-center">
            <h3 className="font-display text-xl text-royal-purple">Our Motto</h3>
            <p className="mt-3 font-display italic text-lg text-foreground/80">
              Healing Happens Here. Hope Begins Today.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-display text-xl text-royal-purple">Our Commitment</h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/75">
              We are committed to providing high-quality, ethical, and
              evidence-based services that inspire hope, promote recovery, and
              strengthen our community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

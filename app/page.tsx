import SkylineHero from "./components/SkylineHero";
import ValuesBar from "./components/ValuesBar";
import AboutCollage from "./components/AboutCollage";
import HighlightsBar from "./components/HighlightsBar";
import ProgramCards from "./components/ProgramCards";
import CTABanner from "./components/CTABanner";

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <SkylineHero />

      {/* LOTUS values quick-reference bar, overlapping the hero */}
      <ValuesBar />

      {/* Mission */}
      <section className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-royal-purple">
          Our Mission
        </p>
        <h2 className="mt-2 font-display text-3xl text-royal-purple">
          Healing Is a Journey
        </h2>
        <span className="mt-4 block h-[3px] w-16 bg-gold mx-auto" />
        <p className="mt-6 text-lg leading-relaxed text-foreground/80">
          Like the lotus flower that rises through muddy waters to bloom, every
          individual has the capacity to overcome adversity with the right
          support, guidance, and opportunities. We are committed to meeting
          people where they are and walking alongside them as they achieve
          recovery, independence, and lasting wellness.
        </p>
      </section>

      {/* About, with photo collage */}
      <AboutCollage />

      {/* Honest at-a-glance highlights */}
      <HighlightsBar />

      {/* Programs */}
      <ProgramCards />

      {/* CTA banner */}
      <CTABanner />
    </div>
  );
}

import Link from "next/link";
import { BookOpenCheck, HeartPulse, ArrowRight } from "lucide-react";

const PROGRAMS = [
  {
    icon: BookOpenCheck,
    title: "Mental Health Skill Building",
    subtitle: "2.1",
    desc: "Helping adults develop the skills needed to live safely and independently in the community.",
  },
  {
    icon: HeartPulse,
    title: "Substance Use Intensive Outpatient",
    subtitle: "SA IOP",
    desc: "Structured treatment supporting recovery through counseling, education, and relapse prevention.",
  },
];

export default function ProgramCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-royal-purple">
        Our Programs
      </p>
      <h2 className="mt-2 text-center font-display text-3xl md:text-4xl text-royal-purple">
        Creating Opportunities. Building Futures.
      </h2>
      <span className="mt-4 block h-[3px] w-16 bg-gold mx-auto" />

      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {PROGRAMS.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-teal/20 p-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal/10">
                <Icon className="h-6 w-6 text-teal" strokeWidth={1.75} />
              </div>
              <span className="mt-4 block text-xs font-semibold uppercase tracking-wide text-teal">
                {p.subtitle}
              </span>
              <h3 className="mt-1 font-display text-xl text-royal-purple">
                {p.title}
              </h3>
              <p className="mt-3 text-sm text-foreground/70">{p.desc}</p>
              <Link
                href="/services"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-royal-purple hover:text-teal"
              >
                Learn more <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

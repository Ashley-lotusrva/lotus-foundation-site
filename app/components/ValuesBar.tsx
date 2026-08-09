import { Compass, KeyRound, Sparkles, Users, HeartHandshake } from "lucide-react";

const VALUES = [
  {
    letter: "L",
    title: "Leadership",
    desc: "Integrity, accountability, and a commitment to excellence.",
    icon: Compass,
  },
  {
    letter: "O",
    title: "Opportunity",
    desc: "Creating pathways to recovery, growth, and independence.",
    icon: KeyRound,
  },
  {
    letter: "T",
    title: "Transformation",
    desc: "Meaningful change is possible for every individual.",
    icon: Sparkles,
  },
  {
    letter: "U",
    title: "Unity",
    desc: "Strong partnerships with clients, families, and providers.",
    icon: Users,
  },
  {
    letter: "S",
    title: "Service",
    desc: "Compassionate care that honors dignity and respect.",
    icon: HeartHandshake,
  },
];

export default function ValuesBar() {
  return (
    <div className="relative z-20 -mt-16 md:-mt-20 px-6">
      <div className="mx-auto max-w-6xl rounded-2xl bg-white shadow-xl border border-gold/20 px-6 py-8 md:px-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {VALUES.map((v) => {
          const Icon = v.icon;
          return (
            <div key={v.letter} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-royal-purple/10">
                <Icon className="h-6 w-6 text-royal-purple" strokeWidth={1.75} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-royal-purple">
                {v.title}
              </h3>
              <p className="mt-1 text-xs text-foreground/60 leading-snug">
                {v.desc}
              </p>
              <span className="mt-2 block h-[2px] w-8 mx-auto bg-gold" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

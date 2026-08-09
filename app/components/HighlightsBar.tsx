import { Users, MapPin, ShieldCheck, ClipboardList } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Users, label: "Adults 18+", sub: "Who we serve" },
  { icon: MapPin, label: "Richmond & Central VA", sub: "Service area" },
  { icon: ShieldCheck, label: "Evidence-based", sub: "Our approach" },
  { icon: ClipboardList, label: "Two core programs", sub: "Growing every year" },
];

export default function HighlightsBar() {
  return (
    <section className="bg-royal-purple py-14">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-gold">
          At a Glance
        </p>
        <h2 className="mt-2 text-center font-display text-2xl md:text-3xl text-white">
          Compassionate Care, Close to Home
        </h2>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {HIGHLIGHTS.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.label} className="text-center">
                <Icon
                  className="mx-auto h-7 w-7 text-gold"
                  strokeWidth={1.5}
                />
                <p className="mt-3 text-sm md:text-base font-semibold text-white">
                  {h.label}
                </p>
                <p className="mt-1 text-xs text-white/60">{h.sub}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

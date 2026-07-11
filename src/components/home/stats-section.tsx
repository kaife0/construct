import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";

const stats = [
  { to: 500, suffix: "+", label: "Projects delivered" },
  { to: 14, suffix: "yrs", label: "Field experience" },
  { to: 60, suffix: "+", label: "Cities served" },
  { to: 98, suffix: "%", label: "On-time handover" },
];

export function StatsSection() {
  return (
    <section className="border-t border-line bg-ink text-paper">
      <div className="container-x grid grid-cols-2 gap-8 py-16 md:grid-cols-4 md:py-20">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div>
              <p className="display text-4xl text-paper sm:text-5xl">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="label mt-3 text-paper/50">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

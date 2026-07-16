import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { getSiteSettings } from "@/lib/api";

export async function StatsSection() {
  const { profile } = await getSiteSettings();
  const stats = [
    { to: profile.stats.projects, suffix: "+", label: "Projects delivered" },
    { to: profile.stats.experienceYears, suffix: "yrs", label: "Field experience" },
    { to: profile.stats.cities, suffix: "+", label: "Cities served" },
    { to: 98, suffix: "%", label: "On-time handover" }, // not admin-editable — no backing field in SiteSettings
  ];

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

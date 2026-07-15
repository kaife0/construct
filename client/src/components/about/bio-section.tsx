import { Reveal } from "@/components/reveal";
import { Counter } from "@/components/counter";
import { getSiteSettings } from "@/lib/api";

export async function BioSection() {
  const { profile } = await getSiteSettings();
  const stats = [
    { to: profile.stats.projects, suffix: "+", label: "Projects" },
    { to: profile.stats.experienceYears, suffix: "yrs", label: "Experience" },
    { to: profile.stats.cities, suffix: "+", label: "Cities" },
  ];

  return (
    <section>
      <div className="container-x grid gap-12 py-14 md:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          {profile.bio.map((para, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <p className="mb-5 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">{para}</p>
            </Reveal>
          ))}

          <div className="mt-8 grid grid-cols-3 gap-6 border-t border-line pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="display text-3xl sm:text-4xl">
                  <Counter to={s.to} suffix={s.suffix} />
                </p>
                <p className="label mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credentials */}
        <div className="lg:col-span-5">
          <div className="border border-line bg-surface p-6">
            <span className="label text-[10px]">CREDENTIALS</span>
            <ul className="mt-4 divide-y divide-line">
              {profile.credentials.map((c, i) => (
                <li key={c} className="flex items-center gap-3 py-3">
                  <span className="label text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-medium">{c}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

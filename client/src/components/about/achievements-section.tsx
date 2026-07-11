import { Reveal } from "@/components/reveal";
import { achievements } from "@/lib/content";

export function AchievementsSection() {
  return (
    <section className="border-t border-line">
      <div className="container-x py-16 md:py-20">
        <p className="label">Milestones</p>
        <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">Selected achievements.</h2>
        <div className="mt-12 border-t border-line">
          {achievements.map((a, i) => (
            <Reveal key={a.year} delay={i * 0.05}>
              <div className="grid grid-cols-12 items-baseline gap-4 border-b border-line py-7">
                <span className="mono col-span-3 text-lg font-semibold text-accent-strong sm:col-span-2">{a.year}</span>
                <h3 className="col-span-9 text-lg font-semibold tracking-tight sm:col-span-4">{a.title}</h3>
                <p className="col-span-9 col-start-4 text-sm text-graphite sm:col-span-6 sm:col-start-auto">{a.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

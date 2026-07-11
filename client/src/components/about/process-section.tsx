import { Reveal } from "@/components/reveal";
import { process } from "@/lib/content";

export function ProcessSection() {
  return (
    <section className="border-t border-line bg-surface/60">
      <div className="container-x py-16 md:py-20">
        <p className="label">How we work</p>
        <h2 className="display mt-4 max-w-md text-3xl sm:text-4xl">A simple, four-step process.</h2>
        <div className="mt-12 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.06}>
              <div className="h-full bg-surface p-6">
                <span className="display text-3xl text-accent">{p.step}</span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

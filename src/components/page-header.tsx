import { Reveal } from "@/components/reveal";

/** Consistent inner-page header: mono index label, big title, optional lede. */
export function PageHeader({
  index,
  label,
  title,
  lede,
}: {
  index: string;
  label: string;
  title: string;
  lede?: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 md:py-20">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-accent" />
            ({index}) — {label}
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="display mt-6 max-w-3xl text-4xl sm:text-6xl">{title}</h1>
        </Reveal>
        {lede && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-graphite sm:text-lg">
              {lede}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}

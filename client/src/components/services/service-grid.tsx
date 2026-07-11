import { Reveal } from "@/components/reveal";
import { ServiceCard } from "@/components/services/service-card";
import type { Service } from "@/lib/content";

export function ServiceGrid({ services }: { services: Service[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 lg:gap-6">
      {services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 3) * 0.05}>
          <ServiceCard service={s} />
        </Reveal>
      ))}
    </div>
  );
}

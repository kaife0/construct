import { CardGrid } from "@/components/card-grid";
import { ServiceCard } from "@/components/services/service-card";
import type { Service } from "@/lib/content";

export function ServiceGrid({ services }: { services: Service[] }) {
  return <CardGrid items={services} lgCols={3} getKey={(s) => s.slug} renderItem={(s) => <ServiceCard service={s} />} />;
}

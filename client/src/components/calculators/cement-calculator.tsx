"use client";

import { useConcreteMix } from "@/components/calculators/use-concrete-mix";
import { ConcreteVolumeFields } from "@/components/calculators/concrete-volume-fields";
import { ResultCard } from "@/components/calculators/result-card";
import { materialRates } from "@/lib/rates";
import { formatNumber, formatRupees } from "@/lib/format";

export function CementCalculator() {
  const m = useConcreteMix();
  const cost = m.result.cementBags * materialRates.cementPerBag;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <ConcreteVolumeFields {...m} />
      <ResultCard
        headlineLabel="Cement required"
        headlineValue={`${formatNumber(m.result.cementBags, 1)} bags`}
        stats={[
          { label: "Cement weight", value: `${formatNumber(m.result.cementKg)} kg` },
          { label: "Grade", value: m.grade },
          { label: "Rate used", value: `₹${materialRates.cementPerBag}/bag` },
        ]}
        costValue={formatRupees(cost)}
        note="50kg bags, nominal mix. Dry volume factor 1.54 applied for bulking during mixing."
      />
    </div>
  );
}

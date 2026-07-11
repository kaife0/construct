"use client";

import { useConcreteMix } from "@/components/calculators/use-concrete-mix";
import { ConcreteVolumeFields } from "@/components/calculators/concrete-volume-fields";
import { ResultCard } from "@/components/calculators/result-card";
import { materialRates } from "@/lib/rates";
import { formatNumber, formatRupees } from "@/lib/format";

export function StoneCalculator() {
  const m = useConcreteMix();
  const cost = m.result.aggregateCuft * materialRates.aggregatePerCuft;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <ConcreteVolumeFields {...m} />
      <ResultCard
        headlineLabel="Stone (aggregate) required"
        headlineValue={`${formatNumber(m.result.aggregateCuft)} cu.ft`}
        stats={[
          { label: "In m³", value: `${formatNumber(m.result.aggregateM3, 2)} m³` },
          { label: "Grade", value: m.grade },
          { label: "Rate used", value: `₹${materialRates.aggregatePerCuft}/cu.ft` },
        ]}
        costValue={formatRupees(cost)}
        note="Coarse aggregate (20mm graded) for the nominal mix selected, dry-volume basis."
      />
    </div>
  );
}

"use client";

import { useConcreteMix } from "@/components/calculators/use-concrete-mix";
import { ConcreteVolumeFields } from "@/components/calculators/concrete-volume-fields";
import { ResultCard } from "@/components/calculators/result-card";
import { materialRates } from "@/lib/rates";
import { formatNumber, formatRupees } from "@/lib/format";

export function SandCalculator() {
  const m = useConcreteMix();
  const cost = m.result.sandCuft * materialRates.sandPerCuft;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <ConcreteVolumeFields {...m} />
      <ResultCard
        headlineLabel="Sand required"
        headlineValue={`${formatNumber(m.result.sandCuft)} cu.ft`}
        stats={[
          { label: "In m³", value: `${formatNumber(m.result.sandM3, 2)} m³` },
          { label: "Grade", value: m.grade },
          { label: "Rate used", value: `₹${materialRates.sandPerCuft}/cu.ft` },
        ]}
        costValue={formatRupees(cost)}
        note="Fine aggregate for the nominal mix selected, dry-volume basis."
      />
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import { NumberField, SelectField } from "@/components/fields";
import { ResultCard } from "@/components/calculators/result-card";
import { calculateSteel, STRUCTURE_TYPE_OPTIONS, type StructureType } from "@/lib/calculators";
import { materialRates } from "@/lib/rates";
import { formatNumber, formatRupees } from "@/lib/format";

export function SteelCalculator() {
  const [area, setArea] = useState(1200);
  const [type, setType] = useState<StructureType>("framed-lowrise");

  const result = useMemo(() => calculateSteel(area, type), [area, type]);
  const cost = result.kg * materialRates.steelPerKg;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField label="Built-up area" suffix="sqft" value={area} onChange={setArea} step={50} />
        <SelectField label="Structure type" value={type} onChange={setType} options={STRUCTURE_TYPE_OPTIONS} />
      </div>

      <ResultCard
        headlineLabel="Steel required"
        headlineValue={`${formatNumber(result.kg)} kg`}
        stats={[
          { label: "In tonnes", value: `${formatNumber(result.tonnes, 2)} t` },
          { label: "Rate used", value: `₹${materialRates.steelPerKg}/kg` },
        ]}
        costValue={formatRupees(cost)}
        note="Thumb-rule kg per sq.ft of built-up area by structure type — a detailed BBS will vary by design."
      />
    </div>
  );
}

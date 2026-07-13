"use client";

import { useMemo, useState } from "react";
import { NumberField, SelectField } from "@/components/fields";
import { ResultCard } from "@/components/calculators/result-card";
import { calculateBricks, WALL_THICKNESS_OPTIONS } from "@/lib/calculators";
import { materialRates } from "@/lib/rates";
import { formatNumber, formatRupees } from "@/lib/format";

export function BrickCalculator() {
  const [length, setLength] = useState(30);
  const [height, setHeight] = useState(10);
  const [thickness, setThickness] = useState<number>(WALL_THICKNESS_OPTIONS[1].mm);
  const [openings, setOpenings] = useState(20);
  const [wastage, setWastage] = useState(5);

  const result = useMemo(
    () => calculateBricks(length, height, thickness, openings, wastage),
    [length, height, thickness, openings, wastage]
  );

  const cost = result.bricks * materialRates.brickPerUnit;

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField label="Wall length" suffix="m" value={length} onChange={setLength} step={0.5} />
        <NumberField label="Wall height" suffix="m" value={height} onChange={setHeight} step={0.5} />
        <SelectField
          label="Wall thickness"
          value={String(thickness)}
          onChange={(v) => setThickness(Number(v))}
          options={WALL_THICKNESS_OPTIONS.map((o) => ({ value: String(o.mm), label: o.label }))}
        />
        <NumberField label="Openings (doors/windows)" suffix="m²" value={openings} onChange={setOpenings} step={1} />
        <NumberField label="Wastage" suffix="%" value={wastage} onChange={setWastage} step={1} />
      </div>

      <ResultCard
        headlineLabel="Bricks required"
        headlineValue={`${formatNumber(result.bricks)} bricks`}
        stats={[
          { label: "Net wall volume", value: `${formatNumber(result.netVolumeM3, 2)} m³` },
          { label: "Rate used", value: `₹${materialRates.brickPerUnit}/brick` },
        ]}
        costValue={formatRupees(cost)}
        note="Based on standard modular brick (190×90×90mm) with a 10mm mortar joint. Adjust wastage for cut bricks and breakage."
      />
    </div>
  );
}

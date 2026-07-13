"use client";

import { NumberField, SelectField } from "@/components/fields";
import type { ConcreteGrade } from "@/lib/calculators";

const gradeOptions: { value: ConcreteGrade; label: string }[] = [
  { value: "M15", label: "M15 (1:2:4)" },
  { value: "M20", label: "M20 (1:1.5:3)" },
  { value: "M25", label: "M25 (1:1:2)" },
];

export function ConcreteVolumeFields(props: {
  length: number; setLength: (v: number) => void;
  width: number; setWidth: (v: number) => void;
  depth: number; setDepth: (v: number) => void;
  grade: ConcreteGrade; setGrade: (v: ConcreteGrade) => void;
  wastage: number; setWastage: (v: number) => void;
  volumeM3: number;
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <NumberField label="Length" suffix="m" value={props.length} onChange={props.setLength} step={0.5} />
      <NumberField label="Width" suffix="m" value={props.width} onChange={props.setWidth} step={0.5} />
      <NumberField label="Depth / thickness" suffix="m" value={props.depth} onChange={props.setDepth} step={0.05} />
      <SelectField label="Concrete grade" value={props.grade} onChange={props.setGrade} options={gradeOptions} />
      <NumberField label="Wastage" suffix="%" value={props.wastage} onChange={props.setWastage} step={1} />
      <div>
        <label className="label mb-2 block text-[11px]">Wet volume</label>
        <p className="mono flex h-[42px] items-center border border-line bg-surface px-3.5 text-sm text-graphite">
          {props.volumeM3.toFixed(2)} m³
        </p>
      </div>
    </div>
  );
}

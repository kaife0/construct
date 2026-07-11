"use client";

import { useMemo, useState } from "react";
import { calculateConcreteMix, type ConcreteGrade } from "@/lib/calculators";

/** Shared state + calculation for the Cement / Sand / Stone calculators — they're all the same concrete-volume math, just headlining a different output. */
export function useConcreteMix() {
  const [length, setLength] = useState(10);
  const [width, setWidth] = useState(10);
  const [depth, setDepth] = useState(0.15);
  const [grade, setGrade] = useState<ConcreteGrade>("M20");
  const [wastage, setWastage] = useState(5);

  const volumeM3 = length * width * depth;
  const result = useMemo(
    () => calculateConcreteMix(volumeM3, grade, wastage),
    [volumeM3, grade, wastage]
  );

  return {
    length, setLength,
    width, setWidth,
    depth, setDepth,
    grade, setGrade,
    wastage, setWastage,
    volumeM3,
    result,
  };
}

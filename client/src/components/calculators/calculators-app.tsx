"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { BrickCalculator } from "@/components/calculators/brick-calculator";
import { CementCalculator } from "@/components/calculators/cement-calculator";
import { SteelCalculator } from "@/components/calculators/steel-calculator";
import { SandCalculator } from "@/components/calculators/sand-calculator";
import { StoneCalculator } from "@/components/calculators/stone-calculator";
import type { MaterialRates } from "@/lib/rates";

const tabs = [
  { key: "bricks", label: "Bricks", Component: BrickCalculator },
  { key: "cement", label: "Cement", Component: CementCalculator },
  { key: "steel", label: "Steel", Component: SteelCalculator },
  { key: "sand", label: "Sand", Component: SandCalculator },
  { key: "stone", label: "Stone", Component: StoneCalculator },
] as const;

export function CalculatorsApp({ rates }: { rates: MaterialRates }) {
  const [active, setActive] = useState<(typeof tabs)[number]["key"]>("bricks");
  const Active = tabs.find((t) => t.key === active)?.Component ?? BrickCalculator;

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-line pb-6">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className="relative px-4 py-2.5 text-sm font-medium text-graphite transition-colors data-[active=true]:text-ink"
            data-active={active === t.key}
          >
            <span className="relative z-10">{t.label}</span>
            {active === t.key && (
              <motion.span
                layoutId="calc-app-tab"
                className="absolute inset-0 border border-line bg-surface"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="pt-10">
        <Active rates={rates} />
      </div>
    </div>
  );
}

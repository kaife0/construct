"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Homepage calculator teaser — a lightweight quick-estimate with a few tabs.
 * Uses common residential thumb-rules per sq.ft of built-up area. The full,
 * detailed calculators (with grades, wall thickness, wastage etc.) live on the
 * dedicated /calculators page (Phase 3).
 */

type Tab = {
  key: string;
  label: string;
  unit: string;
  perSqft: number; // rough coefficient per sq.ft built-up
  note: string;
};

const tabs: Tab[] = [
  { key: "bricks", label: "Bricks", unit: "bricks", perSqft: 8, note: "≈ 8 bricks / sq.ft (9\" walls)" },
  { key: "cement", label: "Cement", unit: "bags", perSqft: 0.4, note: "≈ 0.4 bag / sq.ft (50 kg bags)" },
  { key: "steel", label: "Steel", unit: "kg", perSqft: 4, note: "≈ 4 kg / sq.ft (RCC framed)" },
];

function format(n: number, unit: string) {
  const v = Math.round(n);
  return `${v.toLocaleString("en-IN")} ${unit}`;
}

export function CalculatorTeaser() {
  const [active, setActive] = useState(0);
  const [area, setArea] = useState(1200);
  const tab = tabs[active];
  const result = area * tab.perSqft;

  return (
    <div className="border border-line bg-surface">
      {/* header row */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="label text-[10px]">QUICK ESTIMATE</span>
        <span className="label text-[10px] text-accent-strong">THUMB-RULE</span>
      </div>

      {/* tabs */}
      <div className="flex border-b border-line">
        {tabs.map((t, i) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(i)}
            className={`relative flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              i === active ? "text-ink" : "text-muted hover:text-graphite"
            }`}
          >
            {t.label}
            {i === active && (
              <motion.span
                layoutId="calc-tab"
                className="absolute inset-x-0 bottom-0 h-0.5 bg-accent"
                transition={{ type: "spring", stiffness: 400, damping: 34 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* input */}
        <label className="label block text-[11px]">Built-up area — sq.ft</label>
        <div className="mt-3 flex items-center gap-4">
          <input
            type="range"
            min={200}
            max={5000}
            step={50}
            value={area}
            onChange={(e) => setArea(Number(e.target.value))}
            className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line accent-accent"
            aria-label="Built-up area in square feet"
          />
          <span className="mono w-24 shrink-0 text-right text-lg font-semibold tabular-nums">
            {area.toLocaleString("en-IN")}
          </span>
        </div>

        {/* result */}
        <div className="mt-7 border-t border-line pt-6">
          <p className="label text-[11px]">Estimated {tab.label.toLowerCase()}</p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={tab.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="display text-4xl sm:text-5xl"
              >
                {format(result, tab.unit)}
              </motion.p>
            </AnimatePresence>
          </div>
          <p className="mt-3 text-xs text-muted">{tab.note} · indicative only</p>
        </div>
      </div>
    </div>
  );
}

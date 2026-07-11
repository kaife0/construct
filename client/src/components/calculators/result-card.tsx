"use client";

import { AnimatePresence, motion } from "motion/react";

type Stat = { label: string; value: string };

export function ResultCard({
  headlineLabel,
  headlineValue,
  stats = [],
  costValue,
  note,
}: {
  headlineLabel: string;
  headlineValue: string;
  stats?: Stat[];
  costValue?: string;
  note?: string;
}) {
  return (
    <div className="border border-line bg-ink text-paper">
      <div className="flex items-center justify-between border-b border-paper/10 px-5 py-3">
        <span className="label text-[10px] text-paper/50">ESTIMATE</span>
        <span className="label text-[10px] text-accent">THUMB-RULE</span>
      </div>

      <div className="p-6">
        <p className="label text-[11px] text-paper/50">{headlineLabel}</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={headlineValue}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="display mt-2 text-4xl text-paper sm:text-5xl"
          >
            {headlineValue}
          </motion.p>
        </AnimatePresence>

        {stats.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-paper/10 pt-5 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="mono text-lg font-semibold text-paper">{s.value}</p>
                <p className="label mt-1 text-[9px] text-paper/50">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {costValue && (
          <div className="mt-6 flex items-center justify-between border-t border-paper/10 pt-5">
            <span className="label text-[11px] text-paper/50">Est. cost</span>
            <span className="mono text-xl font-semibold text-accent">{costValue}</span>
          </div>
        )}

        {note && <p className="mt-5 text-xs leading-relaxed text-paper/40">{note}</p>}
      </div>
    </div>
  );
}

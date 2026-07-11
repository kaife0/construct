"use client";

import { motion } from "motion/react";

/**
 * Animated technical elevation drawing (house front) with dimension callouts.
 * Lines draw themselves once on mount — a subtle, on-brand engineering signature.
 */

const draw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: (i: number) => ({
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { delay: i * 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] as const },
      opacity: { delay: i * 0.12, duration: 0.2 },
    },
  }),
};

const stroke = {
  fill: "none",
  stroke: "var(--ink)",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const thin = {
  fill: "none",
  stroke: "var(--line-strong)",
  strokeWidth: 1,
};

export function TechnicalDrawing() {
  return (
    <motion.svg
      viewBox="0 0 420 360"
      className="h-auto w-full"
      initial="hidden"
      animate="visible"
      role="img"
      aria-label="Technical elevation drawing of a house"
    >
      {/* faint grid */}
      <motion.rect
        x="0" y="0" width="420" height="360"
        fill="url(#grid)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.6 }}
      />
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="var(--line)" strokeWidth="0.75" />
        </pattern>
      </defs>

      {/* Ground line */}
      <motion.line x1="24" y1="300" x2="396" y2="300" {...stroke} variants={draw} custom={0} />

      {/* House body */}
      <motion.path d="M110 300 V170 H310 V300" {...stroke} variants={draw} custom={1} />
      {/* Roof */}
      <motion.path d="M92 176 L210 96 L328 176" {...stroke} variants={draw} custom={2} />
      {/* Roof ridge accent */}
      <motion.line x1="210" y1="96" x2="210" y2="170" stroke="var(--accent)" strokeWidth="1.5" variants={draw} custom={3} />

      {/* Door */}
      <motion.path d="M190 300 V232 H230 V300" {...stroke} variants={draw} custom={3.5} />
      {/* Windows */}
      <motion.rect x="128" y="200" width="42" height="42" {...stroke} variants={draw} custom={4} />
      <motion.rect x="250" y="200" width="42" height="42" {...stroke} variants={draw} custom={4.3} />
      <motion.path d="M149 200 V242 M128 221 H170" {...thin} variants={draw} custom={4.6} />
      <motion.path d="M271 200 V242 M250 221 H292" {...thin} variants={draw} custom={4.6} />

      {/* Dimension line — width (bottom) */}
      <motion.g variants={draw} custom={5}>
        <line x1="110" y1="326" x2="310" y2="326" {...thin} stroke="var(--accent)" />
        <line x1="110" y1="320" x2="110" y2="332" {...thin} stroke="var(--accent)" />
        <line x1="310" y1="320" x2="310" y2="332" {...thin} stroke="var(--accent)" />
      </motion.g>
      {/* Dimension line — height (left) */}
      <motion.g variants={draw} custom={5.3}>
        <line x1="64" y1="96" x2="64" y2="300" {...thin} stroke="var(--accent)" />
        <line x1="58" y1="96" x2="70" y2="96" {...thin} stroke="var(--accent)" />
        <line x1="58" y1="300" x2="70" y2="300" {...thin} stroke="var(--accent)" />
      </motion.g>

      {/* Labels */}
      <motion.text
        x="210" y="345" textAnchor="middle"
        className="mono" fontSize="11" fill="var(--graphite)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.4 }}
      >
        9600 mm
      </motion.text>
      <motion.text
        x="46" y="202" textAnchor="middle" transform="rotate(-90 46 202)"
        className="mono" fontSize="11" fill="var(--graphite)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 0.4 }}
      >
        7200 mm
      </motion.text>
      <motion.text
        x="332" y="112"
        className="mono" fontSize="10" fill="var(--accent-strong)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.4 }}
      >
        FRONT ELEVATION
      </motion.text>
    </motion.svg>
  );
}

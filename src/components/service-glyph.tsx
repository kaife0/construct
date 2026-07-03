/**
 * Per-service technical line-art illustration (blueprint style).
 * Rendered on a `.group` parent so parts animate subtly on hover via group-hover.
 * Transparent background — the card supplies the bordered blueprint-grid box.
 */

const ink = { fill: "none", stroke: "var(--ink)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
const thin = { fill: "none", stroke: "var(--line-strong)", strokeWidth: 1.25 };
const acc = { fill: "none", stroke: "var(--accent)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 220 150" className="h-full w-full" role="img" aria-hidden>
      {children}
    </svg>
  );
}

const glyphs: Record<string, React.ReactNode> = {
  // Floor plan with a room highlight + door swing
  "house-planning": (
    <Frame>
      <rect x="34" y="30" width="152" height="90" {...ink} />
      <line x1="110" y1="30" x2="110" y2="120" {...thin} />
      <line x1="34" y1="78" x2="110" y2="78" {...thin} />
      <line x1="110" y1="64" x2="186" y2="64" {...thin} />
      {/* highlighted room reveals on hover */}
      <rect x="34" y="30" width="76" height="48" fill="var(--accent-soft)" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      {/* door swing */}
      <path d="M150 120 A28 28 0 0 0 150 92" {...acc} />
      <line x1="150" y1="120" x2="150" y2="92" {...thin} stroke="var(--accent)" />
    </Frame>
  ),

  // Portal frame + footings + load arrow (drops on hover)
  "structural-design": (
    <Frame>
      <line x1="30" y1="118" x2="190" y2="118" {...ink} />
      <path d="M56 118 V54 H164 V118" {...ink} />
      <rect x="46" y="118" width="20" height="10" {...thin} />
      <rect x="154" y="118" width="20" height="10" {...thin} />
      {/* rebar ticks */}
      <line x1="72" y1="54" x2="148" y2="54" {...thin} />
      <line x1="80" y1="46" x2="80" y2="54" {...thin} />
      <line x1="110" y1="46" x2="110" y2="54" {...thin} />
      <line x1="140" y1="46" x2="140" y2="54" {...thin} />
      {/* load arrow */}
      <g className="transition-transform duration-500 group-hover:translate-y-1.5">
        <line x1="110" y1="20" x2="110" y2="40" {...acc} />
        <path d="M104 34 L110 42 L116 34" {...acc} />
      </g>
    </Frame>
  ),

  // Room section: sofa, lamp with light cone, plant
  "interior-design": (
    <Frame>
      <path d="M30 120 H190 M40 120 V44 H180 V120" {...ink} />
      {/* sofa */}
      <path d="M58 120 V96 H104 V120 M52 108 h6 v12 M104 108 h6 v12 M58 96 q23 -12 46 0" {...thin} stroke="var(--ink)" />
      {/* lamp */}
      <line x1="150" y1="44" x2="150" y2="70" {...thin} />
      <path d="M138 70 H162 L156 82 H144 Z" {...ink} />
      <path d="M144 82 L138 104 M156 82 L162 104" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" stroke="var(--accent)" strokeWidth={1.25} />
      {/* plant */}
      <path d="M120 120 v-10 h12 v10 M126 110 v-14 M126 100 q8 -2 8 -10 M126 102 q-8 -2 -8 -10" {...thin} stroke="var(--ink)" />
    </Frame>
  ),

  // 2D square → 3D iso cube with arrow
  "2d-3d-plans": (
    <Frame>
      <rect x="34" y="52" width="52" height="52" {...ink} />
      <line x1="60" y1="52" x2="60" y2="104" {...thin} />
      <line x1="34" y1="78" x2="86" y2="78" {...thin} />
      <path d="M100 78 H126" {...acc} />
      <path d="M120 72 L128 78 L120 84" {...acc} />
      {/* iso cube */}
      <path d="M162 46 L188 60 L188 96 L162 110 L136 96 L136 60 Z" {...ink} />
      <path d="M136 60 L162 74 L188 60 M162 74 V110" {...thin} />
      <path d="M162 46 L188 60 L162 74 L136 60 Z" fill="var(--accent-soft)" className="opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
    </Frame>
  ),

  // BOQ document + brick stack + total tick
  "estimation-costing": (
    <Frame>
      <rect x="34" y="28" width="96" height="94" {...ink} />
      <line x1="48" y1="48" x2="116" y2="48" {...thin} />
      <line x1="48" y1="64" x2="116" y2="64" {...thin} />
      <line x1="48" y1="80" x2="116" y2="80" {...thin} />
      <line x1="48" y1="96" x2="92" y2="96" {...acc} />
      {/* brick stack */}
      <g stroke="var(--ink)" strokeWidth={1.5} fill="none">
        <rect x="150" y="98" width="40" height="14" />
        <rect x="150" y="84" width="40" height="14" />
        <rect x="158" y="70" width="40" height="14" className="transition-transform duration-500 group-hover:-translate-y-1" />
      </g>
    </Frame>
  ),

  // Clipboard checklist (checks appear on hover) + hard hat
  "site-supervision": (
    <Frame>
      <rect x="40" y="30" width="90" height="94" rx="4" {...ink} />
      <rect x="70" y="24" width="30" height="12" rx="3" {...thin} stroke="var(--ink)" />
      {[52, 72, 92].map((y, i) => (
        <g key={y}>
          <rect x={56} y={y} width="12" height="12" {...thin} />
          <path d={`M58 ${y + 6} l3 3 l6 -8`} stroke="var(--accent)" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round"
            className="opacity-0 transition-opacity group-hover:opacity-100" style={{ transitionDelay: `${i * 90}ms`, transitionDuration: "300ms" }} />
          <line x1="78" y1={y + 6} x2="118" y2={y + 6} {...thin} />
        </g>
      ))}
      {/* hard hat */}
      <path d="M150 108 a26 26 0 0 1 52 0 Z" {...ink} />
      <path d="M168 84 v-8 h16 v8" {...thin} />
      <line x1="144" y1="108" x2="208" y2="108" {...ink} />
    </Frame>
  ),
};

export function ServiceGlyph({ slug }: { slug: string }) {
  return glyphs[slug] ?? <Frame><rect x="40" y="34" width="140" height="82" {...ink} /></Frame>;
}

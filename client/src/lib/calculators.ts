/**
 * Pure material-estimation formulas (India / metric, nominal-mix thumb rules).
 * No React here — this is shared by every calculator component and can be
 * unit-tested independently. Numbers are indicative, standard construction
 * thumb rules; not a substitute for a structural engineer's BOQ.
 */

// ---- Concrete (shared by Cement / Sand / Stone calculators) ----------------

export type ConcreteGrade = "M15" | "M20" | "M25";

/** Nominal mix ratios — cement : sand : aggregate, by parts. */
export const CONCRETE_MIX: Record<ConcreteGrade, { cement: number; sand: number; aggregate: number }> = {
  M15: { cement: 1, sand: 2, aggregate: 4 },
  M20: { cement: 1, sand: 1.5, aggregate: 3 },
  M25: { cement: 1, sand: 1, aggregate: 2 },
};

const DRY_VOLUME_FACTOR = 1.54; // wet concrete -> dry material volume
const CEMENT_DENSITY_KG_PER_M3 = 1440;
const CEMENT_BAG_KG = 50;
export const CUFT_PER_M3 = 35.3147;

export type ConcreteMixResult = {
  cementBags: number;
  cementKg: number;
  sandM3: number;
  sandCuft: number;
  aggregateM3: number;
  aggregateCuft: number;
};

/** Cement, sand & aggregate quantities for a given wet concrete volume. */
export function calculateConcreteMix(
  volumeM3: number,
  grade: ConcreteGrade,
  wastagePct = 5
): ConcreteMixResult {
  const mix = CONCRETE_MIX[grade];
  const totalParts = mix.cement + mix.sand + mix.aggregate;
  const dryVolume = Math.max(volumeM3, 0) * DRY_VOLUME_FACTOR * (1 + wastagePct / 100);

  const cementVolumeM3 = dryVolume * (mix.cement / totalParts);
  const sandVolumeM3 = dryVolume * (mix.sand / totalParts);
  const aggregateVolumeM3 = dryVolume * (mix.aggregate / totalParts);

  const cementKg = cementVolumeM3 * CEMENT_DENSITY_KG_PER_M3;

  return {
    cementBags: cementKg / CEMENT_BAG_KG,
    cementKg,
    sandM3: sandVolumeM3,
    sandCuft: sandVolumeM3 * CUFT_PER_M3,
    aggregateM3: aggregateVolumeM3,
    aggregateCuft: aggregateVolumeM3 * CUFT_PER_M3,
  };
}

// ---- Bricks -----------------------------------------------------------------

/** Standard modular brick 190×90×90mm + 10mm mortar joint = 200×100×100mm effective. */
const BRICK_WITH_MORTAR_M3 = 0.2 * 0.1 * 0.1;

export const WALL_THICKNESS_OPTIONS = [
  { label: "4.5\" (115mm)", mm: 115 },
  { label: "9\" (230mm)", mm: 230 },
  { label: "13.5\" (345mm)", mm: 345 },
] as const;

export type BrickResult = { bricks: number; netVolumeM3: number };

export function calculateBricks(
  lengthM: number,
  heightM: number,
  thicknessMm: number,
  openingsM2 = 0,
  wastagePct = 5
): BrickResult {
  const thicknessM = thicknessMm / 1000;
  const grossVolume = Math.max(lengthM, 0) * Math.max(heightM, 0) * thicknessM;
  const openingsVolume = Math.max(openingsM2, 0) * thicknessM;
  const netVolumeM3 = Math.max(grossVolume - openingsVolume, 0);
  const bricks = (netVolumeM3 / BRICK_WITH_MORTAR_M3) * (1 + wastagePct / 100);
  return { bricks, netVolumeM3 };
}

// ---- Steel --------------------------------------------------------------

export type StructureType = "slab" | "framed-lowrise" | "framed-multistorey";

/** Thumb-rule steel consumption per sq.ft of built-up area, by structure type. */
export const STEEL_RATE_KG_PER_SQFT: Record<StructureType, number> = {
  slab: 3.5,
  "framed-lowrise": 4,
  "framed-multistorey": 4.75,
};

export const STRUCTURE_TYPE_OPTIONS: { value: StructureType; label: string }[] = [
  { value: "slab", label: "Slab only" },
  { value: "framed-lowrise", label: "Framed · G+1/G+2" },
  { value: "framed-multistorey", label: "Framed · Multi-storey" },
];

export type SteelResult = { kg: number; tonnes: number };

export function calculateSteel(areaSqft: number, type: StructureType): SteelResult {
  const kg = Math.max(areaSqft, 0) * STEEL_RATE_KG_PER_SQFT[type];
  return { kg, tonnes: kg / 1000 };
}

/**
 * Placeholder ₹ material rates used for indicative costing in the calculators.
 * These become admin-editable (per-region, updated as prices change) once the
 * admin panel and database are wired up.
 */
export const materialRates = {
  brickPerUnit: 8,
  cementPerBag: 380,
  steelPerKg: 68,
  sandPerCuft: 55,
  aggregatePerCuft: 60,
} as const;

export type MaterialRates = typeof materialRates;

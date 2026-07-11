import { Schema, model, type InferSchemaType } from "mongoose";

/** Singleton document — admin-editable ₹ rates used across all calculators. */
const CalculatorRatesSchema = new Schema(
  {
    brickPerUnit: { type: Number, required: true, default: 8 },
    cementPerBag: { type: Number, required: true, default: 380 },
    steelPerKg: { type: Number, required: true, default: 68 },
    sandPerCuft: { type: Number, required: true, default: 55 },
    aggregatePerCuft: { type: Number, required: true, default: 60 },
  },
  { timestamps: true }
);

export type CalculatorRatesDoc = InferSchemaType<typeof CalculatorRatesSchema>;
export const CalculatorRates = model("CalculatorRates", CalculatorRatesSchema);

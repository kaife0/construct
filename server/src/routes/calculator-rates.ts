import { z } from "zod";
import { CalculatorRates } from "../models/index.js";
import { createSingletonRouter } from "../lib/singletonRouter.js";

const schema = z.object({
  brickPerUnit: z.number().positive(),
  cementPerBag: z.number().positive(),
  steelPerKg: z.number().positive(),
  sandPerCuft: z.number().positive(),
  aggregatePerCuft: z.number().positive(),
});

export default createSingletonRouter({ model: CalculatorRates, schema, partialUpdate: true });

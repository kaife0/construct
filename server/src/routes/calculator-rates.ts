import { Router } from "express";
import { z } from "zod";
import { CalculatorRates } from "../models/index.js";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = Router();

const schema = z.object({
  brickPerUnit: z.number().positive(),
  cementPerBag: z.number().positive(),
  steelPerKg: z.number().positive(),
  sandPerCuft: z.number().positive(),
  aggregatePerCuft: z.number().positive(),
});

// ---- Public read -------------------------------------------------------

router.get("/", async (_req, res) => {
  let rates = await CalculatorRates.findOne();
  if (!rates) rates = await CalculatorRates.create({});
  res.json(rates);
});

// ---- Admin update --------------------------------------------------------

router.put("/", requireAdmin, async (req, res) => {
  const parsed = schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid data." });
    return;
  }
  const updated = await CalculatorRates.findOneAndUpdate({}, parsed.data, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  res.json(updated);
});

export default router;

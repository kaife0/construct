import { Router } from "express";
import { Service } from "../models/index.js";

const router = Router();

/** GET /api/services — public list, sorted for display order. Full CRUD (create/update/delete, admin-only) is added with the admin panel. */
router.get("/", async (_req, res) => {
  const services = await Service.find().sort({ order: 1 });
  res.json(services);
});

export default router;

import { z } from "zod";
import { DigitalProductCategory } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().min(1, "Description is required."),
  image: z.string().trim().min(1, "Image is required."),
  showPlansCatalog: z.boolean().optional(),
  order: z.number().int().optional(),
});

export default createCrudRouter({ model: DigitalProductCategory, schema, noun: "Category" });

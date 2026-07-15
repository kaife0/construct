import { z } from "zod";
import { Plan } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  config: z.string().trim().min(1, "Configuration is required."),
  area: z.number().positive("Area must be a positive number."),
  beds: z.number().int().nonnegative(),
  baths: z.number().int().nonnegative(),
  floors: z.number().int().positive(),
  facing: z.string().trim().min(1, "Facing is required."),
  tag: z.string().trim().optional().or(z.literal("")),
  image: z.string().trim().min(1, "Image is required."),
  images: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().min(1, "Description is required."),
  order: z.number().int().optional(),
});

export default createCrudRouter({ model: Plan, schema, noun: "Plan", hasGallery: true });

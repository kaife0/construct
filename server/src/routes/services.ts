import { z } from "zod";
import { Service } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  summary: z.string().trim().min(1, "Summary is required."),
  description: z.string().trim().min(1, "Description is required."),
  deliverables: z.array(z.string().trim().min(1)).default([]),
  image: z.string().trim().min(1, "Image is required."),
  order: z.number().int().optional(),
});

export default createCrudRouter({ model: Service, schema, noun: "Service" });

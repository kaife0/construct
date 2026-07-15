import { z } from "zod";
import { Project } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  location: z.string().trim().min(1, "Location is required."),
  status: z.enum(["completed", "in-progress"]),
  year: z.string().trim().min(1, "Year is required."),
  image: z.string().trim().min(1, "Image is required."),
  images: z.array(z.string().trim().min(1)).default([]),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  area: z.number().positive().optional(),
  floors: z.number().int().positive().optional(),
  type: z.string().trim().max(80).optional().or(z.literal("")),
  budget: z.number().positive().optional(),
  order: z.number().int().optional(),
});

export default createCrudRouter({ model: Project, schema, noun: "Project", hasGallery: true });

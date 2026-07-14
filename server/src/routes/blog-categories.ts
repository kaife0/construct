import { z } from "zod";
import { BlogCategory } from "../models/index.js";
import { createCrudRouter } from "../lib/crudRouter.js";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required."),
  order: z.number().int().optional(),
});

export default createCrudRouter({ model: BlogCategory, schema, noun: "Category", hasImage: false });

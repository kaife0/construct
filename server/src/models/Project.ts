import { Schema, model, type InferSchemaType } from "mongoose";

const ProjectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, enum: ["completed", "in-progress"], required: true },
    year: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type ProjectDoc = InferSchemaType<typeof ProjectSchema>;
export const Project = model("Project", ProjectSchema);

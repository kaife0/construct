import { Schema, model, type InferSchemaType } from "mongoose";

const PlanSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    config: { type: String, required: true }, // e.g. "3 BHK · G+1"
    area: { type: Number, required: true }, // sq.ft built-up
    beds: { type: Number, required: true },
    baths: { type: Number, required: true },
    floors: { type: Number, required: true },
    facing: { type: String, required: true },
    tag: { type: String },
    image: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type PlanDoc = InferSchemaType<typeof PlanSchema>;
export const Plan = model("Plan", PlanSchema);

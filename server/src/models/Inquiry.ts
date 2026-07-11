import { Schema, model, type InferSchemaType } from "mongoose";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    service: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
  },
  { timestamps: true }
);

export type InquiryDoc = InferSchemaType<typeof InquirySchema>;
export const Inquiry = model("Inquiry", InquirySchema);

import { Schema, model, type InferSchemaType } from "mongoose";

const AdminUserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["admin"], default: "admin" },
  },
  { timestamps: true }
);

export type AdminUserDoc = InferSchemaType<typeof AdminUserSchema>;
export const AdminUser = model("AdminUser", AdminUserSchema);

import { Schema, model, type InferSchemaType } from "mongoose";

/** Singleton document — admin-editable profile, contact and social details. */
const SiteSettingsSchema = new Schema(
  {
    profile: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      intro: { type: String, required: true },
      bio: { type: [String], default: [] },
      credentials: { type: [String], default: [] },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true },
      whatsappNumber: { type: String, required: true }, // intl format, digits only
      location: { type: String, required: true },
    },
    socials: {
      instagram: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      youtube: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema>;
export const SiteSettings = model("SiteSettings", SiteSettingsSchema);

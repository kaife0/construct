import { Schema, model, type InferSchemaType } from "mongoose";

/**
 * Singleton document — admin-editable profile, achievements, contact and
 * social details shown across the public site (About page, footer, WhatsApp
 * buttons, contact section). Every field has a `default` matching the
 * original static placeholder content so the first `GET` can lazily create
 * this doc (see routes/site-settings.ts) without a separate seed script.
 */
const SiteSettingsSchema = new Schema(
  {
    profile: {
      name: { type: String, required: true, default: "Er. A. Sharma" },
      role: { type: String, required: true, default: "Civil Engineer & Structural Consultant" },
      intro: {
        type: String,
        required: true,
        default:
          "Fourteen years of turning plots into homes and ideas into buildable, code-compliant structures across residential and commercial projects.",
      },
      bio: {
        type: [String],
        default: [
          "I'm a practising civil engineer specialising in structural design and end-to-end home planning. My work spans everything from a first floor-plan sketch to the bar-bending schedule your contractor builds from.",
          "I believe good engineering is invisible — it just works, lasts, and stays within budget. Every project gets the same discipline: careful analysis, honest costing, and drawings clear enough to build without guesswork.",
        ],
      },
      credentials: {
        type: [String],
        default: ["B.E. Civil Engineering", "Chartered Engineer (India)", "Licensed Structural Engineer", "STAAD.Pro / AutoCAD / Revit"],
      },
      stats: {
        projects: { type: Number, default: 500 },
        experienceYears: { type: Number, default: 14 },
        cities: { type: Number, default: 60 },
      },
    },
    achievements: {
      type: [
        {
          year: { type: String, required: true },
          title: { type: String, required: true },
          desc: { type: String, required: true },
        },
      ],
      default: [
        { year: "2024", title: "500th project delivered", desc: "Crossed 500 completed residential & commercial projects." },
        { year: "2021", title: "Commercial complex, RCC design", desc: "Lead structural consultant for a 6-storey mixed-use build." },
        { year: "2018", title: "Featured — regional builders' expo", desc: "Invited speaker on cost-efficient RCC design." },
        { year: "2010", title: "Practice established", desc: "Started independent consulting practice." },
      ],
    },
    contact: {
      phone: { type: String, required: true, default: "+91 87977 86067" },
      email: { type: String, required: true, default: "adildream10@gmail.com" },
      whatsappNumber: { type: String, required: true, default: "918797786067" }, // intl format, digits only
      location: { type: String, required: true, default: "Rajmahal, Sahibganj, Jharkhand, India" },
    },
    socials: {
      instagram: { type: String, default: "#" },
      linkedin: { type: String, default: "#" },
      youtube: { type: String, default: "#" },
    },
  },
  { timestamps: true }
);

export type SiteSettingsDoc = InferSchemaType<typeof SiteSettingsSchema>;
export const SiteSettings = model("SiteSettings", SiteSettingsSchema);

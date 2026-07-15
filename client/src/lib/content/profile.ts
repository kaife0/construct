/**
 * Fixed methodology copy for the About page's "Process" section. Profile,
 * achievements and contact/social details live in `SiteSettings` instead
 * (see `@/lib/site`), since those are personal/business content, not
 * boilerplate. This one stays static.
 */
export const process = [
  { step: "01", title: "Consult", desc: "We discuss your plot, needs and budget over a call or WhatsApp." },
  { step: "02", title: "Design", desc: "Layouts, structure and 3D views — refined until you're happy." },
  { step: "03", title: "Detail", desc: "Working drawings, structural details and estimates for construction." },
  { step: "04", title: "Support", desc: "On-call guidance and optional site supervision through the build." },
];

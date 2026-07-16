/**
 * Renders a JSON-LD structured-data block. Data comes from our own SEO builders,
 * but some fields (business name, address, bio) originate in admin-editable
 * SiteSettings, so `<` is escaped to prevent a stray "</script>" from breaking out.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

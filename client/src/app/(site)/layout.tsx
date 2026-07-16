import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { JsonLd } from "@/components/json-ld";
import { getSiteSettings } from "@/lib/api";
import { localBusinessJsonLd } from "@/lib/seo";

/** Public site chrome — navbar, footer, floating WhatsApp button. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  return (
    <>
      <JsonLd data={localBusinessJsonLd(settings)} />
      <Navbar whatsappNumber={settings.contact.whatsappNumber} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton whatsappNumber={settings.contact.whatsappNumber} />
    </>
  );
}

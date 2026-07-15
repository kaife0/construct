import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getSiteSettings } from "@/lib/api";

/** Public site chrome — navbar, footer, floating WhatsApp button. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { contact } = await getSiteSettings();
  return (
    <>
      <Navbar whatsappNumber={contact.whatsappNumber} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton whatsappNumber={contact.whatsappNumber} />
    </>
  );
}

import type { Metadata } from "next";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";

export const metadata: Metadata = { title: "Site Settings" };

export default function SiteSettingsPage() {
  return <SiteSettingsForm />;
}

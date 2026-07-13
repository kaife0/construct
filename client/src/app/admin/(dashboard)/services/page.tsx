import type { Metadata } from "next";
import { ServicesList } from "@/components/admin/services-list";

export const metadata: Metadata = { title: "Services" };

export default function AdminServicesPage() {
  return <ServicesList />;
}

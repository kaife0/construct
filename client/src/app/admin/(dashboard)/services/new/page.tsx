import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/service-form";

export const metadata: Metadata = { title: "New Service" };

export default function NewServicePage() {
  return <ServiceForm />;
}

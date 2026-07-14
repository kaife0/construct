import type { Metadata } from "next";
import { DigitalProductForm } from "@/components/admin/digital-product-form";

export const metadata: Metadata = { title: "New Digital Product Category" };

export default function NewDigitalProductPage() {
  return <DigitalProductForm />;
}

import type { Metadata } from "next";
import { DigitalProductsList } from "@/components/admin/digital-products-list";

export const metadata: Metadata = { title: "Digital Products" };

export default function AdminDigitalProductsPage() {
  return <DigitalProductsList />;
}

import type { Metadata } from "next";
import { DigitalProductItemForm } from "@/components/admin/digital-product-item-form";

export const metadata: Metadata = { title: "New Product" };

export default async function NewDigitalProductItemPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  return <DigitalProductItemForm categoryId={categoryId} />;
}

import type { Metadata } from "next";
import { DigitalProductItemsList } from "@/components/admin/digital-product-items-list";

export const metadata: Metadata = { title: "Products" };

export default async function DigitalProductItemsPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  return <DigitalProductItemsList categoryId={categoryId} />;
}

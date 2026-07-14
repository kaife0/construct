import type { Metadata } from "next";
import { EditDigitalProductItem } from "@/components/admin/edit-digital-product-item";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditDigitalProductItemPage({
  params,
}: {
  params: Promise<{ id: string; productId: string }>;
}) {
  const { id, productId } = await params;
  return <EditDigitalProductItem categoryId={id} id={productId} />;
}

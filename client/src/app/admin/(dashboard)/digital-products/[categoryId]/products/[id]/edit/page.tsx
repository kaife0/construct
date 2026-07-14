import type { Metadata } from "next";
import { EditDigitalProductItem } from "@/components/admin/edit-digital-product-item";

export const metadata: Metadata = { title: "Edit Product" };

export default async function EditDigitalProductItemPage({
  params,
}: {
  params: Promise<{ categoryId: string; id: string }>;
}) {
  const { categoryId, id } = await params;
  return <EditDigitalProductItem categoryId={categoryId} id={id} />;
}

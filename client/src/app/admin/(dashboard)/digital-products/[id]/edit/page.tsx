import type { Metadata } from "next";
import { EditDigitalProduct } from "@/components/admin/edit-digital-product";

export const metadata: Metadata = { title: "Edit Digital Product Category" };

export default async function EditDigitalProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditDigitalProduct id={id} />;
}

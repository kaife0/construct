import type { Metadata } from "next";
import { EditService } from "@/components/admin/edit-service";

export const metadata: Metadata = { title: "Edit Service" };

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditService id={id} />;
}

import type { Metadata } from "next";
import { EditProject } from "@/components/admin/edit-project";

export const metadata: Metadata = { title: "Edit Project" };

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditProject id={id} />;
}

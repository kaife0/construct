import type { Metadata } from "next";
import { EditPlan } from "@/components/admin/edit-plan";

export const metadata: Metadata = { title: "Edit Plan" };

export default async function EditPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditPlan id={id} />;
}

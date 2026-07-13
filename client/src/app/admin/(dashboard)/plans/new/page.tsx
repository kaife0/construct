import type { Metadata } from "next";
import { PlanForm } from "@/components/admin/plan-form";

export const metadata: Metadata = { title: "New Plan" };

export default function NewPlanPage() {
  return <PlanForm />;
}

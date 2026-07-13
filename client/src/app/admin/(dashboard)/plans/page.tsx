import type { Metadata } from "next";
import { PlansList } from "@/components/admin/plans-list";

export const metadata: Metadata = { title: "Ready-made Plans" };

export default function AdminPlansPage() {
  return <PlansList />;
}

import type { Metadata } from "next";
import { ProjectsList } from "@/components/admin/projects-list";

export const metadata: Metadata = { title: "Our Work" };

export default function AdminProjectsPage() {
  return <ProjectsList />;
}

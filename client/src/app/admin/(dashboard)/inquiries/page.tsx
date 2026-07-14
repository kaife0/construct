import type { Metadata } from "next";
import { InquiriesList } from "@/components/admin/inquiries-list";

export const metadata: Metadata = { title: "Inquiries" };

export default function AdminInquiriesPage() {
  return <InquiriesList />;
}

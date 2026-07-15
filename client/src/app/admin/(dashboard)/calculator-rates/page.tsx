import type { Metadata } from "next";
import { CalculatorRatesForm } from "@/components/admin/calculator-rates-form";

export const metadata: Metadata = { title: "Calculator Rates" };

export default function CalculatorRatesPage() {
  return <CalculatorRatesForm />;
}

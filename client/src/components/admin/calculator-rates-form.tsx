"use client";

import { useState } from "react";
import { getCalculatorRates, updateCalculatorRates, type CalculatorRatesRecord } from "@/lib/admin-api";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { NumberField } from "@/components/fields";
import { useResource } from "@/components/admin/use-resource";
import { ResourceLoader } from "@/components/admin/resource-loader";

const RATE_FIELDS = [
  { key: "brickPerUnit", label: "Brick rate", suffix: "₹/brick" },
  { key: "cementPerBag", label: "Cement rate", suffix: "₹/bag" },
  { key: "steelPerKg", label: "Steel rate", suffix: "₹/kg" },
  { key: "sandPerCuft", label: "Sand rate", suffix: "₹/cu.ft" },
  { key: "aggregatePerCuft", label: "Stone (aggregate) rate", suffix: "₹/cu.ft" },
] as const;

export function CalculatorRatesForm() {
  // Singleton resource — no id to key the fetch on, so the fetcher just ignores it.
  const { data, error } = useResource<CalculatorRatesRecord>("singleton", getCalculatorRates, "Could not load calculator rates.");
  return (
    <ResourceLoader data={data} error={error}>
      {(initial) => <RatesForm initial={initial} />}
    </ResourceLoader>
  );
}

function RatesForm({ initial }: { initial: CalculatorRatesRecord }) {
  const [rates, setRates] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      setRates(await updateCalculatorRates(rates));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save calculator rates.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminFormShell
      backHref="/admin"
      backLabel="Dashboard"
      heading="Calculator Rates"
      onSubmit={handleSubmit}
      error={error}
      saving={saving}
      submitLabel="Save rates"
      cancelHref="/admin"
    >
      {RATE_FIELDS.map((f) => (
        <NumberField
          key={f.key}
          label={f.label}
          suffix={f.suffix}
          value={rates[f.key]}
          onChange={(v) => setRates({ ...rates, [f.key]: v })}
          required
        />
      ))}
    </AdminFormShell>
  );
}

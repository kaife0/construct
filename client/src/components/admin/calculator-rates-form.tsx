"use client";

import { useEffect, useState } from "react";
import { getCalculatorRates, updateCalculatorRates, type CalculatorRatesRecord } from "@/lib/admin-api";
import { AdminFormShell } from "@/components/admin/admin-form-shell";
import { NumberField } from "@/components/fields";

const RATE_FIELDS = [
  { key: "brickPerUnit", label: "Brick rate", suffix: "₹/brick" },
  { key: "cementPerBag", label: "Cement rate", suffix: "₹/bag" },
  { key: "steelPerKg", label: "Steel rate", suffix: "₹/kg" },
  { key: "sandPerCuft", label: "Sand rate", suffix: "₹/cu.ft" },
  { key: "aggregatePerCuft", label: "Stone (aggregate) rate", suffix: "₹/cu.ft" },
] as const;

export function CalculatorRatesForm() {
  const [rates, setRates] = useState<CalculatorRatesRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCalculatorRates()
      .then(setRates)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load calculator rates."));
  }, []);

  if (!rates) {
    return error ? <p className="text-sm text-accent-strong">{error}</p> : <p className="text-sm text-graphite">Loading…</p>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!rates) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await updateCalculatorRates(rates);
      setRates(updated);
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

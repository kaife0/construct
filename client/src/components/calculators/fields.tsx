"use client";

const inputCls =
  "w-full border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

export function NumberField({
  label,
  suffix,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          min={min}
          step={step}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={`${inputCls} ${suffix ? "pr-12" : ""}`}
        />
        {suffix && (
          <span className="label pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

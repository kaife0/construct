"use client";

/** Shared form input primitives — used by both the calculators and the admin panel. */

const inputCls =
  "w-full resize-y border border-line bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-ink";

/** Omitted when the caller renders its own heading row (e.g. label + character counter). */
function FieldLabel({ label, required }: { label?: string; required?: boolean }) {
  if (!label) return null;
  return <label className="label mb-2 block text-[11px]">{label}{required && " *"}</label>;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputCls}
      />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  required,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={inputCls}
      />
      {hint && <p className="mt-1.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function NumberField({
  label,
  suffix,
  value,
  onChange,
  min = 0,
  step = 1,
  required,
}: {
  label: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
  required?: boolean;
}) {
  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}{required && " *"}</label>
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

export function CheckboxField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 border-line accent-ink"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        {hint && <span className="block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function SelectField<T extends string>({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="label mb-2 block text-[11px]">{label}{required && " *"}</label>
      <select value={value} onChange={(e) => onChange(e.target.value as T)} className={inputCls}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

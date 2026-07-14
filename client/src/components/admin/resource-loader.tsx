import { Loader2 } from "lucide-react";

/** Shared loading/error chrome for the EditX wrappers — renders children once data is ready. */
export function ResourceLoader<T>({
  data,
  error,
  children,
}: {
  data: T | null;
  error: string | null;
  children: (data: T) => React.ReactNode;
}) {
  if (error) return <p className="text-sm text-accent-strong">{error}</p>;
  if (!data)
    return (
      <div className="flex items-center gap-2 text-sm text-graphite">
        <Loader2 size={16} className="animate-spin" /> Loading…
      </div>
    );
  return <>{children(data)}</>;
}

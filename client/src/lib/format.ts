export function formatNumber(n: number, maxFractionDigits = 0) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: maxFractionDigits });
}

export function formatRupees(n: number) {
  return `₹${formatNumber(n)}`;
}

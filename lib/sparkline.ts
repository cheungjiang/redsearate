// Fixed 120 × 40 chart geometry with four units of padding.
export function sparklinePoints(values: readonly number[]): string {
  if (values.length < 2 || values.some((value) => !Number.isFinite(value))) return "";
  const low = Math.min(...values);
  const high = Math.max(...values);
  const round = (value: number) => Math.round(value * 100) / 100;
  return values.map((value, i) => {
    const x = 4 + (i * 112) / (values.length - 1);
    const y = high === low ? 20 : 36 - ((value - low) / (high - low)) * 32;
    return `${round(x)},${round(y)}`;
  }).join(" ");
}

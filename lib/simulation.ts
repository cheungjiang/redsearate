export function showSimulatedData(
  value: string | undefined,
  nodeEnv: string | undefined,
): boolean {
  if (value === undefined) return nodeEnv !== "production";
  return value === "true";
}

import { indexCandidates } from "./platform.ts";

// Illustrative values only, never input to pricing, aggregation or inquiries.
const metrics: Record<string, { median: number; weekChange: number; sampleSize: number }> = {
  Jeddah: { median: 3260, weekChange: 2.8, sampleSize: 24 },
  Sokhna: { median: 2940, weekChange: -1.6, sampleSize: 18 },
  Aqaba: { median: 3480, weekChange: 0, sampleSize: 12 },
  "Port Sudan": { median: 4175, weekChange: 4.3, sampleSize: 9 },
};

export const demoIndex = {
  kind: "demo" as const,
  origin: "Shanghai",
  currency: "USD",
  equipment: "40HQ",
  entries: indexCandidates.map(({ port }) => {
    const value = port ? metrics[port.id] : undefined;
    return {
      port,
      median: value?.median ?? null,
      weekChange: value?.weekChange ?? null,
      sampleSize: value?.sampleSize ?? null,
    };
  }),
};

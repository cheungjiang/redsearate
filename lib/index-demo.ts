import { indexCandidates } from "./platform.ts";

// Illustrative values only, never input to pricing, aggregation or inquiries.
const metrics: Record<string, { weeklyMedians: number[]; sampleSize: number }> = {
  Jeddah: { weeklyMedians: [3040, 3120, 3075, 3190, 3155, 3220, 3171, 3260], sampleSize: 24 },
  Sokhna: { weeklyMedians: [3150, 3080, 3125, 3005, 3050, 2965, 2988, 2940], sampleSize: 18 },
  Aqaba: { weeklyMedians: [3370, 3440, 3395, 3520, 3450, 3505, 3480, 3480], sampleSize: 12 },
  Djibouti: { weeklyMedians: [2750, 2815, 2790, 2860, 2835, 2910, 2880, 2965], sampleSize: 16 },
  "Port Sudan": { weeklyMedians: [3760, 3890, 3825, 3970, 3915, 4060, 4003, 4175], sampleSize: 9 },
};

export const demoIndex = {
  kind: "demo" as const,
  origin: "Shanghai",
  currency: "USD",
  equipment: "40HQ",
  entries: indexCandidates.map(({ port }) => {
    const value = port ? metrics[port.id] : undefined;
    const median = value?.weeklyMedians.at(-1) ?? null;
    const previous = value?.weeklyMedians.at(-2);
    return {
      port,
      median,
      weekChange: median !== null && previous
        ? Number(((median / previous - 1) * 100).toFixed(1))
        : null,
      sampleSize: value?.sampleSize ?? null,
      weeklyMedians: value?.weeklyMedians ?? [],
    };
  }),
};

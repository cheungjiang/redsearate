import type { SampleRate } from "./platform.ts";

// Fixed UI fixtures, not carrier quotes, verification results or database rows.
export const sampleRates: SampleRate[] = [
  {
    kind: "test", id: "TEST-001", origin: "Shanghai", destination: "Jeddah",
    container: "40HQ", currency: "USD", price: 3260, carrier: "TEST Carrier 01",
    grade: "A", validFrom: "2026-10-26", validUntil: "2026-11-02",
    updatedAt: "2026-10-30T08:30:00Z",
  },
  {
    kind: "test", id: "TEST-002", origin: "Ningbo", destination: "Sokhna",
    container: "40HQ", currency: "USD", price: 2940, carrier: "TEST Carrier 02",
    grade: "B", validFrom: "2026-10-27", validUntil: "2026-11-03",
    updatedAt: "2026-10-30T09:15:00Z",
  },
  {
    kind: "test", id: "TEST-003", origin: "Shenzhen", destination: "Aqaba",
    container: "20GP", currency: "USD", price: 2185, carrier: "TEST Carrier 03",
    grade: "C", validFrom: "2026-10-28", validUntil: "2026-11-04",
    updatedAt: "2026-10-30T10:05:00Z",
  },
  {
    kind: "test", id: "TEST-004", origin: "Qingdao", destination: "Djibouti",
    container: "40HQ", currency: "USD", price: 2965, carrier: "TEST Carrier 04",
    grade: "A", validFrom: "2026-10-29", validUntil: "2026-11-05",
    updatedAt: "2026-10-30T11:20:00Z",
  },
];

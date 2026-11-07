import "server-only";
import { demoIndex } from "./index-demo";
import { sampleRates } from "./rate-demo";
import { showSimulatedData } from "./simulation";
import type { SimulationPreview } from "./platform";

// The browser receives no fixtures when disabled. This is decided when pages
// are built, not by a NEXT_PUBLIC flag or a client-side display preference.
export function simulationPreview(): SimulationPreview | null {
  if (!showSimulatedData(process.env.SHOW_SIMULATED_DATA, process.env.NODE_ENV)) {
    return null;
  }
  return { index: demoIndex.entries, rates: sampleRates };
}

import { getLanePlan } from "../../lib/lanes.server";
import { laneRegistry } from "../../lib/lanes";

export const dynamic = "force-static";

export async function GET() {
  const plan = await getLanePlan();
  return Response.json(laneRegistry(plan.active, plan.retired));
}

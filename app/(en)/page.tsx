import Home from "../site";
import { homeData } from "../../lib/site-data";

export default async function Page() {
  return <Home lang="en" {...await homeData()} />;
}

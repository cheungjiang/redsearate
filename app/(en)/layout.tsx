import type { Metadata } from "next";
import "../globals.css";
import "../editorial.css";
import "../platform.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://redsearate.com"),
  title: "RedSeaRate | China to Red Sea Ocean Freight Estimates",
  description:
    "Plan your shipment from China to the Red Sea. Explore indicative ocean freight ranges, transit times and shipping insights. Request a tailored quote.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/zh", "x-default": "/" },
  },
  openGraph: {
    title: "RedSeaRate — A clearer course for your cargo.",
    description:
      "China to the Red Sea. Freight estimates, route insights and booking requests.",
    images: ["/ship.webp"],
    type: "website",
  },
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

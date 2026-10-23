import type { Metadata } from "next";
import "../globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://redsearate.com"),
  title: "Red Sea Rate | China to Red Sea Ocean Freight Estimates",
  description:
    "Plan your shipment from China to the Red Sea. Explore indicative ocean freight ranges, transit times and shipping insights. Request a tailored quote.",
  alternates: {
    canonical: "/",
    languages: { en: "/", "zh-CN": "/zh", "x-default": "/" },
  },
  openGraph: {
    title: "Red Sea Rate — A clearer course for your cargo.",
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

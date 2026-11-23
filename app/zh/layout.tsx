import type { Metadata } from "next";
import { preload } from "react-dom";
import "../globals.css";
import "../editorial.css";
import "../platform.css";
import "../home.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://redsearate.com"),
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  preload("/fonts/playfair-display.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/dm-sans.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  preload("/fonts/manrope.woff2", { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

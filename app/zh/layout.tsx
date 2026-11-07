import type { Metadata } from "next";
import "../globals.css";
import "../editorial.css";
import "../platform.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://redsearate.com"),
  robots: { index: true, follow: true },
  icons: { icon: "/icon.svg", apple: "/icon-512.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

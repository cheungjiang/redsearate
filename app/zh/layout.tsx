import type { Metadata } from "next";
import "../globals.css";
import "../editorial.css";
import "../platform.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://redsearate.com"),
  openGraph: {
    title: "RedSeaRate 红海运价 — 从中国到红海，让出运更有把握。",
    description: "海运参考运价、航程信息与专属询价。",
    images: ["/ship.webp"],
    locale: "zh_CN",
    type: "website",
  },
  icons: { icon: "/icon.svg" },
  robots: { index: true, follow: true },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

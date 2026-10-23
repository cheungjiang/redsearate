import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "价格池 | Red Sea Rate",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

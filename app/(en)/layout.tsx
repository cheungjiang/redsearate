import type { Metadata } from "next";
import "../globals.css";
import "../editorial.css";
import "../platform.css";
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
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

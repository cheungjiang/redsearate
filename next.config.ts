import type { NextConfig } from "next";

// GitHub Pages serves plain files, so every route is prerendered at build time.
// Trailing slashes make each page a directory index (/zh/ -> zh/index.html).
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
};

export default config;

import type { NextConfig } from "next";

// GitHub Pages отдаёт статику по пути /<repo>/, поэтому basePath нужен
// только в CI. Локально (npm run dev) сайт остаётся на корне.
const base = process.env.GITHUB_ACTIONS === "true" ? "/meaTtI" : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: base,
  // next/link дописывает basePath сам, а сырые пути (адресная строка и iframe
  // окна на «рабочем столе») о нём не знают — отдаём значение в клиент.
  env: { NEXT_PUBLIC_BASE_PATH: base },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;

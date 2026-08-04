import type { NextConfig } from "next";

// GitHub Pages отдаёт статику по пути /<repo>/, поэтому basePath нужен
// только в CI. Локально (npm run dev) сайт остаётся на корне.
const isPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  ...(isPages && { basePath: "/meaTtI" }),
};

export default nextConfig;

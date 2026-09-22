import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

export const dynamic = "force-static";

// Новая страница сайта — добавить сюда же. /spasibo в поиске не нужна.
const PAGES: [path: string, priority: number][] = [
  ["", 1],
  ["/uslugi", 0.9],
  ["/keysy", 0.8],
  ["/team", 0.6],
  ["/contacts", 0.7],
  ["/policy", 0.2],
];

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`,
    priority,
  }));
}

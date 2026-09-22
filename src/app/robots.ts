import type { MetadataRoute } from "next";
import { SITE_URL } from "@/utils/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Служебное: PHP-бот формы и страница после отправки заявки
      disallow: ["/bot/", "/spasibo"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

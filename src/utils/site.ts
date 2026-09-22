// Боевой адрес сайта — для robots.txt, sitemap.xml и абсолютных ссылок в
// метаданных. Другой домен задаётся переменной SITE_URL при сборке.
export const SITE_URL = (process.env.SITE_URL || "https://maetti.ru").replace(/\/+$/, "");

// Копия на GitHub Pages — только предпросмотр: в поиске ей делать нечего,
// иначе она соперничала бы с основным доменом за те же тексты.
export const IS_PREVIEW_BUILD = process.env.GITHUB_ACTIONS === "true";

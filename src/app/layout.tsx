import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiverScroll from "@/components/DiverScroll";
import HoverLine from "@/components/HoverLine";
import ViewportGate from "@/components/ViewportGate";
import { IS_PREVIEW_BUILD, SITE_URL } from "@/utils/site";

import { TransitionProvider } from "@/context/TransitionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

// Страницы — клиентские компоненты и metadata сами не экспортируют: свои
// title/description они задают через layout.tsx в папке маршрута.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "maeTtI — IT Студия Разработки",
    template: "%s — maeTtI",
  },
  description: "Разработка высококлассных веб-сайтов, Telegram-ботов, макросов, интеграций, рекламы и SEO.",
  // og:title и og:description для превью ссылок (Telegram, VK) Next берёт из
  // title и description страницы сам — здесь только то, чего там нет.
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "maeTtI",
  },
  ...(IS_PREVIEW_BUILD && { robots: { index: false, follow: false } }),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // data-scroll-behavior: без него Next 16 при смене страницы прокручивает к
    // началу тоже плавно (из-за scroll-behavior: smooth) — прокрутка тянулась
    // из-под шторки и цепляла на главной интро услуг и «магнит» стола.
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* Страницу можно открыть окном внутри «рабочего стола» на главной — тогда
          она живёт в iframe. Класс .embed прячет там обвязку сайта (правила в
          globals.css), и ставим мы его синхронно при разборе HTML, иначе шапка
          успеет мигнуть. Любая ссылка изнутри окна выводит на настоящий сайт
          поверх симуляции — перехватываем на capture, до роутера. */}
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        <Script
          id="embed-detect"
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/embed-detect.js`}
          strategy="beforeInteractive"
        />
        <TransitionProvider>
          <Header />
          <main id="page-content" className="flex-1 flex flex-col pt-16 md:pt-24">
            {children}
          </main>
          <Footer />
          <DiverScroll />
          <HoverLine />
          <ViewportGate />
        </TransitionProvider>
      </body>
    </html>
  );
}

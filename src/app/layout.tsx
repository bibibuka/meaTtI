import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DiverScroll from "@/components/DiverScroll";
import HoverLine from "@/components/HoverLine";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "maeTtI — IT Студия Разработки",
  description: "Разработка высококлассных веб-сайтов, Telegram-ботов, макросов, интеграций, рекламы и SEO.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      {/* Страницу можно открыть окном внутри «рабочего стола» на главной — тогда
          она живёт в iframe. Класс .embed прячет там обвязку сайта (правила в
          globals.css), и ставим мы его синхронно при разборе HTML, иначе шапка
          успеет мигнуть. Любая ссылка изнутри окна выводит на настоящий сайт
          поверх симуляции — перехватываем на capture, до роутера. */}
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(self!==top){document.documentElement.classList.add("embed");addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a||a.target||a.getAttribute("href").charAt(0)==="#")return;e.preventDefault();top.location.href=a.href},true)}`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-emerald-500 selection:text-white">
        <Header />
        <main id="page-content" className="flex-1 flex flex-col pt-24">
          {children}
        </main>
        <Footer />
        <DiverScroll />
        <HoverLine />
      </body>
    </html>
  );
}

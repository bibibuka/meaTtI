"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import KelpFrame from "@/components/KelpFrame";

// Футер продолжает фон своей страницы, иначе снизу торчит чужая полоса.
// Умолчание — bg-neutral-50, оно и так совпадает с услугами, кейсами и спасибо;
// здесь только те страницы, что из него выбиваются. Цвет дублирует корень
// страницы, так что менять их надо парой.
const PAGE_CONFIG: Record<
  string,
  { bg: string; border: string; text: string; logo: string; kelpInvert?: boolean }
> = {
  "/team": {
    bg: "bg-[#FFFDF0] dark:bg-neutral-950",
    border: "border-neutral-300 dark:border-neutral-800",
    text: "text-neutral-700 dark:text-neutral-400",
    logo: "text-black dark:text-white",
  },
  "/contacts": {
    bg: "bg-neutral-950",
    border: "border-neutral-800",
    text: "text-neutral-400",
    logo: "text-white",
    kelpInvert: true,
  },
  "/policy": {
    bg: "bg-white dark:bg-neutral-950",
    border: "border-neutral-200 dark:border-neutral-800",
    text: "text-neutral-600 dark:text-neutral-400",
    logo: "text-foreground",
  },
};

const DEFAULT_CONFIG = {
  bg: "bg-neutral-50 dark:bg-neutral-950",
  border: "border-neutral-200 dark:border-neutral-800",
  text: "text-neutral-600 dark:text-neutral-400",
  logo: "text-foreground",
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  const config = PAGE_CONFIG[pathname] ?? DEFAULT_CONFIG;

  return (
    <div className={`w-full mt-auto flex flex-col ${config.bg}`}>
      {/* Своя зона под ламинарии в потоке между контентом и футером */}
      <div className="w-full">
        <KelpFrame className={config.kelpInvert ? "kelp-strip--invert" : ""} />
      </div>

      {/* Компактный обрезанный футер (1/4 от стандартного) */}
      <footer className={`w-full border-t ${config.border} ${config.bg} ${config.text}`}>
        <div className="max-w-7xl mx-auto px-6 py-3 md:py-3.5 flex flex-col md:flex-row items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-black tracking-tighter shrink-0 hover:opacity-80 transition-opacity">
              <span className={config.logo}>maetti</span>
              <span className="text-blue-500">.</span>
            </Link>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">|</span>
            <p className="text-[11px] text-neutral-500 hidden sm:inline">
              Студия разработки цифровых решений
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-4 gap-y-1 text-[11px]">
            <span>© {new Date().getFullYear()} maeTtI. Все права защищены.</span>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <Link href="/policy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
            <span className="text-neutral-300 dark:text-neutral-700">•</span>
            <span className="opacity-75">ИП Маетный Д. А. ИНН 123456789012 ОГРНИП 321123456789012</span>
          </div>
        </div>
      </footer>
    </div>
  );
}



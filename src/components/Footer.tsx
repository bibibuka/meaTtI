"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <Link href="/" className="text-xl font-black text-foreground tracking-tighter">
            maetti<span className="text-blue-600">.</span>
          </Link>
          <p className="text-xs text-neutral-500">
            Студия разработки цифровых решений. Делаем сайты, ботов, автоматизации.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2 text-center md:text-right">
          <p className="text-xs">
            © {new Date().getFullYear()} maeTtI. Все права защищены.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/policy" className="hover:text-foreground transition-colors">
              Политика конфиденциальности
            </Link>
            <span>•</span>
            <span className="text-neutral-500">ИП Маетный Д. А. ИНН 123456789012 ОГРНИП 321123456789012</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

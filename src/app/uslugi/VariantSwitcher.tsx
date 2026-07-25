"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const VARIANTS = [
  { path: "/uslugi", label: "Текущий" },
  { path: "/uslugi/v1", label: "1. Сплит-экран" },
  { path: "/uslugi/v2", label: "2. Сетка карточек" },
  { path: "/uslugi/v3", label: "3. Аккордеон" },
  { path: "/uslugi/v4", label: "4. Калькулятор" },
];

export default function VariantSwitcher() {
  const pathname = usePathname();

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 sticky top-16 z-40 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
          Сравнение вариантов дизайна:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {VARIANTS.map((v) => {
            const isActive = pathname === v.path;
            return (
              <Link
                key={v.path}
                href={v.path}
                className={`text-xs font-medium px-3 py-1.5 rounded transition-all shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                }`}
              >
                {v.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

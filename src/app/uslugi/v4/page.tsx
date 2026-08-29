"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Send, Calculator, Code, Bot, Cpu, Workflow, TrendingUp, Search } from "lucide-react";
import { SECTIONS } from "../data";
import VariantSwitcher from "../VariantSwitcher";
import WaveRule from "@/components/WaveRule";

const ICON_MAP = {
  code: Code,
  bot: Bot,
  automation: Workflow,
  makros: Cpu,
  api: Workflow,
  reklama: TrendingUp,
  seo: Search,
};

export default function Variant4Page() {
  const [selectedIds, setSelectedIds] = useState<string[]>([SECTIONS[0].id, SECTIONS[1].id]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectedServices = SECTIONS.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.priceNum, 0);

  const buildTelegramLink = () => {
    const names = selectedServices.map((s) => s.title).join(", ");
    const text = encodeURIComponent(`Здравствуйте! Хочу обсудить комплекс услуг: ${names} (ориентировочно от ${totalPrice.toLocaleString("ru-RU")} ₽)`);
    return `https://t.me/maetti_agency_stub?text=${text}`;
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      <VariantSwitcher />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <div className="w-fit mb-6">
            <WaveRule className="mb-5" />
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              Рассчитать Стоимость
            </h1>
          </div>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Отметьте необходимые направления работы, чтобы составить предварительный набор и смету проекта.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Selectable Service Cards */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
              Выберите интересующие услуги:
            </h2>

            {SECTIONS.map((sec) => {
              const isSelected = selectedIds.includes(sec.id);
              const Icon = ICON_MAP[sec.iconName];

              return (
                <div
                  key={sec.id}
                  onClick={() => toggleSelect(sec.id)}
                  className={`p-6 border transition-all duration-300 cursor-pointer flex items-start justify-between gap-4 ${
                    isSelected
                      ? "bg-white dark:bg-neutral-900 border-blue-600 dark:border-blue-500 shadow-sm"
                      : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 opacity-70 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-6 h-6 border mt-1 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-neutral-300 dark:border-neutral-700"}`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-neutral-400 font-semibold">[{sec.num}]</span>
                        <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <h3 className="text-base font-semibold text-neutral-950 dark:text-white">
                          {sec.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light mt-1 max-w-xl">
                        {sec.subtitle}
                      </p>
                      
                      <div className="mt-3 flex flex-wrap gap-2">
                        {sec.bullets.slice(0, 3).map((b, i) => (
                          <span key={i} className="text-[11px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-neutral-600 dark:text-neutral-400">
                            • {b}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-base font-semibold text-blue-600 dark:text-blue-400 block">{sec.price}</span>
                    <span className="text-xs font-mono text-neutral-400">{sec.time}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Summary Box */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm">
              <div className="flex items-center gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6">
                <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-white">
                  Ваш комплект ({selectedServices.length})
                </h3>
              </div>

              {selectedServices.length === 0 ? (
                <p className="text-xs text-neutral-400 font-light py-6 text-center">
                  Выберите хотя бы одну услугу для расчета
                </p>
              ) : (
                <div className="space-y-3 mb-6">
                  {selectedServices.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[200px]">
                        {item.title}
                      </span>
                      <span className="font-mono text-neutral-500">{item.price}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Предварительно:</span>
                  <span className="text-2xl font-light text-blue-600 dark:text-blue-400">
                    от {totalPrice.toLocaleString("ru-RU")} ₽
                  </span>
                </div>

                <a
                  href={buildTelegramLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 font-semibold text-xs py-3.5 transition-all duration-300 ${
                    selectedServices.length > 0
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  <span>Отправить набор в Telegram</span>
                  <Send className="w-3.5 h-3.5" />
                </a>

                <p className="text-[11px] text-neutral-400 font-light text-center">
                  Итоговая смета уточняется при детализации ТЗ
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

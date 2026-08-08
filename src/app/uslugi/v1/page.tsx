"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, ArrowRight, Code, Bot, Cpu, Workflow, TrendingUp, Search } from "lucide-react";
import { SECTIONS, ServiceSection } from "../data";
import VariantSwitcher from "../VariantSwitcher";
import WaveRule from "@/components/WaveRule";

const ICON_MAP = {
  code: Code,
  bot: Bot,
  makros: Cpu,
  api: Workflow,
  reklama: TrendingUp,
  seo: Search,
};

export default function Variant1Page() {
  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const activeService = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];
  const ActiveIcon = ICON_MAP[activeService.iconName];

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      <VariantSwitcher />

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <div className="w-fit mb-6">
            <WaveRule className="mb-5" />
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              Наши Услуги
            </h1>
          </div>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Выберите категорию слева для просмотра состава пакета, стоимости и сроков реализации.
          </p>
        </div>
      </section>

      {/* Split Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Navigation Sidebar */}
          <div className="lg:col-span-4 space-y-2 lg:sticky lg:top-28">
            {SECTIONS.map((item) => {
              const isActive = item.id === activeId;
              const Icon = ICON_MAP[item.iconName];

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveId(item.id)}
                  className={`w-full text-left p-5 transition-all duration-300 border flex items-center justify-between group ${
                    isActive
                      ? "bg-white dark:bg-neutral-900 border-blue-600 dark:border-blue-500 shadow-md translate-x-1"
                      : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono ${isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "text-neutral-400"}`}>
                      [{item.num}]
                    </span>
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200"}`} />
                    <div>
                      <h3 className={`text-sm font-medium ${isActive ? "text-neutral-950 dark:text-white font-semibold" : "text-neutral-700 dark:text-neutral-300"}`}>
                        {item.title}
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono block mt-0.5">
                        {item.price}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? "text-blue-600 dark:text-blue-400 translate-x-1" : "text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400"}`} />
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-8 md:p-12 shadow-sm"
              >
                <div className="flex items-start justify-between flex-wrap gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-8 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs font-mono text-blue-600 dark:text-blue-400 uppercase tracking-widest font-semibold">
                        [{activeService.num}] {activeService.category}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-4xl font-normal tracking-tight text-neutral-950 dark:text-white">
                      {activeService.title}
                    </h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base mt-3 font-light leading-relaxed max-w-2xl">
                      {activeService.subtitle}
                    </p>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 p-4 shrink-0 min-w-[200px]">
                    <div className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-1">Стоимость</div>
                    <div className="text-2xl font-light text-blue-600 dark:text-blue-400">{activeService.price}</div>
                    <div className="text-xs text-neutral-400 mt-1 font-mono">{activeService.time}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                    Что входит в услугу:
                  </h3>
                  <ul className="grid grid-cols-1 gap-3">
                    {activeService.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-neutral-700 dark:text-neutral-200">
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <span className="text-xs text-neutral-400 block">Готовы приступить?</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Бесплатный расчет ТЗ за 30 минут</span>
                  </div>
                  <a
                    href="https://t.me/maetti_agency_stub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold px-6 py-3.5 hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <span>Обсудить {activeService.title}</span>
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}

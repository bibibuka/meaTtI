"use client";

import React, { useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Plus, Minus, Code, Bot, Cpu, Workflow, TrendingUp, Search } from "lucide-react";
import { SECTIONS } from "./data";

const ICON_MAP = {
  code: Code,
  bot: Bot,
  makros: Cpu,
  api: Workflow,
  reklama: TrendingUp,
  seo: Search,
};

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export default function ServicesPage() {
  // Ссылки с главной ведут на /uslugi#id — эта позиция раскрыта по умолчанию
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  );
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const isOpenId = (id: string) =>
    toggled[id] ?? (hash ? id === hash : id === SECTIONS[0].id);

  const toggleAccordion = (id: string) =>
    setToggled((prev) => ({ ...prev, [id]: !isOpenId(id) }));

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            Наши Услуги
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Нажмите на любую позицию для раскрытия подробного состава пакета и условий работы.
          </p>
        </div>
      </section>

      {/* Accordion List */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
          {SECTIONS.map((sec) => {
            const isOpen = isOpenId(sec.id);
            const Icon = ICON_MAP[sec.iconName];

            return (
              <div key={sec.id} id={sec.id} className="py-6 transition-colors scroll-mt-28">
                <button
                  onClick={() => toggleAccordion(sec.id)}
                  className="w-full text-left flex items-center justify-between gap-4 py-2 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-sm font-mono text-neutral-400 font-semibold min-w-[30px]">
                      [{sec.num}]
                    </span>
                    <Icon className={`w-6 h-6 shrink-0 transition-colors ${isOpen ? "text-blue-600 dark:text-blue-400" : "text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"}`} />
                    <div>
                      <h2 className="text-xl md:text-3xl font-light tracking-tight text-neutral-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sec.title}
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1 hidden sm:block">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-sm font-mono font-medium text-blue-600 dark:text-blue-400 hidden md:block">
                      {sec.price}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-neutral-950 text-white dark:bg-white dark:text-black rotate-180" : "group-hover:border-neutral-400"}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-4 pl-0 sm:pl-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-8 space-y-4">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light block sm:hidden">
                            {sec.subtitle}
                          </p>
                          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                            Состав пакета:
                          </h3>
                          <ul className="space-y-3">
                            {sec.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                          <div>
                            <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">Стоимость</div>
                            <div className="text-2xl font-light text-blue-600 dark:text-blue-400">{sec.price}</div>
                            <div className="text-xs text-neutral-400 mt-1 font-mono">{sec.time}</div>
                          </div>

                          <a
                            href="https://t.me/maetti_agency_stub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs py-3 hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300"
                          >
                            <span>Обсудить задачу</span>
                            <Send className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

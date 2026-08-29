"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Send, Code, Bot, Cpu, Workflow, TrendingUp, Search } from "lucide-react";
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

export default function Variant2Page() {
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
            Наглядный каталог решений в виде карточек с иконками, ключевыми опциями и фиксированными тарифами.
          </p>
        </div>
      </section>

      {/* Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SECTIONS.map((sec, idx) => {
            const Icon = ICON_MAP[sec.iconName];

            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 p-8 flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  {/* Top Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white dark:group-hover:bg-blue-500 dark:group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-neutral-400">
                      [{sec.num}]
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-xl font-normal tracking-tight text-neutral-950 dark:text-white mb-2">
                    {sec.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6 text-pretty line-clamp-3">
                    {sec.subtitle}
                  </p>

                  {/* Bullets */}
                  <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 mb-6">
                    <ul className="space-y-2.5">
                      {sec.bullets.slice(0, 6).map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-300">
                          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                      {sec.bullets.length > 6 && (
                        <li className="text-xs text-neutral-400 dark:text-neutral-500 font-light pt-1">
                          + ещё {sec.bullets.length - 6} возможностей - спросите подробнее
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Footer Pricing & CTA */}
                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                  <div className="flex items-baseline justify-between mb-4">
                    <span className="text-xl font-light text-blue-600 dark:text-blue-400">{sec.price}</span>
                    <span className="text-xs text-neutral-400 font-mono">{sec.time}</span>
                  </div>

                  <a
                    href="https://t.me/maetti_agency_stub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs py-3 hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300"
                  >
                    <span>Заказать в Telegram</span>
                    <Send className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

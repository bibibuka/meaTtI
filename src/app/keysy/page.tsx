"use client";

import React, { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Leaf, Shield, Award } from "lucide-react";
import gsap from "gsap";

const CASES = [
  {
    num: "I",
    title: "Экосистема для премиального ритейла «Boutique Digital»",
    category: "Веб-разработка & Интеграции",
    challenge: "Заказчик столкнулся с низкой конверсией мобильной версии и медленным обновлением каталога из старой ERP. Процесс покупки занимал более 6 шагов.",
    solution: "Мы переработали пользовательский путь (UX) и перенесли интерфейс на headless-архитектуру Next.js. Подключили быструю синхронизацию товаров по WebSockets и внедрили бесшовную оплату в один клик.",
    results: [
      { metric: "+43%", label: "Конверсия в покупку" },
      { metric: "0.8 сек", label: "Скорость загрузки (LCP)" },
      { metric: "-35%", label: "Брошенные корзины" }
    ],
    color: "bg-emerald-50/50 dark:bg-emerald-950/20"
  },
  {
    num: "II",
    title: "Интеллектуальный хелпдеск-ассистент «MediCall»",
    category: "Telegram-боты & ИИ",
    challenge: "Служба поддержки частных клиник перегружена рутинными вопросами пациентов о расписании врачей, прайсе и подготовке к исследованиям. Время ответа оператора составляло более 12 минут.",
    solution: "Создали кастомный Telegram Web App с интеграцией тонко настроенной модели GPT-4. Бот мгновенно считывает свободные слоты в CRM клиники, записывает пациентов на прием и отвечает на медицинские вопросы согласно регламенту.",
    results: [
      { metric: "72%", label: "Вопросов решается без оператора" },
      { metric: "< 3 сек", label: "Время ответа ассистента" },
      { metric: "x2.5", label: "Рост объема записей" }
    ],
    color: "bg-amber-50/50 dark:bg-amber-950/20"
  },
  {
    num: "III",
    title: "Автоматизация отчетности холдинга «FinTech Logic»",
    category: "Скрипты & Макросы",
    challenge: "Бухгалтерия тратит около 35 часов еженедельно на ручной сбор и сведение отчетов из 14 разных филиалов, выгружающих данные в разных форматах (CSV, XLS, JSON).",
    solution: "Разработали систему автоматической валидации и нормализации данных на Node.js. Скрипт по расписанию забирает выгрузки с почты, приводит их к единому стандарту и собирает сводную интерактивную Excel-панель.",
    results: [
      { metric: "-35 ч", label: "Времени экономится каждую неделю" },
      { metric: "0%", label: "Человеческих ошибок в расчетах" },
      { metric: "1 кл", label: "Сведение отчета вместо часов работы" }
    ],
    color: "bg-rose-50/50 dark:bg-rose-950/20"
  }
];

export default function CasesPage() {
  const shouldReduceMotion = useReducedMotion();
  const leaf1Ref = useRef<HTMLDivElement>(null);
  const leaf2Ref = useRef<HTMLDivElement>(null);
  const leaf3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    // Slow organic floating animations with GSAP
    gsap.to(leaf1Ref.current, {
      y: "+=30",
      x: "-=15",
      rotation: 25,
      duration: 7,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(leaf2Ref.current, {
      y: "-=25",
      x: "+=20",
      rotation: -20,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(leaf3Ref.current, {
      y: "+=20",
      x: "+=15",
      rotation: 12,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, [shouldReduceMotion]);

  return (
    <div className="relative bg-[#f4f6f7] dark:bg-neutral-950 min-h-screen text-[#2d323a] dark:text-neutral-200 overflow-hidden font-sans">
      
      {/* Organic Background Elements (Floating SVG Leaves) */}
      <div ref={leaf1Ref} className="absolute top-20 left-[-40px] w-48 h-48 opacity-20 pointer-events-none text-blue-800 dark:text-blue-500">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M 50 0 C 70 30, 80 60, 50 100 C 20 60, 30 30, 50 0 Z" />
        </svg>
      </div>

      <div ref={leaf2Ref} className="absolute top-[45%] right-[-50px] w-64 h-64 opacity-15 pointer-events-none text-blue-700 dark:text-blue-400">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M 10 50 C 30 20, 70 30, 90 50 C 70 70, 30 80, 10 50 Z" />
        </svg>
      </div>

      <div ref={leaf3Ref} className="absolute bottom-10 left-[10%] w-36 h-36 opacity-20 pointer-events-none text-indigo-800 dark:text-indigo-500">
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M 50 10 C 80 30, 60 80, 30 90 C 20 70, 20 30, 50 10 Z" />
        </svg>
      </div>

      {/* Hero Header */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 z-10">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-4">
            <Leaf className="w-4 h-4 animate-pulse" />
            <span>Ботанический Эдиториал</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-serif font-normal italic tracking-tight text-neutral-900 dark:text-white mt-2 mb-8">
            Наши Проекты
          </h1>
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
            Каждый кейс для нас — это живой организм. Мы выращиваем решения из конкретной бизнес-проблемы, развивая структуру, дизайн и программную логику в гармонии с целями бизнеса.
          </p>
        </div>
      </section>

      {/* Cases List */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32 z-10">
        <div className="flex flex-col gap-24">
          {CASES.map((c, index) => (
            <motion.div
              key={index}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 40 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className={`rounded-3xl p-8 md:p-16 border border-[#e1e3de] dark:border-neutral-800/80 ${c.color} shadow-sm flex flex-col gap-12`}
            >
              {/* Top Row: Index and Category */}
              <div className="flex items-center justify-between border-b border-[#e1e3de] dark:border-neutral-800 pb-6">
                <span className="font-serif italic text-3xl md:text-4xl text-blue-800 dark:text-blue-400">
                  {c.num}
                </span>
                <span className="text-xs font-semibold uppercase tracking-widest text-neutral-500">
                  {c.category}
                </span>
              </div>

              {/* Main Info */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6">
                  <h2 className="text-2xl md:text-4xl font-serif text-neutral-900 dark:text-white font-normal leading-tight mb-8">
                    {c.title}
                  </h2>
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Задача</h3>
                      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                        {c.challenge}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Решение</h3>
                      <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
                        {c.solution}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="lg:col-span-6 lg:pl-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-6 w-full">
                  {c.results.map((res, rIdx) => (
                    <div
                      key={rIdx}
                      className="border border-[#e1e3de] dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-sm rounded-2xl p-6 flex flex-col justify-center"
                    >
                      <span className="text-3xl md:text-4xl font-serif font-semibold text-blue-800 dark:text-blue-400">
                        {res.metric}
                      </span>
                      <span className="text-xs text-neutral-500 mt-2 font-medium tracking-wide">
                        {res.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-end mt-4">
                <a
                  href="https://t.me/maetti_agency_stub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
                >
                  <span>Подробный разбор в Telegram</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

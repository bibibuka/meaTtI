"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowRight, Send } from "lucide-react";
import WaveRule from "@/components/WaveRule";

const CASES = [
  {
    id: "boutique",
    num: "01",
    roman: "I",
    title: "Экосистема для премиального ритейла «Boutique Digital»",
    category: "Веб-разработка & Интеграции",
    short: "Ритейл",
    challenge: "Заказчик столкнулся с низкой конверсией мобильной версии и медленным обновлением каталога из старой ERP. Процесс покупки занимал более 6 шагов.",
    solution: "Мы переработали пользовательский путь (UX) и перенесли интерфейс на headless-архитектуру Next.js. Подключили быструю синхронизацию товаров по WebSockets и внедрили бесшовную оплату в один клик.",
    results: [
      { metric: "+43%", label: "Конверсия в покупку" },
      { metric: "0.8 сек", label: "Скорость загрузки (LCP)" },
      { metric: "-35%", label: "Брошенные корзины" }
    ]
  },
  {
    id: "medicall",
    num: "02",
    roman: "II",
    title: "Интеллектуальный хелпдеск-ассистент «MediCall»",
    category: "Telegram-боты & ИИ",
    short: "Боты и ИИ",
    challenge: "Служба поддержки частных клиник перегружена рутинными вопросами пациентов о расписании врачей, прайсе и подготовке к исследованиям. Время ответа оператора составляло более 12 минут.",
    solution: "Создали кастомный Telegram Web App с интеграцией тонко настроенной модели GPT-4. Бот мгновенно считывает свободные слоты в CRM клиники, записывает пациентов на прием и отвечает на медицинские вопросы согласно регламенту.",
    results: [
      { metric: "72%", label: "Вопросов решается без оператора" },
      { metric: "< 3 сек", label: "Время ответа ассистента" },
      { metric: "x2.5", label: "Рост объема записей" }
    ]
  },
  {
    id: "fintech",
    num: "03",
    roman: "III",
    title: "Автоматизация отчетности холдинга «FinTech Logic»",
    category: "Скрипты & Макросы",
    short: "Автоматизация",
    challenge: "Бухгалтерия тратит около 35 часов еженедельно на ручной сбор и сведение отчетов из 14 разных филиалов, выгружающих данные в разных форматах (CSV, XLS, JSON).",
    solution: "Разработали систему автоматической валидации и нормализации данных на Node.js. Скрипт по расписанию забирает выгрузки с почты, приводит их к единому стандарту и собирает сводную интерактивную Excel-панель.",
    results: [
      { metric: "-35 ч", label: "Времени экономится каждую неделю" },
      { metric: "0%", label: "Человеческих ошибок в расчетах" },
      { metric: "1 кл", label: "Сведение отчета вместо часов" }
    ]
  }
];

type Case = (typeof CASES)[number];

function CaseDetail({ c }: { c: Case }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm h-full flex flex-col p-6 sm:p-8 md:p-12">
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-6 md:pb-8 mb-6 md:mb-8">
        <WaveRule className="mb-4" />
        <h2 className="text-xl sm:text-2xl md:text-4xl font-normal tracking-tight text-neutral-950 dark:text-white leading-tight">
          {c.title}
        </h2>
      </div>

      {/* Задача / Решение */}
      <div className="space-y-6 md:space-y-8">
        <div>
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Задача</h3>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {c.challenge}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Решение</h3>
          <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {c.solution}
          </p>
        </div>
      </div>

      {/* Метрики — тонкие волосяные линии между колонками */}
      <div className="mt-8 md:mt-10 grid grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        {c.results.map((res, rIdx) => (
          <div key={rIdx} className="bg-neutral-50 dark:bg-neutral-950 p-3 md:p-5">
            <div className="text-lg md:text-3xl font-light text-blue-600 dark:text-blue-400 whitespace-nowrap">
              {res.metric}
            </div>
            <div className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-snug">
              {res.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-auto pt-8 md:pt-10 flex items-center justify-between flex-wrap gap-4">
        <div className="hidden sm:block">
          <span className="text-xs text-neutral-400 block">Похожая задача?</span>
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Разберем ваш случай за 30 минут</span>
        </div>
        <a
          href="https://t.me/maetti_agency_stub"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto justify-center inline-flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold px-6 py-3.5 hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
        >
          <span>Подробный разбор</span>
          <Send className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const activeCase = CASES[active];

  // Свайп карусели -> подсветка чипа. Карточки одинаковой ширины,
  // поэтому шаг = вся прокрутка / (n-1).
  const syncFromRail = () => {
    const el = railRef.current;
    if (!el) return;
    const step = (el.scrollWidth - el.clientWidth) / (CASES.length - 1);
    if (step > 0) setActive(Math.min(CASES.length - 1, Math.round(el.scrollLeft / step)));
  };

  // Активный чип всегда в поле зрения (лента чипов уже экрана)
  useEffect(() => {
    chipsRef.current?.children[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const goTo = (i: number) => {
    setActive(i);
    railRef.current?.children[i]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <MotionConfig reducedMotion="user">
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <WaveRule className="mb-5" />
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-6">
            Наши Кейсы
          </h1>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Выберите проект, чтобы посмотреть исходную задачу, техническое решение и измеримый результат.
          </p>
        </div>
      </section>

      {/* ===== Desktop: сплит-экран ===== */}
      <div className="hidden lg:block max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Навигация */}
          <div className="col-span-4 space-y-2 sticky top-28">
            {CASES.map((c, i) => {
              const isActive = i === active;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(i)}
                  className={`w-full text-left p-5 transition-all duration-300 border flex items-center justify-between gap-4 group ${
                    isActive
                      ? "bg-white dark:bg-neutral-900 border-blue-600 dark:border-blue-500 shadow-md translate-x-1"
                      : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-mono shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "text-neutral-400"}`}>
                      [{c.num}]
                    </span>
                    <div>
                      <h3 className={`text-sm font-medium leading-snug ${isActive ? "text-neutral-950 dark:text-white font-semibold" : "text-neutral-700 dark:text-neutral-300"}`}>
                        {c.title}
                      </h3>
                      <span className="text-xs text-neutral-400 font-mono block mt-1">
                        {c.category}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-blue-600 dark:text-blue-400 translate-x-1" : "text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400"}`} />
                </button>
              );
            })}
          </div>

          {/* Детали */}
          <div className="col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCase.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <CaseDetail c={activeCase} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== Mobile: липкая лента + свайп-карусель ===== */}
      <div className="lg:hidden">
        {/* Липкая шапка навигации */}
        <div className="sticky top-24 z-30 bg-neutral-50/85 dark:bg-neutral-950/85 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 px-6 pt-3 pb-2.5">
            <div
              ref={chipsRef}
              className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1"
            >
              {CASES.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.id}
                    onClick={() => goTo(i)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-1.5 border text-xs transition-colors duration-300 ${
                      isActive
                        ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white"
                        : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                    }`}
                  >
                    <span className="font-mono opacity-60">{c.roman}</span>
                    <span className="font-medium whitespace-nowrap">{c.short}</span>
                  </button>
                );
              })}
            </div>
            <span className="ml-auto shrink-0 text-xs font-mono text-neutral-400 tabular-nums">
              {String(active + 1).padStart(2, "0")}/{String(CASES.length).padStart(2, "0")}
            </span>
          </div>

          {/* Прогресс */}
          <div className="h-px bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              className="h-px bg-blue-600 dark:bg-blue-400"
              animate={{ width: `${((active + 1) / CASES.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
            />
          </div>
        </div>

        {/* Карусель: нативный scroll-snap, соседние карточки подглядывают с краёв */}
        <div
          ref={railRef}
          onScroll={syncFromRail}
          className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 py-8"
        >
          {CASES.map((c) => (
            <div key={c.id} className="snap-center shrink-0 w-[calc(100vw-4.5rem)] max-w-lg">
              <CaseDetail c={c} />
            </div>
          ))}
        </div>

        <p className="px-6 pb-12 text-xs font-mono text-neutral-400 flex items-center gap-2">
          <ArrowRight className="w-3.5 h-3.5" />
          Листайте вбок — следующий кейс
        </p>
      </div>
    </div>
    </MotionConfig>
  );
}

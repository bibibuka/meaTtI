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

/* 1 тик колеса ≈ 100px. На каждый кейс — 5 тиков, потом открепление. */
const TICK_PX = 100;
const TICKS_PER_SLIDE = 5;
const SLIDE_PX = TICK_PX * TICKS_PER_SLIDE;
const PIN_EXTRA_PX = SLIDE_PX * CASES.length;

function pinProgressPx(track: HTMLElement): number {
  const sticky = track.firstElementChild as HTMLElement | null;
  if (!sticky || track.offsetHeight === 0) return 0;
  const extra = Math.max(0, track.offsetHeight - sticky.offsetHeight);
  if (extra === 0) return 0;
  const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
  const scrolled = stickyTop - track.getBoundingClientRect().top;
  return Math.min(extra, Math.max(0, scrolled));
}

function slideIndexFromProgress(progress: number): number {
  if (progress >= PIN_EXTRA_PX) return CASES.length - 1;
  return Math.min(CASES.length - 1, Math.max(0, Math.floor(progress / SLIDE_PX)));
}

function scrollTrackToProgress(track: HTMLElement, progress: number) {
  const sticky = track.firstElementChild as HTMLElement | null;
  if (!sticky) return;
  const stickyTop = parseFloat(getComputedStyle(sticky).top) || 0;
  const targetTrackTop = stickyTop - progress;
  const delta = track.getBoundingClientRect().top - targetTrackTop;
  window.scrollTo({ top: window.scrollY + delta, behavior: "smooth" });
}

function CaseDetail({ c }: { c: Case }) {
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between p-5 sm:p-6 md:p-7 h-full min-h-[28.75rem] max-h-[36.25rem] transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
      {/* Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
            {c.category}
          </span>
          <span className="text-xs font-mono text-neutral-400">
            ПРОЕКТ [{c.num}]
          </span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-normal tracking-tight text-neutral-950 dark:text-white leading-tight">
          {c.title}
        </h2>
      </div>

      {/* Задача & Решение: 2 колонки на десктопе для компактности */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 my-auto">
        <div className="bg-neutral-50 dark:bg-neutral-950/60 p-3.5 sm:p-4 border border-neutral-100 dark:border-neutral-800/80">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Задача
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {c.challenge}
          </p>
        </div>
        <div className="bg-neutral-50 dark:bg-neutral-950/60 p-3.5 sm:p-4 border border-neutral-100 dark:border-neutral-800/80">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Решение
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {c.solution}
          </p>
        </div>
      </div>

      {/* Метрики — тонкие волосяные линии между колонками */}
      <div className="mt-4 grid grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800">
        {c.results.map((res, rIdx) => (
          <div key={rIdx} className="bg-neutral-50 dark:bg-neutral-950 p-2.5 sm:p-3 md:p-3.5 text-center">
            <div className="text-base sm:text-lg md:text-2xl font-light text-blue-600 dark:text-blue-400 whitespace-nowrap">
              {res.metric}
            </div>
            <div className="text-[10px] md:text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
              {res.label}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
        <div className="hidden sm:block">
          <span className="text-[11px] text-neutral-400 block">Похожая задача?</span>
          <span className="text-xs md:text-sm font-medium text-neutral-800 dark:text-neutral-200">Подберем решение за 30 минут</span>
        </div>
        <a
          href="https://t.me/maetti_agency_stub"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto justify-center inline-flex items-center gap-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white active:scale-95 transition-all duration-200 shadow-sm text-xs sm:text-sm"
        >
          <span>Подробный разбор</span>
          <Send className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function CasesPage() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const prevActiveRef = useRef(0);

  const desktopTrackRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const ignoreScrollRef = useRef(false);
  const unlockTimerRef = useRef<number>(0);
  const clickGenRef = useRef(0);

  const activeCase = CASES[active];

  useEffect(() => {
    const track = desktopTrackRef.current;
    if (!track) return;

    const sync = () => {
      if (ignoreScrollRef.current || track.offsetHeight === 0) return;
      const nextIdx = slideIndexFromProgress(pinProgressPx(track));
      if (nextIdx !== prevActiveRef.current) {
        setDirection(nextIdx > prevActiveRef.current ? 1 : -1);
        prevActiveRef.current = nextIdx;
        setActive(nextIdx);
      }
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    sync();
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      clickGenRef.current += 1;
      ignoreScrollRef.current = false;
      window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const handleDesktopClick = (targetIndex: number) => {
    const track = desktopTrackRef.current;
    if (!track) return;

    if (targetIndex !== active) {
      setDirection(targetIndex > active ? 1 : -1);
      setActive(targetIndex);
    }
    prevActiveRef.current = targetIndex;

    const targetProgress = targetIndex * SLIDE_PX + 8;
    const gen = ++clickGenRef.current;
    ignoreScrollRef.current = true;
    window.clearTimeout(unlockTimerRef.current);

    const unlock = () => {
      window.removeEventListener("scrollend", unlock);
      window.clearTimeout(unlockTimerRef.current);
      if (gen !== clickGenRef.current) return;
      ignoreScrollRef.current = false;
    };

    if (Math.abs(pinProgressPx(track) - targetProgress) < 2) {
      ignoreScrollRef.current = false;
      return;
    }

    window.addEventListener("scrollend", unlock);
    unlockTimerRef.current = window.setTimeout(unlock, 1500);
    scrollTrackToProgress(track, targetProgress);
  };

  // Mobile rail swipe sync
  const syncFromRail = () => {
    const el = railRef.current;
    if (!el) return;
    const step = (el.scrollWidth - el.clientWidth) / (CASES.length - 1);
    if (step > 0) setActive(Math.min(CASES.length - 1, Math.round(el.scrollLeft / step)));
  };

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    chipsRef.current?.children[active]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active]);

  const goToMobile = (i: number) => {
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
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-12 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-3xl">
            <div className="w-fit mb-4">
              <WaveRule className="mb-4" />
              <h1 className="text-3xl md:text-5xl font-light tracking-tight">
                Наши Кейсы
              </h1>
            </div>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              Листайте страницу вниз для последовательного просмотра проектов, задач, технических решений и измеримых результатов.
            </p>
          </div>
        </section>

        {/* ===== Desktop: Pinned Scroll Track (по 5 тиков на каждый кейс) ===== */}
        <div
          ref={desktopTrackRef}
          className="hidden lg:block relative"
          style={{ height: `calc(100vh - 5rem + ${PIN_EXTRA_PX}px)` }}
        >
          <div className="sticky top-20 h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="max-w-7xl w-full mx-auto px-6">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Навигация слева */}
                <div className="col-span-4 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1">
                    <span>ПРОЕКТЫ</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400 font-semibold">
                      [{String(active + 1).padStart(2, "0")}/{String(CASES.length).padStart(2, "0")}]
                    </span>
                  </div>

                  {/* Индикатор общего прогресса */}
                  <div className="h-1 bg-neutral-200 dark:bg-neutral-800 mb-4 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                      animate={{ width: `${((active + 1) / CASES.length) * 100}%` }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  </div>

                  {CASES.map((c, i) => {
                    const isActive = i === active;
                    return (
                      <button
                        key={c.id}
                        onClick={() => handleDesktopClick(i)}
                        className={`w-full text-left p-4 transition-all duration-300 border flex items-center justify-between gap-4 group relative ${
                          isActive
                            ? "bg-white dark:bg-neutral-900 border-blue-600 dark:border-blue-500 shadow-md translate-x-1"
                            : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeBar"
                            className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 dark:bg-blue-400"
                          />
                        )}
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-mono shrink-0 ${isActive ? "text-blue-600 dark:text-blue-400 font-bold" : "text-neutral-400"}`}>
                            [{c.num}]
                          </span>
                          <div>
                            <h3 className={`text-sm font-medium leading-snug ${isActive ? "text-neutral-950 dark:text-white font-semibold" : "text-neutral-700 dark:text-neutral-300"}`}>
                              {c.title}
                            </h3>
                            <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                              {c.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? "text-blue-600 dark:text-blue-400 translate-x-1" : "text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400"}`} />
                      </button>
                    );
                  })}

                </div>

                {/* Детали карточки справа */}
                <div className="col-span-8">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeCase.id}
                      custom={direction}
                      initial={{ opacity: 0, y: direction * 18, scale: 0.99 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -direction * 18, scale: 0.99 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      <CaseDetail c={activeCase} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
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
                      onClick={() => goToMobile(i)}
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

          {/* Карусель: нативный scroll-snap */}
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

          <p className="px-6 pb-12 md:pb-16 text-xs font-mono text-neutral-400 flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5" />
            Листайте вбок - следующий кейс
          </p>
        </div>
      </div>
    </MotionConfig>
  );
}


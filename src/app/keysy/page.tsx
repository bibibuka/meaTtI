"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ArrowRight, Send, ExternalLink, ChevronLeft, ChevronRight, X, Images } from "lucide-react";
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
    ],
    domain: "boutique-digital.store",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        title: "Главная страница и каталог товаров",
        desc: "Адаптивная верстка с бесшовным переключением категорий и фильтрацией в реальном времени."
      },
      {
        url: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80",
        title: "Карточка товара и мобильный интерфейс",
        desc: "Проектирование быстрых пользовательских сценариев покупки в один клик."
      },
      {
        url: "https://images.unsplash.com/photo-1556742049-0a67dd3f3a8b?auto=format&fit=crop&w=1600&q=80",
        title: "Модуль оформления заказа (Checkout)",
        desc: "Интеграция эквайринга и службы доставки соавтоматическим расчетом сроков."
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        title: "Панель администратора и аналитика ERP",
        desc: "Синхронизация по WebSockets с остатками на складе и аналитикой продаваемости."
      }
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
    ],
    domain: "t.me/medicall_bot",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
        title: "Диалоговый интерфейс ассистента в Telegram",
        desc: "Распознавание естественного языка и помощь пациентам 24/7 по регламентам клиники."
      },
      {
        url: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1600&q=80",
        title: "Интерактивный календарь записи (Telegram Mini App)",
        desc: "Выбор свободного слота врача и подгрузка медицинской карты за несколько секунд."
      },
      {
        url: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80",
        title: "Личный кабинет пациента",
        desc: "Напоминания о приеме, подготовка к анализам и история прошлых посещений."
      },
      {
        url: "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1600&q=80",
        title: "Дашборд загруженности операторов клиники",
        desc: "Мониторинг обращений в реальном времени с функцией бесшовного перевода на оператора."
      }
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
    ],
    domain: "analytics.fintech-logic.internal",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
        title: "Сводная аналитическая панель расчетов",
        desc: "Автоматическое агрегирование показателей 14 филиалов в единый интерактивный отчет."
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
        title: "Пайплайн валидации и очистки данных",
        desc: "Проверка форматов JSON, CSV и XLS без участия сотрудников компании."
      },
      {
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=80",
        title: "Экспорт и генерация итоговых Excel-таблиц",
        desc: "Автоматическая выгрузка с формулами, макросами и диаграммами распределения бюджетов."
      }
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

function CaseDetail({
  c,
  onOpenGallery,
}: {
  c: Case;
  onOpenGallery: (c: Case, photoIndex?: number) => void;
}) {
  const mainPhoto = c.gallery[0];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between p-5 sm:p-6 md:p-7 transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
      {/* 1. Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
        <div className="flex items-center justify-between gap-4 mb-1.5">
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

      {/* 2. 4 Прямоугольника (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 my-auto items-stretch">
        {/* Левый верхний: ТЕКСТ (Задача) */}
        <div className="bg-neutral-50 dark:bg-neutral-950/60 p-4 sm:p-5 border border-neutral-100 dark:border-neutral-800/80 rounded-xl flex flex-col justify-center">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Задача
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
            {c.challenge}
          </p>
        </div>

        {/* Правый верхний: ФОТО 16:9 (Браузерный фрейм) */}
        <div className="flex flex-col justify-center">
          <div
            onClick={() => onOpenGallery(c, 0)}
            className="w-full border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-950 group cursor-pointer relative flex flex-col shadow-xs"
          >
            <div className="bg-neutral-100 dark:bg-neutral-900 px-3.5 py-1.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] font-mono text-neutral-500 shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700 inline-block" />
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400 truncate max-w-[180px]">
                <ExternalLink className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="truncate text-xs">{c.domain}</span>
              </div>
            </div>

            {/* 16:9 Widescreen Photo */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-neutral-900">
              <img
                src={mainPhoto.url}
                alt={c.title}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-neutral-200">
                <span className="truncate drop-shadow font-sans text-xs">{mainPhoto.title}</span>
                <span className="shrink-0 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1 border border-white/10 ml-1.5">
                  <Images className="w-3.5 h-3.5 text-blue-400" />
                  <span>Галерея ({c.gallery.length})</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Левый нижний: ТЕКСТ (Метрики просто текстом без плашки) */}
        <div className="flex flex-col justify-center px-1 sm:px-2 py-2">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-left">
            {c.results.map((res, rIdx) => (
              <div key={rIdx} className="flex flex-col">
                <div className="text-xl sm:text-2xl md:text-3xl font-light text-blue-600 dark:text-blue-400 tracking-tight">
                  {res.metric}
                </div>
                <div className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                  {res.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Правый нижний: ТЕКСТ (Решение) */}
        <div className="bg-neutral-50 dark:bg-neutral-950/60 p-4 sm:p-5 border border-neutral-100 dark:border-neutral-800/80 rounded-xl flex flex-col justify-center">
          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Решение
          </h3>
          <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
            {c.solution}
          </p>
        </div>
      </div>

      {/* 3. CTA Footer */}
      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
        <div>
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

  // Modal Lightbox Gallery State
  const [galleryCase, setGalleryCase] = useState<Case | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);

  const handleOpenGallery = (c: Case, idx = 0) => {
    setGalleryCase(c);
    setPhotoIndex(idx);
  };

  const handleCloseGallery = () => {
    setGalleryCase(null);
  };

  const handleNextPhoto = () => {
    if (!galleryCase) return;
    setPhotoIndex((prev) => (prev + 1) % galleryCase.gallery.length);
  };

  const handlePrevPhoto = () => {
    if (!galleryCase) return;
    setPhotoIndex((prev) => (prev - 1 + galleryCase.gallery.length) % galleryCase.gallery.length);
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!galleryCase) return;
      if (e.key === "Escape") handleCloseGallery();
      if (e.key === "ArrowRight") handleNextPhoto();
      if (e.key === "ArrowLeft") handlePrevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryCase]);

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
                      <CaseDetail c={activeCase} onOpenGallery={handleOpenGallery} />
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
                <CaseDetail c={c} onOpenGallery={handleOpenGallery} />
              </div>
            ))}
          </div>

          <p className="px-6 pb-12 md:pb-16 text-xs font-mono text-neutral-400 flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5" />
            Листайте вбок - следующий кейс
          </p>
        </div>

        {/* ===== Interactive Fullscreen Gallery Lightbox Modal ===== */}
        <AnimatePresence>
          {galleryCase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between text-white border-b border-neutral-800 pb-4">
                <div>
                  <span className="text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold block mb-0.5">
                    [{galleryCase.num}] {galleryCase.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-white truncate max-w-xl">
                    {galleryCase.title}
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
                    {photoIndex + 1} из {galleryCase.gallery.length}
                  </span>
                  <button
                    onClick={handleCloseGallery}
                    className="p-2 text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-600 rounded-md transition-colors cursor-pointer"
                    aria-label="Закрыть галерею"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image View Area */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                {/* Left Arrow */}
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-2 sm:left-4 z-10 p-3 text-white bg-neutral-900/80 hover:bg-blue-600 border border-neutral-700 rounded-full transition-all shadow-lg cursor-pointer"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Animated Current Photo */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={photoIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="max-w-5xl max-h-[65vh] relative flex flex-col items-center justify-center"
                  >
                    <img
                      src={galleryCase.gallery[photoIndex].url}
                      alt={galleryCase.gallery[photoIndex].title}
                      className="max-w-full max-h-[58vh] object-contain rounded-md shadow-2xl border border-neutral-800"
                    />

                    {/* Image Caption & Description */}
                    <div className="mt-3 text-center max-w-2xl px-4">
                      <h4 className="text-sm sm:text-base font-medium text-white">
                        {galleryCase.gallery[photoIndex].title}
                      </h4>
                      <p className="text-xs text-neutral-400 font-light mt-0.5">
                        {galleryCase.gallery[photoIndex].desc}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Right Arrow */}
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-2 sm:right-4 z-10 p-3 text-white bg-neutral-900/80 hover:bg-blue-600 border border-neutral-700 rounded-full transition-all shadow-lg cursor-pointer"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Thumbnails Strip Footer */}
              <div className="border-t border-neutral-800 pt-3 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar">
                {galleryCase.gallery.map((item, idx) => {
                  const isActive = idx === photoIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setPhotoIndex(idx)}
                      className={`relative w-16 sm:w-20 h-10 sm:h-12 rounded overflow-hidden border transition-all shrink-0 cursor-pointer ${
                        isActive
                          ? "border-blue-500 scale-105 shadow-md"
                          : "border-neutral-800 opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </MotionConfig>
  );
}

"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useReducedMotion } from "framer-motion";
import { ArrowUpRight, ChevronRight, Layers, Cpu, Award } from "lucide-react";
import WaveRule from "@/components/WaveRule";

const WinDesktop = dynamic(() => import("@/components/WinDesktop"), { ssr: false });

const SERVICES = [
  {
    id: "sajty",
    title: "Веб-сайты",
    desc: "Промо-страницы, интернет-магазины, порталы и SPA. Креативный дизайн и безупречная производительность.",
    color: "from-purple-600 to-indigo-600",
    bg: "bg-purple-500/10",
    border: "group-hover:border-purple-500",
    badge: "WEB"
  },
  {
    id: "boty",
    title: "Telegram-боты",
    desc: "Сложные диалоговые интерфейсы, CRM-боты, мини-аппы (Mini Apps) и боты с интеграцией искусственного интеллекта.",
    color: "from-blue-600 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500",
    badge: "BOT"
  },
  {
    id: "makrosy",
    title: "Макросы и Скрипты",
    desc: "Автоматизация Excel, Google Таблиц, веб-парсеры и оптимизация рутинных задач вашего офиса.",
    color: "from-green-600 to-emerald-600",
    bg: "bg-green-500/10",
    border: "group-hover:border-green-500",
    badge: "SCRIPT"
  },
  {
    id: "integracii",
    title: "Интеграции систем",
    desc: "Связывание CRM, систем лояльности, платежных шлюзов, почтовых сервисов и любых API.",
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-500/10",
    border: "group-hover:border-amber-500",
    badge: "API"
  },
  {
    id: "reklama",
    title: "Реклама и Трафик",
    desc: "Запуск таргетированной и контекстной рекламы, лидогенерация, сквозная аналитика и воронки продаж.",
    color: "from-rose-600 to-red-600",
    bg: "bg-rose-500/10",
    border: "group-hover:border-rose-500",
    badge: "ADS"
  },
  {
    id: "seo",
    title: "SEO-продвижение",
    desc: "Вывод сайтов в топ поисковых систем Яндекс и Google, аудит кода, семантика и ссылочная стратегия.",
    color: "from-teal-600 to-cyan-600",
    bg: "bg-teal-500/10",
    border: "group-hover:border-teal-500",
    badge: "SEO"
  }
];

const ADVANTAGES = [
  {
    title: "Фокус на окупаемости",
    desc: "Мы не просто пишем код — мы создаем инструменты для масштабирования вашего бизнеса.",
    icon: Award,
  },
  {
    title: "Полный цикл разработки",
    desc: "От предпроектной аналитики и дизайна до выкатки на продакшн и поддержки.",
    icon: Layers,
  },
  {
    title: "Современный стек",
    desc: "Используем передовые фреймворки. Никакого легаси-кода — всё летает и легко масштабируется.",
    icon: Cpu,
  },
];

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();

  // Split text for kinetic typography dance
  const word = "АБСОЛЮТНОЕ.ЦЕННОЕ.ЦИФРОВОЕ.";
  const chars = Array.from(word);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[calc(85vh-6rem)] flex flex-col justify-center overflow-hidden px-6 pb-20 bg-white text-neutral-950">
        {/* Colorful blob backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/40 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[25rem] h-[25rem] rounded-full bg-blue-500/30 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          {/* Kinetic Offer */}
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight leading-none mb-8 select-none break-words">
            МЫ СТРОИМ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600">
              ЧИСТЫЙ КОД
            </span> <br />
            И СМЕЛЫЙ ДИЗАЙН.
          </h1>

          <p className="text-lg md:text-2xl text-neutral-600 max-w-2xl font-light mb-12">
            Создаем технологичные решения, которые выведут ваш продукт в топ. Разрабатываем сайты, настраиваем рекламу, автоматизируем процессы и строим экосистемы.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/contacts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Начать проект
            </Link>
            <a
              href="#services"
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 flex items-center gap-2"
            >
              <span>Наши услуги</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Endless scrolling kinetic typography */}
        {!shouldReduceMotion ? (
          <div className="absolute bottom-6 left-0 right-0 w-full overflow-hidden py-4 border-y border-neutral-200 select-none bg-white/40 backdrop-blur-sm pointer-events-none">
            <div className="flex whitespace-nowrap animate-marquee">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-8 text-2xl md:text-4xl font-extrabold text-neutral-200 uppercase tracking-widest px-4">
                  {chars.map((char, index) => (
                    <span
                      key={index}
                      className="inline-block transition-transform duration-200 hover:text-blue-500 hover:scale-125"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute bottom-6 left-0 right-0 w-full py-4 border-y border-neutral-200 bg-white/40 text-center text-neutral-400 text-sm tracking-widest uppercase">
            АБСОЛЮТНОЕ • ЦЕННОЕ • ЦИФРОВОЕ
          </div>
        )}
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="w-fit">
            <WaveRule className="mb-4" />
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
              ЧЕМ МЫ МОЖЕМ ПОМОЧЬ
            </h2>
          </div>
          <p className="text-neutral-500 max-w-md text-sm md:text-base">
            Полный спектр IT-услуг от разработки сайтов до сложного продвижения и создания умных Telegram-интерфейсов.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, idx) => (
            <Link key={s.id} href={`/uslugi#${s.id}`} className="group relative">
              <div
                className={`h-full border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-neutral-900 transition-all duration-300 group-hover:shadow-2xl ${s.border}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 rounded-full tracking-wider">
                      {s.badge}
                    </span>
                    <span className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-foreground group-hover:text-background flex items-center justify-center transition-all duration-300">
                      <ArrowUpRight className="w-5 h-5" />
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-4">
                    {s.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-8">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">Узнать подробнее</span>
                  <span className="text-sm font-bold text-foreground">от 25 000 ₽</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. WHY MAETTI */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="w-fit mb-6">
              <WaveRule className="mb-4" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                ПОЧЕМУ ВЫБИРАЮТ MAETTI
              </h2>
            </div>
            <p className="text-neutral-500 leading-relaxed mb-8">
              Мы ценим ваше время и ресурсы. Наша команда создает гибкие программные продукты, ориентируясь на конечные бизнес-показатели, а не только на красивый код.
            </p>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-extrabold text-foreground">98%</div>
              <div className="text-xs text-neutral-500 leading-tight">
                довольных клиентов<br />
                и повторных обращений
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-1 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-6"
                >
                  <div className="p-3.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{adv.title}</h3>
                    <p className="text-sm text-neutral-500">{adv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.5. РАБОЧИЙ СТОЛ — навигация ярлыками, шапка на нём прячется */}
      <WinDesktop />
    </div>
  );
}

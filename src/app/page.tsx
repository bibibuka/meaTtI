"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, CheckCircle2, ChevronRight, Send, Terminal, Sparkles, Layers, Cpu, Award } from "lucide-react";
import { useRouter } from "next/navigation";

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

const STAGES = [
  { number: "01", title: "Исследование", desc: "Анализируем бизнес-процессы, пишем ТЗ, утверждаем интерфейсы." },
  { number: "02", title: "Дизайн и Прототип", desc: "Создаем дизайн-систему, строим архитектуру, готовим мокапы." },
  { number: "03", title: "Разработка", desc: "Пишем чистый типизированный код, интегрируем базы данных." },
  { number: "04", title: "Тестирование и Запуск", desc: "Покрываем тестами, проверяем нагрузки, деплоим на надежные сервера." }
];

export default function HomePage() {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push("/spasibo");
  };

  // Split text for kinetic typography dance
  const word = "АБСОЛЮТНОЕ.ЦЕННОЕ.ЦИФРОВОЕ.";
  const chars = Array.from(word);

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden px-6 py-20 bg-neutral-950 text-white">
        {/* Colorful blob backgrounds */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-600/40 blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/30 blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto w-full z-10">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-8">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            <span>Digital Engineering Studio</span>
          </div>

          {/* Kinetic Offer */}
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-none mb-8 select-none">
            МЫ СТРОИМ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500">
              ЧИСТЫЙ КОД
            </span> <br />
            И СМЕЛЫЙ ДИЗАЙН.
          </h1>

          <p className="text-lg md:text-2xl text-neutral-400 max-w-2xl font-light mb-12">
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
              className="bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 font-bold px-8 py-4 rounded-full text-base transition-all duration-200 flex items-center gap-2"
            >
              <span>Наши услуги</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Endless scrolling kinetic typography */}
        {!shouldReduceMotion ? (
          <div className="absolute bottom-6 left-0 right-0 w-full overflow-hidden py-4 border-y border-white/5 select-none bg-black/40 backdrop-blur-sm pointer-events-none">
            <div className="flex whitespace-nowrap animate-marquee">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-8 text-2xl md:text-4xl font-extrabold text-neutral-800/80 uppercase tracking-widest px-4">
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
          <div className="absolute bottom-6 left-0 right-0 w-full py-4 border-y border-white/5 bg-black/40 text-center text-neutral-600 text-sm tracking-widest uppercase">
            АБСОЛЮТНОЕ • ЦЕННОЕ • ЦИФРОВОЕ
          </div>
        )}
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <section id="services" className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Услуги студии</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 text-foreground">
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
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Почему мы</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 mb-6 text-foreground">
              ПОЧЕМУ ВЫБИРАЮТ MAETTI
            </h2>
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

      {/* 4. WORK STAGES */}
      <section className="py-24 px-6 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Процесс</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-2 text-foreground">
            КАК МЫ РАБОТАЕМ
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STAGES.map((stage, idx) => (
            <div key={idx} className="relative group">
              <div className="absolute top-0 left-0 text-7xl font-black text-neutral-200/50 dark:text-neutral-800/30 group-hover:text-blue-600/20 transition-colors pointer-events-none">
                {stage.number}
              </div>
              <div className="relative pt-12">
                <h3 className="text-xl font-bold text-foreground mb-3">{stage.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. QUICK ACTION / FORM */}
      <section className="py-24 px-6 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
            ОБСУДИМ ВАШ ПРОЕКТ?
          </h2>
          <p className="text-lg md:text-xl font-medium mb-12 max-w-xl mx-auto opacity-80">
            Оставьте свои контакты, и мы свяжемся с вами в течение 30 минут, чтобы составить первичное техническое задание.
          </p>

          <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Ваше имя"
              required
              className="flex-1 bg-white border-2 border-transparent focus:border-black rounded-full px-6 py-4 text-black placeholder-neutral-500 outline-none font-semibold"
            />
            <input
              type="text"
              placeholder="Телефон или Telegram"
              required
              className="flex-1 bg-white border-2 border-transparent focus:border-black rounded-full px-6 py-4 text-black placeholder-neutral-500 outline-none font-semibold"
            />
            <button
              type="submit"
              className="bg-white hover:bg-neutral-100 text-blue-600 font-extrabold px-8 py-4 rounded-full transition-transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <span>Отправить</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          <p className="text-xs opacity-60 mt-6">
            Нажимая кнопку, вы соглашаетесь с нашей Политикой конфиденциальности.
          </p>
        </div>
      </section>
    </div>
  );
}

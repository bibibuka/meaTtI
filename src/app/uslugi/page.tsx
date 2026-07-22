"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Send, ArrowDown } from "lucide-react";

const SECTIONS = [
  {
    id: "sajty",
    num: "01",
    title: "Разработка Веб-Сайтов",
    subtitle: "Современные адаптивные интерфейсы с акцентом на скорость и конверсию.",
    bullets: [
      "Проектирование пользовательских сценариев (UX/UI)",
      "Адаптивная верстка (Mobile First, Retina Ready)",
      "Интеграция с системами управления контентом (headless CMS)",
      "Оптимизация производительности (Google Core Web Vitals)",
      "Техническая поддержка и SEO-подготовка при запуске"
    ],
    price: "от 75 000 ₽",
    time: "от 10 рабочих дней"
  },
  {
    id: "boty",
    num: "02",
    title: "Telegram-боты и Mini Apps",
    subtitle: "Автоматизация коммуникаций и полноценные приложения внутри мессенджера.",
    bullets: [
      "Разработка архитектуры базы данных и логики диалогов",
      "Интеграция искусственного интеллекта (OpenAI GPT, Claude)",
      "Создание интерактивных интерфейсов Telegram Mini Apps (React/HTML5)",
      "Административные панели для управления контентом и рассылками",
      "Системы приема платежей непосредственно внутри бота"
    ],
    price: "от 50 000 ₽",
    time: "от 7 рабочих дней"
  },
  {
    id: "makrosy",
    num: "03",
    title: "Макросы и Автоматизация",
    subtitle: "Освободите сотрудников от рутины с помощью умных скриптов.",
    bullets: [
      "Автоматизация расчетов и отчетов в MS Excel и Google Таблицах",
      "Разработка скриптов для парсинга и сбора данных из открытых источников",
      "Интеграция офисных документов с внешними API и CRM-системами",
      "Создание локальных утилит на Node.js / Python для обработки файлов",
      "Обучение персонала работе с разработанными инструментами"
    ],
    price: "от 25 000 ₽",
    time: "от 3 рабочих дней"
  },
  {
    id: "integracii",
    num: "04",
    title: "Интеграция Сервисов и API",
    subtitle: "Объединение разрозненных программных систем в единую экосистему.",
    bullets: [
      "Связывание CRM-систем (AmoCRM, Bitrix24) с внешними источниками",
      "Настройка сквозного обмена данными по протоколам REST/GraphQL/SOAP",
      "Автоматическая отправка уведомлений (SMS, Email, Telegram, WhatsApp)",
      "Интеграция эквайрингов (T-Bank, ЮKassa, Stripe, криптоплатежи)",
      "Разработка кастомных вебхуков для синхронизации баз данных"
    ],
    price: "от 40 000 ₽",
    time: "от 5 рабочих дней"
  },
  {
    id: "reklama",
    num: "05",
    title: "Реклама и Трафик",
    subtitle: "Привлечение целевой аудитории с измеримым возвратом инвестиций (ROI).",
    bullets: [
      "Анализ конкурентной среды и разработка рекламной стратегии",
      "Настройка контекстной рекламы в Яндекс.Директ и Google Ads",
      "Создание таргетированных кампаний в социальных сетях",
      "Проектирование и оптимизация конверсионных автоворонок",
      "Внедрение сквозной веб-аналитики (Roistat, Яндекс.Метрика)"
    ],
    price: "от 45 000 ₽ / мес.",
    time: "подготовка за 7 дней"
  },
  {
    id: "seo",
    num: "06",
    title: "SEO-оптимизация",
    subtitle: "Органический трафик из поисковых систем без постоянных затрат на клики.",
    bullets: [
      "Глубокий технический и юзабилити-аудит существующего сайта",
      "Сбор полного семантического ядра и проектирование структуры",
      "Оптимизация мета-тегов, текстов и внутренней перелинковки",
      "Повышение скорости загрузки и исправление ошибок верстки",
      "Работа со ссылочным профилем и поведенческими факторами"
    ],
    price: "от 35 000 ₽ / мес.",
    time: "первые результаты через 2 мес."
  }
];
export default function ServicesPage() {
  const shouldReduceMotion = useReducedMotion();

  const animationProps = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-10%" },
        transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
      };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Hero Intro */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Направления работы
          </span>
          <h1 className="text-4xl md:text-7xl font-light tracking-tight mt-4 mb-8">
            Наши Услуги
          </h1>
          <p className="text-lg md:text-xl text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Мы работаем в строгом минималистичном стиле планирования и проектирования. Ничего лишнего — только точные инженерные решения, решающие конкретные бизнес-задачи с прогнозируемым результатом.
          </p>
          <div className="mt-12 flex items-center gap-3 text-neutral-400 text-sm">
            <span>Прокрутите вниз или выберите услугу в меню</span>
            <ArrowDown className="w-4 h-4 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <div className="max-w-7xl mx-auto px-6">
        {SECTIONS.map((sec, idx) => (
          <section
            key={sec.id}
            id={sec.id}
            className="py-24 md:py-32 border-b border-neutral-200 dark:border-neutral-800 scroll-mt-24"
          >
            <motion.div {...animationProps} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Left Column: Number and Title */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <span className="text-sm font-mono text-neutral-400 block mb-6">
                    [{sec.num}]
                  </span>
                  <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-neutral-950 dark:text-white mb-6">
                    {sec.title}
                  </h2>
                  <p className="text-neutral-500 dark:text-neutral-400 text-base font-light leading-relaxed">
                    {sec.subtitle}
                  </p>
                </div>
                
                <div className="hidden lg:block mt-12">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Стоимость</div>
                  <div className="text-3xl font-light text-blue-600 dark:text-blue-400">{sec.price}</div>
                  <div className="text-xs text-neutral-400 mt-1">Срок исполнения: {sec.time}</div>
                </div>
              </div>

              {/* Right Column: Details list & Action */}
              <div className="lg:col-span-7 flex flex-col justify-between pl-0 lg:pl-12">
                <div>
                  <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-6">
                    Что входит в базовый пакет:
                  </h3>
                  <ul className="space-y-4">
                    {sec.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-4 text-sm md:text-base text-neutral-600 dark:text-neutral-300">
                        <Check className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mobile/Tablet Price block */}
                <div className="block lg:hidden mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-900">
                  <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">Стоимость</div>
                  <div className="text-2xl font-light text-blue-600 dark:text-blue-400">{sec.price}</div>
                  <div className="text-xs text-neutral-400 mt-1">Срок исполнения: {sec.time}</div>
                </div>

                {/* Action CTA */}
                <div className="mt-12 flex items-center">
                  <a
                    href="https://t.me/maetti_agency_stub"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold px-6 py-3.5 rounded-none hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300 shadow-sm"
                  >
                    <span>Обсудить в Telegram</span>
                    <Send className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          </section>
        ))}
      </div>
    </div>
  );
}

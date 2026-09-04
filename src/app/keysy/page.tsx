"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  Send,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
} from "lucide-react";
import WaveRule from "@/components/WaveRule";

export interface Case {
  id: string;
  num: string;
  groupId: "web" | "bots" | "automation";
  groupTitle: string;
  title: string;
  category: string;
  short: string;
  note?: string;
  challenge: string;
  solution: string;
  results: { metric: string; label: string }[];
  domain?: string;
  url?: string;
  gallery: {
    url: string;
    title: string;
    desc: string;
  }[];
}

export interface CaseGroup {
  id: "web" | "bots" | "automation";
  num: string;
  roman: string;
  title: string;
  subtitle: string;
  caseIndices: number[];
}

const GROUPS: CaseGroup[] = [
  {
    id: "web",
    num: "01",
    roman: "I",
    title: "Веб-разработка",
    subtitle: "Сайты, порталы и CMS",
    caseIndices: [0, 1, 2, 3],
  },
  {
    id: "bots",
    num: "02",
    roman: "II",
    title: "Чат-боты и ИИ",
    subtitle: "Telegram, MAX, VK и CRM",
    caseIndices: [4, 5],
  },
  {
    id: "automation",
    num: "03",
    roman: "III",
    title: "Автоматизация и парсинг",
    subtitle: "Скрипты, API и данные",
    caseIndices: [6],
  },
];

const CASES: Case[] = [
  {
    id: "academie",
    num: "01",
    groupId: "web",
    groupTitle: "Веб-разработка",
    title: "Премиальная вокальная академия «Académie des Talents» (Швейцария)",
    category: "Веб-разработка & Мультиязычность",
    short: "Académie des Talents",
    note: "Швейцария • DE / EN / RU",
    challenge:
      "Заказчику требовался презентационный и конверсионный веб-сервис для академии постановки голоса топ-менеджеров и взрослых в Шаффхаузене с записью на персональную диагностику и высоким уровнем доверия европейских клиентов.",
    solution:
      "Разработали премиальный мультиязычный сайт (немецкий, английский, русский), внедрили микроразметку Schema.org (LocalBusiness / MusicSchool), форму записи на индивидуальную диагностику и добились 100/100 по Core Web Vitals.",
    results: [
      { metric: "3 языка", label: "Локализация (DE / EN / RU)" },
      { metric: "100/100", label: "Скорость и SEO-структура" },
      { metric: "CHF 190+", label: "Средний чек первого визита" },
    ],
    domain: "academie-des-talents.com",
    url: "https://academie-des-talents.com/",
    gallery: [
      {
        url: "/cases/academie_full.webp",
        title: "Главный экран и позиционирование в Швейцарии",
        desc: "Утонченная эстетика, микроразметка Schema.org и адаптивность под любые устройства.",
      },
      {
        url: "/cases/academie.webp",
        title: "Брендинг и визуальная идентификация",
        desc: "Премиальное позиционирование услуг вокального коучинга для руководителей.",
      },
      {
        url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=960&q=60",
        title: "Акустическое пространство и форматы занятий",
        desc: "Презентация студии, методологии и индивидуальных программ обучения.",
      },
      {
        url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=960&q=60",
        title: "Executive Voice Coaching для топ-менеджеров",
        desc: "Целевые сценарии для бизнес-аудитории и онлайн-запись на персональную диагностику.",
      },
    ],
  },
  {
    id: "alina",
    num: "02",
    groupId: "web",
    groupTitle: "Веб-разработка",
    title: "Личный бренд и портфолио оперной певицы «Alina Zamalieva»",
    category: "Веб-разработка & Личный бренд",
    short: "Alina Zamalieva",
    note: "Культура & Арт",
    challenge:
      "Создать имиджевый ресурс мирового уровня для оперной певицы (сопрано) для презентации репертуара европейским театрам, агентам, организаторам фестивалей и прессе.",
    solution:
      "Спроектировали дизайн в эстетике высокого искусства с академической типографикой (Cormorant Garamond + Montserrat), интерактивной афишей концертов, быстрой медиатекой аудио/видео фрагментов и версткой под Retina-экраны.",
    results: [
      { metric: "3 страны", label: "Охват (CH, DE, RU)" },
      { metric: "< 1.0 сек", label: "Загрузка медиатеки" },
      { metric: "100%", label: "Презентация для агентов" },
    ],
    domain: "alinazamalieva.com",
    url: "https://www.alinazamalieva.com/",
    gallery: [
      {
        url: "/cases/alina_full.webp",
        title: "Главный экран и портфолио оперной певицы",
        desc: "Типографика Cormorant Garamond, медиатека выступлений и афиша концертов.",
      },
      {
        url: "https://www.alinazamalieva.com/images/hero-bg.jpg",
        title: "Сценический образ и биография",
        desc: "Презентация репертуара для оперных театров и европейских агентов.",
      },
      {
        url: "https://www.alinazamalieva.com/images/JPF3303.jpg",
        title: "Репертуарная карта и медиа-материалы",
        desc: "Фрагменты оперных партий, аудиозаписи и рецензии музыкальных критиков.",
      },
      {
        url: "https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=960&q=60",
        title: "Международная концертная деятельность",
        desc: "Организация графиков выступлений и прямая связь с продюсерами.",
      },
    ],
  },
  {
    id: "rahim",
    num: "03",
    groupId: "web",
    groupTitle: "Веб-разработка",
    title: "Онлайн-галерея и арт-каталог художника «Rahim El»",
    category: "Веб-разработка & WordPress CMS",
    short: "Rahim El",
    note: "WordPress CMS • Испания",
    challenge:
      "Художнику в Испании требовался персональный каталог выставок и картин, которым он может полностью управлять сам без знания кода: создавать серии полотен, загружать фото в 4K и обновлять статус доступности.",
    solution:
      "Разработали сайт на базе WordPress CMS с кастомной темой (artist-portfolio), настроили кастомные типы записей и полей для картин, внедрили оптимизацию тяжелых изображений без потери резкости мазков и удобную админ-панель.",
    results: [
      { metric: "0 ₽", label: "Затрат на контент-менеджеров" },
      { metric: "4K / Retina", label: "Качество отображения картин" },
      { metric: "100%", label: "Автономное управление в CMS" },
    ],
    domain: "rahimel.com/artworks/",
    url: "https://rahimel.com/artworks/",
    gallery: [
      {
        url: "/cases/rahim_full.webp",
        title: "Каталог произведений современного искусства",
        desc: "Кастомная тема WordPress с адаптивной сеткой картин и быстрым предпросмотром.",
      },
      {
        url: "https://rahimel.com/wp-content/uploads/2026/07/IMG_4852-1916x2000.jpeg",
        title: "Оригинальное полотно в высоком разрешении",
        desc: "Сохранение текстуры мазков и точной цветопередачи на экранах Retina.",
      },
      {
        url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=960&q=60",
        title: "Выставочные пространства и кураторские серии",
        desc: "Структурирование работ по периодам, выставкам и коллекциям.",
      },
      {
        url: "https://images.unsplash.com/photo-1582561424760-0321d75e81fa?auto=format&fit=crop&w=960&q=60",
        title: "Админ-панель управления экспонатами",
        desc: "Добавление картин, габаритов, техники и статуса продажи без участия программистов.",
      },
    ],
  },
  {
    id: "barori",
    num: "04",
    groupId: "web",
    groupTitle: "Веб-разработка",
    title: "Федеральный сервис подключения водителей «Барори Парк»",
    category: "Веб-сервисы & Интеграции",
    short: "Барори Парк",
    note: "152-ФЗ • Bitrix • TG-бот",
    challenge:
      "Обеспечить высокий поток регистраций водителей и курьеров (Яндекс Такси, Яндекс Смена, Купер) с жестким соблюдением 152-ФЗ, отсевом спам-ботов и мгновенной передачей лидов диспетчерам таксопарка.",
    solution:
      "Спроектировали конверсионный веб-сервис с локализацией шрифтов (исключена трансграничная передача IP), отдельным получением согласий на ПДн, защитой Yandex SmartCaptcha и интеграцией с ботом @BaroriPark_Bot и Bitrix.",
    results: [
      { metric: "152-ФЗ", label: "Полный юридический комплаенс" },
      { metric: "24/7", label: "Автоматический прием заявок" },
      { metric: "+52%", label: "Конверсия в регистрацию водителя" },
    ],
    domain: "baroripark.ru",
    url: "https://baroripark.ru/",
    gallery: [
      {
        url: "/cases/baroripark.webp",
        title: "Главный экран и калькулятор заработка",
        desc: "Быстрое подключение к Яндекс Такси, Яндекс Смене и доставке по РФ.",
      },
      {
        url: "https://baroripark.ru/bitrix/templates/barorikorNEW/img/IMG_4314.jfif.jpeg",
        title: "Условия парка и прозрачные выплаты",
        desc: "Блок доверия с лицензиями, условиями и поддержкой водителей.",
      },
      {
        url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=960&q=60",
        title: "Мультисервисная интеграция (Такси, Доставка, Купер)",
        desc: "Маршрутизация заявок исполнителей по направлениям работы.",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=60",
        title: "Модуль комплаенса 152-ФЗ и SmartCaptcha",
        desc: "Хранение данных в РФ, защита от спам-атак и мгновенная отправка в CRM.",
      },
    ],
  },
  {
    id: "hr-bot",
    num: "05",
    groupId: "bots",
    groupTitle: "Чат-боты и ИИ",
    title: "AI-бот рекрутинга полного цикла в Telegram «под ключ»",
    category: "Telegram-боты & ИИ",
    short: "AI-Рекрутер",
    note: "OpenAI • STT • Bitrix24",
    challenge:
      "Рекрутеры тратили до 70% рабочего времени на первичную переписку, прослушивание десятков голосовых сообщений соискателей, скрининг анкет и ручное согласование свободного времени первого интервью.",
    solution:
      "Разработали автономный Python-бот на OpenAI API с Function Calling: он распознает речь из голосовых (STT), оценивает навыки кандидата по критериям вакансий, бронирует непересекающиеся слоты интервью и синхронизирует всё с Google Таблицами и Bitrix24.",
    results: [
      { metric: "-80%", label: "Времени HR на первый скрининг" },
      { metric: "< 3 сек", label: "Ответ на вопрос или голосовое" },
      { metric: "0 накладок", label: "Бронирование слотов собеседований" },
    ],
    domain: "t.me/hr_recruiter_bot",
    url: "https://t.me/maetti_agency_stub",
    gallery: [
      {
        url: "/cases/hr_recruiter_bot.webp",
        title: "Дашборд скоринга кандидатов и чат с ИИ",
        desc: "Распознавание голосовых сообщений (STT), оценка компетенций и календарь слотов.",
      },
      {
        url: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=960&q=60",
        title: "Квалификационный скрининг соискателей",
        desc: "Адаптивные системные промпты под каждую вакансию и отработка возражений.",
      },
      {
        url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=960&q=60",
        title: "Модуль бронирования слотов интервью",
        desc: "Исключение овербукинга с синхронизацией календаря рекрутеров.",
      },
      {
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=960&q=60",
        title: "Двусторонняя интеграция с Bitrix24 и Google Sheets",
        desc: "Автоматический импорт вакансий и фиксация анкет кандидатов в реальном времени.",
      },
    ],
  },
  {
    id: "omnichannel",
    num: "06",
    groupId: "bots",
    groupTitle: "Чат-боты и ИИ",
    title: "Омниканальный бот клиентской поддержки «MAX + VK + TG»",
    category: "Мессенджеры & amoCRM",
    short: "Helpdesk CRM",
    note: "MAX • VK • TG • amoCRM",
    challenge:
      "Поступающие сообщения из мессенджера MAX, ВКонтакте и Telegram обрабатывались вручную в разных окнах, что приводило к задержкам ответа до 20 минут, потере контекста переписки и выгоранию службы поддержки.",
    solution:
      "Создали единый шлюз омниканальной коммуникации (аналог Mao Bot): боты ведут первичный диалог и консультацию во всех 3 каналах, а при сложных вопросах бесшовно передают диалог оператору, работающему из «одного окна» amoCRM.",
    results: [
      { metric: "1 окно", label: "Для всех обращений в amoCRM" },
      { metric: "3 канала", label: "MAX, ВКонтакте и Telegram" },
      { metric: "x3.5", label: "Скорость обработки обращений" },
    ],
    domain: "amo.maetti.agency",
    url: "https://t.me/maetti_agency_stub",
    gallery: [
      {
        url: "/cases/omnichannel_bot.webp",
        title: "Единое окно оператора amoCRM (MAX + VK + Telegram)",
        desc: "Объединение всех каналов связи, автоответы ИИ и бесшовный перевод на оператора.",
      },
      {
        url: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=960&q=60",
        title: "Быстрый перехват диалога оператором",
        desc: "Сотрудник видит всю историю диалога с ботом и отвечает прямо из сделки CRM.",
      },
      {
        url: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=960&q=60",
        title: "Автосоздание карточки клиента и тегирование",
        desc: "Квалификация лида, определение источника рекламы и сохранение контактов.",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=60",
        title: "Аналитика времени ответа и качества консультаций",
        desc: "Контроль нагрузки на операторов и метрик первого ответа (FRT).",
      },
    ],
  },
  {
    id: "parsinghh",
    num: "07",
    groupId: "automation",
    groupTitle: "Автоматизация и парсинг",
    title: "Агрегатор вакансий и прямых контактов «ParsingHH & SuperJob»",
    category: "Парсинг & Автоматизация данных",
    short: "ParsingHH",
    note: "Парсер данных • Python",
    challenge:
      "Рекрутинговым агентствам требовалось ежедневно собирать свежие базы вакансий с прямыми контактами нанимателей. При этом ручной поиск отнимал десятки часов, а HH закрыл открытый API номеров телефонов соискателям.",
    solution:
      "Разработали специализированный сервис парсинга с гибкой фильтрацией (города, вилки зарплат, минус-слова). Адаптировали логику: прямой сбор номеров телефонов переведен на SuperJob, а с HH выгружаются доступные метаданные с мгновенным экспортом в Excel.",
    results: [
      { metric: "10x", label: "Ускорение сбора базы контактов" },
      { metric: "1 клик", label: "Экспорт в Excel и CSV" },
      { metric: "100%", label: "Работоспособность с SuperJob" },
    ],
    domain: "parsinghh.ru",
    url: "https://parsinghh.ru/",
    gallery: [
      {
        url: "/cases/parsinghh.webp",
        title: "Интерфейс фильтрации, стоп-слов и выбора площадок",
        desc: "Управление источниками (HH.ru / SuperJob), городами и исключениями нерелевантных фраз.",
      },
      {
        url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=960&q=60",
        title: "Выгрузка прямых телефонных номеров с SuperJob",
        desc: "Автоматизированное извлечение контактов нанимателей без ручного кликанья.",
      },
      {
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=960&q=60",
        title: "Экспорт и структурирование данных в Excel/CSV",
        desc: "Формирование готовых списков для холодного и теплого рекрутинга.",
      },
      {
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=960&q=60",
        title: "Отказоустойчивая архитектура парсинга",
        desc: "Обход защит, ротация прокси и гибкая реакция на изменение алгоритмов агрегаторов.",
      },
    ],
  },
];

/* 1 тик колеса ≈ 100px. Длина скролла увеличена в 1.3 раза (6.5 тиков = 650px на кейс), потом открепление. */
const TICK_PX = 100;
const TICKS_PER_SLIDE = 6.5;
const SLIDE_PX = Math.round(TICK_PX * TICKS_PER_SLIDE);
const PIN_EXTRA_PX = SLIDE_PX * CASES.length;

/* Кэш метрик пина: getComputedStyle на каждый scroll-кадр форсит рефлоу. */
const pinMetricsCache = new WeakMap<
  HTMLElement,
  { top: number; extra: number }
>();

function pinProgressPx(track: HTMLElement): number {
  let m = pinMetricsCache.get(track);
  if (!m) {
    const sticky = track.firstElementChild as HTMLElement | null;
    const top = sticky ? parseFloat(getComputedStyle(sticky).top) || 0 : 0;
    const extra = sticky
      ? Math.max(0, track.offsetHeight - sticky.offsetHeight)
      : 0;
    m = { top, extra };
    pinMetricsCache.set(track, m);
  }
  if (m.extra === 0 || track.offsetHeight === 0) return 0;
  const scrolled = m.top - track.getBoundingClientRect().top;
  return Math.min(m.extra, Math.max(0, scrolled));
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
  eager,
}: {
  c: Case;
  onOpenGallery: (c: Case, photoIndex?: number) => void;
  eager?: boolean;
}) {
  const mainPhoto = c.gallery[0];

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm flex flex-col justify-between px-6 sm:px-8 py-5 sm:py-6 transition-all duration-300 hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5">
      {/* 1. Header */}
      <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
        <span className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider block mb-1.5">
          {c.category}
        </span>
        <h2 className="text-xl sm:text-2xl font-normal tracking-tight text-neutral-950 dark:text-white leading-snug">
          {c.title}
        </h2>
      </div>

      {/* 2. 4 Прямоугольника (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 my-auto items-start">
        {/* Левый верхний: ФОТО 16:9 */}
        <div className="flex flex-col justify-center">
          <div
            onClick={() => onOpenGallery(c, 0)}
            className="w-full relative aspect-[16/9] rounded-xl overflow-hidden bg-neutral-900 group cursor-pointer border border-neutral-200/80 dark:border-neutral-800 shadow-sm"
          >
            <img
              src={mainPhoto.url}
              alt={c.title}
              loading={eager ? "eager" : "lazy"}
              fetchPriority={eager ? "high" : "auto"}
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105 opacity-95 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

            <div className="absolute bottom-2.5 right-3 flex items-center text-neutral-200">
              <span className="bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-xs flex items-center gap-1.5 border border-white/10">
                <Images className="w-3.5 h-3.5 text-blue-400" />
                <span>Галерея ({c.gallery.length})</span>
              </span>
            </div>
          </div>
        </div>

        {/* Правый верхний: ТЕКСТ (Метрики просто текстом без плашки) */}
        <div className="h-full flex flex-col justify-center self-center py-2">
          <div className="grid grid-cols-3 gap-3 sm:gap-4 text-left">
            {c.results.map((res, rIdx) => (
              <div key={rIdx} className="flex flex-col">
                <div className="text-2xl sm:text-3xl font-light text-blue-600 dark:text-blue-400 tracking-tight">
                  {res.metric}
                </div>
                <div className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1 leading-snug">
                  {res.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Левый нижний: ТЕКСТ (Задача) */}
        <div className="flex flex-col justify-start">
          <h3 className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Задача
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
            {c.challenge}
          </p>
        </div>

        {/* Правый нижний: ТЕКСТ (Решение) */}
        <div className="flex flex-col justify-start">
          <h3 className="text-xs font-mono text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
            Решение
          </h3>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
            {c.solution}
          </p>
        </div>
      </div>

      {/* 3. CTA Footer */}
      <div className="mt-5 pt-3.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-xs text-neutral-400 block">Похожая задача?</span>
          <span className="text-sm sm:text-base font-medium text-neutral-800 dark:text-neutral-200">
            Подберем решение за 30 минут
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {c.url && (
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 px-3.5 py-2.5 rounded-lg hover:border-neutral-400 dark:hover:border-neutral-500 text-xs sm:text-sm font-medium transition-colors"
            >
              <span>На сайт</span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          )}
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
    </div>
  );
}

export default function CasesPage() {
  const [active, setActive] = useState(0);
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
    setPhotoIndex(
      (prev) => (prev - 1 + galleryCase.gallery.length) % galleryCase.gallery.length
    );
  };

  // Предзагрузка соседних фото галереи, чтобы листалось без задержек
  useEffect(() => {
    if (!galleryCase) return;
    const n = galleryCase.gallery.length;
    [(photoIndex + 1) % n, (photoIndex - 1 + n) % n].forEach((i) => {
      const im = new Image();
      im.src = galleryCase.gallery[i].url;
    });
  }, [galleryCase, photoIndex]);

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

  const activeCase = CASES[active] || CASES[0];
  const activeGroup =
    GROUPS.find((g) => g.caseIndices.includes(active)) || GROUPS[0];

  useEffect(() => {
    const track = desktopTrackRef.current;
    if (!track) return;
    let ticking = false;

    // rAF-throttle: scroll фаерит десятки раз за кадр, setState нужен 1 раз.
    const sync = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (ignoreScrollRef.current || track.offsetHeight === 0) return;
        const nextIdx = slideIndexFromProgress(pinProgressPx(track));
        if (nextIdx !== prevActiveRef.current) {
          prevActiveRef.current = nextIdx;
          setActive(nextIdx);
        }
      });
    };
    const onResize = () => {
      pinMetricsCache.delete(track);
      sync();
    };

    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", onResize);
    sync();
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", onResize);
      clickGenRef.current += 1;
      ignoreScrollRef.current = false;
      window.clearTimeout(unlockTimerRef.current);
    };
  }, []);

  const handleDesktopClick = (targetIndex: number) => {
    const track = desktopTrackRef.current;
    if (!track) return;

    if (targetIndex !== active) {
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

  const handleGroupClick = (group: CaseGroup) => {
    const targetCaseIdx = group.caseIndices[0];
    handleDesktopClick(targetCaseIdx);
  };


  // Mobile rail swipe sync (rAF-throttle, setState только при смене слайда)
  const railTickRef = useRef(false);
  const syncFromRail = () => {
    if (railTickRef.current) return;
    railTickRef.current = true;
    requestAnimationFrame(() => {
      railTickRef.current = false;
      const el = railRef.current;
      if (!el) return;
      const step = (el.scrollWidth - el.clientWidth) / (CASES.length - 1);
      if (step <= 0) return;
      const next = Math.min(
        CASES.length - 1,
        Math.round(el.scrollLeft / step)
      );
      if (next !== prevActiveRef.current) {
        prevActiveRef.current = next;
        setActive(next);
      }
    });
  };

  const prevGroupRef = useRef(activeGroup.id);
  useEffect(() => {
    // Чипы мотаем только при смене группы, иначе петля scroll→setState→scroll
    if (prevGroupRef.current === activeGroup.id) return;
    prevGroupRef.current = activeGroup.id;
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const activeGroupIndex = GROUPS.findIndex((g) => g.id === activeGroup.id);
    if (activeGroupIndex >= 0) {
      chipsRef.current?.children[activeGroupIndex]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeGroup]);

  const goToMobile = (i: number) => {
    prevActiveRef.current = i;
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
        <section className="relative z-10 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
            <div className="max-w-3xl">
              <div className="w-fit mb-4">
                <WaveRule className="mb-4" />
                <h1 className="text-3xl md:text-5xl font-light tracking-tight">
                  Наши Кейсы
                </h1>
              </div>
              <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                Листайте страницу вниз для последовательного просмотра проектов по направлениям (Веб, Чат-боты и Автоматизация), задач, технических решений и измеримых результатов.
              </p>
            </div>
          </div>
        </section>

        {/* ===== Desktop: Pinned Scroll Track ===== */}
        <div
          ref={desktopTrackRef}
          className="hidden lg:block relative z-0"
          style={{ height: `calc(100vh - 5rem + ${PIN_EXTRA_PX}px)` }}
        >
          <div className="sticky top-4 h-[calc(100vh-2rem)] flex items-start pt-4">
            <div className="max-w-7xl w-full mx-auto px-6">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Навигация слева: 3 плашки-группы */}
                <div className="col-span-4 min-w-0 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-1">
                    <span>НАПРАВЛЕНИЯ & КЕЙСЫ</span>
                    <span className="tabular-nums text-blue-600 dark:text-blue-400 font-semibold">
                      [{String(active + 1).padStart(2, "0")}/{String(CASES.length).padStart(2, "0")}]
                    </span>
                  </div>

                  {/* Индикатор общего прогресса */}
                  <div className="h-1 bg-neutral-200 dark:bg-neutral-800 mb-4 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-[width] duration-300 ease-out"
                      style={{ width: `${((active + 1) / CASES.length) * 100}%` }}
                    />
                  </div>

                  {GROUPS.map((g) => {
                    const isGroupActive = g.id === activeGroup.id;
                    const groupActiveSubIndex = g.caseIndices.indexOf(active);

                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => handleGroupClick(g)}
                        className={`w-full text-left p-4 transition-all duration-300 border flex flex-col justify-between group relative rounded-xl cursor-pointer ${
                          isGroupActive
                            ? "bg-white dark:bg-neutral-900 border-blue-600 dark:border-blue-500 shadow-md translate-x-1"
                            : "bg-transparent border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        {isGroupActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 dark:bg-blue-400 rounded-l-xl" />
                        )}

                        <div className="flex items-start justify-between gap-3 w-full">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-xs font-mono shrink-0 ${
                                isGroupActive
                                  ? "text-blue-600 dark:text-blue-400 font-bold"
                                  : "text-neutral-400"
                              }`}
                            >
                              [{g.num}]
                            </span>
                            <div>
                              <h3
                                className={`text-sm font-medium leading-snug ${
                                  isGroupActive
                                    ? "text-neutral-950 dark:text-white font-semibold"
                                    : "text-neutral-700 dark:text-neutral-300"
                                }`}
                              >
                                {g.title}
                              </h3>
                              <span className="text-[11px] text-neutral-400 font-mono block mt-0.5">
                                {g.subtitle} • {g.caseIndices.length}{" "}
                                {g.caseIndices.length === 1
                                  ? "проект"
                                  : g.caseIndices.length < 5
                                  ? "проекта"
                                  : "проектов"}
                              </span>
                            </div>
                          </div>
                          <ArrowRight
                            className={`w-4 h-4 shrink-0 mt-0.5 transition-transform ${
                              isGroupActive
                                ? "text-blue-600 dark:text-blue-400 translate-x-1"
                                : "text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400"
                            }`}
                          />
                        </div>

                        {/* Индикатор текущего проекта внутри активной группы */}
                        {isGroupActive && (
                          <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 w-full">
                            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400 mb-1.5">
                              <span>
                                Проект {groupActiveSubIndex + 1} из {g.caseIndices.length}
                              </span>
                              <span className="text-neutral-700 dark:text-neutral-200 font-medium truncate max-w-[140px]">
                                {activeCase.short}
                              </span>
                            </div>
                            <div
                              className="grid gap-1.5 w-full"
                              style={{
                                gridTemplateColumns: `repeat(${g.caseIndices.length}, minmax(0, 1fr))`,
                              }}
                            >
                              {g.caseIndices.map((idx) => {
                                const isCur = idx === active;
                                const isPast = idx < active;
                                return (
                                  <div
                                    key={idx}
                                    className={`h-1 rounded-full transition-all duration-300 ${
                                      isCur
                                        ? "bg-blue-600 dark:bg-blue-400"
                                        : isPast
                                        ? "bg-blue-300 dark:bg-blue-900"
                                        : "bg-neutral-200 dark:bg-neutral-800"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Детали карточки справа */}
                <div className="col-span-8 min-w-0">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeCase.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                    >
                      <CaseDetail
                        c={activeCase}
                        onOpenGallery={handleOpenGallery}
                        eager
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Mobile: липкая лента групп + свайп-карусель всех кейсов ===== */}
        <div className="lg:hidden">
          {/* Липкая шапка навигации с группами */}
          <div className="sticky top-24 z-30 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3 px-6 pt-3 pb-2.5">
              <div
                ref={chipsRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1"
              >
                {GROUPS.map((g) => {
                  const isGroupActive = g.id === activeGroup.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => goToMobile(g.caseIndices[0])}
                      className={`shrink-0 flex items-center gap-2 px-3 py-1.5 border text-xs transition-colors duration-300 rounded-md ${
                        isGroupActive
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white font-medium"
                          : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400"
                      }`}
                    >
                      <span className="font-mono opacity-60">[{g.num}]</span>
                      <span className="whitespace-nowrap">{g.title}</span>
                      <span className="text-[10px] opacity-70 font-mono">
                        ({g.caseIndices.length})
                      </span>
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
              <div
                className="h-px bg-blue-600 dark:bg-blue-400 transition-[width] duration-300 ease-out"
                style={{ width: `${((active + 1) / CASES.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Карусель: нативный scroll-snap со всеми 7 кейсами */}
          <div
            ref={railRef}
            onScroll={syncFromRail}
            className="flex items-stretch gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-6 py-8"
          >
            {CASES.map((c, idx) => (
              <div
                key={c.id}
                className="snap-center shrink-0 w-[calc(100vw-4.5rem)] max-w-lg [content-visibility:auto] [contain-intrinsic-size:auto_640px]"
              >
                <CaseDetail
                  c={c}
                  onOpenGallery={handleOpenGallery}
                  eager={idx === 0}
                />
              </div>
            ))}
          </div>

          <p className="px-6 pb-12 md:pb-16 text-xs font-mono text-neutral-400 flex items-center gap-2">
            <ArrowRight className="w-3.5 h-3.5" />
            Листайте вбок для перехода между всеми проектами
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
                    type="button"
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
                  type="button"
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
                      decoding="async"
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
                  type="button"
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
                      type="button"
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
                        loading="lazy"
                        decoding="async"
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

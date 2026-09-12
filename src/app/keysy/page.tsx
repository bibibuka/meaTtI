"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Send,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Images,
} from "lucide-react";
import WaveRule from "@/components/WaveRule";
import { haptic } from "@/utils/haptics";

export interface Case {
  id: string;
  num: string;
  groupId: "web" | "bots" | "automation" | "software";
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
    title?: string;
    desc?: string;
  }[];
}

export interface CaseGroup {
  id: "web" | "bots" | "automation" | "software";
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
  {
    id: "software",
    num: "04",
    roman: "IV",
    title: "Игры, софт и SaaS",
    subtitle: "Лаунчеры, десктоп и клиенты",
    caseIndices: [7, 8],
  },
];

const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

const CASES: Case[] = [
  {
    id: "barori",
    num: "01",
    groupId: "web",
    groupTitle: "Веб-разработка",
    title: "Федеральный сервис подключения водителей «Барори Парк»",
    category: "Веб-сервисы & Интеграции",
    short: "Барори Парк",
    note: "152-ФЗ • amoCRM • TG-бот",
    challenge:
      "Обеспечить высокий поток регистраций водителей и курьеров (Яндекс Такси, Яндекс Смена, Купер) с жестким соблюдением 152-ФЗ, отсевом спам-ботов и мгновенной передачей лидов диспетчерам таксопарка.",
    solution:
      "Спроектировали конверсионный веб-сервис с локализацией шрифтов (исключена трансграничная передача IP), отдельным получением согласий на ПДн, защитой Yandex SmartCaptcha и интеграцией с ботом @BaroriPark_Bot и amoCRM.",
    results: [
      { metric: "152-ФЗ", label: "Без штрафов" },
      { metric: "24/7", label: "Заявки даже ночью" },
      { metric: "+52%", label: "Больше водителей" },
    ],
    domain: "baroripark.ru",
    url: "https://baroripark.ru/",
    gallery: [
      { url: "/cases/barori/1.webp" },
      { url: "/cases/barori/2.webp" },
      { url: "/cases/barori/3.webp" },
      { url: "/cases/barori/4.webp" },
    ],
  },
  {
    id: "academie",
    num: "02",
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
      { metric: "24/7", label: "Запись с сайта" },
      { metric: "1 клик", label: "До формы диагностики" },
      { metric: "0", label: "Пропущенных заявок" },
    ],
    domain: "academie-des-talents.com",
    url: "https://academie-des-talents.com/",
    gallery: [
      { url: "/cases/academie/1.webp" },
      { url: "/cases/academie/2.webp" },
      { url: "/cases/academie/3.webp" },
      { url: "/cases/academie/4.webp" },
    ],
  },
  {
    id: "alina",
    num: "03",
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
      { metric: "1 стр.", label: "Вся карьера и репертуар" },
      { metric: "100%", label: "Афиша всегда актуальна" },
      { metric: "1 место", label: "В поиске" },
    ],
    domain: "alinazamalieva.com",
    url: "https://www.alinazamalieva.com/",
    gallery: [
      { url: "/cases/alina/1.webp" },
      { url: "/cases/alina/2.webp" },
      { url: "/cases/alina/3.webp" },
      { url: "/cases/alina/4.webp" },
    ],
  },
  {
    id: "rahim",
    num: "04",
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
      { metric: "2 шага", label: "Новая картина на сайте" },
      { metric: "100%", label: "Управляет сам" },
      { metric: "0", label: "Ожидания публикации" },
    ],
    domain: "rahimel.com/artworks/",
    url: "https://rahimel.com/artworks/",
    gallery: [
      { url: "/cases/rahim/1.webp" },
      { url: "/cases/rahim/2.webp" },
      { url: "/cases/rahim/3.webp" },
      { url: "/cases/rahim/4.webp" },
    ],
  },
  {
    id: "omnichannel",
    num: "05",
    groupId: "bots",
    groupTitle: "Чат-боты и ИИ",
    title: "Омниканальный бот клиентской поддержки «MAX + VK + TG»",
    category: "Мессенджеры & amoCRM",
    short: "Helpdesk CRM",
    note: "MAX • VK • TG • amoCRM",
    challenge:
      "Поступающие сообщения из мессенджера MAX, ВКонтакте и Telegram обрабатывались вручную в разных окнах, что приводило к задержкам ответа до 20 минут, потере контекста переписки и выгоранию службы поддержки.",
    solution:
      "Создали единый шлюз омниканальной коммуникации (аналог Mao Bot): боты ведут первичный диалог и консультацию во всех 3 каналах, а при сложных вопросах бесшовно передают диалог оператору, работающему из «одного окна» нашего софта (можно подключить в amoCRM).",
    results: [
      { metric: "1 окно", label: "Все чаты в amoCRM" },
      { metric: "3 в 1", label: "MAX, VK и Telegram" },
      { metric: "x3.5", label: "Быстрее ответов" },
    ],
    domain: "my.etag.store/baroripark",
    url: "https://my.etag.store/baroripark",
    gallery: [
      { url: "/cases/omnichannel/1.webp" },
    ],
  },
  {
    id: "hr-bot",
    num: "06",
    groupId: "bots",
    groupTitle: "Чат-боты и ИИ",
    title: "AI-бот рекрутинга полного цикла в Telegram «под ключ»",
    category: "Telegram-боты & ИИ",
    short: "AI-Рекрутер",
    note: "GLM • Telegram • Google Sheets • CRM",
    challenge:
      "Требовалось автоматизировать привлечение соискателей через регулярную рассылку вакансий по профильным чатам, а также избавить рекрутеров от ручного первичного отсева, подбора позиций под каждого кандидата, долгого анкетирования и переноса данных в таблицы и CRM.",
    solution:
      "Разработали интеллектуального Telegram-бота на базе LLM-модели GLM: бот автоматически рассылает актуальные вакансии по чатам, в живом диалоге общается с кандидатами, подбирает вакансию, проводит анкетирование и мгновенно отправляет результаты менеджеру в Telegram, Google Таблицы и CRM.",
    results: [
      { metric: "11 ₽", label: "За одного кандидата" },
      { metric: "-80%", label: "Меньше рутины HR" },
      { metric: "-20%", label: "Ушедших лидов" },
    ],
    domain: "t.me/Violetta_Arbusova",
    url: "https://t.me/Violetta_Arbusova",
    gallery: [
      { url: "/cases/hr-bot/1.webp" },
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
      { metric: "10x", label: "Скорость подбора" },
      { metric: "1 клик", label: "Выгрузка в Excel" },
      { metric: "100%", label: "Контроля выдачи" },
    ],
    domain: "parsinghh.ru",
    gallery: [
      { url: "/cases/parsinghh/1.webp" },
      { url: "/cases/parsinghh/2.webp" },
    ],
  },
  {
    id: "lunate",
    num: "08",
    groupId: "software",
    groupTitle: "Игры, софт и SaaS",
    title: "Игровой комплекс и лаунчер техномагического сервера «Lunate»",
    category: "Fullstack, Desktop & GameDev",
    short: "Lunate Server",
    note: "Minecraft 1.20.1 • Web & Desktop",
    challenge:
      "Техномагический сервер объединяет сложную индустриальную автоматизацию и магию. Требовалось исключить ручную установку игроками десятков модов, Java и конфигов, обеспечив вход на сервер за пару кликов как на мощных, так и на слабых ПК.",
    solution:
      "Создали комплексную экосистему: веб-портал с интерактивным лором, фазами луны и вики (lunate.lol), а также кастомный десктоп-лаунчер на Electron с фоновой синхронизацией модов, проверкой файлов и профилями сборок MAX/LITE.",
    results: [
      { metric: "2 клика", label: "Открыл и играешь" },
      { metric: "MAX / LITE", label: "Хватит любого ПК" },
      { metric: "100%", label: "Моды качаются сами" },
    ],
    domain: "lunate.lol",
    url: "https://lunate.lol/",
    gallery: [
      { url: "/cases/lunate/header.webp" },
      { url: "/cases/lunate/launcher_title.webp" },
      { url: "/cases/lunate/world.webp" },
      { url: "/cases/lunate/magic.webp" },
      { url: "/cases/lunate/tech.webp" },
      { url: "/cases/lunate/launcher_settings.webp" },
      { url: "/cases/lunate/community.webp" },
      { url: "/cases/lunate/faq.webp" },
    ],
  },
  {
    id: "mozority",
    num: "09",
    groupId: "software",
    groupTitle: "Игры, софт и SaaS",
    title: "Приватный чит для Counter-Strike 2 и SaaS-платформа «Mozority»",
    category: "C++ Game Cheat & SaaS-платформа",
    short: "Mozority CS2",
    note: "C++ • ImGui • HWID Lock • SaaS",
    challenge:
      "Разработать приватный чит для Counter-Strike 2 с максимальной оптимизацией (0 просадки FPS и без задержек инпута), полным спектром модулей (Aimbot, ESP, Chams, Skinchanger) и построить защищенную SaaS-инфраструктуру продажи подписок с аппаратной привязкой (HWID Lock).",
    solution:
      "Разработали C++/ImGui чит с нулевым влиянием на FPS: визуальный оверлей (ESP), аимбот со сглаживанием Smooth и компенсацией отдачи, цветные чамсы и скинчейнджер. Построили SaaS-экосистему: стильный веб-портал, личный кабинет с автовыдачей ключей, привязкой к железу (HWID) и встроенным чатом.",
    results: [
      { metric: "0 FPS drop", label: "Кадры не роняет" },
      { metric: "HWID Lock", label: "Ключ не перепродать" },
      { metric: "100%", label: "Ключи выдаются сами" },
    ],
    domain: "github.com/bUmmy1337/mozority",
    url: "https://github.com/bUmmy1337/mozority",
    gallery: [
      { url: "/cases/mozority/web_header.webp" },
      { url: "/cases/mozority/esp.webp" },
      { url: "/cases/mozority/cabinet.webp" },
      { url: "/cases/mozority/aimbot.webp" },
      { url: "/cases/mozority/chams.webp" },
      { url: "/cases/mozority/nightmode.webp" },
      { url: "/cases/mozority/skinchanger.webp" },
      { url: "/cases/mozority/cabinet_chat.webp" },
    ],
  },
];

/* 1 тик колеса ≈ 100px. Длина скролла: 4 тика = 400px на кейс + буфер на финальном кейсе перед откреплением. */
const TICK_PX = 100;
const TICKS_PER_SLIDE = 4;
const SLIDE_PX = Math.round(TICK_PX * TICKS_PER_SLIDE);
const END_BUFFER_PX = 350;
const PIN_EXTRA_PX = SLIDE_PX * CASES.length + END_BUFFER_PX;

function pinProgressPx(track: HTMLElement, stickyTop = 80): number {
  const scrolled = stickyTop - track.getBoundingClientRect().top;
  return Math.min(PIN_EXTRA_PX, Math.max(0, scrolled));
}

function slideIndexFromProgress(progress: number): number {
  if (progress >= (CASES.length - 1) * SLIDE_PX) {
    return CASES.length - 1;
  }
  return Math.min(CASES.length - 1, Math.max(0, Math.floor(progress / SLIDE_PX)));
}

function scrollTrackToProgress(track: HTMLElement, progress: number, stickyTop = 80) {
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
              src={asset(mainPhoto.url)}
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
        <div className="h-full hidden lg:flex flex-col justify-center self-center py-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-left">
            {c.results.map((res, rIdx) => (
              <div
                key={rIdx}
                className={`flex flex-col${
                  rIdx === c.results.length - 1 && c.results.length % 2
                    ? " col-span-2 items-center text-center sm:col-span-1 sm:items-start sm:text-left"
                    : ""
                }`}
              >
                <div className="text-xl sm:text-2xl md:text-3xl font-light text-blue-600 dark:text-blue-400 tracking-tight">
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
              <span>
                {c.url.includes("github.com")
                  ? "GitHub"
                  : c.url.includes("t.me")
                  ? "Открыть бота"
                  : c.id === "omnichannel"
                  ? "К ботам"
                  : "На сайт"}
              </span>
              <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
            </a>
          )}
          <a
            href="https://t.me/maetti_mihail"
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

const ZMIN = 1;
const ZMAX = 4;

function ZoomableImg({
  src,
  alt,
  onSwipe,
}: {
  src: string;
  alt: string;
  onSwipe: (dir: -1 | 1) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const z = useRef({ s: 1, x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const pinch = useRef<{ dist: number; s: number } | null>(null);
  const swipeX = useRef<number | null>(null);
  const lastTap = useRef(0);
  const [, bump] = useState(0);
  const paint = () => bump((n) => n + 1);

  const setZ = (s: number, x: number, y: number) => {
    const ns = Math.min(ZMAX, Math.max(ZMIN, s));
    z.current = ns <= 1.02 ? { s: 1, x: 0, y: 0 } : { s: ns, x, y };
    paint();
  };

  useEffect(() => {
    z.current = { s: 1, x: 0, y: 0 };
    paint();
  }, [src]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZ(z.current.s * (e.deltaY < 0 ? 1.12 : 0.89), z.current.x, z.current.y);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const dist = (a: React.Touch, b: React.Touch) =>
    Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

  return (
    <div
      ref={wrapRef}
      className="max-w-5xl max-h-[72vh] relative flex items-center justify-center overflow-hidden touch-none"
      style={{ cursor: z.current.s > 1 ? "grab" : "zoom-in" }}
      onTouchStart={(e) => {
        if (e.touches.length === 2) {
          pinch.current = { dist: dist(e.touches[0], e.touches[1]), s: z.current.s };
          swipeX.current = null;
          drag.current = null;
          return;
        }
        if (z.current.s > 1) {
          drag.current = {
            x: z.current.x,
            y: z.current.y,
            px: e.touches[0].clientX,
            py: e.touches[0].clientY,
          };
          swipeX.current = null;
        } else {
          swipeX.current = e.touches[0].clientX;
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 2 && pinch.current) {
          const d = dist(e.touches[0], e.touches[1]);
          setZ((d / pinch.current.dist) * pinch.current.s, z.current.x, z.current.y);
          return;
        }
        if (drag.current && e.touches.length === 1) {
          const t = e.touches[0];
          setZ(
            z.current.s,
            drag.current.x + (t.clientX - drag.current.px),
            drag.current.y + (t.clientY - drag.current.py),
          );
        }
      }}
      onTouchEnd={(e) => {
        if (pinch.current) {
          pinch.current = e.touches.length >= 2 ? pinch.current : null;
          return;
        }
        if (drag.current) {
          drag.current = null;
          return;
        }
        if (swipeX.current == null || !e.changedTouches[0]) return;
        const dx = e.changedTouches[0].clientX - swipeX.current;
        swipeX.current = null;
        const now = Date.now();
        if (now - lastTap.current < 280 && Math.abs(dx) < 12) {
          lastTap.current = 0;
          setZ(z.current.s > 1 ? 1 : 2.5, 0, 0);
          return;
        }
        lastTap.current = now;
        if (dx > 45) onSwipe(-1);
        else if (dx < -45) onSwipe(1);
      }}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || z.current.s <= 1) return;
        drag.current = { x: z.current.x, y: z.current.y, px: e.clientX, py: e.clientY };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current || e.pointerType !== "mouse") return;
        setZ(z.current.s, drag.current.x + e.clientX - drag.current.px, drag.current.y + e.clientY - drag.current.py);
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onDoubleClick={() => setZ(z.current.s > 1 ? 1 : 2.5, 0, 0)}
    >
      <img
        src={src}
        alt={alt}
        decoding="async"
        draggable={false}
        className="max-w-full max-h-[72vh] object-contain rounded-md shadow-2xl border border-neutral-800"
        style={{
          transform: `translate(${z.current.x}px, ${z.current.y}px) scale(${z.current.s})`,
          transformOrigin: "center center",
          transition: drag.current || pinch.current ? "none" : "transform 120ms ease-out",
        }}
      />
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
  const stickyTopRef = useRef<number>(80);

  // Modal Lightbox Gallery State
  const [galleryCase, setGalleryCase] = useState<Case | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const thumbsRef = useRef<HTMLDivElement>(null);
  const thumbsLockRef = useRef(false);

  const handleOpenGallery = (c: Case, idx = 0) => {
    haptic.toggle();
    setGalleryCase(c);
    setPhotoIndex(idx);
  };

  const handleCloseGallery = () => {
    haptic.toggle();
    setGalleryCase(null);
  };

  const handleNextPhoto = () => {
    if (!galleryCase) return;
    haptic.tick();
    setPhotoIndex((prev) => (prev + 1) % galleryCase.gallery.length);
  };

  const handlePrevPhoto = () => {
    if (!galleryCase) return;
    haptic.tick();
    setPhotoIndex(
      (prev) => (prev - 1 + galleryCase.gallery.length) % galleryCase.gallery.length
    );
  };

  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip || !galleryCase) return;
    const thumb = strip.children[photoIndex] as HTMLElement | undefined;
    if (!thumb) return;
    thumbsLockRef.current = true;
    thumb.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    const t = window.setTimeout(() => {
      thumbsLockRef.current = false;
    }, 420);
    return () => clearTimeout(t);
  }, [photoIndex, galleryCase]);

  useEffect(() => {
    const strip = thumbsRef.current;
    if (!strip || !galleryCase) return;
    const onEnd = () => {
      if (thumbsLockRef.current) return;
      const mid = strip.getBoundingClientRect().left + strip.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < strip.children.length; i++) {
        const r = (strip.children[i] as HTMLElement).getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      }
      if (best !== photoIndex) setPhotoIndex(best);
    };
    strip.addEventListener("scrollend", onEnd);
    return () => strip.removeEventListener("scrollend", onEnd);
  }, [galleryCase, photoIndex]);

  // Предзагрузка соседних фото галереи, чтобы листалось без задержек
  useEffect(() => {
    if (!galleryCase) return;
    const n = galleryCase.gallery.length;
    [(photoIndex + 1) % n, (photoIndex - 1 + n) % n].forEach((i) => {
      const im = new Image();
      im.src = asset(galleryCase.gallery[i].url);
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

  useEffect(() => {
    if (!galleryCase) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [galleryCase]);

  const activeCase = CASES[active] || CASES[0];
  const activeGroup =
    GROUPS.find((g) => g.caseIndices.includes(active)) || GROUPS[0];

  useEffect(() => {
    const track = desktopTrackRef.current;
    if (!track) return;
    let ticking = false;

    const sticky = track.firstElementChild as HTMLElement | null;
    const updateStickyTop = () => {
      if (sticky) {
        stickyTopRef.current = parseFloat(getComputedStyle(sticky).top) || 80;
      }
    };
    updateStickyTop();

    // rAF-throttle: scroll фаерит десятки раз за кадр, setState нужен 1 раз.
    const sync = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (ignoreScrollRef.current || track.offsetHeight === 0) return;
        const nextIdx = slideIndexFromProgress(pinProgressPx(track, stickyTopRef.current));
        if (nextIdx !== prevActiveRef.current) {
          prevActiveRef.current = nextIdx;
          setActive(nextIdx);
        }
      });
    };
    const onResize = () => {
      updateStickyTop();
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

    if (Math.abs(pinProgressPx(track, stickyTopRef.current) - targetProgress) < 2) {
      ignoreScrollRef.current = false;
      return;
    }

    window.addEventListener("scrollend", unlock);
    unlockTimerRef.current = window.setTimeout(unlock, 1500);
    scrollTrackToProgress(track, targetProgress, stickyTopRef.current);
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
        haptic.tick();
      }
    });
  };

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    const activeGroupIndex = GROUPS.findIndex((g) => g.id === activeGroup.id);
    if (activeGroupIndex < 0) return;
    chipsRef.current?.children[activeGroupIndex]?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [active, activeGroup.id]);

  const goToMobile = (i: number) => {
    haptic.tap();
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
        <section className="max-w-7xl mx-auto px-6 pt-8 pb-12 border-b border-neutral-200 dark:border-neutral-800">
          <div className="max-w-3xl">
            <div className="w-fit mb-4">
              <WaveRule className="mb-4" />
              <h1 className="text-3xl md:text-5xl font-light tracking-tight">
                Наши Кейсы
              </h1>
            </div>
            <p className="text-sm md:text-base text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
              <span className="hidden lg:inline">
                Листайте страницу вниз для последовательного просмотра проектов по направлениям (Веб, Чат-боты, Автоматизация, Игры и софт), задач, технических решений и измеримых результатов.
              </span>
              <span className="lg:hidden">
                Свайпайте карточки вбок для последовательного просмотра проектов по направлениям, задач, технических решений и измеримых результатов.
              </span>
            </p>
          </div>
        </section>

        {/* ===== Desktop: Pinned Scroll Track ===== */}
        <div
          ref={desktopTrackRef}
          className="hidden lg:block relative"
          style={{ height: `calc(100vh - 5rem + ${PIN_EXTRA_PX}px)` }}
        >
          <div className="sticky top-20 h-[calc(100vh-5rem)] flex items-center justify-center">
            <div className="max-w-7xl w-full mx-auto px-6">
              <div className="grid grid-cols-12 gap-8 items-center">
                {/* Навигация слева: 3 плашки-группы */}
                <div className="col-span-4 space-y-3">
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
                      <div
                        key={g.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleGroupClick(g)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleGroupClick(g);
                          }
                        }}
                        className={`w-full text-left p-4 transition-all duration-300 border flex flex-col justify-between group relative rounded-xl cursor-pointer select-none ${
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

                          {/* Интерактивные стрелки навигации по кейсам */}
                          {isGroupActive ? (
                            <div
                              className="flex items-center gap-1 shrink-0 mt-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {active > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDesktopClick(active - 1);
                                  }}
                                  title="Предыдущий кейс"
                                  aria-label="Предыдущий кейс"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all duration-200 cursor-pointer active:scale-90"
                                >
                                  <ArrowLeft className="w-4 h-4" />
                                </button>
                              )}
                              {active < CASES.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDesktopClick(active + 1);
                                  }}
                                  title="Следующий кейс"
                                  aria-label="Следующий кейс"
                                  className="w-7 h-7 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-all duration-200 cursor-pointer active:scale-90"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <ArrowRight
                              className="w-4 h-4 shrink-0 mt-0.5 transition-transform text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-400 group-hover:translate-x-0.5"
                            />
                          )}
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
                              className="grid gap-1.5 w-full items-center"
                              style={{
                                gridTemplateColumns: `repeat(${g.caseIndices.length}, minmax(0, 1fr))`,
                              }}
                            >
                              {g.caseIndices.map((idx) => {
                                const isCur = idx === active;
                                const isPast = idx < active;
                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDesktopClick(idx);
                                    }}
                                    title={`Кейс ${idx + 1}`}
                                    aria-label={`Перейти к кейсу ${idx + 1}`}
                                    className="py-1 w-full cursor-pointer group/bar focus:outline-none"
                                  >
                                    <div
                                      className={`h-1 rounded-full transition-all duration-300 group-hover/bar:h-1.5 ${
                                        isCur
                                          ? "bg-blue-600 dark:bg-blue-400"
                                          : isPast
                                          ? "bg-blue-300 dark:bg-blue-900"
                                          : "bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Детали карточки справа */}
                <div className="col-span-8">
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
          <div className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between gap-3 px-4 sm:px-6 pt-3 pb-2.5">
              <div
                ref={chipsRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 flex-1 min-w-0"
              >
                {GROUPS.map((g) => {
                  const isGroupActive = g.id === activeGroup.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => goToMobile(g.caseIndices[0])}
                      className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 border text-xs transition-colors duration-300 rounded-lg ${
                        isGroupActive
                          ? "bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white font-medium shadow-xs"
                          : "border-neutral-300 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900"
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
              <div className="shrink-0 pl-2.5 border-l border-neutral-200 dark:border-neutral-800">
                <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {String(active + 1).padStart(2, "0")}/{String(CASES.length).padStart(2, "0")}
                </span>
              </div>
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
            className="flex items-start gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4 sm:px-6 py-6 sm:py-8"
          >
            {CASES.map((c, idx) => (
              <div
                key={c.id}
                className="snap-center snap-always shrink-0 w-[calc(100vw-2.5rem)] sm:w-[calc(100vw-4.5rem)] max-w-lg [content-visibility:auto] [contain-intrinsic-size:auto_640px]"
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
              <div className="flex items-center justify-between text-white border-b border-neutral-800 pb-4 gap-2">
                <div className="min-w-0 flex-1 pr-2">
                  <span className="text-[11px] sm:text-xs font-mono text-blue-400 uppercase tracking-widest font-semibold block mb-0.5 truncate">
                    [{galleryCase.num}] {galleryCase.category}
                  </span>
                  <h3 className="text-sm sm:text-lg font-medium text-white truncate">
                    {galleryCase.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <span className="text-xs font-mono text-neutral-400 hidden sm:inline-block">
                    {photoIndex + 1} из {galleryCase.gallery.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleCloseGallery}
                    className="p-2.5 sm:p-2 text-neutral-300 hover:text-white bg-neutral-900 border border-neutral-700 rounded-lg transition-colors cursor-pointer active:scale-90"
                    aria-label="Закрыть галерею"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image View Area */}
              <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
                {/* Left Arrow (Desktop on sides, mobile in bottom bar) */}
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="hidden md:flex absolute left-4 z-10 p-3 text-white bg-neutral-900/80 hover:bg-blue-600 border border-neutral-700 rounded-full transition-all shadow-lg cursor-pointer"
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
                    className="max-w-5xl max-h-[72vh] relative flex items-center justify-center"
                  >
                    <ZoomableImg
                      src={asset(galleryCase.gallery[photoIndex].url)}
                      alt={galleryCase.title}
                      onSwipe={(dir) => (dir < 0 ? handlePrevPhoto() : handleNextPhoto())}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Right Arrow (Desktop on sides, mobile in bottom bar) */}
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="hidden md:flex absolute right-4 z-10 p-3 text-white bg-neutral-900/80 hover:bg-blue-600 border border-neutral-700 rounded-full transition-all shadow-lg cursor-pointer"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Thumbnails & Mobile Controls Footer */}
              <div className="border-t border-neutral-800 pt-3 flex items-center justify-between md:justify-center gap-2 md:gap-3">
                {/* Mobile Prev Button */}
                <button
                  type="button"
                  onClick={handlePrevPhoto}
                  className="md:hidden min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-white bg-neutral-900 border border-neutral-700 rounded-lg active:scale-95 shrink-0"
                  aria-label="Предыдущее фото"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Thumbnails */}
                <div
                  ref={thumbsRef}
                  className="flex items-center gap-2 sm:gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar py-1 px-[calc(50%-1.75rem)] sm:px-[calc(50%-2.5rem)]"
                >
                  {galleryCase.gallery.map((item, idx) => {
                    const isActive = idx === photoIndex;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPhotoIndex(idx)}
                        className={`relative w-14 sm:w-20 h-9 sm:h-12 rounded overflow-hidden border transition-all shrink-0 snap-center snap-always cursor-pointer ${
                          isActive
                            ? "border-blue-500 scale-105 shadow-md ring-1 ring-blue-500"
                            : "border-neutral-800 opacity-50 hover:opacity-100"
                        }`}
                      >
                        <img
                          src={asset(item.url)}
                          alt={item.title || galleryCase.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Mobile Next Button */}
                <button
                  type="button"
                  onClick={handleNextPhoto}
                  className="md:hidden min-w-[44px] min-h-[44px] p-2.5 flex items-center justify-center text-white bg-neutral-900 border border-neutral-700 rounded-lg active:scale-95 shrink-0"
                  aria-label="Следующее фото"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}

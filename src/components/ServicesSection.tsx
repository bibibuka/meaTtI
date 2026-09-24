"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { Unbounded, Onest } from "next/font/google";
import WaveRule from "@/components/WaveRule";

// Оба шрифта нужны только интро на ПК, поэтому заранее их не грузим и берём
// лишь те начертания, что там есть: font-bold и font-semibold. Подтягиваются
// в фоне из эффекта ниже, пока секция ещё не на экране.
const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["600"],
  display: "swap",
  preload: false,
});
import { TransitionLink } from "@/context/TransitionContext";

export const SERVICES = [
  {
    id: "sajty",
    title: "Веб-сайты",
    desc: "Создаём сайты для бизнеса: лендинги, корпоративные сайты, интернет-магазины и веб-сервисы. Работаем и с готовыми сайтами: обновляем дизайн, редактируем тексты и страницы, добавляем функции, исправляем ошибки и ускоряем загрузку.",
    color: "from-purple-600 to-indigo-600",
    bg: "bg-purple-500/10",
    border: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    badge: "WEB",
    price: "от 40 000 ₽",
  },
  {
    id: "boty",
    title: "Чат-боты и\nмини‑приложения",
    desc: "Разрабатываем ботов и мини-приложения для Telegram, ВКонтакте и MAX. Настраиваем запись, приём заявок и оплату, ответы на вопросы и рассылки. Подключаем CRM и базы знаний, чтобы клиентам было проще получить помощь, а команде — обрабатывать обращения.",
    color: "from-blue-600 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    badge: "BOT",
    price: "от 50 000 ₽",
  },
  {
    id: "avtomatizacija",
    title: "Автоматизация и интеграции",
    desc: "Автоматизируем повторяющиеся задачи: сбор данных, отчёты, перенос заявок и уведомления. Связываем сайт, CRM, склад и мессенджеры, настраиваем обмен данными с Excel и Google Таблицами. Помогаем сократить ручную работу и освободить время команды.",
    color: "from-teal-600 to-emerald-600",
    bg: "bg-teal-500/10",
    border: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    badge: "AUTO",
    price: "от 25 000 ₽",
  },
];

const FULL_TEXT =
  "Мы проектируем цифровые экосистемы: освобождаем сотрудников от рутины и делаем их работу удобнее, а бизнесу экономим бюджет и операционные расходы.";

interface CharData {
  char: string;
  index: number;
}

interface WordData {
  word: string;
  chars: CharData[];
  wordStartIndex: number;
  spaceIndex: number | null;
}

const WORDS_DATA: WordData[] = (() => {
  const words = FULL_TEXT.split(" ");
  let runningIndex = 0;
  return words.map((word, wIdx) => {
    const chars = word.split("").map((char, cIdx) => ({
      char,
      index: runningIndex + cIdx,
    }));
    const wordStartIndex = runningIndex;
    runningIndex += word.length;
    const hasSpace = wIdx < words.length - 1;
    const spaceIndex = hasSpace ? runningIndex : null;
    if (hasSpace) runningIndex += 1;

    return {
      word,
      chars,
      wordStartIndex,
      spaceIndex,
    };
  });
})();

const SESSION_KEY = "maetti_services_intro_seen";

let hasCompletedIntroInSession = false;

const readSessionIntroSeen = () => {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "true";
  } catch {
    return false;
  }
};

// Интро уже видели до этой загрузки страницы (перезагрузка в той же вкладке).
// Снимок берётся один раз на загрузку: раскрытие секции его не меняет, иначе
// сама анимация раскрытия стала бы мгновенной. В статическом HTML — false.
let seenAtLoad: boolean | null = null;
const getSeenAtLoad = () => (seenAtLoad ??= readSessionIntroSeen());
const getSeenOnServer = () => false;
const noSubscribe = () => () => {};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0,
    margin: "-50% 0px -49% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  const restored = useSyncExternalStore(noSubscribe, getSeenAtLoad, getSeenOnServer);
  const [settled, setIsSettled] = useState(hasCompletedIntroInSession);
  const isSettled = settled || restored;
  const [charCount, setCharCount] = useState(hasCompletedIntroInSession ? FULL_TEXT.length : 0);
  const [isTyped, setIsTyped] = useState(hasCompletedIntroInSession);
  const [canSettle, setCanSettle] = useState(hasCompletedIntroInSession);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const clickBlockedUntilRef = useRef<number>(0);
  // Секция открылась уже раскрытой — анимации появления не нужны
  const [instantState, setInstant] = useState(hasCompletedIntroInSession);
  const instant = instantState || restored;
  const [inPlace, setInPlace] = useState<boolean | null>(null);
  const inPlaceRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const mobile = mq.matches;
      inPlaceRef.current = mobile;
      setInPlace(mobile);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Шрифты интро без preload: подтягиваем их в фоне сразу после загрузки
  // страницы, чтобы к началу печати текст не мигнул шрифтом-заменителем.
  // На телефоне и после уже увиденного интро они не нужны вовсе.
  useEffect(() => {
    if (inPlace !== false || isSettled) return;
    const sample = "Мы кликните по экрану";
    Promise.all([
      document.fonts.load(`600 1em ${onest.style.fontFamily}`, sample),
      document.fonts.load(`600 1em ${unbounded.style.fontFamily}`, sample),
      document.fonts.load(`700 1em ${unbounded.style.fontFamily}`, sample),
    ]).catch(() => {});
  }, [inPlace, isSettled]);

  // Клик, которым раскрывают секцию, не должен провалиться дальше: сразу после
  // него карточки становятся кликабельными, и второй клик уводил на другую страницу.
  useEffect(() => {
    const handleCaptureClick = (e: MouseEvent) => {
      if (Date.now() < clickBlockedUntilRef.current) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("click", handleCaptureClick, { capture: true });
    window.addEventListener("auxclick", handleCaptureClick, { capture: true });
    return () => {
      window.removeEventListener("click", handleCaptureClick, { capture: true });
      window.removeEventListener("auxclick", handleCaptureClick, { capture: true });
    };
  }, []);

  const settleSection = useCallback(() => {
    hasCompletedIntroInSession = true;
    setInstant(false);
    setIsSettled(true);
    setIsTyped(true);
    setCanSettle(true);
    // На телефоне секция раскрывается сама, без клика, — там блокировать нечего.
    if (!inPlaceRef.current) {
      clickBlockedUntilRef.current = Date.now() + 1200;
      setIsClickBlocked(true);
      setTimeout(() => setIsClickBlocked(false), 1200);
    }
    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {}
  }, []);

  // Печать стартует, когда секция дошла до середины экрана. useInView с once
  // сам «защёлкивается», поэтому отдельное состояние не нужно; после
  // раскрытия introGo нигде не читается.
  const introGo = !shouldReduceMotion && isInView && inPlace !== null;

  // Natural typewriter effect with cadence on punctuation
  useEffect(() => {
    if (shouldReduceMotion) {
      queueMicrotask(() => {
        setCharCount(FULL_TEXT.length);
        setIsTyped(true);
        setCanSettle(true);
        setIsSettled(true);
        try {
          sessionStorage.setItem(SESSION_KEY, "true");
        } catch {}
      });
      return;
    }

    if (!introGo || isSettled) return;

    let timeoutId: NodeJS.Timeout;
    let current = 0;
    const fast = inPlace === true;

    const typeNext = () => {
      current += 1;
      setCharCount(current);

      if (current >= FULL_TEXT.length) {
        setIsTyped(true);
        if (inPlaceRef.current) settleSection();
        return;
      }

      const prevChar = FULL_TEXT[current - 1];
      let delay = fast ? 7 : 18;
      if (prevChar === ":" || prevChar === ".") {
        delay = fast ? 40 : 140;
      } else if (prevChar === ",") {
        delay = fast ? 20 : 80;
      }

      timeoutId = setTimeout(typeNext, delay);
    };

    timeoutId = setTimeout(typeNext, 40);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [introGo, shouldReduceMotion, isSettled, inPlace, settleSection]);

  // Strict 0.75-second click block after typing completes (no click allowed during or within 750ms after typing)
  useEffect(() => {
    if (instant || isSettled || !isTyped) return;

    const cooldownTimer = setTimeout(() => {
      setCanSettle(true);
    }, 750);

    return () => clearTimeout(cooldownTimer);
  }, [instant, isTyped, isSettled]);

  // Handle interaction: NO SKIPPING during typing. Click only triggers after text is finished + 0.75s passed
  const handleInteraction = useCallback((e?: React.MouseEvent) => {
    if (!canSettle || isSettled) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    settleSection();
  }, [canSettle, isSettled, settleSection]);

  // Listen for click/touch anywhere on the page only AFTER typing is completely finished AND 0.75s delay passed
  useEffect(() => {
    if (!canSettle || isSettled) return;

    const onGlobalClick = () => {
      settleSection();
    };

    window.addEventListener("click", onGlobalClick, { once: true, capture: true });
    window.addEventListener("touchend", onGlobalClick, { once: true, capture: true });

    return () => {
      window.removeEventListener("click", onGlobalClick, { capture: true });
      window.removeEventListener("touchend", onGlobalClick, { capture: true });
    };
  }, [canSettle, isSettled, settleSection]);

  // Идея владельца сайта: при первом просмотре на ПК интро намеренно
  // удерживает прокрутку до окончания печати и последующего клика.
  // Такое поведение предусмотрено сценарием знакомства с услугами.
  useEffect(() => {
    if (shouldReduceMotion || !isInView || isSettled || inPlace !== false) return;
    const heading = headingRef.current;
    if (!heading) return;

    const header = document.querySelector<HTMLElement>(".site-header");
    const root = document.documentElement;
    const body = document.body;
    const prevOverflow = [root.style.overflow, body.style.overflow];

    // Сначала останавливаем инерцию в текущей позиции. Дальше прокруткой
    // управляет один цикл: нативный smooth-scroll не спорит с блокировкой
    // и не обрывается мгновенным переносом к цели.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";

    let raf = 0;
    const align = () => {
      cancelAnimationFrame(raf);
      const from = window.scrollY;
      window.scrollTo({ top: from, behavior: "instant" });
      // Выравниваем видимый заголовок, а не секцию вместе с её padding.
      // После раскрытия карточки остаются выше и помещаются на ноутбуке.
      const targetTop = (header?.getBoundingClientRect().bottom ?? 0) + 24;
      const maxScroll = Math.max(0, root.scrollHeight - window.innerHeight);
      const to = Math.min(maxScroll, Math.max(0, from + heading.getBoundingClientRect().top - targetTop));
      const distance = to - from;
      const duration = Math.min(1000, 650 + Math.abs(distance) * 0.35);
      let previousFrame = performance.now();
      let elapsed = 0;

      const tick = (now: number) => {
        // Если браузер пропустил кадры, продолжаем небольшим шагом,
        // а не перескакиваем через оставшуюся часть движения.
        elapsed += Math.min(40, Math.max(0, now - previousFrame));
        previousFrame = now;
        const t = Math.min(1, elapsed / duration);
        const eased = t * t * (3 - 2 * t);
        // instant применяется к маленькому шагу каждого кадра; плавность
        // задаёт eased, без второй анимации со стороны браузера.
        window.scrollTo({ top: from + distance * eased, behavior: "instant" });
        if (t < 1) raf = requestAnimationFrame(tick);
      };

      raf = requestAnimationFrame(tick);
    };

    const scheduleAlign = () => {
      cancelAnimationFrame(raf);
      // Последнее событие колеса могло уже уйти в compositor. Даём ему
      // завершиться после блокировки и берём фактическую позицию, иначе
      // первый кадр анимации возвращает страницу назад на один шаг колеса.
      raf = requestAnimationFrame(() => {
        raf = requestAnimationFrame(align);
      });
    };

    const block = (e: Event) => {
      if (e.cancelable) e.preventDefault();
    };
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", scheduleAlign);
    const observer = new ResizeObserver(scheduleAlign);
    observer.observe(heading);
    if (header) observer.observe(header);
    scheduleAlign();

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      [root.style.overflow, body.style.overflow] = prevOverflow;
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", scheduleAlign);
    };
  }, [isInView, isSettled, shouldReduceMotion, inPlace]);

  return (
    <section
      ref={sectionRef}
      id="services"
      onClick={handleInteraction}
      suppressHydrationWarning
      className={`py-12 md:py-16 px-6 max-w-7xl mx-auto w-full relative select-none overflow-hidden ${
        canSettle && !isSettled ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* BACKGROUND TYPOGRAPHIC PATTERN (across the whole section to fill the top void) */}
      <AnimatePresence>
        {canSettle && !isSettled && inPlace === false && (
          <motion.div
            key="services-bg-marquee"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 pointer-events-none overflow-hidden select-none flex flex-col justify-around py-4 z-0"
          >
            {Array.from({ length: 7 }).map((_, rIdx) => (
              <div
                key={rIdx}
                className={`flex whitespace-nowrap text-base sm:text-lg md:text-xl font-bold tracking-wider text-blue-600/[0.07] dark:text-blue-400/[0.08] select-none animate-marquee ${unbounded.className}`}
                style={{
                  animationDuration: `${30 + rIdx * 6}s`,
                  animationDirection: rIdx % 2 === 0 ? "normal" : "reverse",
                }}
              >
                {Array.from({ length: 12 }).map((_, cIdx) => (
                  <span key={cIdx} className="inline-flex items-center gap-3 mx-6">
                    <span>кликните по экрану</span>
                    <MousePointerClick className="w-5 h-5 opacity-75 inline-block -mt-0.5" />
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 min-h-[100px] relative z-10">
        {/* Left: Title + Wave (reveals when typing completes and user clicks) */}
        <motion.div
          ref={headingRef}
          initial={
            instant || inPlace
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          animate={
            isSettled || inPlace
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          transition={{
            duration: instant || inPlace ? 0 : 0.9,
            delay: instant || inPlace ? 0 : (isSettled ? 0.25 : 0),
            ease: [0.16, 1, 0.3, 1],
          }}
          className={`w-fit shrink-0 ${isSettled && !isClickBlocked ? "pointer-events-auto" : "pointer-events-none"}`}
        >
          <WaveRule className="mb-4" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            ЧЕМ МЫ МОЖЕМ ПОМОЧЬ
          </h2>
        </motion.div>

        {/* Right: Subtitle target slot (turns back to gray when settled) */}
        <div className="w-full md:max-w-md min-h-[72px] flex items-end">
          {(isSettled || inPlace) && (
            <motion.div
              layoutId={inPlace ? undefined : "services-statement-box"}
              transition={{
                duration: instant || inPlace ? 0 : 2,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-normal leading-relaxed text-left"
            >
              <p>
                {inPlace && !isSettled ? (
                  <>
                    {FULL_TEXT.slice(0, charCount)}
                    {introGo && !isTyped && (
                      <span className="inline-block w-[1.5px] h-[1em] bg-neutral-400 ml-0.5 align-[-0.1em] animate-pulse" />
                    )}
                  </>
                ) : (
                  FULL_TEXT
                )}
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* CARDS SECTION & TYPING STAGE */}
      <div className="relative min-h-[420px] z-10">
        {/* 3 SERVICES CARDS (hidden during typing on pure white, then cascade in) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, idx) => (
            <motion.div
              key={s.id}
              initial={
                instant || inPlace
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              animate={
                isSettled || inPlace
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              transition={{
                duration: instant || inPlace ? 0 : 0.8,
                delay: instant || inPlace ? 0 : (isSettled ? 0.45 + idx * 0.25 : 0),
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`h-full ${!isSettled || isClickBlocked ? "pointer-events-none select-none" : ""}`}
            >
              <TransitionLink href={`/uslugi#${s.id}`} className="group relative block h-full">
                <div
                  className={`h-full border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 flex flex-col justify-between overflow-hidden bg-white dark:bg-neutral-900 transition-all duration-300 group-hover:shadow-lg ${s.border}`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-xs font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-750 rounded-full tracking-wider transition-all duration-300">
                        {s.badge}
                      </span>
                      <span className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black flex items-center justify-center transition-all duration-300">
                        <ArrowUpRight className="w-5 h-5" />
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-4 md:min-h-[4rem] whitespace-pre-line">
                      {s.title}
                    </h3>
                    <p className="text-[15px] text-neutral-600 dark:text-neutral-300 leading-relaxed mb-8">
                      {s.desc}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 group-hover:border-neutral-200 dark:group-hover:border-neutral-700 flex items-center justify-between transition-colors duration-300">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-750 transition-all duration-300">
                      Узнать подробнее
                    </span>
                    <span className="text-sm font-bold px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-750 transition-all duration-300">
                      {s.price}
                    </span>
                  </div>
                </div>
              </TransitionLink>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CENTER TYPING STAGE (Centered across the whole section without vertical layout jumps) */}
      {!isSettled && inPlace === false && introGo && (
        <div
          onClick={handleInteraction}
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 z-20 ${
            canSettle ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <motion.div
            layoutId="services-statement-box"
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl text-center"
          >
            <p className={`text-xl sm:text-2xl md:text-3xl font-semibold text-blue-600 dark:text-blue-500 leading-relaxed tracking-tight ${onest.className}`}>
              {charCount === 0 && !isTyped && (
                <span className="inline-block w-[2.5px] h-[1.15em] bg-blue-600 dark:bg-blue-400 mr-1 align-middle animate-pulse" />
              )}
              {WORDS_DATA.map((item, wIdx) => (
                <Fragment key={wIdx}>
                  <span className="inline-block whitespace-nowrap">
                    {item.chars.map(({ char, index }) => {
                      const isRevealed = index < charCount;
                      const isCaretHere = index === charCount - 1 && !isTyped;
                      return (
                        <span key={index} className="relative inline-block">
                          <span
                            className={`transition-opacity duration-150 ${
                              isRevealed ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {char}
                          </span>
                          {isCaretHere && (
                            <span className="absolute left-full top-0 w-[2.5px] h-[1.15em] bg-blue-600 dark:bg-blue-400 ml-0.5 align-middle animate-pulse pointer-events-none" />
                          )}
                        </span>
                      );
                    })}
                  </span>
                  {item.spaceIndex !== null && " "}
                </Fragment>
              ))}
            </p>
          </motion.div>

          {/* Clean text prompt with Unbounded font and MousePointerClick sticker - strictly after 0.75s cooldown */}
          {canSettle && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={`mt-6 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wider text-blue-600 dark:text-blue-400 select-none animate-pulse ${unbounded.className}`}
            >
              <span>кликните по экрану</span>
              <MousePointerClick className="w-4 h-4" />
            </motion.div>
          )}
        </div>
      )}
    </section>
  );
}

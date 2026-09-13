"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MousePointerClick } from "lucide-react";
import { Unbounded, Onest } from "next/font/google";
import WaveRule from "@/components/WaveRule";

const unbounded = Unbounded({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
import { TransitionLink } from "@/context/TransitionContext";

export const SERVICES = [
  {
    id: "sajty",
    title: "Веб-сайты",
    desc: "Сайты под любую задачу и любое пожелание: от одной страницы до большого сервиса. Витрина, продажи, заявки, нестандартный функционал - без шаблона «как у всех». Если сами не знаете, какой именно сайт нужен, подскажем формат.",
    color: "from-purple-600 to-indigo-600",
    bg: "bg-purple-500/10",
    border: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    badge: "WEB",
    price: "от 40 000 ₽",
  },
  {
    id: "boty",
    title: "Чат-боты и\nМини‑приложения",
    desc: "Любые боты и мини-приложения: консультации, запись, продажи, оплата, рассылки - в Telegram, ВКонтакте и MAX. От простого автоответа до умного ассистента и приложения внутри мессенджера. Опишете, как должно отвечать и что уметь - сделаем.",
    color: "from-blue-600 to-cyan-600",
    bg: "bg-blue-500/10",
    border: "group-hover:border-blue-500/30 dark:group-hover:border-blue-400/30",
    badge: "BOT",
    price: "от 50 000 ₽",
  },
  {
    id: "avtomatizacija",
    title: "Автоматизация и Интеграции",
    desc: "Избавляем от рутины и связываем ваши сервисы в единую систему. Разрабатываем скрипты для парсинга данных, настраиваем сквозные API-интеграции между CRM, складом и мессенджерами, автоматизируем отчеты в Excel и Google Таблицах и многое другое.",
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

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, {
    once: true,
    amount: 0,
    margin: "-50% 0px -49% 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  const [isSettled, setIsSettled] = useState(hasCompletedIntroInSession);
  const [charCount, setCharCount] = useState(hasCompletedIntroInSession ? FULL_TEXT.length : 0);
  const [isTyped, setIsTyped] = useState(hasCompletedIntroInSession);
  const [canSettle, setCanSettle] = useState(hasCompletedIntroInSession);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const clickBlockedUntilRef = useRef<number>(0);
  const wasAlreadySettledOnMount = useRef(hasCompletedIntroInSession);
  const [inPlace, setInPlace] = useState<boolean | null>(null);
  const inPlaceRef = useRef(false);
  const [introGo, setIntroGo] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => {
      const mobile = mq.matches;
      inPlaceRef.current = mobile;
      setInPlace(mobile);
    };
    apply();
    mq.addEventListener("change", apply);
    if (readSessionIntroSeen()) {
      hasCompletedIntroInSession = true;
      wasAlreadySettledOnMount.current = true;
      setIsSettled(true);
      setCharCount(FULL_TEXT.length);
      setIsTyped(true);
      setCanSettle(true);
    }
    return () => mq.removeEventListener("change", apply);
  }, []);

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
    wasAlreadySettledOnMount.current = false;
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

  useEffect(() => {
    if (shouldReduceMotion || isSettled || !isInView || inPlace === null) return;
    setIntroGo(true);
  }, [isInView, isSettled, shouldReduceMotion, inPlace]);

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
    if (wasAlreadySettledOnMount.current || isSettled || !isTyped) return;

    const cooldownTimer = setTimeout(() => {
      setCanSettle(true);
    }, 750);

    return () => clearTimeout(cooldownTimer);
  }, [isTyped, isSettled]);

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

  useEffect(() => {
    if (shouldReduceMotion || !isInView || isSettled || inPlace !== false) return;
    const el = sectionRef.current;
    if (!el) return;

    const HEADER_HEIGHT = 88;
    const rect = el.getBoundingClientRect();
    const availableHeight = window.innerHeight - HEADER_HEIGHT;
    const targetTop =
      rect.height <= availableHeight
        ? HEADER_HEIGHT + Math.max(0, (availableHeight - rect.height) / 2)
        : HEADER_HEIGHT + 12;
    const targetScrollY = Math.max(0, Math.round(window.scrollY + rect.top - targetTop));

    window.scrollTo({ top: targetScrollY, behavior: "smooth" });

    let locked = false;
    const anchorTimer = setTimeout(() => {
      locked = true;
    }, 120);

    const block = (e: Event) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };
    const onScroll = () => {
      if (locked && Math.abs(window.scrollY - targetScrollY) > 6) {
        window.scrollTo({ top: targetScrollY });
      }
    };

    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      clearTimeout(anchorTimer);
      window.removeEventListener("wheel", block);
      window.removeEventListener("touchmove", block);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
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
          initial={
            wasAlreadySettledOnMount.current || inPlace
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          animate={
            isSettled || inPlace
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          transition={{
            duration: wasAlreadySettledOnMount.current || inPlace ? 0 : 0.9,
            delay: wasAlreadySettledOnMount.current || inPlace ? 0 : (isSettled ? 0.25 : 0),
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
                duration: wasAlreadySettledOnMount.current || inPlace ? 0 : 2,
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
                wasAlreadySettledOnMount.current || inPlace
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              animate={
                isSettled || inPlace
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              transition={{
                duration: wasAlreadySettledOnMount.current || inPlace ? 0 : 0.8,
                delay: wasAlreadySettledOnMount.current || inPlace ? 0 : (isSettled ? 0.45 + idx * 0.25 : 0),
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
                    <p className="text-sm text-neutral-500 leading-relaxed mb-8">
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

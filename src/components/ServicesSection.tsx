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
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const shouldReduceMotion = useReducedMotion();

  const [isSettled, setIsSettled] = useState(hasCompletedIntroInSession);
  const [charCount, setCharCount] = useState(hasCompletedIntroInSession ? FULL_TEXT.length : 0);
  const [isTyped, setIsTyped] = useState(hasCompletedIntroInSession);
  const [canSettle, setCanSettle] = useState(hasCompletedIntroInSession);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const clickBlockedUntilRef = useRef<number>(0);
  const wasAlreadySettledOnMount = useRef(hasCompletedIntroInSession);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      hasCompletedIntroInSession = true;
      wasAlreadySettledOnMount.current = true;
      setIsSettled(true);
      setCharCount(FULL_TEXT.length);
      setIsTyped(true);
      setCanSettle(true);
      return;
    }
    if (readSessionIntroSeen()) {
      hasCompletedIntroInSession = true;
      wasAlreadySettledOnMount.current = true;
      setIsSettled(true);
      setCharCount(FULL_TEXT.length);
      setIsTyped(true);
      setCanSettle(true);
    }
  }, []);

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
    clickBlockedUntilRef.current = Date.now() + 1200;
    setIsClickBlocked(true);

    // Save flag strictly AFTER the 0.85s flight animation finishes so duration is never 0
    setTimeout(() => {
      setIsClickBlocked(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // ignore in environments with restricted storage
      }
    }, 1200);
  }, []);

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

    if (!isInView || isSettled) return;

    let timeoutId: NodeJS.Timeout;
    let current = 0;

    const typeNext = () => {
      current += 1;
      setCharCount(current);

      if (current >= FULL_TEXT.length) {
        setIsTyped(true);
        return;
      }

      const prevChar = FULL_TEXT[current - 1];
      let delay = 18;
      if (prevChar === ":" || prevChar === ".") {
        delay = 140;
      } else if (prevChar === ",") {
        delay = 80;
      }

      timeoutId = setTimeout(typeNext, delay);
    };

    const startTimer = setTimeout(typeNext, 180);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(timeoutId);
    };
  }, [isInView, shouldReduceMotion, isSettled]);

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

  // Fix screen while typing and waiting for click: keep section framed in view
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!isInView || isSettled) return;
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const el = sectionRef.current;
    if (!el) return;

    const HEADER_HEIGHT = 88;
    const rect = el.getBoundingClientRect();
    const availableHeight = window.innerHeight - HEADER_HEIGHT;
    
    // Ideal positioning: center the section inside the available height on screen.
    // On laptops where the section is taller than availableHeight, align section top with comfortable clearance.
    const targetTop = rect.height <= availableHeight
      ? HEADER_HEIGHT + Math.max(0, (availableHeight - rect.height) / 2)
      : HEADER_HEIGHT + 12;

    const sectionDocTop = window.scrollY + rect.top;
    const targetScrollY = Math.max(0, Math.round(sectionDocTop - targetTop));

    // Smoothly glide into position
    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });

    let isLocked = false;
    // Activate position anchor shortly after smooth scroll starts to halt residual trackpad momentum
    const anchorTimer = setTimeout(() => {
      isLocked = true;
    }, 120);

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
    };

    const handleScroll = () => {
      if (isLocked) {
        if (Math.abs(window.scrollY - targetScrollY) > 6) {
          window.scrollTo({ top: targetScrollY });
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(anchorTimer);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isInView, isSettled, shouldReduceMotion]);

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
        {canSettle && !isSettled && (
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
            wasAlreadySettledOnMount.current
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          animate={
            isSettled
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          transition={{
            duration: wasAlreadySettledOnMount.current ? 0 : 0.7,
            delay: wasAlreadySettledOnMount.current ? 0 : (isSettled ? 0.2 : 0),
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
          {isSettled && (
            <motion.div
              layoutId="services-statement-box"
              transition={{
                duration: wasAlreadySettledOnMount.current ? 0 : 0.85,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full text-neutral-500 dark:text-neutral-400 text-sm md:text-base font-normal leading-relaxed text-left"
            >
              <p>{FULL_TEXT}</p>
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
                wasAlreadySettledOnMount.current
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              animate={
                isSettled
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              transition={{
                duration: wasAlreadySettledOnMount.current ? 0 : 0.65,
                delay: wasAlreadySettledOnMount.current ? 0 : (isSettled ? 0.25 + idx * 0.1 : 0),
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`h-full ${(!isSettled || isClickBlocked) ? "pointer-events-none select-none" : ""}`}
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
      {!isSettled && (
        <div
          onClick={handleInteraction}
          className={`absolute inset-0 flex flex-col items-center justify-center p-6 z-20 ${
            canSettle ? "cursor-pointer" : "cursor-default"
          }`}
        >
          <motion.div
            layoutId="services-statement-box"
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
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

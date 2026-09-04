"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
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

const emptySubscribe = () => () => {};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const shouldReduceMotion = useReducedMotion();

  // Read session storage safely without triggering hydration mismatches or cascading setState
  const isSeenInSession = useSyncExternalStore(
    emptySubscribe,
    () => {
      try {
        return sessionStorage.getItem(SESSION_KEY) === "true";
      } catch {
        return false;
      }
    },
    () => false
  );

  const [charCount, setCharCount] = useState(0);
  const [isTyped, setIsTyped] = useState(false);
  const [userSettled, setUserSettled] = useState(false);
  const [isClickBlocked, setIsClickBlocked] = useState(false);
  const clickBlockedUntilRef = useRef<number>(0);

  const isSettled = isSeenInSession || userSettled;
  const hasSeenIntro = isSeenInSession;

  // Global click interception for 1.2 seconds after settling (prevents accidental link navigation)
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

  // Settle section and activate 1.2s click cooldown
  const settleSection = useCallback(() => {
    setUserSettled(true);
    clickBlockedUntilRef.current = Date.now() + 1200;
    setIsClickBlocked(true);

    try {
      sessionStorage.setItem(SESSION_KEY, "true");
    } catch {
      // ignore in environments with restricted storage
    }

    setTimeout(() => {
      setIsClickBlocked(false);
    }, 1200);
  }, []);

  // Natural typewriter effect with cadence on punctuation
  useEffect(() => {
    if (shouldReduceMotion) {
      queueMicrotask(() => {
        setCharCount(FULL_TEXT.length);
        setIsTyped(true);
        setUserSettled(true);
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

  // Handle interaction: click triggers instant settlement (allows skipping too)
  const handleInteraction = useCallback((e?: React.MouseEvent) => {
    if (isSettled) return;
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCharCount(FULL_TEXT.length);
    setIsTyped(true);
    settleSection();
  }, [isSettled, settleSection]);

  // Listen for click/touch anywhere on the page once text has finished typing
  useEffect(() => {
    if (isSettled) return;

    const onGlobalClick = (e: MouseEvent | TouchEvent) => {
      if (isTyped) {
        e.preventDefault();
        e.stopPropagation();
        settleSection();
      }
    };

    if (isTyped) {
      window.addEventListener("click", onGlobalClick, { once: true, capture: true });
      window.addEventListener("touchend", onGlobalClick, { once: true, capture: true });
    }

    return () => {
      window.removeEventListener("click", onGlobalClick, { capture: true });
      window.removeEventListener("touchend", onGlobalClick, { capture: true });
    };
  }, [isTyped, isSettled, settleSection]);

  // Fix screen while typing and waiting for click: keep section framed in view
  useEffect(() => {
    if (shouldReduceMotion) return;
    if (!isInView || isSettled) return;

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
      className={`py-12 md:py-16 px-6 max-w-7xl mx-auto w-full relative select-none overflow-hidden ${
        isTyped && !isSettled ? "cursor-pointer" : "cursor-default"
      }`}
    >
      {/* BACKGROUND TYPOGRAPHIC PATTERN (across the whole section to fill the top void) */}
      {isTyped && !isSettled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
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

      {/* HEADER ROW */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 min-h-[100px] relative z-10">
        {/* Left: Title + Wave (reveals when typing completes and user clicks) */}
        <motion.div
          initial={hasSeenIntro ? false : { opacity: 0, x: -28, filter: "blur(4px)" }}
          animate={
            isSettled
              ? { opacity: 1, x: 0, filter: "blur(0px)" }
              : { opacity: 0, x: -28, filter: "blur(4px)" }
          }
          transition={{
            duration: hasSeenIntro ? 0 : 0.7,
            delay: hasSeenIntro ? 0 : (isSettled ? 0.2 : 0),
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
                duration: hasSeenIntro ? 0 : 0.85,
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
              initial={hasSeenIntro ? false : { opacity: 0, y: 35 }}
              animate={
                isSettled
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 35 }
              }
              transition={{
                duration: hasSeenIntro ? 0 : 0.65,
                delay: hasSeenIntro ? 0 : (isSettled ? 0.25 + idx * 0.1 : 0),
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
          className="absolute inset-0 flex flex-col items-center justify-center p-6 z-20 cursor-pointer"
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

          {/* Clean text prompt with Unbounded font and MousePointerClick sticker */}
          {isTyped && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
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

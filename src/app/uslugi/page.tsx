"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Send, Plus, Minus } from "lucide-react";
import { SECTIONS } from "./data";
import WaveRule from "@/components/WaveRule";

// 1. Анимированная иконка кода: кавычки разъезжаются, пишется 'code', удаляется, кавычки сужаются
function AnimatedCodeIcon({
  trigger,
  className = "",
}: {
  trigger: number;
  isOpen?: boolean;
  className?: string;
}) {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;

    const word = "www";
    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => {
        setIsTyping(true);
        setText("");
      }, 0)
    );

    // Печатаем по одной букве (145мс на букву, чтобы сохранить ту же общую длительность)
    for (let i = 1; i <= word.length; i++) {
      timers.push(
        setTimeout(() => {
          setText(word.slice(0, i));
        }, 145 * i)
      );
    }

    // Пауза на полном слове
    const pauseTime = 145 * word.length + 325;

    // Стираем буквы по одной (100мс на букву)
    for (let i = word.length - 1; i >= 0; i--) {
      const step = word.length - i;
      timers.push(
        setTimeout(() => {
          setText(word.slice(0, i));
          if (i === 0) {
            setIsTyping(false);
          }
        }, pauseTime + 100 * step)
      );
    }

    return () => timers.forEach(clearTimeout);
  }, [trigger]);

  return (
    <motion.div
      className={`h-6 flex items-center justify-center select-none shrink-0 ${className}`}
      animate={{
        width: isTyping || text ? "auto" : 24,
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      <svg
        className="w-2.5 h-4 shrink-0"
        viewBox="0 0 10 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="7 3 2 8 7 13" />
      </svg>

      <AnimatePresence>
        {(isTyping || text) && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.15 }}
            className="px-1 font-mono text-[16px] md:text-[18px] font-black text-blue-600 dark:text-blue-400 overflow-hidden inline-flex items-center leading-none tracking-normal"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>

      <svg
        className="w-2.5 h-4 shrink-0"
        viewBox="0 0 10 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="3 3 8 8 3 13" />
      </svg>
    </motion.div>
  );
}

// 2. Анимированная иконка робота: приближается (кивок), подмигивает одним глазом и отдаляется
function AnimatedBotIcon({
  trigger,
  className = "",
}: {
  trigger: number;
  isOpen?: boolean;
  className?: string;
}) {
  const [isWinking, setIsWinking] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    const t0 = setTimeout(() => {
      setAnimating(true);
      setIsWinking(false);
    }, 0);

    // При приближении подмигивает глазом в момент максимального зума
    const t1 = setTimeout(() => setIsWinking(true), 200);
    // Открывает глаз
    const t2 = setTimeout(() => setIsWinking(false), 520);
    // Возвращается на исходную
    const t3 = setTimeout(() => setAnimating(false), 800);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [trigger]);

  return (
    <motion.div
      className={`w-6 h-6 flex items-center justify-center shrink-0 ${className}`}
      animate={
        animating
          ? {
              scale: [1, 1.35, 1.35, 1],
              y: [0, -3, -2.5, 0],
              rotate: [0, -5, 3, 0],
            }
          : { scale: 1, y: 0, rotate: 0 }
      }
      transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <svg
        className="w-6 h-6 overflow-visible"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Антенна */}
        <line x1="12" y1="2" x2="12" y2="6" />
        <circle cx="12" cy="2" r="1.2" fill="currentColor" />

        {/* Ушки */}
        <line x1="1.5" y1="12" x2="3.5" y2="12" />
        <line x1="20.5" y1="12" x2="22.5" y2="12" />

        {/* Голова */}
        <rect x="3.5" y="6" width="17" height="12" rx="3" />

        {/* Левый глаз (всегда открыт) */}
        <circle cx="8.5" cy="11" r="1.4" fill="currentColor" stroke="none" />

        {/* Правый глаз (подмигивает в линию при анимации) */}
        {isWinking ? (
          <line
            x1="13.8"
            y1="11"
            x2="17.2"
            y2="11"
            strokeWidth="2.2"
            stroke="currentColor"
          />
        ) : (
          <circle cx="15.5" cy="11" r="1.4" fill="currentColor" stroke="none" />
        )}

        {/* Улыбка */}
        <path d="M9 15 Q12 16.8 15 15" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}

// 3. Анимированная иконка автоматизации: рисуется контур, плавно течёт линия между 2 узлами
function AnimatedWorkflowIcon({
  trigger,
  className = "",
}: {
  trigger: number;
  isOpen?: boolean;
  className?: string;
}) {
  const isFirstRender = trigger === 0;

  return (
    <div
      key={trigger}
      className={`w-6 h-6 flex items-center justify-center shrink-0 overflow-hidden ${className}`}
    >
      <svg
        className="w-6 h-6 overflow-hidden"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Узел 1 (Верхний левый квадратик): прорисовывается по контуру */}
        <motion.path
          d="M 7 11 H 5 A 2 2 0 0 1 3 9 V 5 A 2 2 0 0 1 5 3 H 9 A 2 2 0 0 1 11 5 V 9 A 2 2 0 0 1 9 11 Z"
          initial={isFirstRender ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
        />

        {/* Соединительная линия: плавно вытекает из узла 1 и течёт к узлу 2 */}
        <motion.path
          d="M 7 11 V 15 A 2 2 0 0 0 9 17 H 13"
          initial={isFirstRender ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.2 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            isFirstRender
              ? { duration: 0 }
              : { duration: 0.32, delay: 0.22, ease: "easeInOut" }
          }
        />

        {/* Узел 2 (Нижний правый квадратик): рисуется, как только линия в него втекает */}
        <motion.path
          d="M 13 17 V 15 A 2 2 0 0 1 15 13 H 19 A 2 2 0 0 1 21 15 V 19 A 2 2 0 0 1 19 21 H 15 A 2 2 0 0 1 13 19 Z"
          initial={isFirstRender ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            isFirstRender
              ? { duration: 0 }
              : { duration: 0.3, delay: 0.48, ease: "easeOut" }
          }
        />

        {/* Эффект текущей линии: световой импульс протекает по соединению 2 раза */}
        {!isFirstRender && (
          <motion.path
            d="M 7 11 V 15 A 2 2 0 0 0 9 17 H 13"
            strokeDasharray="4 8"
            initial={{ strokeDashoffset: 12, opacity: 0 }}
            animate={{
              strokeDashoffset: [12, -12],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.5,
              delay: 0.72,
              ease: "linear",
              repeat: 1,
            }}
            strokeWidth="2.2"
            className="text-blue-500 dark:text-blue-400"
          />
        )}
      </svg>
    </div>
  );
}

const ICON_MAP = {
  code: AnimatedCodeIcon,
  bot: AnimatedBotIcon,
  automation: AnimatedWorkflowIcon,
};

const subscribeHash = (cb: () => void) => {
  window.addEventListener("hashchange", cb);
  return () => window.removeEventListener("hashchange", cb);
};

export default function ServicesPage() {
  // Ссылки с главной ведут на /uslugi#id — эта позиция раскрыта по умолчанию
  const hash = useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.slice(1),
    () => ""
  );

  const [activeId, setActiveId] = useState<string | null>(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const h = window.location.hash.slice(1);
      if (SECTIONS.some((s) => s.id === h)) return h;
    }
    return SECTIONS[0].id;
  });

  const [animTrigger, setAnimTrigger] = useState<Record<string, number>>({});

  // Анимация иконки запускается ТОЛЬКО когда блок уже полностью открылся (анимация раскрытия длится 300ms)
  useEffect(() => {
    if (!activeId) return;

    const timer = setTimeout(() => {
      setAnimTrigger((prev) => ({ ...prev, [activeId]: (prev[activeId] || 0) + 1 }));
    }, 320);

    return () => clearTimeout(timer);
  }, [activeId]);

  // Центрирование один раз при переходе по ссылке/хэшу с главной страницы
  useEffect(() => {
    if (!hash || !SECTIONS.some((s) => s.id === hash)) return;

    // Единичный плавный скролл в центр экрана после открытия перехода
    const timer = setTimeout(() => {
      setActiveId(hash);
      const el = document.getElementById(hash);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const elCenter = window.scrollY + rect.top + rect.height / 2;
      const targetScroll = Math.max(0, elCenter - window.innerHeight / 2);
      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }, 120);

    return () => clearTimeout(timer);
  }, [hash]);

  // При клике на самой странице - переключаем активную плашку
  const toggleAccordion = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-16 border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-3xl">
          <div className="w-fit mb-6">
            <WaveRule className="mb-5" />
            <h1 className="text-4xl md:text-6xl font-light tracking-tight">
              Наши Услуги
            </h1>
          </div>
          <p className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
            Нажмите на любую позицию для раскрытия подробного состава пакета и условий работы.
          </p>
        </div>
      </section>

      {/* Services List with generous bottom padding to allow any card to center */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-[50vh]">
        <div className="divide-y divide-neutral-200 dark:divide-neutral-800 border-t border-b border-neutral-200 dark:border-neutral-800">
          {SECTIONS.map((sec) => {
            const isOpen = activeId === sec.id;
            const Icon = ICON_MAP[sec.iconName];

            return (
              <div key={sec.id} id={sec.id} className="py-6 transition-colors">
                <button
                  onClick={() => toggleAccordion(sec.id)}
                  className="w-full text-left flex items-center justify-between gap-4 py-2 group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4 sm:gap-6">
                    <span className="text-sm font-mono text-neutral-400 font-semibold min-w-[30px]">
                      [{sec.num}]
                    </span>
                    <Icon
                      trigger={animTrigger[sec.id] || 0}
                      isOpen={isOpen}
                      className={`transition-colors ${
                        isOpen
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300"
                      }`}
                    />
                    <div>
                      <h2 className="text-xl md:text-3xl font-light tracking-tight text-neutral-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {sec.title}
                      </h2>
                      <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 font-light mt-1 hidden sm:block">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <span className="text-sm font-mono font-medium text-blue-600 dark:text-blue-400 hidden md:block">
                      {sec.price}
                    </span>
                    <div className={`w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-transform duration-300 ${isOpen ? "bg-neutral-950 text-white dark:bg-white dark:text-black rotate-180" : "group-hover:border-neutral-400"}`}>
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 pb-4 pl-0 sm:pl-16 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                        <div className="md:col-span-8 space-y-4">
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light block sm:hidden">
                            {sec.subtitle}
                          </p>
                          <h3 className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                            Состав пакета:
                          </h3>
                          <ul className="space-y-3">
                            {sec.bullets.map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-3 text-sm text-neutral-700 dark:text-neutral-300">
                                <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="md:col-span-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
                          <div>
                            <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-1">Стоимость</div>
                            <div className="text-2xl font-light text-blue-600 dark:text-blue-400">{sec.price}</div>
                            <div className="text-xs text-neutral-400 mt-1 font-mono">{sec.time}</div>
                          </div>

                          <a
                            href="https://t.me/maetti_agency_stub"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-xs py-3 hover:bg-blue-600 hover:dark:bg-blue-400 hover:text-white dark:hover:text-white transition-all duration-300"
                          >
                            <span>Обсудить задачу</span>
                            <Send className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

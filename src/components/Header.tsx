"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
import { Send } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/keysy", label: "Кейсы" },
  { href: "/team", label: "Команда" },
  { href: "/contacts", label: "Контакты" },
];

// Бегущая волна — нижняя кромка шапки. Точки синусоиды в objectBoundingBox
// (0..1), кадры = сдвиг фазы -> волна едет вбок, цикл бесшовный.
// Амплитуда в долях, поэтому для закрытой (низкой) шапки она больше:
// в пикселях волна получается примерно одинаковой в обоих состояниях.
const AMP = { closed: 0.115, open: 0.035 };
const PHASES = Array.from({ length: 9 }, (_, i) => (i * Math.PI) / 4); // 0..2PI

const wavePoints = (phase: number, amp: number) =>
  Array.from({ length: 41 }, (_, i) => {
    const x = 1 - i / 40;
    const y = 0.88 + amp * Math.sin(x * 2 * Math.PI + phase);
    return `${x.toFixed(3)},${y.toFixed(3)}`;
  }).join(" L ");

const frames = (amp: number, shift = 0) =>
  PHASES.map((p) => wavePoints(p + shift, amp));

const fill = (pts: string[]) => pts.map((p) => `M 0,0 L 1,0 L ${p} Z`);
const line = (pts: string[]) => pts.map((p) => `M ${p}`);

const WAVE_FILL = {
  closed: fill(frames(AMP.closed)),
  open: fill(frames(AMP.open)),
};
const WAVE_LINE = {
  closed: line(frames(AMP.closed)),
  open: line(frames(AMP.open)),
};
const WAVE_ECHO = {
  closed: line(frames(AMP.closed, Math.PI / 2)),
  open: line(frames(AMP.open, Math.PI / 2)),
};

const listVariants = {
  open: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
  closed: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants = {
  open: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
  closed: {
    opacity: 0,
    x: -28,
    filter: "blur(4px)",
    transition: { duration: 0.15 },
  },
};

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const state = isOpen ? "open" : "closed";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <MotionConfig reducedMotion="user">
      {/* ClipPath Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="liquid-glass-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              d={WAVE_FILL.closed[0]}
              animate={{ d: reduce ? WAVE_FILL[state][0] : WAVE_FILL[state] }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 6, repeat: Infinity, ease: "linear" }
              }
            />
          </clipPath>
        </defs>
      </svg>

      <header className="fixed top-0 left-0 right-0 z-50 h-24">
        {/* Клик мимо меню — закрыть */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="fixed top-24 left-0 right-0 bottom-0 bg-black/20 md:hidden"
              aria-hidden="true"
            />
          )}
        </AnimatePresence>

        {/* Единая поверхность: шапка и выехавшее меню — один кусок стекла,
            который опускается вместе со своей волной */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none">
          <div
            className="absolute inset-0 bg-white/25 dark:bg-black/25 backdrop-blur-xl transition-colors duration-300"
            style={{
              clipPath: "url(#liquid-glass-clip)",
              boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
            }}
          />

          {/* Гребень волны — виден, пока меню открыто */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1 1"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <motion.path
              d={WAVE_ECHO.closed[0]}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
              className="text-blue-500/30"
              animate={{
                pathLength: isOpen ? 1 : 0,
                opacity: isOpen ? 1 : 0,
                d: reduce ? WAVE_ECHO[state][0] : WAVE_ECHO[state],
              }}
              transition={{
                d: reduce
                  ? { duration: 0 }
                  : { duration: 9, repeat: Infinity, ease: "linear" },
                pathLength: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
            />
            <motion.path
              d={WAVE_LINE.closed[0]}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              vectorEffect="non-scaling-stroke"
              className="text-blue-600"
              animate={{
                pathLength: isOpen ? 1 : 0,
                opacity: isOpen ? 1 : 0,
                d: reduce ? WAVE_LINE[state][0] : WAVE_LINE[state],
              }}
              transition={{
                d: reduce
                  ? { duration: 0 }
                  : { duration: 6, repeat: Infinity, ease: "linear" },
                pathLength: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.3 },
              }}
            />
          </svg>

          {/* Место под верхнюю строку шапки */}
          <div className="h-24" />

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="menu-panel"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden pointer-events-auto md:hidden"
              >
                <motion.div
                  variants={listVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  className="px-6 pt-2 pb-24 flex flex-col gap-6"
                >
                  <nav className="flex flex-col gap-4">
                    {NAV_LINKS.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <motion.div key={link.href} variants={itemVariants}>
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block text-lg font-bold ${
                              isActive
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-foreground/75 hover:text-foreground"
                            } transition-colors`}
                          >
                            {link.label}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </nav>

                  <motion.div
                    variants={itemVariants}
                    className="h-px bg-foreground/10 w-full"
                  />

                  <motion.a
                    variants={itemVariants}
                    href="https://t.me/maetti_agency_stub"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="w-full justify-center inline-flex items-center gap-2 bg-foreground text-background font-bold px-6 py-3.5 rounded-full active:scale-95 transition-transform duration-200 shadow-md text-sm"
                  >
                    <Send className="w-4 h-4" />
                    <span>Написать в Telegram</span>
                  </motion.a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-3xl font-extrabold tracking-tighter text-foreground group-hover:scale-105 transition-transform duration-200">
              maetti<span className="text-blue-600">.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-sm font-semibold tracking-wide text-foreground/80 hover:text-foreground transition-colors py-2"
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="https://t.me/maetti_agency_stub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-foreground text-background font-bold px-5 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Написать в Telegram</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative z-50 -mr-2 flex h-10 w-10 flex-col items-center justify-center gap-1.5 text-foreground focus:outline-none active:scale-90 transition-transform"
            aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isOpen}
          >
            <motion.span
              className="block h-0.5 w-6 rounded-full bg-current origin-center"
              animate={isOpen ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            />
            <motion.span
              className="block h-0.5 w-6 rounded-full bg-current origin-center"
              animate={isOpen ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
            />
          </button>
        </div>
      </header>
    </MotionConfig>
  );
}

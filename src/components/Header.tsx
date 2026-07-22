"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Send } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Главная" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/keysy", label: "Кейсы" },
  { href: "/team", label: "Команда" },
  { href: "/contacts", label: "Контакты" },
];

// Normalized SVG paths for clipPathUnits="objectBoundingBox"
// Each path goes from (0,0) -> (1,0) -> (1,Y) -> curve to (0,Y) -> Z
const PATHS = [
  "M 0,0 L 1,0 L 1,0.78 C 0.85,0.92 0.72,0.68 0.5,0.85 C 0.28,1.02 0.15,0.72 0,0.84 Z",
  "M 0,0 L 1,0 L 1,0.84 C 0.88,0.72 0.68,0.96 0.5,0.76 C 0.32,0.56 0.12,0.88 0,0.8 Z",
  "M 0,0 L 1,0 L 1,0.74 C 0.82,0.86 0.64,0.74 0.48,0.92 C 0.32,1.1 0.18,0.82 0,0.88 Z"
];

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ClipPath Definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="liquid-glass-clip" clipPathUnits="objectBoundingBox">
            <motion.path
              animate={{
                d: [PATHS[0], PATHS[1], PATHS[2], PATHS[0]],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </clipPath>
        </defs>
      </svg>

      <header className="fixed top-0 left-0 right-0 z-50 h-24 transition-all duration-300">
        {/* Animated backdrop glass background */}
        <div
          className="absolute inset-0 bg-white/25 dark:bg-black/25 backdrop-blur-xl border-b border-white/10 dark:border-black/10 transition-all duration-300"
          style={{
            clipPath: "url(#liquid-glass-clip)",
            boxShadow: scrolled
              ? "0 4px 30px rgba(0, 0, 0, 0.1)"
              : "none",
          }}
        />

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
            className="md:hidden p-2 text-foreground/80 hover:text-foreground focus:outline-none z-50"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="absolute top-24 left-0 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-2xl border-b border-neutral-200 dark:border-neutral-800 px-6 py-8 flex flex-col gap-6 md:hidden shadow-2xl"
            >
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-bold ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-foreground/75 hover:text-foreground"
                      } transition-colors`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800 w-full" />

              <a
                href="https://t.me/maetti_agency_stub"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="w-full justify-center inline-flex items-center gap-2 bg-foreground text-background font-bold px-6 py-3.5 rounded-full hover:scale-105 transition-all duration-200 shadow-md text-sm"
              >
                <Send className="w-4 h-4" />
                <span>Написать в Telegram</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

// Штора перехода между страницами: полотно в высоту экрана + полоса волны под
// ним. Едет сверху вниз (закрывает старую страницу), после чего идёт push, и
// как только новый путь смонтирован — уезжает обратно вверх.
// Путь нарисован на два периода, `.wave-rule` тянет его влево ровно на один
// (viewBox шириной 200 = один период), так что волна ещё и бежит вбок.
const SHEET_BAND = 80; // px, высота полосы с волной
const SHEET_WAVE = "M 0,50 q 50,-40 100,0 t 100,0 t 100,0 t 100,0";
const SHEET_FILL = `${SHEET_WAVE} L 400,0 L 0,0 Z`;

// Детские каракули на шторе. Каждая рисуется в своём viewBox, strokeWidth
// делится на масштаб — обводка на экране везде одинаковой толщины.
// Движение разложено на два слоя, потому что ход и качка живут в разных
// периодах и один transform им не поделить: обёртка везёт фигурку по
// горизонтали (`travel`), сама картинка внутри качается/крутится (`motion`).
// Периоды и размах приходят через CSS-переменные, они наследуются вниз —
// так до путей внутри волны дотягивается её собственный период ряби.
type Art = {
  box: [number, number];
  travel: string; // класс обёртки, "" — стоит на месте
  motion: string; // класс самой картинки
  dur: string; // период хода / вращения / порыва
  reach: string; // размах горизонтального хода
  sway: string; // период качки или ряби
  k?: number; // поправка к масштабу раскладки
  el: React.ReactNode;
};

const ART: Record<
  "wind" | "boat" | "fin" | "ring" | "raft" | "whirl" | "wave",
  Art
> = {
  // Ветер: три штриха с завитками, порывами пролетают вбок и тают.
  wind: {
    box: [46, 30],
    travel: "",
    motion: "doodle-gust",
    dur: "4.6s",
    reach: "0",
    sway: "0s",
    el: (
      <>
        <path d="M 2,8 q 18,-6 34,-1 a 5,5 0 1 0 -5,5" />
        <path d="M 8,17 q 14,-5 28,-1 a 4,4 0 1 0 -4,4" />
        <path d="M 4,25 q 12,-4 24,-1" />
      </>
    ),
  },
  boat: {
    box: [48, 44],
    travel: "doodle-sail",
    motion: "doodle-bob",
    dur: "13s",
    reach: "5vw",
    sway: "3.6s",
    el: (
      <>
        <path d="M 6,30 L 42,30 L 36,39 L 12,39 Z" />
        <path d="M 24,30 L 24,5" />
        <path d="M 27,8 L 39,29 L 27,29 Z" />
        <path d="M 21,13 L 12,29 L 21,29 Z" />
      </>
    ),
  },
  // Акула идёт быстрее и дальше всех — она плывёт, а не дрейфует.
  fin: {
    box: [40, 36],
    travel: "doodle-sail",
    motion: "doodle-bob",
    dur: "9s",
    reach: "8vw",
    sway: "2.8s",
    el: (
      <>
        <path d="M 5,28 C 9,15 17,6 31,3 C 22,12 19,20 19,28" />
        <path d="M 0,28 q 5,-4 10,0 t 10,0 t 10,0 t 10,0" />
      </>
    ),
  },
  ring: {
    box: [40, 40],
    travel: "doodle-sail",
    motion: "doodle-bob",
    dur: "15s",
    reach: "3.5vw",
    sway: "3.2s",
    el: (
      <>
        <circle cx="20" cy="20" r="16" />
        <circle cx="20" cy="20" r="6.5" />
        <path d="M 20,4 v 9.5 M 20,26.5 v 9.5 M 4,20 h 9.5 M 26.5,20 h 9.5" />
      </>
    ),
  },
  raft: {
    box: [56, 26],
    travel: "doodle-sail",
    motion: "doodle-bob",
    dur: "14s",
    reach: "4vw",
    sway: "4.2s",
    el: (
      <>
        <path d="M 9,5 h 38 a 8,8 0 0 1 0,16 h -38 a 8,8 0 0 1 0,-16 z" />
        <path d="M 19,5 v 16 M 28,5 v 16 M 37,5 v 16" />
      </>
    ),
  },
  // Водоворот: спираль из дуг с убывающим радиусом, крутится на месте.
  whirl: {
    box: [40, 40],
    travel: "",
    motion: "doodle-spin",
    dur: "9s",
    reach: "0",
    sway: "0s",
    el: (
      <path d="M 36,20 A 16,16 0 1 1 20,4 A 14,14 0 1 1 10,20 A 10,10 0 1 1 20,30 A 6,6 0 1 1 26,20 A 4,4 0 1 1 20,17" />
    ),
  },
  // Волна: линия нарисована на четыре периода и уезжает ровно на один
  // (30 единиц) — гребни бегут, стык не виден.
  wave: {
    box: [60, 12],
    travel: "",
    motion: "",
    dur: "0s",
    reach: "0",
    sway: "2.6s",
    k: 1.5,
    el: (
      <path
        className="doodle-ripple"
        d="M -30,6 q 7.5,-4 15,0 t 15,0 t 15,0 t 15,0 t 15,0 t 15,0 t 15,0 t 15,0"
      />
    ),
  },
};

// Состав сцены фиксирован, меняется только раскладка: 10 вариантов, по одному
// [left%, top%, масштаб, наклон] на каждый элемент в этом же порядке.
// Композиция во всех: ветер держится верхней трети (там «воздух»), водоворот —
// нижней половины, масштаб растёт сверху вниз, так что мелкое читается как
// далёкое. Штора едет вниз, поэтому первым в кадр входит крупный ближний план.
const SCENE_ORDER: (keyof typeof ART)[] = [
  "wind", "wind", "boat", "boat", "fin", "fin",
  "ring", "raft", "whirl", "wave", "wave", "wave",
];

const LAYOUTS: [number, number, number, number][][] = [
  [[18,16,0.95,-4],[74,22,0.85,3],[32,38,1.2,-4],[78,58,1.45,4],[55,30,0.9,0],[22,72,1.5,-5],[86,42,1.1,0],[46,86,1.6,-5],[12,52,1.25,0],[66,68,1.35,0],[10,32,0.95,0],[34,58,1.15,0]],
  [[72,18,0.9,4],[26,26,1,-3],[62,44,1.3,3],[18,66,1.5,-4],[44,34,0.95,0],[80,74,1.45,4],[12,40,1.05,0],[56,86,1.6,4],[86,54,1.2,0],[34,54,1.1,0],[68,62,1.25,0],[20,88,1.4,0]],
  [[34,15,0.85,-5],[82,26,0.95,4],[20,36,1.15,-3],[66,70,1.5,4],[50,48,1.2,0],[14,80,1.45,-4],[86,58,1.25,0],[34,64,1.35,5],[60,30,1,0],[10,54,1.05,0],[44,86,1.5,0],[88,84,1.35,0]],
  [[60,17,0.9,3],[14,24,0.95,-4],[42,50,1.3,4],[84,34,1.05,-3],[24,44,1.1,0],[62,78,1.5,5],[30,72,1.4,0],[76,86,1.55,-4],[88,62,1.15,0],[52,30,0.9,0],[10,62,1.2,0],[40,88,1.45,0]],
  [[46,16,1,-3],[86,28,0.85,4],[24,52,1.35,-4],[68,38,1.1,3],[40,68,1.35,0],[88,72,1.3,-5],[14,32,0.95,0],[62,86,1.6,4],[52,56,1.2,0],[30,26,0.9,0],[76,58,1.25,0],[18,86,1.45,0]],
  [[22,20,0.9,4],[66,15,0.95,-3],[50,40,1.25,-4],[16,70,1.5,4],[78,48,1.15,0],[44,82,1.5,-4],[88,32,1,0],[70,74,1.5,5],[30,56,1.2,0],[60,62,1.2,0],[10,42,1,0],[84,88,1.5,0]],
  [[38,18,0.95,-4],[80,24,0.9,3],[14,42,1.15,4],[58,66,1.45,-3],[34,56,1.15,0],[86,80,1.4,4],[68,40,1.05,0],[22,84,1.55,-5],[48,32,0.95,0],[88,58,1.2,0],[12,64,1.15,0],[56,88,1.5,0]],
  [[70,20,0.9,-3],[20,15,0.95,4],[40,34,1.1,3],[74,62,1.45,-4],[12,50,1.2,0],[52,78,1.45,5],[34,60,1.25,0],[84,86,1.55,4],[62,44,1.1,0],[88,36,0.95,0],[24,84,1.5,0],[10,70,1.3,0]],
  [[52,14,0.9,4],[12,26,0.95,-4],[30,48,1.25,-3],[80,44,1.2,4],[62,30,0.9,0],[26,78,1.45,-5],[48,66,1.3,0],[78,84,1.55,5],[10,62,1.15,0],[66,56,1.15,0],[88,66,1.25,0],[44,88,1.45,0]],
  [[28,22,0.95,3],[76,16,0.9,-4],[56,52,1.35,4],[16,38,1.05,-3],[84,60,1.25,0],[38,74,1.4,4],[70,34,1,0],[14,86,1.55,-4],[44,34,1,0],[10,58,1.15,0],[88,84,1.45,0],[60,72,1.3,0]],
];

function SheetScene({ layout }: { layout: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden text-blue-600/45">
      {SCENE_ORDER.map((kind, i) => {
        const { box: [w, h], travel, motion: anim, dur, reach, sway, k, el } =
          ART[kind];
        const [left, top, depth, rot] = LAYOUTS[layout][i];
        const s = depth * (k ?? 1);
        return (
          <div
            key={i}
            className={`doodle ${travel}`}
            style={
              {
                left: `${left}%`,
                top: `${top}%`,
                // мелкое = далёкое, поэтому и бледнее; поправка k сюда не идёт
                opacity: 0.55 + (depth - 0.85) * 0.45,
                "--dur": dur,
                "--reach": reach,
                "--sway": sway,
                "--phase": `${-i * 1.7}s`,
              } as React.CSSProperties
            }
          >
            <svg
              viewBox={`0 0 ${w} ${h}`}
              width={w * s}
              height={h * s}
              className={anim}
              style={{ rotate: `${rot}deg` }}
              fill="none"
              stroke="currentColor"
              strokeWidth={2 / s}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {el}
            </svg>
          </div>
        );
      })}
    </div>
  );
}

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
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pending, setPending] = useState<{ href: string; from: string } | null>(
    null,
  );
  // Раскладка каракулей — своя на каждый переход. Стартовая фиксирована,
  // иначе SSR и клиент разойдутся на гидратации.
  const [layout, setLayout] = useState(0);
  const reduce = useReducedMotion();
  const state = isOpen ? "open" : "closed";
  // Вода в шапке. Наверху страницы её нет — шапка пропускает фон насквозь;
  // при скролле, открытом меню или переходе она спускается со своей волной.
  // На переходе завязана прямо на pending, поэтому уходит вверх вместе со
  // шторой, а не ждёт, пока та поднимется.
  const submerged = scrolled || isOpen || !!pending;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Путь сменился — даём новой странице смонтироваться за шторой (на главной
  // three.js-куб грузит главный поток и дёргает подъём), потом поднимаем.
  useEffect(() => {
    if (!pending || pending.from === pathname) return;
    const t = setTimeout(() => setPending(null), 400);
    return () => clearTimeout(t);
  }, [pending, pathname]);

  // Перехватываем SPA-переход: сначала опускаем штору, push уже после неё.
  const startTransition = (href: string) => (e: { preventDefault(): void }) => {
    if (href === pathname) return;
    e.preventDefault();
    if (!pending) {
      setPending({ href, from: pathname });
      setLayout(Math.floor(Math.random() * LAYOUTS.length));
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[45] pointer-events-none"
        style={{ height: `calc(100dvh + ${SHEET_BAND}px)` }}
        initial={false}
        animate={{ y: pending ? "0%" : "-100%" }}
        transition={
          reduce
            ? { duration: 0 }
            : {
                duration: pending ? 0.55 : 0.65,
                ease: [0.22, 1, 0.36, 1],
                // Спуск ждёт, пока шапка докрасится в голубой
                delay: pending ? 0.2 : 0,
              }
        }
        onAnimationComplete={() => pending && router.push(pending.href)}
      >
        <div
          className="absolute inset-x-0 top-0 bg-sky-100"
          style={{ bottom: SHEET_BAND }}
        >
          <SheetScene layout={layout} />
        </div>
        <svg
          className="absolute inset-x-0 bottom-0 w-full text-blue-600"
          style={{ height: SHEET_BAND }}
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
        >
          <path className="wave-rule fill-sky-100" d={SHEET_FILL} />
          <path
            className="wave-rule"
            d={SHEET_WAVE}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </motion.div>

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
          {/* Вода со своей волной и гребнем едет вниз целиком — тот же жест,
              что и у шторы перехода, только на высоту шапки. Наверху страницы
              она убрана вверх, и сквозь шапку виден фон самой страницы. */}
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ y: submerged ? "0%" : "-100%" }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: submerged ? 0.5 : 0.38, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div
              className={`absolute inset-0 backdrop-blur-xl transition-colors duration-200 ${
                pending ? "bg-sky-100" : "bg-sky-100/85"
              }`}
              style={{
                clipPath: "url(#liquid-glass-clip)",
                boxShadow: scrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
              }}
            />

            {/* Гребень волны — кромка воды */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1 1"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <motion.path
                d={WAVE_LINE.closed[0]}
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
                className="text-blue-600"
                // На переходе гребень прячем: под шапкой такое же голубое
                // полотно шторы, и линия читалась бы швом поперёк заставки.
                // Не анимировать здесь pathLength: framer-motion делает его через
                // stroke-dasharray, а с non-scaling-stroke длины штрихов считаются в
                // экранных пикселях — линия при таком viewBox рассыпается в точки.
                // Появление и так на opacity.
                animate={{
                  opacity: submerged && !pending ? 1 : 0,
                  d: reduce ? WAVE_LINE[state][0] : WAVE_LINE[state],
                }}
                transition={{
                  d: reduce
                    ? { duration: 0 }
                    : { duration: 6, repeat: Infinity, ease: "linear" },
                  opacity: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                }}
              />
            </svg>
          </motion.div>

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
                            onNavigate={startTransition(link.href)}
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
          <Link
            href="/"
            onNavigate={startTransition("/")}
            className="group flex items-center gap-2"
          >
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
                  onNavigate={startTransition(link.href)}
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

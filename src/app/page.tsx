"use client";

import {
  Fragment,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, Layers, Cpu, Award, MousePointerClick } from "lucide-react";
import WaveRule from "@/components/WaveRule";
import { TransitionLink } from "@/context/TransitionContext";
import ServicesSection from "@/components/ServicesSection";

const BLOB_FLOOR_LIFT = 20;

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
}

const BLOBS = [
  {
    className: "w-96 h-96 bg-purple-500/40 blur-[100px]",
    start: [0.28, 0.32] as const,
  },
  {
    className: "w-[25rem] h-[25rem] bg-blue-500/30 blur-[120px]",
    start: [0.72, 0.48] as const,
  },
];

function HeroBlob({
  spec,
  stageRef,
  ctaEl,
  reduceMotion,
}: {
  spec: (typeof BLOBS)[number];
  stageRef: RefObject<HTMLDivElement | null>;
  ctaEl: HTMLDivElement | null;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    const stage = stageRef.current;
    if (!el || !stage) return;

    // кэшируем размеры, чтобы не дергать getBoundingClientRect каждый кадр
    let cachedBox = { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const updateBox = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      const floor = ctaEl
        ? ctaEl.getBoundingClientRect().top -
          stage.getBoundingClientRect().top -
          BLOB_FLOOR_LIFT
        : h * 0.35;
      cachedBox = {
        minX: w * 0.06,
        maxX: w * 0.94,
        minY: 0,
        maxY: Math.max(0, floor),
      };
    };
    updateBox();

    const b0 = cachedBox;
    let x = b0.minX + spec.start[0] * (b0.maxX - b0.minX);
    let y = Math.min(b0.maxY, b0.minY + spec.start[1] * (b0.maxY - b0.minY));
    el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;

    if (reduceMotion) return;

    let fromX = x;
    let fromY = y;
    let cX = x;
    let cY = y;
    let toX = x;
    let toY = y;
    let start = performance.now();
    let dur = 1;
    let raf = 0;
    let paused = document.hidden;
    const wobblePhase = Math.random() * Math.PI * 2;
    const wobbleA = rand(22, 48);
    const wobbleB = rand(14, 32);
    const wobbleSpeedA = rand(0.55, 1.15);
    const wobbleSpeedB = rand(0.9, 1.7);

    const retarget = (now: number) => {
      const b = cachedBox;
      fromX = x;
      fromY = y;
      let tries = 0;
      do {
        toX = rand(b.minX, b.maxX);
        toY = rand(b.minY, b.maxY);
        tries += 1;
      } while (Math.hypot(toX - fromX, toY - fromY) < 90 && tries < 8);
      const mx = (fromX + toX) / 2;
      const my = (fromY + toY) / 2;
      const dx = toX - fromX;
      const dy = toY - fromY;
      const len = Math.hypot(dx, dy) || 1;
      const side = Math.random() < 0.5 ? 1 : -1;
      const bend = rand(0.3, 0.95) * len;
      cX = Math.min(b.maxX, Math.max(b.minX, mx + (-dy / len) * bend * side));
      cY = Math.min(b.maxY, Math.max(b.minY, my + (dx / len) * bend * side));
      start = now;
      dur = rand(3200, 9000);
    };

    retarget(performance.now());

    const tick = (now: number) => {
      if (paused) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const b = cachedBox;
      let t = (now - start) / dur;
      if (t >= 1) {
        retarget(now);
        t = 0;
      }
      const e = easeInOut(Math.min(1, t));
      const omt = 1 - e;
      x = omt * omt * fromX + 2 * omt * e * cX + e * e * toX;
      y = omt * omt * fromY + 2 * omt * e * cY + e * e * toY;
      const n = now * 0.001;
      x += wobbleA * Math.sin(n * wobbleSpeedA + wobblePhase);
      y += wobbleB * Math.cos(n * wobbleSpeedB + wobblePhase * 1.3);
      x = Math.min(b.maxX, Math.max(b.minX, x));
      y = Math.min(b.maxY, Math.max(b.minY, y));
      el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onVis = () => {
      paused = document.hidden;
      if (!paused) start = performance.now() - (performance.now() - start);
    };
    document.addEventListener("visibilitychange", onVis);
    const ro = new ResizeObserver(updateBox);
    ro.observe(stage);
    if (ctaEl) ro.observe(ctaEl);
    window.addEventListener("resize", updateBox, { passive: true });

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", updateBox);
      ro.disconnect();
    };
  }, [ctaEl, reduceMotion, spec, stageRef]);

  return (
    <div
      ref={ref}
      className={`absolute rounded-full will-change-transform ${spec.className}`}
      style={{ left: 0, top: 0 }}
    />
  );
}

function HeroBlobs({
  ctaEl,
  reduceMotion,
}: {
  ctaEl: HTMLDivElement | null;
  reduceMotion: boolean | null;
}) {
  const stageRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-30"
      aria-hidden
    >
      {BLOBS.map((spec) => (
        <HeroBlob
          key={spec.className}
          spec={spec}
          stageRef={stageRef}
          ctaEl={ctaEl}
          reduceMotion={!!reduceMotion}
        />
      ))}
    </div>
  );
}

const WinDesktop = dynamic(() => import("@/components/WinDesktop"), {
  ssr: false,
  loading: () => <div className="h-[100svh] w-full bg-gradient-to-b from-[#1a4f8a] to-[#a9dbf5]" aria-hidden />,
});



const ADVANTAGES = [
  {
    title: "Фокус на окупаемости",
    desc: "Мы не просто пишем код - мы создаем инструменты для масштабирования вашего бизнеса.",
    icon: Award,
  },
  {
    title: "Полный цикл разработки",
    desc: "От предпроектной аналитики и дизайна до выкатки на продакшн и поддержки.",
    icon: Layers,
  },
  {
    title: "Современный стек",
    desc: "Используем передовые фреймворки. Никакого легаси-кода - всё летает и легко масштабируется.",
    icon: Cpu,
  },
];

// Слово-перевертыш: MAETTI, прочитанное наоборот, - это IT TEAM.
// Каждая буква - отдельный элемент с layout-анимацией, поэтому при смене
// порядка они физически разъезжаются на новые места, а не подменяются.
// Живет прямо внутри заголовка «КТО ТАКИЕ ...?» - клик по слову
// превращает вопрос в ответ.
const FLIP_LETTERS = ["M", "A", "E", "T", "T", "I"];

function MaettiWord() {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();

  const order = flipped ? [5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5];
  // Пробел после второй буквы в разобранном виде: IT | TEAM
  const gapAfter = new Set(flipped ? [4] : []);

  return (
    <span className="relative inline-flex flex-col items-center group">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        aria-pressed={flipped}
        aria-label="Перевернуть слово MAETTI"
        title={flipped ? "Вернуть MAETTI" : "Нажмите: MAETTI наоборот"}
        className="inline-flex items-baseline cursor-pointer select-none focus:outline-none"
      >
        {order.map((i) => (
          <Fragment key={i}>
            <motion.span
              layout={!reduce}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className={`inline-block transition-colors duration-500 ${
                flipped && (i === 5 || i === 4) ? "text-blue-600" : ""
              }`}
            >
              {FLIP_LETTERS[i]}
            </motion.span>
            {gapAfter.has(i) && (
              <motion.span
                initial={false}
                animate={{ width: flipped ? "0.15em" : "0em" }}
                transition={reduce ? { duration: 0 } : { duration: 0.4 }}
                className="inline-block"
              />
            )}
          </Fragment>
        ))}
      </button>
      {/* Подсказка абсолютом: занимает место под словом, не влияя на строку
          заголовка и поток секции. Ловит hover со слова через group. */}
      <span
        aria-hidden="true"
        className="absolute top-full left-0 -translate-x-1/0 sm:left-1/2 sm:-translate-x-1/2 mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400/60 dark:text-neutral-500/60 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 whitespace-nowrap"
      >
        {flipped ? (
          "↑ мы — it-команда"
        ) : (
          <>
            ↑ нажми
            <MousePointerClick className="inline ml-1 -mt-0.5 w-3.5 h-3.5" />
          </>
        )}
      </span>
    </span>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [ctaEl, setCtaEl] = useState<HTMLDivElement | null>(null);

  const MARQUEE_ITEMS = [
    "ВЕБ-САЙТЫ",
    "TELEGRAM-БОТЫ",
    "АВТОМАТИЗАЦИЯ",
    "СЛОЖНЫЕ ИНТЕГРАЦИИ",
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden px-6 -mt-24 pt-24 pb-28 sm:pb-32 bg-white text-neutral-950">
        {/* Colorful blob backgrounds. Центр круга не ниже линии на 20px выше CTA. */}
        <HeroBlobs ctaEl={ctaEl} reduceMotion={shouldReduceMotion} />

        <div className="relative max-w-7xl mx-auto w-full z-10">
          {/* Kinetic Offer */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 select-none break-words">
            ПОКОРЯЙТЕ <br />
            <span className="animate-gradient-flow">
              ЦИФРОВУЮ СТИХИЮ.
            </span> <br />
            <span className="text-neutral-900">
              РАЗРАБОТКА НА ЛЮБОЙ <br />
              <span className="animate-gradient-flow">ГЛУБИНЕ</span> СЛОЖНОСТИ.
            </span>
          </h1>

          <p className="max-w-2xl text-lg sm:text-xl text-neutral-500 leading-relaxed mb-6">
            Создаем технологичные решения, которые выведут ваш продукт в&nbsp;топ. Разрабатываем сайты, автоматизируем процессы и&nbsp;строим экосистемы.
          </p>

          <div ref={setCtaEl} className="flex flex-wrap gap-4">
            <TransitionLink
              href="/contacts"
              className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-full text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Связаться с нами
            </TransitionLink>
            <TransitionLink
              href="/uslugi"
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>Наши услуги</span>
              <ChevronRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>

        {/* Endless scrolling kinetic typography */}
        {!shouldReduceMotion ? (
          <div className="absolute bottom-6 left-0 right-0 w-full overflow-hidden py-4 border-y border-neutral-200 select-none bg-white/50 backdrop-blur-xs pointer-events-none">
            <div className="flex whitespace-nowrap animate-marquee">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 md:gap-10 text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-300 uppercase tracking-widest px-4 md:px-6"
                >
                  {MARQUEE_ITEMS.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-6 md:gap-10">
                      <span className="hover:text-blue-600 transition-colors">
                        {item}
                      </span>
                      <span className="text-blue-500 font-black">•</span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute bottom-6 left-0 right-0 w-full py-4 border-y border-neutral-200 bg-white/40 text-center text-neutral-400 text-sm font-bold tracking-widest uppercase">
            {MARQUEE_ITEMS.join(" • ")}
          </div>
        )}
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <ServicesSection />

      {/* 3. WHO IS MAETTI */}
      <section className="py-24 px-6 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-900">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="w-fit mb-6">
              <WaveRule className="mb-4" />
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
                КТО ТАКИЕ <MaettiWord />?
              </h2>
            </div>
            <p className="text-neutral-500 leading-relaxed mb-4">
              Название говорит о&nbsp;нас больше, чем кажется на&nbsp;первый взгляд. Иногда просто стоит посмотреть на&nbsp;него под другим углом.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-4">
              Всё началось с&nbsp;университетских лабораторий и&nbsp;ночных хакатонов. Каждый из&nbsp;нас строил свою карьеру - фриланс, стартапы, продуктовые компании - пока не&nbsp;стало ясно: лучшие проекты рождаются не&nbsp;в&nbsp;одиночку.
            </p>
            <p className="text-neutral-500 leading-relaxed mb-8">
              MAETTI - это точка сборки: общие стандарты качества, прозрачный процесс и&nbsp;ответственность за&nbsp;каждый этап. Мы&nbsp;берёмся за&nbsp;проекты, которым нужна не&nbsp;просто «разработка», а&nbsp;продуманная инженерная команда.
            </p>
            <TransitionLink
              href="/team"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <span>Познакомиться с командой</span>
              <ChevronRight className="w-4 h-4" />
            </TransitionLink>
          </div>
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-1 gap-6">
            {ADVANTAGES.map((adv, idx) => {
              const Icon = adv.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 flex items-start gap-6"
                >
                  <div className="p-3.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{adv.title}</h3>
                    <p className="text-sm text-neutral-500">{adv.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3.5. РАБОЧИЙ СТОЛ — навигация ярлыками, шапка на нём прячется */}
      <WinDesktop />
    </div>
  );
}

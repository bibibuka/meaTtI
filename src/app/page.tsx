"use client";

import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight, MousePointerClick } from "lucide-react";
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
    className: "w-96 h-96",
    background: "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(168,85,247,0.23) 35%, transparent 72%)",
    start: [0.28, 0.32] as const,
  },
  {
    className: "w-[25rem] h-[25rem]",
    background: "radial-gradient(circle, rgba(59,130,246,0.3) 0%, rgba(59,130,246,0.18) 35%, transparent 72%)",
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
    let offset = 0;
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
      const b = cachedBox;
      let t = (now - start) / dur;
      if (t >= 1) {
        retarget(now);
        t = 0;
      }
      const e = easeInOut(Math.min(1, Math.max(0, t)));
      const omt = 1 - e;
      x = omt * omt * fromX + 2 * omt * e * cX + e * e * toX;
      y = omt * omt * fromY + 2 * omt * e * cY + e * e * toY;
      const n = (now - offset) * 0.001;
      x += wobbleA * Math.sin(n * wobbleSpeedA + wobblePhase);
      y += wobbleB * Math.cos(n * wobbleSpeedB + wobblePhase * 1.3);
      x = Math.min(b.maxX, Math.max(b.minX, x));
      y = Math.min(b.maxY, Math.max(b.minY, y));
      el.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    // Цикл стоит, пока вкладка скрыта или hero далеко за экраном. На время
    // паузы сдвигаем и часы кривой, и часы покачивания — после неё блоб
    // продолжает ровно с того места, где замер, без рывка.
    let running = false;
    let offscreen = false;
    let pausedAt = performance.now();
    const sync = () => {
      const run = !document.hidden && !offscreen;
      if (run === running) return;
      running = run;
      const now = performance.now();
      if (run) {
        start += now - pausedAt;
        offset += now - pausedAt;
        raf = requestAnimationFrame(tick);
      } else {
        pausedAt = now;
        cancelAnimationFrame(raf);
      }
    };
    // Запас в полэкрана: блоб оживает раньше, чем покажется.
    const io = new IntersectionObserver(
      ([entry]) => {
        offscreen = !entry.isIntersecting;
        sync();
      },
      { rootMargin: "50% 0px" },
    );
    io.observe(stage);
    document.addEventListener("visibilitychange", sync);
    const ro = new ResizeObserver(updateBox);
    ro.observe(stage);
    if (ctaEl) ro.observe(ctaEl);
    window.addEventListener("resize", updateBox, { passive: true });

    sync();
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("resize", updateBox);
      io.disconnect();
      ro.disconnect();
    };
  }, [ctaEl, reduceMotion, spec, stageRef]);

  return (
    <div
      ref={ref}
      className={`absolute rounded-full will-change-transform ${spec.className}`}
      style={{ left: 0, top: 0, background: spec.background }}
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

// Заглушка на месте стола, пока его код не загружен. Класс desk-shell нужен
// водолазу: по нему он считает, где остановиться.
const DESK_STUB = "desk-shell h-dvh w-full bg-gradient-to-b from-[#1a4f8a] to-[#a9dbf5]";

const WinDesktop = dynamic(() => import("@/components/WinDesktop"), {
  ssr: false,
  loading: () => <div className={DESK_STUB} aria-hidden />,
});

// Стол в самом низу главной: монтируем его (а с ним плеер и запрос mp3),
// только когда до него остаётся экран прокрутки.
function LazyDesk() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Код подгружаем при приближении к столу, а монтируем чуть позже.
    // Так быстрый скролл использует уже загруженный модуль, а первый экран
    // не скачивает рабочий стол без необходимости.
    const warmObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        void import("@/components/WinDesktop");
        warmObserver.disconnect();
      },
      { rootMargin: `${window.innerHeight}px 0px` },
    );
    const mountObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        mountObserver.disconnect();
      },
      { rootMargin: `${Math.round(window.innerHeight * 0.25)}px 0px` },
    );
    warmObserver.observe(el);
    mountObserver.observe(el);
    return () => {
      warmObserver.disconnect();
      mountObserver.disconnect();
    };
  }, []);

  return near ? <WinDesktop /> : <div ref={ref} className={DESK_STUB} aria-hidden />;
}



function AboutPhoto() {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div className="relative w-full max-w-full sm:max-w-[85%] lg:max-w-full mx-auto aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-none group">
      <img
        src={`${base}/about/photo.webp`}
        alt="Команда MAETTI"
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
    </div>
  );
}

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
            {i === 4 && flipped && <span className="inline-block w-[0.15em]" />}
          </Fragment>
        ))}
      </button>
      {/* Подсказка абсолютом: занимает место под словом, не влияя на строку
          заголовка и поток секции. Ловит hover со слова через group. */}
      <span
        aria-hidden="true"
        data-fit-ignore
        className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-400/80 dark:text-neutral-500/80 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300 whitespace-nowrap"
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

function FitLine({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    const box = el?.parentElement;
    if (!el || !box) return;
    const fit = () => {
      const width = box.clientWidth;
      if (width < 1) return;
      const hide = el.querySelectorAll<HTMLElement>("[data-fit-ignore]");
      hide.forEach((n) => {
        n.style.display = "none";
      });
      el.style.width = "max-content";
      el.style.fontSize = "40px";
      const sw = el.scrollWidth + 40 * 0.15;
      hide.forEach((n) => {
        n.style.display = "";
      });
      el.style.width = "";
      if (sw < 1) return;
      el.style.fontSize = `${Math.min(64, (40 * width * 0.99) / sw)}px`;
    };
    fit();
    void document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(box);
    return () => ro.disconnect();
  }, []);
  return (
    <h2 ref={ref} className={`w-max max-w-full whitespace-nowrap ${className}`}>
      {children}
    </h2>
  );
}

export default function HomePage() {
  const shouldReduceMotion = useReducedMotion();
  const [ctaEl, setCtaEl] = useState<HTMLDivElement | null>(null);

  // Переливающийся градиент заголовка браузер перерисовывает каждый кадр —
  // видеокарте такую анимацию не отдать. Когда заголовок ушёл с экрана, её
  // незачем крутить: data-still ставит на паузу (.animate-gradient-flow).
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const el = heroTitleRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      el.toggleAttribute("data-still", !entry.isIntersecting);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const MARQUEE_ITEMS = [
    "ВЕБ-САЙТЫ",
    "TELEGRAM-БОТЫ",
    "АВТОМАТИЗАЦИЯ",
    "СЛОЖНЫЕ ИНТЕГРАЦИИ",
  ];

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-svh flex flex-col overflow-x-hidden px-6 -mt-16 md:-mt-24 pt-16 md:pt-24 bg-white text-neutral-950">
        {/* Colorful blob backgrounds. Центр круга не ниже линии на 20px выше CTA. */}
        <HeroBlobs ctaEl={ctaEl} reduceMotion={shouldReduceMotion} />

        <div className="relative max-w-7xl mx-auto w-full z-10 flex-1 flex flex-col justify-center">
          {/* Kinetic Offer */}
          <h1 ref={heroTitleRef} className="text-[2.55rem] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter sm:tracking-tight leading-[1.05] sm:leading-[1.08] mb-4 sm:mb-6 select-none break-words">
            ПОКОРЯЙТЕ <span className="hidden sm:inline"><br /></span>
            <span className="animate-gradient-flow">
              ЦИФРОВУЮ СТИХИЮ.
            </span> <span className="hidden sm:inline"><br /></span>
            <span className="text-neutral-900">
              РАЗРАБОТКА НА ЛЮБОЙ <span className="hidden sm:inline"><br /></span>
              <span className="animate-gradient-flow">ГЛУБИНЕ</span> СЛОЖНОСТИ.
            </span>
          </h1>

          <p className="max-w-2xl text-base sm:text-xl text-neutral-500 leading-relaxed mb-5 sm:mb-6">
            Создаем технологичные решения, которые выведут ваш продукт в&nbsp;топ. Разрабатываем сайты, автоматизируем процессы и&nbsp;строим экосистемы.
          </p>

          <div ref={setCtaEl} className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-fit">
            <TransitionLink
              href="/contacts"
              className="inline-flex w-fit items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-2.5 sm:px-8 sm:py-4 rounded-full text-sm sm:text-base transition-all duration-200 hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
            >
              Связаться с нами
            </TransitionLink>
            <TransitionLink
              href="/uslugi"
              className="hidden sm:inline-flex w-auto items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-8 py-4 rounded-full text-base transition-all duration-200 gap-2 hover:scale-105 active:scale-95"
            >
              <span>Наши услуги</span>
              <ChevronRight className="w-4 h-4" />
            </TransitionLink>
          </div>
        </div>

        {/* Endless scrolling kinetic typography */}
        {!shouldReduceMotion ? (
          <div className="relative z-10 w-full overflow-hidden py-3 sm:py-4 sm:mt-3 mb-4 sm:mb-6 border-y border-neutral-200 select-none bg-white/50 backdrop-blur-xs pointer-events-none">
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
          <div className="relative z-10 w-full py-3 sm:py-4 sm:mt-3 mb-4 sm:mb-6 border-y border-neutral-200 bg-white/40 text-center text-neutral-400 text-sm font-bold tracking-widest uppercase">
            {MARQUEE_ITEMS.join(" • ")}
          </div>
        )}
      </section>

      {/* 2. SERVICES GRID SECTION */}
      <ServicesSection />

      {/* 3. WHO IS MAETTI */}
      <section className="py-16 sm:py-24 px-6 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-900 scroll-mt-20 md:scroll-mt-28">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="w-full mb-6">
              <WaveRule className="mb-4" />
              <FitLine className="font-black tracking-tight text-foreground">
                КТО ТАКИЕ <MaettiWord />?
              </FitLine>
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
          <div className="lg:col-span-7">
            <AboutPhoto />
          </div>
        </div>
      </section>

      {/* 3.5. РАБОЧИЙ СТОЛ — навигация ярлыками, шапка на нём прячется */}
      <LazyDesk />
    </div>
  );
}

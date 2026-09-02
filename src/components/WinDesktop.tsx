"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryFull,
  Briefcase,
  FolderOpen,
  Gamepad2,
  Globe,
  Info,
  Mail,
  Minus,
  Rocket,
  SignalHigh,
  Sparkles,
  Square,
  Trash2,
  TriangleAlert,
  Users,
  Wifi,
  X,
} from "lucide-react";

/* Экран «чужого устройства» в самом низу главной. Первые четыре ярлыка ведут
   туда же, куда вели капли ртутного куба; остальные открывают окна прямо здесь.
   Широкий экран получает рабочий стол винды, узкий — домашний экран айфона:
    иллюзия должна совпадать с тем, с чего человек смотрит. Общего у оболочек
    всё, кроме хрома, — ярлыки, тексты ошибок и сами игры.
   Пока секция занимает экран целиком, шапка и водолаз уезжают — за это отвечает
   класс .desk-on на <html> (правила в globals.css). */

type Item = {
  id: string;
  label: string;
  href?: string;
  Icon: React.ComponentType<{ className?: string }>;
  tint: string;
};

/* В lucide этой версии нет дракона, поэтому силуэт рисуем сами — тот же
   интерфейс (className), что у lucide-иконок, чтобы жить в общем списке. */
function DragonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <polygon points="5.5,13.5 0.8,13.2 2,17.4 5.5,15.5" />
      <polygon points="8,11 10.5,3.5 13.5,10.5" />
      <polygon points="7.5,10.2 8.5,8.2 9.8,10" />
      <polygon points="10,10 11.3,8.4 12.5,10.4" />
      <ellipse cx="10" cy="14" rx="5.5" ry="4.2" />
      <circle cx="15.5" cy="9.5" r="3.2" />
      <rect x="17.5" y="8.4" width="4.2" height="2.6" rx="1" />
      <polygon points="14.2,7.6 16,4.4 16.8,7.8" />
    </svg>
  );
}

const ICONS: Item[] = [
  { id: "info", label: "Инфо", Icon: Info, tint: "from-blue-500 to-indigo-600" },
  { id: "uslugi", label: "Услуги", href: "/uslugi", Icon: Briefcase, tint: "from-sky-400 to-blue-600" },
  { id: "keysy", label: "Кейсы", href: "/keysy", Icon: Rocket, tint: "from-violet-400 to-indigo-600" },
  { id: "team", label: "Команда", href: "/team", Icon: Users, tint: "from-emerald-400 to-teal-600" },
  { id: "contacts", label: "Контакты", href: "/contacts", Icon: Mail, tint: "from-amber-400 to-orange-600" },
  { id: "snake", label: "Змейка", Icon: Gamepad2, tint: "from-lime-400 to-green-600" },
  { id: "dragon", label: "Дракончик", Icon: DragonIcon, tint: "from-orange-400 to-red-600" },
];

const TITLES: Record<string, string> = {
  info: "О проекте",
  bin: "Корзина",
  explorer: "explorer.exe",
  snake: "Змейка",
  dragon: "Дракончик",
  uslugi: "Услуги",
  keysy: "Кейсы",
  team: "Команда",
  contacts: "Контакты",
};

/* Страницы сайта открываются не переходом, а окном прямо на столе. */
const SITE: Record<string, string> = Object.fromEntries(
  ICONS.filter((it) => it.href).map((it) => [it.id, it.href!]),
);

/* На GitHub Pages сайт лежит в подпапке /meaTtI (basePath в next.config).
   next/link подставляет её сам, но адресная строка окна и src айфрейма — это
   сырые строки, им подпапку дописываем руками. Локально значение пустое. */
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/* На айфоне те же две сломанные иконки зовутся и ругаются по-своему. */
const IOS: Record<string, { label: string; head: string; body: string }> = {
  info: {
    label: "Инфо",
    head: "Интерактивная среда",
    body: "Демонстрация возможностей maeTtI",
  },
  bin: {
    label: "Корзина",
    head: "Не удалось открыть «Корзина»",
    body: "Объект повреждён и не может быть прочитан.",
  },
  explorer: {
    label: "Файлы",
    head: "Не удалось открыть «Файлы»",
    body: "Приложение недоступно. Повторите попытку позже.",
  },
};

const ERRORS: Record<string, { head: string; body: string }> = {
  bin: {
    head: "Не удалось открыть «Корзина»",
    body: "Ошибка 0x80070570: файл или папка повреждены. Чтение невозможно.",
  },
  explorer: {
    head: "Программа выполнила недопустимую операцию и будет закрыта",
    body: "Инструкция по адресу 0x00ma3tt1 обратилась к памяти по адресу 0x00000000. Память не может быть «read».",
  },
};

/* Ярлык-ссылка и ярлык-кнопка отличаются только тегом, поэтому один враппер. */
function Hit({
  href,
  onClick,
  className,
  label,
  children,
}: {
  href?: string;
  onClick: (e: React.MouseEvent) => void;
  className: string;
  label: string;
  children: React.ReactNode;
}) {
  return href ? (
    <Link href={href} onClick={onClick} className={className} aria-label={label}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={className} aria-label={label}>
      {children}
    </button>
  );
}

/* ---------------------------------- окно ---------------------------------- */

function TBtn({
  onClick,
  label,
  danger,
  children,
}: {
  onClick: () => void;
  label: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`grid h-5 w-5 place-items-center rounded border border-white/40 text-white transition-colors ${
        danger ? "bg-red-500/90 hover:bg-red-500" : "bg-white/20 hover:bg-white/35"
      }`}
    >
      {children}
    </button>
  );
}

function Win({
  title,
  dialog,
  size,
  offset,
  z,
  onFocus,
  onClose,
  onMin,
  children,
}: {
  title: string;
  dialog?: boolean;
  /* окну со страницей размер задаём мы: iframe сам по себе высоты не имеет */
  size?: [number, number];
  offset: number;
  z: number;
  onFocus: () => void;
  onClose: () => void;
  onMin: () => void;
  children: React.ReactNode;
}) {
  const [p, setP] = useState({ x: offset * 22, y: offset * 22 });
  const [max, setMax] = useState(false);

  const grab = (e: React.PointerEvent) => {
    onFocus();
    if (max || e.button !== 0) return;
    const sx = e.clientX;
    const sy = e.clientY;
    const p0 = p;
    const move = (ev: PointerEvent) => setP({ x: p0.x + ev.clientX - sx, y: p0.y + ev.clientY - sy });
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", move), {
      once: true,
    });
  };

  return (
    <div
      onPointerDown={onFocus}
      style={{
        zIndex: z,
        ...(max
          ? { inset: 8 }
          : {
              left: "50%",
              top: "50%",
              transform: `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
              width: size ? `${size[0] / 16}rem` : undefined,
              height: size ? `${size[1] / 16}rem` : undefined,
              // на низком экране окно не должно вылезать за стол — тело прокрутится само
              maxWidth: "calc(100% - 1rem)",
              maxHeight: "calc(100% - 4rem)",
            }),
      }}
      className="absolute flex flex-col overflow-hidden rounded-lg border border-white/50 bg-[#ece9d8] shadow-[0_18px_50px_rgba(0,0,0,.45)]"
    >
      <div
        onPointerDown={grab}
        className="flex cursor-grab touch-none items-center gap-2 bg-gradient-to-b from-[#4a90e2] to-[#1a56c4] px-2 py-1.5 active:cursor-grabbing"
      >
        <span className="truncate text-[0.8125rem] font-bold text-white [text-shadow:0_1px_1px_rgba(0,0,0,.45)]">
          {title}
        </span>
        <span className="ml-auto flex shrink-0 gap-1">
          {!dialog && (
            <>
              <TBtn onClick={onMin} label="Свернуть">
                <Minus className="h-3 w-3" />
              </TBtn>
              <TBtn onClick={() => setMax((m) => !m)} label="Развернуть">
                <Square className="h-2.5 w-2.5" />
              </TBtn>
            </>
          )}
          <TBtn onClick={onClose} label="Закрыть" danger>
            <X className="h-3 w-3" />
          </TBtn>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-auto">{children}</div>
    </div>
  );
}

/* ----------------------------- страница сайта ----------------------------- */

/* Настоящая страница сайта внутри окна: адресная строка сверху, под ней iframe.
   Обвязку сайта в нём прячет класс .embed (скрипт в layout.tsx), так что в окне
   остаётся только контент и скроллит его сам iframe. Одна на стол и айфон. */
function Site({ id }: { id: string }) {
  // Домен показываем настоящий: на проде свой, локально — localhost. Компонент
  // живёт только внутри стола (dynamic ssr:false), так что location уже есть.
  const host = location.host;

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-2 border-b border-black/15 bg-neutral-100 px-2 py-1.5">
        <Globe className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
        <span className="min-w-0 flex-1 truncate rounded border border-neutral-300 bg-white px-2 py-0.5 text-[0.75rem] text-neutral-600">
          {host}
          {BASE}
          {SITE[id]}
        </span>
        <Link
          href={SITE[id]}
          title="Открыть по-настоящему"
          aria-label="Открыть по-настоящему"
          className="grid h-6 w-6 shrink-0 place-items-center rounded border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-50"
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <iframe src={BASE + SITE[id]} title={TITLES[id]} className="min-h-0 w-full flex-1 border-0" />
    </div>
  );
}

/* --------------------------------- змейка --------------------------------- */

const N = 20;
const CELL = 14;
const SIZE = N * CELL;

const KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  w: [0, -1],
  s: [0, 1],
  a: [-1, 0],
  d: [1, 0],
  ц: [0, -1],
  ы: [0, 1],
  ф: [-1, 0],
  в: [1, 0],
};

// «Заново» — это ремонт партии с нуля, поэтому просто перемонтируем доску по key.
// full — карта тянется на весь экран (айфон); без него — фиксированный
// размер для плавающего окна на столе.
function Snake({ full }: { full?: boolean }) {
  const [run, setRun] = useState(0);
  return <Board key={run} restart={() => setRun((r) => r + 1)} full={full} />;
}

function Board({ restart, full }: { restart: () => void; full?: boolean }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const turn = useRef<(x: number, y: number) => void>(() => {});
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const snake = [
      { x: 9, y: 10 },
      { x: 8, y: 10 },
      { x: 7, y: 10 },
    ];
    let dir = { x: 1, y: 0 };
    let next = dir;

    const spawn = () => {
      let f = { x: 0, y: 0 };
      do {
        f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
      } while (snake.some((s) => s.x === f.x && s.y === f.y));
      return f;
    };
    let food = spawn();

    const draw = () => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(food.x * CELL + 3, food.y * CELL + 3, CELL - 6, CELL - 6);
      snake.forEach((s, i) => {
        ctx.fillStyle = i ? "#22c55e" : "#86efac";
        ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
      });
    };
    draw();

    const tick = setInterval(() => {
      dir = next;
      const h = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
      if (h.x < 0 || h.y < 0 || h.x >= N || h.y >= N || snake.some((s) => s.x === h.x && s.y === h.y)) {
        clearInterval(tick);
        setOver(true);
        return;
      }
      snake.unshift(h);
      if (h.x === food.x && h.y === food.y) {
        setScore((v) => v + 1);
        food = spawn();
      } else {
        snake.pop();
      }
      draw();
    }, 120);

    // Разворот на 180° запрещён, и сверяемся с уже применённым dir, а не с next:
    // иначе два нажатия внутри одного тика складываются в разворот.
    turn.current = (x, y) => {
      if (x !== -dir.x || y !== -dir.y) next = { x, y };
    };

    const onKey = (e: KeyboardEvent) => {
      // Стрелки перехватываем только пока стол на экране, иначе игра съест
      // прокрутку страницы на всё время, что окно открыто.
      if (!document.documentElement.classList.contains("desk-on")) return;
      const k = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
      if (!k) return;
      e.preventDefault();
      turn.current(k[0], k[1]);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearInterval(tick);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const pad = (x: number, y: number, label: string, glyph: string) => (
    <button
      type="button"
      aria-label={label}
      onClick={() => turn.current(x, y)}
      className="h-10 touch-none rounded bg-neutral-300 text-sm font-bold text-neutral-700 active:bg-neutral-400"
    >
      {glyph}
    </button>
  );

  return (
    <div className={full ? "flex h-full flex-col p-3" : "p-3"}>
      <div className="mb-2 flex items-center justify-between text-[0.75rem] font-bold text-neutral-700">
        <span>Счёт: {score}</span>
        <button
          type="button"
          onClick={restart}
          className="rounded border border-neutral-400 bg-neutral-200 px-2 py-0.5 hover:bg-neutral-100"
        >
          Заново
        </button>
      </div>

      <div
        className={full ? "relative mx-auto aspect-square w-full min-h-0 flex-1" : "relative"}
        style={full ? undefined : { width: SIZE, height: SIZE }}
      >
        <canvas
          ref={cv}
          style={full ? { width: "100%", height: "100%", imageRendering: "pixelated" } : { width: SIZE, height: SIZE }}
          className="block rounded border border-neutral-500"
        />
        {over && (
          <div className="absolute inset-0 grid place-items-center rounded bg-black/70 text-center text-white">
            <div>
              <p className="text-base font-bold">Игра окончена</p>
              <p className="mt-1 text-xs text-white/70">Счёт: {score}</p>
              <button
                type="button"
                onClick={restart}
                className="mt-3 rounded bg-white px-3 py-1 text-xs font-bold text-neutral-900"
              >
                Ещё раз
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-[0.6875rem] text-neutral-500 max-md:hidden [@media(pointer:coarse)]:hidden">
        Стрелки или WASD
      </p>
      <div className="mt-2 hidden grid-cols-3 gap-1 max-md:grid [@media(pointer:coarse)]:grid">
        <span />
        {pad(0, -1, "Вверх", "▲")}
        <span />
        {pad(-1, 0, "Влево", "◀")}
        <span />
        {pad(1, 0, "Вправо", "▶")}
        <span />
        {pad(0, 1, "Вниз", "▼")}
        <span />
      </div>
    </div>
  );
}

/* -------------------------------- дракончик -------------------------------- */

// Flappy на канве в той же стилистике, что змейка: тёмная вода, пиксельная
// рисовка. Дракончик летит между колоннами ламинаций — в тему сайта.
// Управление: пробел/стрелка вверх/клик на столе, тап — на айфоне.
const DW = 288;
const DH = 384;
const GROUND = 16;
const GRAV = 1400;
const JUMP = -360;
const PIPE_W = 46;
const GAP = 128;
const SPEED = 130;
const SPACING = 178;
const DX = 66; // x дракончика
const R = 9; // радиус для столкновений

type Pipe = { x: number; gap: number; scored: boolean };

// Схема та же, что у змейки: «Заново» перемонтирует небо по key.
function Dragon({ full }: { full?: boolean }) {
  const [run, setRun] = useState(0);
  return <Sky key={run} restart={() => setRun((r) => r + 1)} full={full} />;
}

function Sky({ restart, full }: { restart: () => void; full?: boolean }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const flap = useRef<() => void>(() => {});
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = DW * dpr;
    c.height = DH * dpr;
    ctx.scale(dpr, dpr);

    let y = DH * 0.42;
    let vy = 0;
    let run = false;
    let dead = false;
    let pts = 0;
    let pipes: Pipe[] = [];
    const bubbles = Array.from({ length: 9 }, () => ({
      x: Math.random() * DW,
      y: Math.random() * DH,
      r: 1 + Math.random() * 2.4,
      s: 10 + Math.random() * 24,
    }));

    const spawn = () => {
      const top = GAP / 2 + 26;
      const bot = DH - GROUND - GAP / 2 - 26;
      pipes.push({ x: DW + 20, gap: top + Math.random() * (bot - top), scored: false });
    };

    const die = () => {
      dead = true;
      setOver(true);
    };

    // Круг дракончика против прямоугольника ламинарии.
    const hits = (px: number, py: number, w: number, h: number) => {
      const nx = Math.max(px, Math.min(DX, px + w));
      const ny = Math.max(py, Math.min(y, py + h));
      return (DX - nx) ** 2 + (y - ny) ** 2 < R * R;
    };

    const drawKelp = (p: Pipe) => {
      const top = p.gap - GAP / 2;
      const bot = p.gap + GAP / 2;
      ctx.fillStyle = "#166534";
      ctx.fillRect(p.x, 0, PIPE_W, top);
      ctx.fillRect(p.x, bot, PIPE_W, DH - GROUND - bot);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(p.x + 5, 0, PIPE_W - 14, Math.max(0, top - 6));
      ctx.fillRect(p.x + 5, bot + 6, PIPE_W - 14, DH - GROUND - bot - 6);
      // шапочки-концы и листики по бокам
      ctx.fillRect(p.x + 2, top - 7, PIPE_W - 4, 7);
      ctx.fillRect(p.x + 2, bot, PIPE_W - 4, 7);
      for (let yy = 10; yy < top - 12; yy += 18) {
        ctx.fillRect(p.x - 4, yy, 6, 4);
        ctx.fillRect(p.x + PIPE_W - 2, yy + 9, 6, 4);
      }
      for (let yy = bot + 12; yy < DH - GROUND - 10; yy += 18) {
        ctx.fillRect(p.x + PIPE_W - 2, yy, 6, 4);
        ctx.fillRect(p.x - 4, yy + 9, 6, 4);
      }
    };

    const drawDragon = (wingUp: boolean) => {
      const x = DX;
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(x - 16, y - 2, 5, 4); // кончик хвоста
      ctx.fillStyle = "#fb923c";
      ctx.fillRect(x - 12, y - 4, 5, 8); // основание хвоста
      ctx.fillRect(x - 8, y - 6, 14, 12); // тело
      ctx.fillRect(x + 5, y - 8, 9, 9); // голова
      ctx.fillRect(x + 14, y - 4, 4, 4); // морда
      ctx.fillStyle = "#fde68a";
      ctx.fillRect(x - 6, y + 2, 10, 3); // брюшко
      ctx.fillRect(x + 7, y - 12, 3, 5); // рожка
      ctx.fillStyle = "#ea580c";
      if (wingUp) ctx.fillRect(x - 3, y - 14, 7, 9);
      else ctx.fillRect(x - 4, y - 8, 8, 5);
      ctx.fillStyle = "#fff";
      ctx.fillRect(x + 10, y - 6, 3, 3); // глаз
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(x + 11, y - 5, 2, 2); // зрачок
    };

    const draw = (t: number) => {
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(0, 0, DW, DH);
      ctx.fillStyle = "rgba(125,211,252,.14)";
      for (const b of bubbles) {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of pipes) drawKelp(p);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, DH - GROUND, DW, GROUND);
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, DH - GROUND, DW, 2);
      drawDragon(!dead && (run ? vy < 40 : Math.sin(t / 300) > 0));
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      for (const b of bubbles) {
        b.y -= b.s * dt;
        if (b.y < -4) {
          b.y = DH + 4;
          b.x = Math.random() * DW;
        }
      }
      if (dead) {
        // после столкновения дракончик падает на дно и замирает
        if (y + R < DH - GROUND) {
          vy = Math.min(vy + GRAV * dt, 520);
          y = Math.min(y + vy * dt, DH - GROUND - R);
        }
      } else if (run) {
        vy = Math.min(vy + GRAV * dt, 480);
        y += vy * dt;
        if (y < R + 2) {
          y = R + 2;
          vy = 0;
        }
        for (const p of pipes) p.x -= SPEED * dt;
        if (!pipes.length || pipes[pipes.length - 1].x < DW + 20 - SPACING) spawn();
        pipes = pipes.filter((p) => p.x > -PIPE_W - 8);
        for (const p of pipes) {
          if (!p.scored && p.x + PIPE_W < DX) {
            p.scored = true;
            setScore(++pts);
          }
          if (
            hits(p.x, 0, PIPE_W, p.gap - GAP / 2) ||
            hits(p.x, p.gap + GAP / 2, PIPE_W, DH - GROUND - p.gap - GAP / 2)
          )
            die();
        }
        if (y + R >= DH - GROUND) die();
      } else {
        y = DH * 0.42 + Math.sin((now / 1000) * 2.6) * 7;
      }
      draw(now);
      raf = requestAnimationFrame(step);
    };

    flap.current = () => {
      if (dead) return;
      if (!run) {
        run = true;
        spawn();
        setReady(false);
      }
      vy = JUMP;
    };

    const onKey = (e: KeyboardEvent) => {
      // Как у змейки: клавиши ловим только пока стол на экране.
      if (!document.documentElement.classList.contains("desk-on")) return;
      const k = e.key;
      if (k !== " " && k !== "ArrowUp" && k.toLowerCase() !== "w" && k.toLowerCase() !== "ц") return;
      e.preventDefault();
      if (!e.repeat) flap.current();
    };
    window.addEventListener("keydown", onKey);

    raf = requestAnimationFrame(step);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className={full ? "flex h-full flex-col p-3" : "p-3"}>
      <div className="mb-2 flex items-center justify-between text-[0.75rem] font-bold text-neutral-700">
        <span>Счёт: {score}</span>
        <button
          type="button"
          onClick={restart}
          className="rounded border border-neutral-400 bg-neutral-200 px-2 py-0.5 hover:bg-neutral-100"
        >
          Заново
        </button>
      </div>

      <div
        className={full ? "relative mx-auto aspect-[3/4] w-full min-h-0 flex-1" : "relative"}
        style={full ? undefined : { width: DW, height: DH }}
      >
        <canvas
          ref={cv}
          onPointerDown={() => flap.current()}
          style={full ? { width: "100%", height: "100%", imageRendering: "pixelated" } : { width: DW, height: DH }}
          className="block cursor-pointer touch-none rounded border border-neutral-500"
        />
        {ready && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center rounded bg-black/55 text-center text-white">
            <div>
              <p className="text-base font-bold">Дракончик</p>
              <p className="mt-1 text-xs text-white/75">Тапни или нажми пробел</p>
            </div>
          </div>
        )}
        {over && (
          <div className="absolute inset-0 grid place-items-center rounded bg-black/70 text-center text-white">
            <div>
              <p className="text-base font-bold">Игра окончена</p>
              <p className="mt-1 text-xs text-white/70">Счёт: {score}</p>
              <button
                type="button"
                onClick={restart}
                className="mt-3 rounded bg-white px-3 py-1 text-xs font-bold text-neutral-900"
              >
                Ещё раз
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-2 text-center text-[0.6875rem] text-neutral-500 max-md:hidden [@media(pointer:coarse)]:hidden">
        Пробел или клик
      </p>
    </div>
  );
}

const GAMES: Record<string, React.ComponentType<{ full?: boolean }>> = {
  snake: Snake,
  dragon: Dragon,
};

// Открытое «приложение» на айфоне: шапка с названием, содержимое на весь экран
// и полоска «домой». Одно на все — и на игры, и на страницы сайта.
function PhoneApp({ id, onClose }: { id: string; onClose: () => void }) {
  const G = GAMES[id];
  return (
    <div className="ios-open absolute inset-0 z-30 flex flex-col bg-[#f2f2f7]">
      <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <span className="text-[0.9375rem] font-semibold text-neutral-900">{TITLES[id]}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="grid h-7 w-7 place-items-center rounded-full bg-red-500/10 text-red-500 active:bg-red-500/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">{G ? <G full /> : <Site id={id} />}</div>
      <button
        type="button"
        aria-label="На главный экран"
        onClick={onClose}
        className="mx-auto my-2 h-1 w-32 shrink-0 rounded-full bg-neutral-900/30"
      />
    </div>
  );
}

/* -------------------------------- рабочий стол ----------------------------- */

type WinState = { id: string; min: boolean };

export default function WinDesktop() {
  const secRef = useRef<HTMLElement>(null);
  const coarse = useRef(false);
  // Стол внутри окна стола не нужен: если главную открыли в iframe — молчим.
  const embed = window.self !== window.top;
  const [sel, setSel] = useState<string | null>(null);
  const [wins, setWins] = useState<WinState[]>([]);
  const [start, setStart] = useState(false);
  const [clock, setClock] = useState("");
  const [showNotice, setShowNotice] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !sessionStorage.getItem("maetti_notice_seen");
    } catch {
      return false;
    }
  });

  const closeNotice = () => {
    setShowNotice(false);
    try {
      sessionStorage.setItem("maetti_notice_seen", "true");
    } catch {}
  };

  useEffect(() => {
    if (showNotice) {
      try {
        sessionStorage.setItem("maetti_notice_seen", "true");
      } catch {}
    }
  }, [showNotice]);
  // Компонент грузится только на клиенте (dynamic ssr:false), поэтому ширину
  // можно спросить сразу — иначе на телефоне мигнёт винда.
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Пока стол занимает экран целиком — прячем шапку и водолаза.
  useEffect(() => {
    if (embed) return;
    coarse.current = matchMedia("(pointer: coarse)").matches;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([e]) => root.classList.toggle("desk-on", e.intersectionRatio >= 0.85),
      { threshold: 0.85 },
    );
    io.observe(secRef.current!);
    return () => {
      io.disconnect();
      root.classList.remove("desk-on");
    };
  }, [embed]);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);

  const open = (id: string) => {
    setStart(false);
    if (id === "info") {
      setShowNotice(true);
      return;
    }
    setWins((w) => [...w.filter((x) => x.id !== id), { id, min: false }]);
    // Окно живёт внутри секции: если стол виден лишь наполовину, окно срежет
    // краем экрана. Поэтому на открытии доводим стол до полного кадра —
    // руками, а не scrollIntoView: у html есть scroll-padding под шапку, и
    // из-за него стол вставал на 100px ниже, теряя низ окна.
    const el = secRef.current;
    if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY });
  };
  const close = (id: string) => setWins((w) => w.filter((x) => x.id !== id));
  const focus = (id: string) =>
    setWins((w) => [...w.filter((x) => x.id !== id), { id, min: false }]);
  const minimize = (id: string) =>
    setWins((w) => w.map((x) => (x.id === id ? { ...x, min: true } : x)));

  // Кнопка в панели задач: активное окно сворачивает, любое другое — поднимает.
  const task = (id: string) =>
    setWins((w) => {
      const it = w.find((x) => x.id === id)!;
      return w[w.length - 1].id === id && !it.min
        ? w.map((x) => (x.id === id ? { ...x, min: true } : x))
        : [...w.filter((x) => x.id !== id), { id, min: false }];
    });

  // Ярлык страницы никуда не уводит: страница открывается окном здесь же.
  // Ctrl/⌘/Shift оставляем браузеру — ссылка настоящая, пусть откроет вкладку.
  const nav = (e: React.MouseEvent, id: string) => {
    if (id === "info") {
      e.preventDefault();
      setShowNotice(true);
      return;
    }
    if (SITE[id] && (e.metaKey || e.ctrlKey || e.shiftKey)) return;
    e.preventDefault();
    open(id);
  };

  // Мышью как в винде: первый клик выделяет, открывает второй. На айфоне и
  // вообще на тач-экране двойного тапа никто не ждёт — там открываем сразу.
  const hit = (e: React.MouseEvent, it: Item) => {
    setSel(it.id);
    if (it.id === "info") {
      e.preventDefault();
      setShowNotice(true);
      return;
    }
    if (!phone && !coarse.current && e.detail < 2) {
      e.preventDefault();
      return;
    }
    nav(e, it.id);
  };

  const label = (it: Item) => IOS[it.id]?.label ?? it.label;
  const app = (it: Item) => (
    <span
      className={`grid h-14 w-14 place-items-center rounded-[18px] bg-gradient-to-br ${it.tint} shadow-lg ring-1 ring-white/30 transition-transform active:scale-90`}
    >
      <it.Icon className="h-7 w-7 text-white drop-shadow" />
    </span>
  );

  // ------------------------------- айфон -------------------------------
  const top = wins[wins.length - 1];
  const iphone = (
    <div className="ios-ui desk-shell absolute inset-0 flex flex-col bg-gradient-to-b from-[#16307a] via-[#3f6fd8] to-[#9ec6f2]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-[18%] h-56 w-56 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute -right-12 top-1/2 h-56 w-56 rounded-full bg-cyan-300/35 blur-3xl" />
      </div>

      {/* строка состояния */}
      <div className="relative flex items-center justify-between px-6 pt-3 text-[0.8125rem] font-semibold text-white">
        <span className="tabular-nums">{clock}</span>
        <span className="flex items-center gap-1.5">
          <SignalHigh className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          <BatteryFull className="h-4 w-4" />
        </span>
      </div>

      {/* сетка приложений */}
      <div className="relative grid grid-cols-4 gap-x-2 gap-y-5 px-4 pt-8">
        {ICONS.map((it) => (
          <Hit
            key={it.id}
            href={it.href}
            label={label(it)}
            onClick={(e) => hit(e, it)}
            className="flex flex-col items-center gap-1.5 outline-none"
          >
            {app(it)}
            <span className="text-[0.6875rem] leading-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
              {label(it)}
            </span>
          </Hit>
        ))}
      </div>

      {/* точки страниц, док и полоска «домой» */}
      <div className="relative mt-auto px-3 pb-2">
        <div className="mb-3 flex justify-center gap-1.5">
          <i className="h-1.5 w-1.5 rounded-full bg-white" />
          <i className="h-1.5 w-1.5 rounded-full bg-white/40" />
        </div>
        <div className="flex justify-around rounded-[26px] bg-white/20 p-3 backdrop-blur-md">
          {ICONS.filter((it) => it.href).map((it) => (
            <Hit key={it.id} href={it.href} label={it.label} onClick={(e) => hit(e, it)} className="outline-none">
              {app(it)}
            </Hit>
          ))}
        </div>
        <div className="mx-auto mt-3 h-1 w-32 rounded-full bg-white/80" />
      </div>

      {/* Информационная плашка (iOS стиль) */}
      {showNotice && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-md px-5 select-none">
          <div className="ios-open w-full max-w-[21.5rem] overflow-hidden rounded-[28px] bg-white/95 text-center shadow-2xl backdrop-blur-2xl border border-white/60 p-5">
            {/* Иконка */}
            <div className="mx-auto mb-3.5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-blue-600 shadow-lg ring-4 ring-blue-500/20 text-white">
              <Sparkles className="h-7 w-7 text-amber-300 animate-pulse" />
            </div>

            <span className="inline-block rounded-full bg-blue-100 px-3 py-0.5 text-[0.6875rem] font-bold text-blue-700 uppercase tracking-wider mb-1.5">
              Интерактивный концепт
            </span>
            <h3 className="text-[1.125rem] font-bold text-neutral-900 leading-snug">
              Добро пожаловать в maeTtI!
            </h3>

            <p className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-600">
              Этот сайт и операционная система созданы, чтобы наглядно показать наши технические возможности и нестандартный подход к разработке.
            </p>

            <div className="mt-3.5 space-y-2 text-left rounded-2xl bg-neutral-100/90 p-3 text-[0.75rem]">
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">📱</span>
                <span className="text-neutral-700 leading-snug">
                  <strong className="text-neutral-900">Разделы сайта:</strong> открывайте «Услуги», «Кейсы», «Команду» и «Контакты» прямо в приложениях.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">🕹️</span>
                <span className="text-neutral-700 leading-snug">
                  <strong className="text-neutral-900">Мини-игры:</strong> запускайте «Змейку» и «Дракончика» прямо с экрана.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-base leading-none">✨</span>
                <span className="text-neutral-700 leading-snug">
                  <strong className="text-neutral-900">Интерактивность:</strong> тапайте по ярлыкам и исследуйте интерфейс!
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeNotice}
              className="mt-4.5 w-full rounded-2xl bg-blue-600 py-3 text-[0.9375rem] font-bold text-white shadow-lg shadow-blue-600/30 active:scale-95 transition-transform cursor-pointer"
            >
              Понял!
            </button>
          </div>
        </div>
      )}

      {/* открытое «приложение»: игры и страницы на весь экран, остальное — алерт */}
      {top &&
        (GAMES[top.id] || SITE[top.id] ? (
          <PhoneApp id={top.id} onClose={() => close(top.id)} />
        ) : (
          <div
            onClick={() => close(top.id)}
            className="absolute inset-0 z-30 grid place-items-center bg-black/40 px-8 backdrop-blur-[2px]"
          >
            <div className="ios-open w-[16.875rem] overflow-hidden rounded-2xl bg-white/85 text-center backdrop-blur-xl">
              <div className="px-5 py-4">
                <p className="text-[1.0625rem] font-semibold text-neutral-900">
                  {(IOS[top.id] ?? ERRORS[top.id]).head}
                </p>
                <p className="mt-1 text-[0.8125rem] leading-snug text-neutral-700">
                  {(IOS[top.id] ?? ERRORS[top.id]).body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => close(top.id)}
                className="w-full border-t border-black/10 py-2.5 text-[1.0625rem] font-semibold text-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  if (embed) return null;

  return (
    <section
      ref={secRef}
      aria-label={phone ? "Домашний экран" : "Рабочий стол"}
      className="desk-shell relative h-[100svh] w-full shrink-0 select-none"
    >
      {phone ? (
        iphone
      ) : (
        <div className="win-ui absolute inset-0">
          {/* обои + клик по пустому месту снимает выделение */}
          <div
            onClick={() => {
              setSel(null);
              setStart(false);
            }}
            className="absolute inset-0 bg-gradient-to-b from-[#1a4f8a] via-[#3f8fd0] to-[#a9dbf5]"
          >
            <div className="absolute -bottom-[10%] -left-[10%] h-[46%] w-[120%] rounded-[50%] bg-gradient-to-b from-[#86c94a] to-[#3f7d24]" />
          </div>

          {/* ярлыки: строго в один вертикальный столбик */}
          <div className="absolute left-3 top-3 z-10 flex flex-col gap-2.5">
            {ICONS.map((it) => (
              <Hit
                key={it.id}
                href={it.href}
                label={it.label}
                onClick={(e) => hit(e, it)}
                className={`flex w-[5.5rem] flex-col items-center gap-1.5 rounded-xl p-2 text-center outline-none transition-all duration-200 focus-visible:ring-2 focus-visible:ring-white ${
                  sel === it.id ? "bg-white/30 backdrop-blur-md ring-1 ring-white/80 scale-105 shadow-lg" : "hover:bg-white/20 hover:scale-105"
                }`}
              >
                <span
                  className={`relative grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${it.tint} shadow-lg ring-1 ring-white/40 transition-transform`}
                >
                  <it.Icon className="h-6 w-6 text-white drop-shadow" />
                  {it.href && (
                    <span className="absolute -bottom-1 -left-1 grid h-4 w-4 place-items-center rounded-md border border-neutral-300 bg-white/90 shadow-sm">
                      <ArrowUpRight className="h-3 w-3 text-neutral-700" />
                    </span>
                  )}
                </span>
                <span className="text-[0.6875rem] font-medium leading-tight text-white drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.9)]">
                  {it.label}
                </span>
              </Hit>
            ))}
          </div>

          {/* окна */}
          {wins.map((w, i) => {
            const G = GAMES[w.id];
            const site = SITE[w.id];
            return w.min ? null : (
              <Win
                key={w.id}
                title={
                  site
                    ? `maeTtI - ${TITLES[w.id]}`
                    : w.id === "explorer"
                      ? "explorer.exe - Ошибка приложения"
                      : TITLES[w.id]
                }
                dialog={!G && !site}
                size={site ? [820, 580] : undefined}
                offset={i}
                z={20 + i}
                onFocus={() => focus(w.id)}
                onClose={() => close(w.id)}
                onMin={() => minimize(w.id)}
              >
                {site ? (
                  <Site id={w.id} />
                ) : G ? (
                  <G />
                ) : (
                  <div className="w-[min(23.75rem,calc(100vw-2rem))]">
                    <div className="flex gap-3 p-4">
                      <TriangleAlert className="h-8 w-8 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-[0.8125rem] font-bold text-neutral-900">{ERRORS[w.id].head}</p>
                        <p className="mt-1 text-[0.75rem] leading-snug text-neutral-700">{ERRORS[w.id].body}</p>
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-black/10 bg-black/5 px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => close(w.id)}
                        className="min-w-[4.75rem] rounded border border-neutral-400 bg-neutral-200 px-3 py-1 text-[0.75rem] font-bold text-neutral-800 hover:bg-neutral-100"
                      >
                        ОК
                      </button>
                    </div>
                  </div>
                )}
              </Win>
            );
          })}

          {/* Информационная плашка (Windows UI стиль) */}
          {showNotice && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px] p-4 select-none">
              <div className="w-[min(34rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-white/60 bg-[#f8f7f2] shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                {/* Title bar */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#195bb7] via-[#2f79e7] to-[#195bb7] px-3.5 py-2 text-white shadow-inner">
                  <div className="flex items-center gap-2">
                    <div className="grid h-5 w-5 place-items-center rounded bg-white/20">
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                    </div>
                    <span className="text-[0.8125rem] font-bold tracking-wide [text-shadow:0_1px_2px_rgba(0,0,0,0.6)]">
                      maeTtI OS — Демонстрация возможностей
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={closeNotice}
                    className="grid h-5 w-5 place-items-center rounded border border-white/40 bg-red-500/90 text-white hover:bg-red-600 active:scale-95 transition-all cursor-pointer"
                    title="Закрыть"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Body */}
                <div className="p-5 text-neutral-800">
                  <div className="mb-4 flex items-start gap-3.5">
                    <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md ring-2 ring-blue-400/30">
                      <Info className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[0.6875rem] font-bold text-blue-700 uppercase tracking-wider mb-1">
                        💡 Интерактивный концепт
                      </span>
                      <h3 className="text-lg font-black text-neutral-900 leading-tight">
                        Добро пожаловать в интерактивный стол maeTtI!
                      </h3>
                    </div>
                  </div>

                  <p className="text-[0.8125rem] leading-relaxed text-neutral-600 mb-4">
                    Весь наш сайт и эта операционная система — живой пример того, как мы умеем воплощать нестандартные цифровые идеи и создавать интерактивный пользовательский опыт.
                  </p>

                  <div className="space-y-2 rounded-xl bg-white/90 border border-neutral-200/80 p-3.5 text-[0.8125rem] shadow-xs">
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none">📂</span>
                      <p className="text-neutral-700 leading-snug">
                        <strong className="text-neutral-950">Сайт в формате окон:</strong> открывайте «Услуги», «Кейсы», «Команду» и «Контакты» в отдельных интерактивных окнах.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none">🎮</span>
                      <p className="text-neutral-700 leading-snug">
                        <strong className="text-neutral-950">Мини-игры:</strong> сыграйте в «Змейку» или «Дракончика», чтобы отвлечься и протестировать отзывчивость.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="text-base leading-none">🖱️</span>
                      <p className="text-neutral-700 leading-snug">
                        <strong className="text-neutral-950">Симуляция ОС:</strong> перемещайте окна, сворачивайте их в панель задач и пробуйте меню «Пуск»!
                      </p>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="mt-5 flex items-center justify-between pt-3 border-t border-black/10">
                    <span className="text-[0.6875rem] text-neutral-500">
                      Подсказку всегда можно открыть снова через ярлык «Инфо»
                    </span>
                    <button
                      type="button"
                      onClick={closeNotice}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 px-5 py-2 text-[0.8125rem] font-bold text-white shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer ring-2 ring-blue-400/40"
                    >
                      <span>Понял!</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* меню «Пуск» */}
          {start && (
            <div className="absolute bottom-11 left-1.5 z-50 w-56 overflow-hidden rounded-t-lg border border-white/40 bg-white shadow-2xl">
              <div className="bg-gradient-to-b from-[#4a90e2] to-[#1a56c4] px-3 py-2 text-sm font-bold text-white">
                maetti
              </div>
              <ul className="p-1">
                {ICONS.map((it) => (
                  <li key={it.id}>
                    <Hit
                      href={it.href}
                      label={it.label}
                      onClick={(e) => nav(e, it.id)}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[0.8125rem] text-neutral-800 hover:bg-blue-600 hover:text-white"
                    >
                      <it.Icon className="h-4 w-4" />
                      {it.label}
                    </Hit>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* панель задач: пуск с окнами слева, быстрый запуск строго по центру
              (крайние колонки по 1fr), часы справа */}
          <div className="absolute inset-x-0 bottom-0 z-40 grid h-11 grid-cols-[1fr_auto_1fr] items-center gap-1.5 border-t border-white/30 bg-gradient-to-b from-[#3a7be0] to-[#1941a5] px-1.5">
            <div className="flex min-w-0 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setStart((s) => !s)}
                className="flex shrink-0 items-center gap-1.5 rounded-md bg-gradient-to-b from-[#6bc257] to-[#2f7c1f] px-3 py-1.5 text-[0.8125rem] font-bold italic text-white shadow ring-1 ring-white/40"
              >
                <span className="grid h-3.5 w-3.5 grid-cols-2 gap-px">
                  {[0, 1, 2, 3].map((i) => (
                    <i key={i} className="rounded-[1px] bg-white/90" />
                  ))}
                </span>
                пуск
              </button>

              <div className="flex min-w-0 gap-1 overflow-hidden">
                {wins.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => task(w.id)}
                    className={`max-w-[9.375rem] truncate rounded px-2 py-1 text-[0.75rem] text-white ring-1 ring-white/25 ${
                      w.min ? "bg-white/10" : "bg-white/25"
                    }`}
                  >
                    {TITLES[w.id]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-1.5 rounded bg-black/15 px-1.5 py-1">
              {ICONS.filter((it) => it.href).map((it) => (
                <Link
                  key={it.id}
                  href={it.href!}
                  onClick={(e) => nav(e, it.id)}
                  aria-label={it.label}
                  title={it.label}
                  className={`grid h-7 w-7 place-items-center rounded bg-gradient-to-br ${it.tint} shadow ring-1 ring-white/40 outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-white`}
                >
                  <it.Icon className="h-4 w-4 text-white drop-shadow" />
                </Link>
              ))}
            </div>

            <div className="justify-self-end rounded bg-black/15 px-2 py-1 text-[0.75rem] tabular-nums text-white">
              {clock}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

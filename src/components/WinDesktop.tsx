"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BatteryFull,
  Briefcase,
  FolderOpen,
  Gamepad2,
  Mail,
  Minus,
  Rocket,
  SignalHigh,
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
   всё, кроме хрома, — ярлыки, тексты ошибок и сама змейка.
   Пока секция занимает экран целиком, шапка и водолаз уезжают — за это отвечает
   класс .desk-on на <html> (правила в globals.css). */

type Item = {
  id: string;
  label: string;
  href?: string;
  Icon: typeof Briefcase;
  tint: string;
};

const ICONS: Item[] = [
  { id: "uslugi", label: "Услуги", href: "/uslugi", Icon: Briefcase, tint: "from-sky-400 to-blue-600" },
  { id: "keysy", label: "Кейсы", href: "/keysy", Icon: Rocket, tint: "from-violet-400 to-indigo-600" },
  { id: "team", label: "Команда", href: "/team", Icon: Users, tint: "from-emerald-400 to-teal-600" },
  { id: "contacts", label: "Контакты", href: "/contacts", Icon: Mail, tint: "from-amber-400 to-orange-600" },
  { id: "bin", label: "Корзина", Icon: Trash2, tint: "from-neutral-300 to-neutral-500" },
  { id: "explorer", label: "Проводник", Icon: FolderOpen, tint: "from-yellow-300 to-amber-500" },
  { id: "snake", label: "Змейка", Icon: Gamepad2, tint: "from-lime-400 to-green-600" },
];

const TITLES: Record<string, string> = {
  bin: "Корзина",
  explorer: "explorer.exe",
  snake: "Змейка",
};

/* На айфоне те же две сломанные иконки зовутся и ругаются по-своему. */
const IOS: Record<string, { label: string; head: string; body: string }> = {
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
  offset,
  z,
  onFocus,
  onClose,
  onMin,
  children,
}: {
  title: string;
  dialog?: boolean;
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
        <span className="truncate text-[13px] font-bold text-white [text-shadow:0_1px_1px_rgba(0,0,0,.45)]">
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
function Snake() {
  const [run, setRun] = useState(0);
  return <Board key={run} restart={() => setRun((r) => r + 1)} />;
}

function Board({ restart }: { restart: () => void }) {
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
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-neutral-700">
        <span>Счёт: {score}</span>
        <button
          type="button"
          onClick={restart}
          className="rounded border border-neutral-400 bg-neutral-200 px-2 py-0.5 hover:bg-neutral-100"
        >
          Заново
        </button>
      </div>

      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <canvas ref={cv} style={{ width: SIZE, height: SIZE }} className="block rounded border border-neutral-500" />
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

      <p className="mt-2 text-center text-[11px] text-neutral-500 max-md:hidden [@media(pointer:coarse)]:hidden">
        Стрелки или WASD
      </p>
      <div className="mt-2 hidden grid-cols-3 gap-1 max-md:grid [@media(pointer:coarse)]:grid">
        <span />
        {pad(0, -1, "Вверх", "▲")}
        <span />
        {pad(-1, 0, "Влево", "◀")}
        {pad(0, 1, "Вниз", "▼")}
        {pad(1, 0, "Вправо", "▶")}
      </div>
    </div>
  );
}

/* -------------------------------- рабочий стол ----------------------------- */

type WinState = { id: string; min: boolean };

export default function WinDesktop() {
  const secRef = useRef<HTMLElement>(null);
  const coarse = useRef(false);
  const [sel, setSel] = useState<string | null>(null);
  const [wins, setWins] = useState<WinState[]>([]);
  const [start, setStart] = useState(false);
  const [clock, setClock] = useState("");
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
  }, []);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const t = setInterval(tick, 20000);
    return () => clearInterval(t);
  }, []);

  const open = (id: string) => {
    setStart(false);
    setWins((w) => [...w.filter((x) => x.id !== id), { id, min: false }]);
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

  // Мышью как в винде: первый клик выделяет, открывает второй. На айфоне и
  // вообще на тач-экране двойного тапа никто не ждёт — там открываем сразу.
  const hit = (e: React.MouseEvent, it: Item) => {
    setSel(it.id);
    if (!phone && !coarse.current && e.detail < 2) {
      e.preventDefault();
      return;
    }
    if (!it.href) open(it.id);
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
    <div className="ios-ui absolute inset-0 flex flex-col overflow-hidden bg-gradient-to-b from-[#16307a] via-[#3f6fd8] to-[#9ec6f2]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 top-[18%] h-56 w-56 rounded-full bg-fuchsia-400/30 blur-3xl" />
        <div className="absolute -right-12 top-1/2 h-56 w-56 rounded-full bg-cyan-300/35 blur-3xl" />
      </div>

      {/* строка состояния */}
      <div className="relative flex items-center justify-between px-6 pt-3 text-[13px] font-semibold text-white">
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
            <span className="text-[11px] leading-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
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

      {/* открытое «приложение»: змейка на весь экран, остальное — алерт */}
      {top &&
        (top.id === "snake" ? (
          <div className="ios-open absolute inset-0 z-30 flex flex-col bg-[#f2f2f7]">
            <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
              <span className="text-[15px] font-semibold text-neutral-900">Змейка</span>
              <button
                type="button"
                onClick={() => close(top.id)}
                className="text-[15px] font-semibold text-blue-600"
              >
                Готово
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center overflow-auto">
              <Snake />
            </div>
            <button
              type="button"
              aria-label="На главный экран"
              onClick={() => close(top.id)}
              className="mx-auto my-2 h-1 w-32 shrink-0 rounded-full bg-neutral-900/30"
            />
          </div>
        ) : (
          <div
            onClick={() => close(top.id)}
            className="absolute inset-0 z-30 grid place-items-center bg-black/40 px-8 backdrop-blur-[2px]"
          >
            <div className="ios-open w-[270px] overflow-hidden rounded-2xl bg-white/85 text-center backdrop-blur-xl">
              <div className="px-5 py-4">
                <p className="text-[17px] font-semibold text-neutral-900">
                  {(IOS[top.id] ?? ERRORS[top.id]).head}
                </p>
                <p className="mt-1 text-[13px] leading-snug text-neutral-700">
                  {(IOS[top.id] ?? ERRORS[top.id]).body}
                </p>
              </div>
              <button
                type="button"
                onClick={() => close(top.id)}
                className="w-full border-t border-black/10 py-2.5 text-[17px] font-semibold text-blue-600"
              >
                OK
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <section
      ref={secRef}
      aria-label={phone ? "Домашний экран" : "Рабочий стол"}
      className="relative h-[100svh] w-full shrink-0 select-none overflow-hidden"
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

          {/* ярлыки: колонкой сверху вниз, переносом вправо — как в винде */}
          <div className="absolute left-2 top-2 z-10 grid grid-flow-col grid-rows-4 gap-1">
            {ICONS.map((it) => (
              <Hit
                key={it.id}
                href={it.href}
                label={it.label}
                onClick={(e) => hit(e, it)}
                className={`flex w-[86px] flex-col items-center gap-1 rounded p-1.5 text-center outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  sel === it.id ? "bg-white/25 ring-1 ring-white/70" : "hover:bg-white/15"
                }`}
              >
                <span
                  className={`relative grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br ${it.tint} shadow-md ring-1 ring-white/40`}
                >
                  <it.Icon className="h-6 w-6 text-white drop-shadow" />
                  {it.href && (
                    <span className="absolute -bottom-1 -left-1 grid h-4 w-4 place-items-center rounded-sm border border-neutral-400 bg-white">
                      <ArrowUpRight className="h-3 w-3 text-neutral-700" />
                    </span>
                  )}
                </span>
                <span className="text-[11px] leading-tight text-white [text-shadow:0_1px_2px_rgba(0,0,0,.85)]">
                  {it.label}
                </span>
              </Hit>
            ))}
          </div>

          {/* окна */}
          {wins.map((w, i) =>
            w.min ? null : (
              <Win
                key={w.id}
                title={w.id === "explorer" ? "explorer.exe — Ошибка приложения" : TITLES[w.id]}
                dialog={w.id !== "snake"}
                offset={i}
                z={20 + i}
                onFocus={() => focus(w.id)}
                onClose={() => close(w.id)}
                onMin={() => minimize(w.id)}
              >
                {w.id === "snake" ? (
                  <Snake />
                ) : (
                  <div className="w-[min(380px,calc(100vw-32px))]">
                    <div className="flex gap-3 p-4">
                      <TriangleAlert className="h-8 w-8 shrink-0 text-amber-500" />
                      <div>
                        <p className="text-[13px] font-bold text-neutral-900">{ERRORS[w.id].head}</p>
                        <p className="mt-1 text-[12px] leading-snug text-neutral-700">{ERRORS[w.id].body}</p>
                      </div>
                    </div>
                    <div className="flex justify-end border-t border-black/10 bg-black/5 px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => close(w.id)}
                        className="min-w-[76px] rounded border border-neutral-400 bg-neutral-200 px-3 py-1 text-[12px] font-bold text-neutral-800 hover:bg-neutral-100"
                      >
                        ОК
                      </button>
                    </div>
                  </div>
                )}
              </Win>
            ),
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
                      onClick={() => (it.href ? setStart(false) : open(it.id))}
                      className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-[13px] text-neutral-800 hover:bg-blue-600 hover:text-white"
                    >
                      <it.Icon className="h-4 w-4" />
                      {it.label}
                    </Hit>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* панель задач */}
          <div className="absolute inset-x-0 bottom-0 z-40 flex h-11 items-center gap-1.5 border-t border-white/30 bg-gradient-to-b from-[#3a7be0] to-[#1941a5] px-1.5">
            <button
              type="button"
              onClick={() => setStart((s) => !s)}
              className="flex items-center gap-1.5 rounded-md bg-gradient-to-b from-[#6bc257] to-[#2f7c1f] px-3 py-1.5 text-[13px] font-bold italic text-white shadow ring-1 ring-white/40"
            >
              <span className="grid h-3.5 w-3.5 grid-cols-2 gap-px">
                {[0, 1, 2, 3].map((i) => (
                  <i key={i} className="rounded-[1px] bg-white/90" />
                ))}
              </span>
              пуск
            </button>

            <div className="flex min-w-0 flex-1 gap-1 overflow-hidden">
              {wins.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => task(w.id)}
                  className={`max-w-[150px] truncate rounded px-2 py-1 text-[12px] text-white ring-1 ring-white/25 ${
                    w.min ? "bg-white/10" : "bg-white/25"
                  }`}
                >
                  {TITLES[w.id]}
                </button>
              ))}
            </div>

            <div className="shrink-0 rounded bg-black/15 px-2 py-1 text-[12px] tabular-nums text-white">
              {clock}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

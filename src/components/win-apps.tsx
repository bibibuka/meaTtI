"use client";

/* =========================================================================
   maeTtI OS — содержимое приложений рабочего стола:
   звуковой движок, калькулятор проекта, терминал, игры, браузер, «О системе».
   Весь UI красится токенами --desk-* (см. desk-themes.ts); терминал —
   намеренно всегда тёмный, это его природа.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Calculator,
  Check,
  Globe,
  Layers,
  Music,
  Terminal as TerminalIcon,
} from "lucide-react";
import type { WallpaperTheme } from "./desk-themes";

/* ----------------------------- ЗВУКОВОЙ ДВИЖОК ----------------------------- */
// Native Web Audio API: синтез тактильных кликов и эмбиента без внешних mp3
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  public enabled = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
  }

  // Тактильный короткий щелчок (мягкий синус, 15ms)
  playGlassClick() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.015);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.018);
    } catch {}
  }

  // Процедурный эмбиент: пентатонический аккорд с низкочастотным фильтром
  startAmbient(volume = 0.08) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();

      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.4);
        return;
      }

      const master = this.ctx.createGain();
      master.gain.setValueAtTime(0.001, this.ctx.currentTime);
      master.gain.setTargetAtTime(volume, this.ctx.currentTime, 1.2);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // Пентатоника: F3, C4, Eb4, G4
      const freqs = [174.61, 261.63, 311.13, 392.0];
      this.oscs = freqs.map((f, i) => {
        const o = this.ctx!.createOscillator();
        o.type = i % 2 === 0 ? "sine" : "triangle";
        o.frequency.setValueAtTime(f + (i * 0.4 - 0.6), this.ctx!.currentTime);
        o.connect(filter);
        o.start();
        return o;
      });

      filter.connect(master);
      master.connect(this.ctx.destination);
      this.ambientGain = master;
    } catch {}
  }

  stopAmbient() {
    try {
      if (this.ctx && this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.5);
        setTimeout(() => {
          this.oscs.forEach((o) => {
            try {
              o.stop();
            } catch {}
          });
          this.oscs = [];
          this.ambientGain = null;
        }, 600);
      }
    } catch {}
  }
}

export const sounds = new SoundEngine();

/* ----------------------------- КАЛЬКУЛЯТОР ПРОЕКТА ----------------------------- */

type TierId = "landing" | "portal" | "webapp" | "creative";
type SpeedId = "normal" | "fast" | "urgent";

const TIERS: { id: TierId; name: string; base: number; days: number; desc: string }[] = [
  { id: "landing", name: "Landing / Промо", base: 90000, days: 14, desc: "Высококонверсионный лендинг с анимациями" },
  { id: "portal", name: "Корпоративный портал", base: 185000, days: 25, desc: "Многостраничный сайт с CMS и интеграциями" },
  { id: "webapp", name: "Web App / SaaS", base: 310000, days: 45, desc: "Сложная логика, кабинеты, API" },
  { id: "creative", name: "3D / Креативный WebGL", base: 240000, days: 30, desc: "Иммерсивный 3D-опыт и шейдеры" },
];

const ADDONS: { id: string; name: string; cost: number }[] = [
  { id: "three", name: "Интерактивные 3D-модели (Three.js/WebGL)", cost: 45000 },
  { id: "pwa", name: "PWA и мобильная адаптация", cost: 35000 },
  { id: "crm", name: "Интеграция CRM / Telegram-боты", cost: 40000 },
  { id: "ai", name: "AI-ассистент / чат-бот на LLM", cost: 55000 },
  { id: "seo", name: "SEO-оптимизация и аналитика", cost: 25000 },
];

const SPEEDS: { id: SpeedId; name: string; desc: string }[] = [
  { id: "normal", name: "Стандарт ×1.0", desc: "Спокойная проработка" },
  { id: "fast", name: "Спринт ×1.25", desc: "Приоритетная сборка" },
  { id: "urgent", name: "Срочно ×1.5", desc: "Запуск день в день" },
];

export function ProjectCalculatorApp({
  onContact,
}: {
  onContact: (data: { tier: string; budget: number; days: number; addons: string[] }) => void;
}) {
  const [tier, setTier] = useState<TierId>("landing");
  const [addons, setAddons] = useState<string[]>(["three", "pwa"]);
  const [speed, setSpeed] = useState<SpeedId>("normal");

  const selectedTier = TIERS.find((t) => t.id === tier)!;
  const addonCost = addons.reduce((sum, id) => sum + (ADDONS.find((a) => a.id === id)?.cost || 0), 0);
  const speedMult = speed === "urgent" ? 1.5 : speed === "fast" ? 1.25 : 1.0;
  const totalCost = Math.round((selectedTier.base + addonCost) * speedMult);
  const estimatedDays = Math.max(7, Math.round((selectedTier.days + addons.length * 3) / (speed === "urgent" ? 1.4 : speed === "fast" ? 1.2 : 1.0)));

  const card = (active: boolean) =>
    `w-full min-w-0 overflow-hidden rounded-xl border p-3.5 text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
      active
        ? "border-[var(--desk-accent)] bg-[var(--desk-surface-3)]"
        : "border-[var(--desk-border)] bg-[var(--desk-surface-2)] hover:bg-[var(--desk-surface-3)]"
    }`;

  return (
    <div className="flex flex-col gap-5 p-5 text-sm text-[var(--desk-fg)] max-w-4xl mx-auto w-full pb-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--desk-muted)]">Шаг 1 · Тип проекта</span>
        <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {TIERS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTier(t.id)} className={card(tier === t.id)}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 font-bold">
                <span className="min-w-0 leading-snug">{t.name}</span>
                <span className="font-mono text-xs text-[var(--desk-accent)] shrink-0 whitespace-nowrap">{t.base.toLocaleString("ru-RU")} ₽</span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--desk-muted)]">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--desk-muted)]">Шаг 2 · Технологии</span>
        <div className="mt-2.5 space-y-2">
          {ADDONS.map((a) => {
            const active = addons.includes(a.id);
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAddons((cur) => (cur.includes(a.id) ? cur.filter((x) => x !== a.id) : [...cur, a.id]))}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                  active
                    ? "border-[var(--desk-accent)] bg-[var(--desk-surface-3)]"
                    : "border-[var(--desk-border)] bg-[var(--desk-surface-2)] hover:bg-[var(--desk-surface-3)]"
                }`}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-colors ${
                      active ? "border-[var(--desk-accent)] bg-[var(--desk-accent)] text-[var(--desk-accent-fg)]" : "border-[var(--desk-border)]"
                    }`}
                  >
                    {active && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                  </span>
                  <span className="min-w-0 text-xs font-medium">{a.name}</span>
                </span>
                <span className="font-mono text-xs text-[var(--desk-muted)] shrink-0 whitespace-nowrap">+{a.cost.toLocaleString("ru-RU")} ₽</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--desk-muted)]">Шаг 3 · Темп запуска</span>
        <div className="mt-2.5 grid grid-cols-3 gap-2 text-xs">
          {SPEEDS.map((s) => (
            <button key={s.id} type="button" onClick={() => setSpeed(s.id)} className={card(speed === s.id)}>
              <div className="text-center font-bold">{s.name}</div>
              <div className="mt-0.5 text-center text-[0.6875rem] text-[var(--desk-muted)]">{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] p-4.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-[var(--desk-muted)]">Ориентировочно</span>
            <div className="mt-0.5 font-mono text-2xl font-black tracking-tight text-[var(--desk-fg)] sm:text-3xl shrink-0 whitespace-nowrap">
              {totalCost.toLocaleString("ru-RU")} ₽
            </div>
            <div className="mt-0.5 text-xs text-[var(--desk-muted)]">
              Срок: <strong className="text-[var(--desk-fg)]">~{estimatedDays} рабочих дней</strong>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              onContact({
                tier: selectedTier.name,
                budget: totalCost,
                days: estimatedDays,
                addons: addons.map((id) => ADDONS.find((a) => a.id === id)?.name || id),
              })
            }
            className="flex items-center gap-2 rounded-xl bg-[var(--desk-accent)] px-5 py-3 text-xs font-bold text-[var(--desk-accent-fg)] transition-all duration-150 hover:brightness-110 active:scale-95 cursor-pointer shadow-md"
          >
            <span>Отправить бриф с расчётом</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- ТЕРМИНАЛ ----------------------------- */

export function TerminalApp({
  onThemeChange,
  onOpenCalc,
  onOpenApp,
}: {
  onThemeChange: (t: WallpaperTheme) => void;
  onOpenCalc: () => void;
  onOpenApp: (id: string) => void;
}) {
  const [history, setHistory] = useState<string[]>([
    "maeTtI shell 2.4 — интерактивная консоль студии",
    "(c) 2026 maeTtI Digital Engineering Studio",
    "",
    "Введите 'help' для списка команд.",
    "",
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    const cmd = raw.toLowerCase();
    if (!cmd) return;

    sounds.playGlassClick();
    const log = [...history, `guest@maetti:~$ ${raw}`];

    if (cmd === "help") {
      log.push(
        "Команды:",
        "  help         — эта справка",
        "  services     — услуги и стек",
        "  team         — команда",
        "  calc         — калькулятор бюджета",
        "  theme <name> — тема: aurora, light, sunset, ice, cyber",
        "  app <id>     — открыть приложение (uslugi, keysy, team, contacts, snake, dragon)",
        "  skills       — технический стек",
        "  contact      — контакты",
        "  clear        — очистить экран",
        "",
      );
    } else if (cmd === "services") {
      log.push(
        "Услуги maeTtI:",
        "  • 3D и WebGL-сайты (Three.js, GLSL)",
        "  • Веб-сервисы и SaaS (Next.js, Node.js)",
        "  • Дизайн-системы и UI",
        "  • PWA и мобильная разработка",
        "",
      );
    } else if (cmd === "team") {
      log.push(
        "Команда:",
        "  • Lead 3D / Creative Developer",
        "  • Senior Fullstack & System Architect",
        "  • UI/UX & Motion Designer",
        "  • DevOps & Cloud Engineer",
        "",
      );
    } else if (cmd === "calc") {
      log.push("Запуск калькулятора проектов…");
      onOpenCalc();
    } else if (cmd.startsWith("theme ")) {
      const t = cmd.replace("theme ", "").trim() as WallpaperTheme;
      if (["aurora", "light", "sunset", "ice", "cyber"].includes(t)) {
        onThemeChange(t);
        log.push(`Тема переключена: ${t}`);
      } else {
        log.push("Нет такой темы. Варианты: aurora, light, sunset, ice, cyber");
      }
    } else if (cmd.startsWith("app ")) {
      const id = cmd.replace("app ", "").trim();
      log.push(`Открываю '${id}'…`);
      onOpenApp(id);
    } else if (cmd === "skills") {
      log.push("Стек: Next.js, React, TypeScript, Three.js, TailwindCSS, Web Audio API, Node.js.");
    } else if (cmd === "contact") {
      log.push("Telegram: @maetti_studio · Email: hello@maetti.ru");
    } else if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else {
      log.push(`Команда '${cmd}' не распознана. Введите 'help'.`);
    }

    setHistory(log);
    setInput("");
  };

  return (
    <div className="flex h-full flex-col bg-[#0c1118] p-4 font-mono text-[0.8125rem]">
      <div className="desk-scroll flex-1 space-y-1 overflow-auto text-[#a3e6cd]">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap leading-relaxed">
            {line}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 border-t border-emerald-500/20 pt-2">
        <span className="shrink-0 font-bold text-[#7dd3fc]">guest@maetti:~$</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="help, calc, theme cyber…"
          autoFocus
          className="flex-1 bg-transparent text-[#c9f0dd] outline-none placeholder-[#3d594c]"
        />
      </form>
    </div>
  );
}

/* ----------------------------- ИГРЫ ----------------------------- */

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

function GameHud({ score, onRestart }: { score: number; onRestart: () => void }) {
  return (
    <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--desk-fg)]">
      <span className="font-mono tabular-nums">Счёт: {score}</span>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-lg border border-[var(--desk-border)] bg-[var(--desk-surface-2)] px-2 py-0.5 text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-3)] cursor-pointer active:scale-95"
      >
        Заново
      </button>
    </div>
  );
}

function Overlay({
  title,
  hint,
  onRestart,
  onAction,
}: {
  title: string;
  hint?: string;
  onRestart?: () => void;
  onAction?: () => void;
}) {
  return (
    <div
      onPointerDown={(e) => {
        if (onAction) {
          e.stopPropagation();
          onAction();
        }
      }}
      className={`absolute inset-0 grid place-items-center rounded-lg bg-black/70 text-center text-white backdrop-blur-[2px] select-none ${
        onAction ? "cursor-pointer" : ""
      }`}
    >
      <div>
        <p className="text-base font-bold">{title}</p>
        {hint && <p className="mt-1 text-xs text-white/75">{hint}</p>}
        {onRestart && (
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={onRestart}
            className="mt-3 rounded-lg bg-white px-3 py-1 text-xs font-bold text-neutral-900 transition-transform active:scale-95 cursor-pointer"
          >
            Ещё раз
          </button>
        )}
      </div>
    </div>
  );
}

export function Snake({ active = true }: { active?: boolean }) {
  const [run, setRun] = useState(0);
  return <SnakeBoard key={run} active={active} restart={() => setRun((r) => r + 1)} />;
}

function SnakeBoard({ restart, active }: { restart: () => void; active: boolean }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const turn = useRef<(x: number, y: number) => void>(() => {});
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const c = cv.current!;
    const ctx = c.getContext("2d")!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = SIZE * dpr;
    c.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    const snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
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
      ctx.fillStyle = "#0a0f18";
      ctx.fillRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = "#ef4444";
      ctx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
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

    turn.current = (x, y) => {
      if (x !== -dir.x || y !== -dir.y) next = { x, y };
    };

    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      if (!document.documentElement.classList.contains("desk-on")) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest("input, textarea, [contenteditable='true']"))
      ) {
        return;
      }
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

  return (
    <div className="p-3">
      <GameHud score={score} onRestart={restart} />
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        <canvas ref={cv} style={{ width: SIZE, height: SIZE }} className="block rounded-lg border border-[var(--desk-border)]" />
        {over && <Overlay title="Игра окончена" hint={`Счёт: ${score}`} onRestart={restart} onAction={restart} />}
      </div>
    </div>
  );
}

const DW = 288;
const DH = 384;
const GROUND = 16;
const GRAV = 1400;
const JUMP = -360;
const PIPE_W = 46;
const GAP = 128;
const SPEED = 130;
const SPACING = 178;
const DX = 66;
const R = 9;

type Pipe = { x: number; gap: number; scored: boolean };

export function Dragon({ active = true }: { active?: boolean }) {
  const [run, setRun] = useState(0);
  return <Sky key={run} active={active} restart={() => setRun((r) => r + 1)} />;
}

function Sky({ restart, active }: { restart: () => void; active: boolean }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const flap = useRef<() => void>(() => {});
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

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

    const spawn = () => {
      const top = GAP / 2 + 26;
      const bot = DH - GROUND - GAP / 2 - 26;
      pipes.push({ x: DW + 20, gap: top + Math.random() * (bot - top), scored: false });
    };

    const die = () => {
      dead = true;
      setOver(true);
    };

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
    };

    const drawDragon = () => {
      ctx.fillStyle = "#ea580c";
      ctx.fillRect(DX - 8, y - 6, 14, 12);
      ctx.fillStyle = "#fb923c";
      ctx.fillRect(DX + 5, y - 8, 9, 9);
      ctx.fillStyle = "#fff";
      ctx.fillRect(DX + 10, y - 6, 3, 3);
    };

    const draw = () => {
      ctx.fillStyle = "#0c1527";
      ctx.fillRect(0, 0, DW, DH);
      for (const p of pipes) drawKelp(p);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, DH - GROUND, DW, GROUND);
      drawDragon();
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      if (dead) {
        if (y + R < DH - GROUND) {
          vy = Math.min(vy + GRAV * dt, 520);
          y = Math.min(y + vy * dt, DH - GROUND - R);
        }
      } else if (run) {
        vy = Math.min(vy + GRAV * dt, 480);
        y += vy * dt;
        for (const p of pipes) p.x -= SPEED * dt;
        if (!pipes.length || pipes[pipes.length - 1].x < DW + 20 - SPACING) spawn();
        pipes = pipes.filter((p) => p.x > -PIPE_W - 8);
        for (const p of pipes) {
          if (!p.scored && p.x + PIPE_W < DX) {
            p.scored = true;
            setScore(++pts);
          }
          if (hits(p.x, 0, PIPE_W, p.gap - GAP / 2) || hits(p.x, p.gap + GAP / 2, PIPE_W, DH - GROUND - p.gap - GAP / 2)) die();
        }
        if (y + R >= DH - GROUND) die();
      }
      draw();
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
      if (!activeRef.current) return;
      if (!document.documentElement.classList.contains("desk-on")) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.closest("input, textarea, [contenteditable='true']"))
      ) {
        return;
      }
      if (e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        flap.current();
      }
    };
    window.addEventListener("keydown", onKey);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="p-3 select-none">
      <GameHud score={score} onRestart={restart} />
      <div
        className="relative cursor-pointer select-none touch-none"
        style={{ width: DW, height: DH }}
        onPointerDown={() => flap.current()}
      >
        <canvas
          ref={cv}
          style={{ width: DW, height: DH }}
          className="block cursor-pointer touch-none rounded-lg border border-[var(--desk-border)]"
        />
        {ready && <Overlay title="Дракончик" hint="Тапни или нажми пробел" onAction={() => flap.current()} />}
        {over && <Overlay title="Игра окончена" hint={`Счёт: ${score}`} onRestart={restart} onAction={restart} />}
      </div>
    </div>
  );
}

/* ----------------------------- САЙТ В ОКНЕ ----------------------------- */

export function SiteIframe({ path, title }: { path: string; title: string }) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const host = typeof location !== "undefined" ? location.host : "maetti.ru";

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex shrink-0 items-center gap-2.5 border-b border-neutral-300 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 px-3 py-2 text-neutral-800 dark:text-neutral-200">
        <span className="flex items-center gap-1 text-[0.6875rem] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          <Globe className="h-3.5 w-3.5" />
          HTTPS
        </span>
        <div className="flex min-w-0 flex-1 items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 px-3 py-1 text-xs shadow-2xs">
          <span className="truncate font-mono text-neutral-700 dark:text-neutral-300">
            {host}
            {base}
            {path}
          </span>
        </div>
        <a
          href={base + path}
          target="_blank"
          rel="noopener noreferrer"
          title="Открыть в новой вкладке"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer shadow-2xs active:scale-95"
        >
          <ArrowUpRight className="h-3.5 w-3.5 stroke-[2.5]" />
        </a>
      </div>
      <iframe src={base + path} title={title} className="min-h-0 w-full flex-1 border-0 bg-white" />
    </div>
  );
}

/* ----------------------------- О СИСТЕМЕ ----------------------------- */

export function InfoApp({ onClose }: { onClose: () => void }) {
  const features = [
    { icon: Layers, title: "Оконный менеджер", desc: "Перетаскивание, светофоры, док и z-order как в настоящей ОС" },
    { icon: Calculator, title: "Калькулятор проекта", desc: "Смета и сроки за минуту, бриф улетает в контакты" },
    { icon: TerminalIcon, title: "Терминал maeTtI", desc: "Управление столом командами: theme, app, calc" },
    { icon: Music, title: "Звуковой движок", desc: "Процедурный эмбиент на Web Audio — без единого mp3" },
  ];

  return (
    <div className="space-y-4 p-5 text-[var(--desk-fg)]">
      <div>
        <h3 className="text-lg font-black tracking-tight">maeTtI OS</h3>
        <p className="mt-0.5 text-xs text-[var(--desk-muted)]">Интерактивная среда студии цифровой инженерии</p>
      </div>

      <div className="space-y-2">
        {features.map((f) => (
          <div key={f.title} className="flex items-start gap-3 rounded-xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] p-3">
            <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--desk-accent)]" />
            <div>
              <div className="text-xs font-bold">{f.title}</div>
              <div className="mt-0.5 text-[0.6875rem] leading-relaxed text-[var(--desk-muted)]">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onClose}
        className="w-full rounded-xl bg-[var(--desk-accent)] px-6 py-2.5 text-xs font-bold text-[var(--desk-accent-fg)] transition-all duration-150 hover:brightness-110 active:scale-[0.98] cursor-pointer"
      >
        Понятно
      </button>
    </div>
  );
}

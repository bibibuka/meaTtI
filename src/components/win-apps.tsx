"use client";

/* =========================================================================
   maeTtI OS — содержимое приложений рабочего стола:
   звуковой движок, терминал, игры, браузер, «О системе».
   Весь UI красится токенами --desk-* (см. desk-themes.ts); терминал —
   намеренно всегда тёмный, это его природа.
   ========================================================================= */

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Globe,
  Layers,
  Music,
  Terminal as TerminalIcon,
} from "lucide-react";
import type { WallpaperTheme } from "./desk-themes";
import { triggerHaptic } from "@/utils/haptics";

/* ----------------------------- ЗВУКОВОЙ ДВИЖОК ----------------------------- */
// Native Web Audio API: синтез тактильных кликов и эмбиента без внешних mp3
class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private oscs: OscillatorNode[] = [];
  private ambientGen = 0;
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
    triggerHaptic(8);
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
    this.ambientGen++;
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
    const gen = ++this.ambientGen;
    try {
      if (this.ctx && this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0.001, this.ctx.currentTime, 0.5);
        setTimeout(() => {
          if (gen !== this.ambientGen) return;
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

/* ----------------------------- ТЕРМИНАЛ ----------------------------- */

// Что открывает команда `app <id>` — те же id, что у приложений стола.
const TERMINAL_APPS = ["uslugi", "keysy", "team", "contacts", "snake", "dragon", "info", "terminal"];

export function TerminalApp({
  onThemeChange,
  onOpenApp,
}: {
  onThemeChange: (t: WallpaperTheme) => void;
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
        "  theme <name> — тема: aurora, light, sunset, ice, cyber",
        `  app <id>     — открыть приложение (${TERMINAL_APPS.join(", ")})`,
        "  skills       — технический стек",
        "  contact      — контакты",
        "  clear        — очистить экран",
        "",
      );
    } else if (cmd === "services") {
      log.push(
        "Услуги maeTtI:",
        "  • Веб-сайты — от 40 000 ₽",
        "  • Чат-боты и мини-приложения — от 50 000 ₽",
        "  • Автоматизация и интеграции — от 25 000 ₽",
        "",
      );
    } else if (cmd === "team") {
      log.push(
        "Команда:",
        "  • Орлов Михаил — основатель, разработка",
        "  • Егор Калач — сооснователь, backend",
        "  • Данченко Руслан — внедрение",
        "  • Аксёнов Артём — fullstack",
        "  • Пастушенко Леонид — железо",
        "  • Борисова Василиса — медиа",
        "",
      );
    } else if (cmd === "calc") {
      log.push("Калькулятора нет. Напишите в Telegram: @maetti_mihail");
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
      if (TERMINAL_APPS.includes(id)) {
        log.push(`Открываю '${id}'…`);
        onOpenApp(id);
      } else {
        log.push(`Нет приложения '${id}'. Варианты: ${TERMINAL_APPS.join(", ")}`);
      }
    } else if (cmd === "skills") {
      log.push("Стек: Next.js, React, TypeScript, Three.js, TailwindCSS, Web Audio API, Node.js.");
    } else if (cmd === "contact") {
      log.push("Telegram: @maetti_mihail — https://t.me/maetti_mihail");
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

function GameHud({ score }: { score: number }) {
  return (
    <div className="mb-2 flex shrink-0 items-center text-xs font-bold text-[var(--desk-fg)]">
      <span className="font-mono tabular-nums">Счёт: {score}</span>
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
      className={`desk-fade absolute inset-0 grid place-items-center rounded-xl bg-black/75 text-center text-white backdrop-blur-[2px] select-none ${
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
  const containerRef = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const turn = useRef<(x: number, y: number) => void>(() => {});
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [boardSize, setBoardSize] = useState(320);

  useEffect(() => {
    const c = cv.current;
    const container = containerRef.current;
    if (!c || !container) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const pad = 12;
    const availW = Math.max(180, (rect.width || 320) - pad);
    const availH = Math.max(180, (rect.height || 320) - pad);
    const available = Math.min(availW, availH);
    const cell = Math.max(12, Math.floor(available / N));
    const size = cell * N;
    setBoardSize(size);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = size * dpr;
    c.height = size * dpr;
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
      ctx.fillRect(0, 0, size, size);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
      ctx.lineWidth = 1;
      for (let i = 0; i <= N; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cell, 0);
        ctx.lineTo(i * cell, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cell);
        ctx.lineTo(size, i * cell);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255, 255, 255, 0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(1, 1, size - 2, size - 2);

      ctx.fillStyle = "#ef4444";
      ctx.fillRect(food.x * cell + 2, food.y * cell + 2, cell - 4, cell - 4);

      snake.forEach((s, i) => {
        ctx.fillStyle = i ? "#22c55e" : "#86efac";
        ctx.fillRect(s.x * cell + 1, s.y * cell + 1, cell - 2, cell - 2);
      });
    };
    draw();

    const tick = setInterval(() => {
      // Пауза: окно не сверху, стол ушёл с экрана или вкладка скрыта
      if (!activeRef.current || document.hidden) return;
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

    let touchStartX = 0;
    let touchStartY = 0;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      if (Math.hypot(dx, dy) > 20) {
        if (Math.abs(dx) > Math.abs(dy)) {
          turn.current(dx > 0 ? 1 : -1, 0);
        } else {
          turn.current(0, dy > 0 ? 1 : -1);
        }
      }
    };
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      clearInterval(tick);
      window.removeEventListener("keydown", onKey);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col p-3 select-none">
      <GameHud score={score} />
      <div
        ref={containerRef}
        className="relative min-h-0 w-full flex-1 flex items-center justify-center rounded-xl border border-[var(--desk-border)] bg-[#0a0f18] p-2 shadow-inner"
      >
        <div className="relative overflow-hidden rounded-lg border border-white/25" style={{ width: boardSize, height: boardSize }}>
          <canvas
            ref={cv}
            style={{ width: boardSize, height: boardSize }}
            className="block"
          />
          {over && <Overlay title="Игра окончена" hint={`Счёт: ${score}`} onRestart={restart} onAction={restart} />}
        </div>
      </div>
    </div>
  );
}

type Pipe = { x: number; gap: number; scored: boolean };

export function Dragon({ active = true }: { active?: boolean }) {
  const [run, setRun] = useState(0);
  return <Sky key={run} active={active} restart={() => setRun((r) => r + 1)} />;
}

function Sky({ restart, active }: { restart: () => void; active: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const flap = useRef<() => void>(() => {});
  // Цикл отрисовки стоит, пока окно не активно; resume запускает его снова.
  const resume = useRef<() => void>(() => {});
  const activeRef = useRef(active);
  useEffect(() => {
    activeRef.current = active;
    if (active) resume.current();
  }, [active]);

  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const c = cv.current;
    const container = containerRef.current;
    if (!c || !container) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const w = Math.max(260, Math.floor(rect.width || 320));
    const h = Math.max(300, Math.floor(rect.height || 420));

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = w * dpr;
    c.height = h * dpr;
    ctx.scale(dpr, dpr);

    const GROUND = 18;
    const GRAV = 1350;
    const JUMP = -360;
    const PIPE_W = 48;
    const GAP = Math.round(Math.max(120, Math.min(150, h * 0.28)));
    const SPEED = 135;
    const SPACING = Math.round(Math.max(160, w * 0.54));
    const DX = Math.round(w * 0.22);
    const R = 10;

    let y = h * 0.42;
    let vy = 0;
    let run = false;
    let dead = false;
    let pts = 0;
    let pipes: Pipe[] = [];

    const spawn = () => {
      const top = GAP / 2 + 24;
      const bot = h - GROUND - GAP / 2 - 24;
      pipes.push({ x: w + 20, gap: top + Math.random() * (bot - top), scored: false });
    };

    const die = () => {
      dead = true;
      setOver(true);
    };

    const hits = (px: number, py: number, pw: number, ph: number) => {
      const nx = Math.max(px, Math.min(DX, px + pw));
      const ny = Math.max(py, Math.min(y, py + ph));
      return (DX - nx) ** 2 + (y - ny) ** 2 < R * R;
    };

    const drawKelp = (p: Pipe) => {
      const top = p.gap - GAP / 2;
      const bot = p.gap + GAP / 2;
      ctx.fillStyle = "#166534";
      ctx.fillRect(p.x, 0, PIPE_W, top);
      ctx.fillRect(p.x, bot, PIPE_W, h - GROUND - bot);
      ctx.fillStyle = "#22c55e";
      ctx.fillRect(p.x + 5, 0, PIPE_W - 14, Math.max(0, top - 6));
      ctx.fillRect(p.x + 5, bot + 6, PIPE_W - 14, Math.max(0, h - GROUND - bot - 6));
    };

    type Ember = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; color: string; size: number };
    let embers: Ember[] = [];

    const spawnEmbers = () => {
      for (let i = 0; i < 4; i++) {
        embers.push({
          x: DX - 8,
          y: y + (Math.random() * 6 - 3),
          vx: -(SPEED * 0.45 + Math.random() * 50),
          vy: (Math.random() - 0.5) * 45,
          life: 1,
          maxLife: 0.3 + Math.random() * 0.2,
          color: Math.random() > 0.4 ? "#f59e0b" : "#ef4444",
          size: 1.5 + Math.random() * 2,
        });
      }
    };

    const drawDragon = (now: number) => {
      ctx.save();
      ctx.translate(DX, y);

      // Наклон дракончика по скорости прыжка/падения
      const rot = dead
        ? Math.PI * 0.45
        : Math.min(Math.PI * 0.35, Math.max(-Math.PI * 0.28, vy * 0.0018));
      ctx.rotate(rot);

      const wingCycle = dead ? 0.2 : Math.sin(now * (run ? 0.024 : 0.012));

      // 1. Хвост с пламенным наконечником
      ctx.beginPath();
      ctx.moveTo(-8, 2);
      ctx.quadraticCurveTo(-16, 2, -22, -2);
      ctx.quadraticCurveTo(-16, 8, -8, 6);
      ctx.fillStyle = "#ea580c";
      ctx.fill();

      // Наконечник хвоста
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(-21, -1);
      ctx.lineTo(-27, -5);
      ctx.lineTo(-25, 0);
      ctx.lineTo(-28, 4);
      ctx.lineTo(-21, 2);
      ctx.closePath();
      ctx.fill();

      // 2. Спинные шипы
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(-10, -5);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, -6);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-4, -7);
      ctx.lineTo(-5, -13);
      ctx.lineTo(1, -7);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(3, -9);
      ctx.lineTo(3, -15);
      ctx.lineTo(8, -8);
      ctx.fill();

      // 3. Тело дракона (округлое туловище с тенью)
      ctx.fillStyle = "#ea580c";
      ctx.beginPath();
      ctx.ellipse(-1, 2, 12, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#c2410c";
      ctx.beginPath();
      ctx.ellipse(-1, 5, 10, 5, 0, 0, Math.PI);
      ctx.fill();

      // 4. Золотистое брюшко со щитками
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.ellipse(2, 4, 7, 6, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.lineTo(6, 3);
      ctx.moveTo(-1, 5);
      ctx.lineTo(7, 6);
      ctx.moveTo(1, 8);
      ctx.lineTo(6, 9);
      ctx.stroke();

      // 5. Голова дракончика и мордочка
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.ellipse(8, -3, 8, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Носик
      ctx.beginPath();
      ctx.roundRect(11, -3, 8, 6, [2, 4, 4, 2]);
      ctx.fill();

      // Ноздря
      ctx.fillStyle = "#7c2d12";
      ctx.beginPath();
      ctx.arc(16, -1.5, 1, 0, Math.PI * 2);
      ctx.fill();

      // Изогнутые рожки
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.moveTo(4, -8);
      ctx.quadraticCurveTo(2, -15, -4, -16);
      ctx.quadraticCurveTo(2, -12, 7, -8);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(7, -8);
      ctx.quadraticCurveTo(6, -16, 0, -18);
      ctx.quadraticCurveTo(6, -13, 10, -7);
      ctx.fill();

      // 6. Глаз дракончика
      if (dead) {
        ctx.strokeStyle = "#451a03";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(8, -6);
        ctx.lineTo(13, -2);
        ctx.moveTo(13, -6);
        ctx.lineTo(8, -2);
        ctx.stroke();
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(10, -4, 3.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#090d16";
        ctx.beginPath();
        ctx.arc(11, -4, 2.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(10.5, -5.2, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      // Румянец
      if (!dead) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
        ctx.beginPath();
        ctx.ellipse(8, 0, 2.5, 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Анимированное крыло с взмахом
      ctx.save();
      ctx.translate(-2, -1);
      ctx.rotate(wingCycle * 0.45);

      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-4, -14);
      ctx.quadraticCurveTo(1, -12, 4, -15);
      ctx.quadraticCurveTo(6, -9, 9, -12);
      ctx.quadraticCurveTo(7, -5, 4, 0);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = "#fef08a";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-4, -14);
      ctx.moveTo(0, 0);
      ctx.lineTo(4, -15);
      ctx.moveTo(0, 0);
      ctx.lineTo(9, -12);
      ctx.stroke();

      ctx.restore();

      ctx.restore();
    };

    const draw = (now: number) => {
      ctx.fillStyle = "#0c1527";
      ctx.fillRect(0, 0, w, h);
      for (const p of pipes) drawKelp(p);
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(0, h - GROUND, w, GROUND);
      ctx.fillStyle = "#334155";
      ctx.fillRect(0, h - GROUND, w, 2);

      // Искры от взмахов крыльев
      for (const p of embers) {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      drawDragon(now);
    };

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = 0;
      // Окно свернули, перекрыли другим или ушли со стола — замираем на
      // последнем кадре, а не рисуем 60 раз в секунду впустую.
      if (!activeRef.current) return;
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;

      // Обновление искр
      for (const p of embers) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt / p.maxLife;
      }
      embers = embers.filter((p) => p.life > 0);

      if (dead) {
        if (y + R < h - GROUND) {
          vy = Math.min(vy + GRAV * dt, 520);
          y = Math.min(y + vy * dt, h - GROUND - R);
        }
      } else if (run) {
        vy = Math.min(vy + GRAV * dt, 480);
        y += vy * dt;
        for (const p of pipes) p.x -= SPEED * dt;
        if (!pipes.length || pipes[pipes.length - 1].x < w + 20 - SPACING) spawn();
        pipes = pipes.filter((p) => p.x > -PIPE_W - 8);
        for (const p of pipes) {
          if (!p.scored && p.x + PIPE_W < DX) {
            p.scored = true;
            setScore(++pts);
          }
          if (hits(p.x, 0, PIPE_W, p.gap - GAP / 2) || hits(p.x, p.gap + GAP / 2, PIPE_W, h - GROUND - p.gap - GAP / 2)) die();
        }
        if (y + R >= h - GROUND) die();
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
      spawnEmbers();
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
    resume.current = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(step);
    };
    // Первый кадр рисуем всегда: иначе неактивное окно осталось бы пустым.
    draw(performance.now());
    resume.current();

    return () => {
      cancelAnimationFrame(raf);
      resume.current = () => {};
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="flex h-full w-full flex-col p-3 select-none">
      <GameHud score={score} />
      <div
        ref={containerRef}
        className="relative min-h-0 w-full flex-1 cursor-pointer select-none touch-none overflow-hidden rounded-xl border border-[var(--desk-border)] shadow-inner"
        onPointerDown={() => flap.current()}
      >
        <canvas
          ref={cv}
          className="block h-full w-full cursor-pointer touch-none"
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
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer shadow-2xs active:scale-95"
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
    {
      icon: Layers,
      title: "Оконный менеджер",
      desc: "Перетаскивание, светофоры, док и z-order как в настольной операционной системе",
    },
    {
      icon: TerminalIcon,
      title: "Терминал maeTtI",
      desc: "Интерактивная консоль с командами: theme, app, skills, clear",
    },
    {
      icon: Music,
      title: "Звуковой движок",
      desc: "Процедурный эмбиент и тактильные щелчки на чистом Web Audio API",
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between p-6 text-[var(--desk-fg)] select-none">
      <div className="space-y-4">
        {/* Шапка: логотип maeTtI OS, название, версия и статус */}
        <div className="flex items-center gap-3.5 border-b border-[var(--desk-border)] pb-4">
          <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] shadow-xs">
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--desk-accent)] opacity-60 animate-ping" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-[var(--desk-accent)]" />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black tracking-tight text-[var(--desk-fg)]">maeTtI OS</h3>
              <span className="rounded-md border border-[var(--desk-border)] bg-[var(--desk-surface-2)] px-2 py-0.5 text-[0.6875rem] font-bold font-mono text-[var(--desk-accent)]">
                v2.5
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-[var(--desk-fg)]">
              Альтернативная версия взаимодействия с сайтом
            </p>
            <p className="mt-0.5 text-[0.6875rem] text-[var(--desk-muted)]">
              Интерактивная среда студии цифровой инженерии
            </p>
          </div>
        </div>

        {/* Возможности системы */}
        <div className="space-y-2.5">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex items-center gap-3.5 rounded-xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] p-3 transition-colors hover:bg-[var(--desk-surface-3)]"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--desk-border)] bg-[var(--desk-surface)] text-[var(--desk-accent)] shadow-2xs">
                <f.icon className="h-4 w-4 stroke-[2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--desk-fg)]">{f.title}</div>
                <div className="mt-0.5 text-[0.75rem] leading-relaxed text-[var(--desk-muted)]">
                  {f.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Футер: кнопка подтверждения */}
      <div className="pt-3">
        <button
          type="button"
          onClick={() => {
            try {
              sessionStorage.setItem("maetti_info_seen", "true");
            } catch {}
            onClose();
          }}
          className="w-full rounded-xl bg-[var(--desk-accent)] py-2.5 text-xs font-bold text-[var(--desk-accent-fg)] shadow-sm transition-all duration-150 hover:brightness-110 active:scale-[0.99] cursor-pointer"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

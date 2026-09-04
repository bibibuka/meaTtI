"use client";

/* =========================================================================
   maeTtI OS — интерактивный рабочий стол на главной.
   Оболочка: панель сверху, ярлыки, виджеты, окна, док, лаунчер, Spotlight,
   контекстное меню. Весь внешний вид задаётся токенами темы (desk-themes.ts),
   поэтому светлая/тёмная палитры одинаково контрастны по построению.
   ========================================================================= */

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowUp,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  Gamepad2,
  Flame,
  Info,
  Layers,
  Mail,
  Maximize2,
  Minus,
  Music,
  Pause,
  Play,
  Plus,
  Rocket,
  Search,
  Square,
  Terminal,
  Users,
  Volume2,
  VolumeX,
  X,
  type LucideIcon,
} from "lucide-react";
import { THEMES, THEME_ORDER, THEME_SWATCH, type WallpaperTheme } from "./desk-themes";
import { Dragon, InfoApp, SiteIframe, Snake, sounds, TerminalApp } from "./win-apps";

/* ----------------------------- ПРИЛОЖЕНИЯ ----------------------------- */

interface DesktopApp {
  id: string;
  label: string;
  href?: string;
  glyph: LucideIcon;
  tint: string;
  description: string;
}

const APPS: DesktopApp[] = [
  { id: "info", label: "Инфо", glyph: Info, tint: "#3b82f6", description: "О системе maeTtI OS" },
  { id: "uslugi", label: "Услуги", href: "/uslugi", glyph: Briefcase, tint: "#0ea5e9", description: "Разработка, дизайн, digital" },
  { id: "keysy", label: "Кейсы", href: "/keysy", glyph: Rocket, tint: "#d97706", description: "Наши проекты и результаты" },
  { id: "team", label: "Команда", href: "/team", glyph: Users, tint: "#10b981", description: "Инженеры и разработчики" },
  { id: "contacts", label: "Контакты", href: "/contacts", glyph: Mail, tint: "#f43f5e", description: "Связаться с нами" },
  { id: "terminal", label: "Терминал", glyph: Terminal, tint: "#8b5cf6", description: "Интерактивная консоль" },
  { id: "snake", label: "Змейка", glyph: Gamepad2, tint: "#22c55e", description: "Ретро-аркада на Canvas" },
  { id: "dragon", label: "Дракончик", glyph: Flame, tint: "#ef4444", description: "Аркада Flappy Dragon" },
];

const TITLES: Record<string, string> = {
  info: "О системе",
  uslugi: "Услуги студии",
  keysy: "Кейсы",
  team: "Команда",
  contacts: "Контакты",
  terminal: "maeTtI Shell",
  snake: "Змейка",
  dragon: "Дракончик",
};

const SIZES: Record<string, [number, number]> = {
  uslugi: [1160, 720],
  keysy: [1180, 740],
  team: [1140, 720],
  contacts: [960, 640],
  terminal: [720, 460],
  snake: [340, 500],
  dragon: [340, 560],
  info: [420, 480],
};

const tileStyle = (tint: string): CSSProperties => ({
  background: `color-mix(in srgb, ${tint} 16%, transparent)`,
  borderColor: `color-mix(in srgb, ${tint} 40%, transparent)`,
  color: tint,
});

/* ----------------------------- ЯРЛЫК ПРИЛОЖЕНИЯ ----------------------------- */

function AppTile({ app, onOpen, selected }: { app: DesktopApp; onOpen: () => void; selected: boolean }) {
  const Glyph = app.glyph;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={app.label}
      className="group flex w-[5.5rem] flex-col items-center gap-1.5 rounded-2xl p-1 text-center outline-none transition-transform duration-150 select-none hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[var(--desk-accent)] cursor-pointer sm:w-24"
    >
      <span
        style={tileStyle(app.tint)}
        className={`grid h-12 w-12 place-items-center rounded-2xl border shadow-sm backdrop-blur-sm transition-all duration-150 group-hover:shadow-md group-active:scale-90 sm:h-14 sm:w-14 ${
          selected ? "ring-2 ring-[var(--desk-accent)] ring-offset-2 ring-offset-transparent" : ""
        }`}
      >
        <Glyph className="h-6 w-6 stroke-[1.75] sm:h-7 sm:w-7" />
      </span>
      <span
        className={`w-full line-clamp-2 px-1 text-[0.6875rem] font-medium leading-tight transition-colors sm:text-xs ${
          selected
            ? "rounded-md bg-[var(--desk-accent)] px-1.5 py-0.5 font-bold text-[var(--desk-accent-fg)] shadow-xs"
            : "text-[var(--desk-fg)]"
        }`}
      >
        {app.label}
      </span>
    </button>
  );
}

/* ----------------------------- КНОПКА-СВЕТОФОР ----------------------------- */

function LightBtn({ onClick, type, label }: { onClick: () => void; type: "close" | "min" | "max"; label: string }) {
  const bg = type === "close" ? "#ff5f57" : type === "min" ? "#febc2e" : "#28c840";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ backgroundColor: bg }}
      className="group/l relative grid h-3.5 w-3.5 place-items-center rounded-full border border-black/15 text-black/75 shadow-sm transition-transform duration-100 hover:brightness-110 active:scale-90 cursor-pointer after:absolute after:-inset-3 sm:after:hidden"
    >
      <span className="opacity-70 transition-opacity group-hover/l:opacity-100 flex items-center justify-center">
        {type === "close" && <X className="h-2 w-2 stroke-[3.5]" />}
        {type === "min" && <Minus className="h-2 w-2 stroke-[3.5]" />}
        {type === "max" && <Plus className="h-2 w-2 stroke-[3.5]" />}
      </span>
    </button>
  );
}

/* ----------------------------- ОКНО ----------------------------- */

function Win({
  title,
  size,
  offset,
  z,
  min,
  focused,
  phone,
  dialog,
  noMaximize,
  maximized,
  onToggleMax,
  onClose,
  onMin,
  onFocus,
  children,
}: {
  title: string;
  size: [number, number];
  offset: number;
  z: number;
  min: boolean;
  focused: boolean;
  phone: boolean;
  dialog?: boolean;
  noMaximize?: boolean;
  maximized?: boolean;
  onToggleMax?: () => void;
  onClose: () => void;
  onMin: () => void;
  onFocus: () => void;
  children: React.ReactNode;
}) {
  const [p, setP] = useState({ x: offset * 26, y: offset * 20 });
  const [internalMax, setInternalMax] = useState(false);
  const max = maximized !== undefined ? maximized : internalMax;
  const toggleMax = () => {
    sounds.playGlassClick();
    if (onToggleMax) onToggleMax();
    else setInternalMax((m) => !m);
  };
  const [dragging, setDragging] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dragging) {
      document.body.classList.add("desk-dragging");
    } else {
      document.body.classList.remove("desk-dragging");
    }
    return () => {
      document.body.classList.remove("desk-dragging");
    };
  }, [dragging]);

  const grab = (e: React.PointerEvent) => {
    onFocus();
    if (phone || max || e.button !== 0) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, input, textarea, a")) return;

    const sx = e.clientX;
    const sy = e.clientY;
    const p0 = p;
    let moved = false;

    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx;
      const dy = ev.clientY - sy;
      if (!moved && Math.hypot(dx, dy) > 4) {
        moved = true;
        setDragging(true);
      }
      if (!moved) return;

      const el = winRef.current;
      const h = el?.offsetHeight ?? size[1];
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // шапка не уезжает под верхнюю панель, низ — под док
      const loY = 52 - (vh / 2 - h / 2);
      const hiY = vh - 88 - (vh / 2 + h / 2);
      // по бокам остаётся минимум 90px окна
      const loX = -(vw / 2) + 90;
      const hiX = vw / 2 - 90;

      setP({
        x: Math.min(Math.max(p0.x + dx, loX), Math.max(loX, hiX)),
        y: Math.min(Math.max(p0.y + dy, loY), Math.max(loY, hiY)),
      });
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener("pointermove", move);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up, { once: true });
  };

  const geometry: CSSProperties = max
    ? {
        left: "50%",
        top: "50%",
        width: "100%",
        height: "100%",
        transform: min ? "translate(-50%, calc(-50% + 48px)) scale(0.92)" : "translate(-50%, -50%)",
      }
    : phone
      ? {
          top: "3.25rem",
          bottom: "5.25rem",
          left: "0.5rem",
          right: "0.5rem",
          transform: min ? "translateY(48px) scale(0.92)" : undefined,
        }
      : {
          left: "50%",
          top: "calc(50% + 0.5rem)",
          width: `min(${size[0]}px, calc(100vw - 2rem))`,
          height: `min(${size[1]}px, calc(100svh - 9rem))`,
          transform: min
            ? `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y + 48}px)) scale(0.92)`
            : `translate(calc(-50% + ${p.x}px), calc(-50% + ${p.y}px))`,
        };

  return (
    <div
      ref={winRef}
      onPointerDown={onFocus}
      style={{
        zIndex: z,
        ...geometry,
        opacity: min ? 0 : 1,
        pointerEvents: min ? "none" : "auto",
        borderColor: focused && !max ? "color-mix(in srgb, var(--desk-accent) 55%, var(--desk-border))" : undefined,
        transition: dragging
          ? "none"
          : "width 240ms cubic-bezier(0.2, 0.8, 0.25, 1), height 240ms cubic-bezier(0.2, 0.8, 0.25, 1), transform 240ms cubic-bezier(0.2, 0.8, 0.25, 1), opacity 180ms ease-out, border-color 240ms ease, border-radius 240ms ease",
      }}
      className={`desk-fade absolute flex flex-col overflow-hidden select-none ${
        max
          ? "rounded-none border-0 shadow-2xl bg-[var(--desk-surface-opaque)]"
          : "rounded-xl border border-[var(--desk-border)] shadow-[var(--desk-shadow)] bg-[var(--desk-surface)] backdrop-blur-md"
      } text-[var(--desk-fg)]`}
    >
      <div
        onPointerDown={grab}
        onDoubleClick={() => {
          if (!dialog && !phone && !noMaximize) {
            toggleMax();
          }
        }}
        className={`flex h-10 shrink-0 touch-none items-center justify-between border-b border-[var(--desk-border)] px-3.5 ${
          dragging ? "cursor-grabbing" : phone || max ? "" : "cursor-grab"
        } select-none`}
      >
        <span onPointerDown={(e) => e.stopPropagation()} className="flex shrink-0 items-center gap-2">
          <LightBtn onClick={onClose} type="close" label="Закрыть" />
          {!dialog && (
            <>
              <LightBtn onClick={onMin} type="min" label="Свернуть" />
              {!noMaximize && <LightBtn onClick={toggleMax} type="max" label={max ? "Восстановить" : "Развернуть"} />}
            </>
          )}
        </span>

        <span className={`min-w-0 flex-1 truncate px-2 text-center text-xs font-bold tracking-wide ${focused ? "" : "opacity-60"}`}>{title}</span>

        {/* Распорка для симметричного центрирования заголовка */}
        <span className="w-14 shrink-0" />
      </div>

      <div className="desk-scroll relative min-h-0 flex-1 overflow-auto">
        {dragging && <div className="absolute inset-0 z-50 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

/* ----------------------------- СОДЕРЖИМОЕ ВИДЖЕТОВ ----------------------------- */

function WidgetsContent({
  clock,
  dateStr,
  noteText,
  updateNote,
  isPlayingSound,
  toggleSound,
}: {
  clock: string;
  dateStr: string;
  noteText: string;
  updateNote: (t: string) => void;
  isPlayingSound: boolean;
  toggleSound: () => void;
}) {
  return (
    <>
      <div className="w-full rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] p-4 shadow-lg backdrop-blur-md">
        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[var(--desk-muted)]">Местное время</span>
        <div className="mt-0.5 font-mono text-4xl font-black tabular-nums tracking-tight text-[var(--desk-fg)]">{clock}</div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-[var(--desk-border)] pt-2 text-xs font-medium text-[var(--desk-muted)]">
          <Calendar className="h-3.5 w-3.5" />
          <span className="first-letter:uppercase">{dateStr}</span>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] p-4 shadow-lg backdrop-blur-md">
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.625rem] font-bold uppercase tracking-widest text-[var(--desk-muted)]">
            <FileText className="h-3.5 w-3.5 text-amber-500" />
            Заметки
          </span>
          <span className="text-[0.625rem] text-[var(--desk-muted)]">автосохранение</span>
        </div>
        <textarea
          value={noteText}
          onChange={(e) => updateNote(e.target.value)}
          rows={3}
          placeholder="Запишите мысль или задачу…"
          className="w-full resize-none rounded-xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] p-2.5 text-xs text-[var(--desk-fg)] outline-none placeholder:text-[var(--desk-muted)] focus:border-[var(--desk-accent)]"
        />
      </div>

      <div className="flex w-full items-center justify-between rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] p-3.5 shadow-lg backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span style={tileStyle("#8b5cf6")} className="grid h-9 w-9 place-items-center rounded-xl border">
            <Music className="h-4 w-4" />
          </span>
          <div>
            <div className="text-xs font-bold text-[var(--desk-fg)]">Soundscape</div>
            <div className="text-[0.6875rem] text-[var(--desk-muted)]">Web Audio Synth</div>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleSound}
          title={isPlayingSound ? "Пауза" : "Слушать"}
          className="grid h-8 w-8 place-items-center rounded-full border border-[var(--desk-border)] bg-[var(--desk-surface-2)] text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-3)] cursor-pointer active:scale-90"
        >
          {isPlayingSound ? <Pause className="h-3.5 w-3.5" /> : <Play className="ml-0.5 h-3.5 w-3.5" />}
        </button>
      </div>
    </>
  );
}

/* ----------------------------- ГЛАВНАЯ КОМПОНЕНТА ----------------------------- */

type WinState = { id: string; min: boolean };

export default function WinDesktop() {
  const secRef = useRef<HTMLElement>(null);
  const embed = typeof window !== "undefined" && window.self !== window.top;

  const [wins, setWins] = useState<WinState[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const seen = sessionStorage.getItem("maetti_info_seen");
      if (!seen) {
        sessionStorage.setItem("maetti_info_seen", "true");
        return [{ id: "info", min: false }];
      }
    } catch {}
    return [];
  });
  const [maxWins, setMaxWins] = useState<Record<string, boolean>>({});
  const [sel, setSel] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);
  const [mobileWidgetsOpen, setMobileWidgetsOpen] = useState(false);
  const [contactsPath, setContactsPath] = useState("/contacts");
  const [clock, setClock] = useState("--:--");
  const [dateStr, setDateStr] = useState("");

  const [theme, setTheme] = useState<WallpaperTheme>(() => {
    if (typeof window === "undefined") return "aurora";
    try {
      const saved = localStorage.getItem("maetti_os_theme") as WallpaperTheme | null;
      return saved && THEMES[saved] ? saved : "aurora";
    } catch {
      return "aurora";
    }
  });

  const changeTheme = useCallback((t: WallpaperTheme) => {
    sounds.playGlassClick();
    setTheme(t);
    try {
      localStorage.setItem("maetti_os_theme", t);
    } catch {}
  }, []);

  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const toggleSound = useCallback(() => {
    sounds.playGlassClick();
    setIsPlayingSound((on) => {
      if (on) sounds.stopAmbient();
      else sounds.startAmbient(0.08);
      return !on;
    });
  }, []);

  const [noteText, setNoteText] = useState(() => {
    const def = "Обсудить новый 3D-проект с maeTtI\nСделать невозможное возможным";
    if (typeof window === "undefined") return def;
    try {
      return localStorage.getItem("maetti_glass_note") || def;
    } catch {
      return def;
    }
  });

  const updateNote = (txt: string) => {
    setNoteText(txt);
    try {
      localStorage.setItem("maetti_glass_note", txt);
    } catch {}
  };

  const [showWidgets, setShowWidgets] = useState(true);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null);
  const [phone, setPhone] = useState(() => (typeof window !== "undefined" ? matchMedia("(max-width: 767px)").matches : false));

  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const [isDeskActive, setIsDeskActive] = useState(false);
  const isDeskActiveRef = useRef(false);
  const userExitedRef = useRef(false);

  useEffect(() => {
    isDeskActiveRef.current = isDeskActive;
  }, [isDeskActive]);

  // Гарантированное добавление/удаление классов desk-on и desk-locked
  useEffect(() => {
    if (embed) return;
    const root = document.documentElement;
    if (isDeskActive) {
      root.classList.add("desk-on", "desk-locked");
      document.body.classList.add("desk-locked");
    } else {
      root.classList.remove("desk-on", "desk-locked");
      document.body.classList.remove("desk-locked");
    }
    return () => {
      root.classList.remove("desk-on", "desk-locked");
      document.body.classList.remove("desk-locked");
    };
  }, [isDeskActive, embed]);

  // Магнитный доводчик к столу при прокрутке до середины (>= 45%)
  useEffect(() => {
    if (embed) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;

        // Сброс блокировки повторного захода при уходе вверх к началу сайта
        if (ratio < 0.1) {
          userExitedRef.current = false;
        }

        // Если пользователя увлекло до середины стола (>=45%) и он не нажимал "К сайту"
        if (ratio >= 0.45 && !userExitedRef.current && !isDeskActiveRef.current) {
          isDeskActiveRef.current = true;
          setIsDeskActive(true);

          if (secRef.current) {
            const top = secRef.current.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top, behavior: "smooth" });
          }
        }
      },
      { threshold: [0.05, 0.45, 0.85] }
    );

    if (secRef.current) io.observe(secRef.current);
    return () => io.disconnect();
  }, [embed]);

  // Запрет выхода с рабочего стола скроллом (когда стол активен)
  useEffect(() => {
    if (!isDeskActive || embed) return;

    const preventOuterScroll = (e: WheelEvent | TouchEvent) => {
      const target = e.target as HTMLElement | null;
      // Разрешаем скролл внутри окон, фреймов и скроллируемых областей
      if (target?.closest(".desk-scroll, iframe, textarea, input, select")) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", preventOuterScroll, { passive: false });
    window.addEventListener("touchmove", preventOuterScroll, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventOuterScroll);
      window.removeEventListener("touchmove", preventOuterScroll);
    };
  }, [isDeskActive, embed]);

  // Выход с рабочего стола только по кнопке "К сайту"
  const handleExitDesk = useCallback(() => {
    sounds.playGlassClick();
    userExitedRef.current = true;
    setIsDeskActive(false);

    document.documentElement.classList.remove("desk-on", "desk-locked");
    document.body.classList.remove("desk-locked");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }));
      setDateStr(d.toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const openApp = useCallback((id: string) => {
    if (!APPS.some((a) => a.id === id)) return;
    sounds.playGlassClick();
    setStartOpen(false);
    setSpotlightOpen(false);
    setSel(id);
    setWins((w) => [...w.filter((x) => x.id !== id), { id, min: false }]);

    const el = secRef.current;
    if (el && typeof window !== "undefined") {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "smooth" });
    }
  }, []);

  const closeWin = (id: string) => {
    sounds.playGlassClick();
    if (id === "info") {
      try {
        sessionStorage.setItem("maetti_info_seen", "true");
      } catch {}
    }
    setWins((w) => w.filter((x) => x.id !== id));
    setMaxWins((m) => {
      const next = { ...m };
      delete next[id];
      return next;
    });
  };
  const focusWin = (id: string) => {
    setWins((w) => [...w.filter((x) => x.id !== id), { id, min: false }]);
  };
  const minWin = (id: string) => {
    sounds.playGlassClick();
    setWins((w) => w.map((x) => (x.id === id ? { ...x, min: true } : x)));
  };
  const toggleTask = (id: string) => {
    sounds.playGlassClick();
    setWins((w) => {
      const it = w.find((x) => x.id === id);
      if (!it) return w;
      return w[w.length - 1].id === id && !it.min
        ? w.map((x) => (x.id === id ? { ...x, min: true } : x))
        : [...w.filter((x) => x.id !== id), { id, min: false }];
    });
  };

  const allMin = wins.length > 0 && wins.every((x) => x.min);

  // Esc: Виджеты (<1280px) → Spotlight → лаунчер → контекстное меню → свернуть активное окно
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (mobileWidgetsOpen) return setMobileWidgetsOpen(false);
      if (spotlightOpen) return setSpotlightOpen(false);
      if (startOpen) return setStartOpen(false);
      if (menu) return setMenu(null);
      const top = [...wins].reverse().find((w) => !w.min);
      if (top) minWin(top.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileWidgetsOpen, spotlightOpen, startOpen, menu, wins]);

  // Закрытие меню «Пуск» и контекстного меню при клике вне их области
  useEffect(() => {
    if (!startOpen && !menu) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (startOpen && !target.closest("[data-start-menu]") && !target.closest("[data-start-btn]")) {
        setStartOpen(false);
      }
      if (menu && !target.closest("[data-context-menu]")) {
        setMenu(null);
      }
    };
    window.addEventListener("pointerdown", handlePointerDown);
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [startOpen, menu]);

  const results = APPS.filter((a) => {
    const q = query.trim().toLowerCase();
    return !q || a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
  });
  const [resultIdx, setResultIdx] = useState(0);

  const topWinId = [...wins].reverse().find((w) => !w.min)?.id;
  const hasMaxWin = wins.some((w) => !w.min && maxWins[w.id]);

  const [topEdgeHovered, setTopEdgeHovered] = useState(false);
  const [dockEdgeHovered, setDockEdgeHovered] = useState(false);
  const topLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dockLeaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTopEnter = useCallback(() => {
    if (topLeaveTimerRef.current) clearTimeout(topLeaveTimerRef.current);
    setTopEdgeHovered(true);
  }, []);

  const handleTopLeave = useCallback(() => {
    if (topLeaveTimerRef.current) clearTimeout(topLeaveTimerRef.current);
    topLeaveTimerRef.current = setTimeout(() => {
      setTopEdgeHovered(false);
    }, 120);
  }, []);

  const handleDockEnter = useCallback(() => {
    if (dockLeaveTimerRef.current) clearTimeout(dockLeaveTimerRef.current);
    setDockEdgeHovered(true);
  }, []);

  const handleDockLeave = useCallback(() => {
    if (dockLeaveTimerRef.current) clearTimeout(dockLeaveTimerRef.current);
    dockLeaveTimerRef.current = setTimeout(() => {
      setDockEdgeHovered(false);
    }, 120);
  }, []);

  useEffect(() => {
    return () => {
      if (topLeaveTimerRef.current) clearTimeout(topLeaveTimerRef.current);
      if (dockLeaveTimerRef.current) clearTimeout(dockLeaveTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!hasMaxWin) return;
    const onMove = (e: PointerEvent) => {
      // Верхняя зона триггера: отступ 300px слева и 300px справа, высота 52px
      const inTopTriggerZone =
        e.clientY <= 52 &&
        e.clientX >= 300 &&
        e.clientX <= window.innerWidth - 300;

      if (inTopTriggerZone) {
        handleTopEnter();
      } else if (!startOpen && !spotlightOpen && !mobileWidgetsOpen) {
        // Если панель опустилась — не поднимать, пока курсор не уведут с неё вниз (y > 52)
        if (e.clientY > 52) {
          handleTopLeave();
        }
      }

      // Нижняя зона триггера: по центру экрана (±290px), высота 80px от низа
      const inBottomZone =
        e.clientY >= window.innerHeight - 80 &&
        Math.abs(e.clientX - window.innerWidth / 2) <= 290;

      if (inBottomZone) {
        handleDockEnter();
      } else if (!startOpen) {
        if (e.clientY < window.innerHeight - 85 || Math.abs(e.clientX - window.innerWidth / 2) > 300) {
          handleDockLeave();
        }
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [hasMaxWin, startOpen, spotlightOpen, mobileWidgetsOpen, handleTopEnter, handleTopLeave, handleDockEnter, handleDockLeave]);

  const topBarVisible = !hasMaxWin || topEdgeHovered || startOpen || spotlightOpen || mobileWidgetsOpen;
  const dockVisible = !hasMaxWin || dockEdgeHovered || startOpen;

  const openWallpaperMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = secRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMenu({
      x: Math.max(8, Math.min(e.clientX - rect.left, rect.width - 232)),
      y: Math.max(8, Math.min(e.clientY - rect.top, rect.height - 300)),
    });
  };

  const iconBtn =
    "grid h-8 w-8 place-items-center rounded-lg border border-[var(--desk-border)] bg-[var(--desk-surface-2)] text-[var(--desk-muted)] transition-colors hover:bg-[var(--desk-surface-3)] hover:text-[var(--desk-fg)] cursor-pointer active:scale-95";

  if (embed) return null;

  return (
    <section
      ref={secRef}
      aria-label="maeTtI OS — интерактивный рабочий стол"
      style={{ ...(THEMES[theme].vars as CSSProperties), background: THEMES[theme].wall }}
      className="desk-shell relative h-[100svh] w-full shrink-0 select-none overflow-hidden font-sans transition-[background] duration-700 text-[var(--desk-fg)]"
    >
      {/* ЖИВЫЕ ОБОИ: два медленно дрейфующих орба */}
      <div
        className="absolute inset-0"
        onClick={() => {
          setSel(null);
          setStartOpen(false);
          setSpotlightOpen(false);
          setMenu(null);
        }}
        onContextMenu={openWallpaperMenu}
      >
        {THEMES[theme].orbs.map((orb, i) => (
          <div
            key={i}
            aria-hidden
            className={`desk-orb pointer-events-none absolute rounded-full blur-[110px] ${orb.pos}`}
            style={
              {
                background: `radial-gradient(circle, ${orb.color} 0%, transparent 65%)`,
                "--dx": `${orb.dx}px`,
                "--dy": `${orb.dy}px`,
                "--dur": `${orb.dur}s`,
              } as CSSProperties
            }
          />
        ))}
      </div>

      {/* СЕНСОРЫ ДЛЯ АВТОПОЯВЛЕНИЯ ПАНЕЛЕЙ ПРИ ФУЛЛСКРИНЕ */}
      {hasMaxWin && (
        <>
          {/* Верхняя зона триггера: отступ по 300px слева и справа, высота ~52px */}
          <div
            aria-hidden
            onMouseEnter={handleTopEnter}
            className="absolute left-[300px] right-[300px] top-0 z-[45] h-[3.25rem] cursor-default pointer-events-auto"
          />
          {/* Нижняя зона триггера (по центру экрана, ширина ~36rem, высота 80px) */}
          <div
            aria-hidden
            onMouseEnter={handleDockEnter}
            onMouseLeave={handleDockLeave}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] max-w-[94vw] h-20 z-[45] cursor-default pointer-events-auto"
          />
        </>
      )}

      {/* ВЕРХНЯЯ ПАНЕЛЬ */}
      <nav
        onMouseEnter={handleTopEnter}
        onMouseLeave={handleTopLeave}
        className={`absolute inset-x-0 top-0 z-50 flex h-11 items-center justify-between gap-3 border-b border-[var(--desk-border)] bg-[var(--desk-surface)] px-3 text-[0.8125rem] text-[var(--desk-fg)] backdrop-blur-md sm:px-4 transition-all duration-300 ease-out after:absolute after:-bottom-3 after:inset-x-0 after:h-3 after:content-[''] ${
          !topBarVisible ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100 pointer-events-auto shadow-md"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleExitDesk}
            title="Вернуться к началу сайта"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--desk-border)] bg-[var(--desk-surface-2)] px-2.5 py-1 text-xs font-bold text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-3)] cursor-pointer active:scale-95"
          >
            <ArrowUp className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="max-sm:hidden">К сайту</span>
          </button>

          <button
            type="button"
            data-start-btn
            onClick={() => {
              sounds.playGlassClick();
              setStartOpen((s) => !s);
            }}
            aria-expanded={startOpen}
            className="flex items-center gap-1.5 font-black tracking-tight text-[var(--desk-fg)] transition-opacity hover:opacity-80 cursor-pointer"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--desk-accent)]" />
            maeTtI<span className="text-[var(--desk-muted)]">OS</span>
          </button>

          <span className="h-4 w-px bg-[var(--desk-border)]" />

          <div className="flex items-center gap-1 max-md:hidden">
            {APPS.filter((a) => a.href).map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => openApp(a.id)}
                className="rounded-lg px-2 py-1 text-[0.8125rem] font-medium text-[var(--desk-muted)] transition-colors hover:bg-[var(--desk-surface-2)] hover:text-[var(--desk-fg)] cursor-pointer"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-[var(--desk-border)] bg-[var(--desk-surface-2)] p-1">
            {THEME_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeTheme(t)}
                title={`Тема: ${THEMES[t].name}`}
                aria-label={`Тема: ${THEMES[t].name}`}
                style={{ background: THEME_SWATCH[t] }}
                className={`h-3.5 w-3.5 rounded-full border border-black/10 transition-transform cursor-pointer ${
                  theme === t ? "scale-110 ring-2 ring-[var(--desk-accent)]" : "opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              setSpotlightOpen((s) => !s);
            }}
            title="Поиск (Spotlight)"
            aria-label="Поиск"
            className={iconBtn}
          >
            <Search className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              setMobileWidgetsOpen((s) => !s);
            }}
            title={mobileWidgetsOpen ? "Закрыть виджеты" : "Виджеты"}
            aria-label="Виджеты"
            className={`${iconBtn} xl:hidden`}
          >
            <Layers className="h-4 w-4" />
          </button>

          <button type="button" onClick={toggleSound} title={isPlayingSound ? "Выключить эмбиент" : "Включить эмбиент"} className={iconBtn}>
            {isPlayingSound ? <Volume2 className="h-4 w-4 text-[var(--desk-accent)]" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth < 1280) {
                sounds.playGlassClick();
                setMobileWidgetsOpen((s) => !s);
              }
            }}
            title="Виджеты и время"
            className="flex items-center gap-1.5 font-mono text-xs font-bold tabular-nums sm:text-sm cursor-pointer"
          >
            <Clock className="h-3.5 w-3.5 text-[var(--desk-muted)] max-sm:hidden" />
            {clock}
          </button>
        </div>
      </nav>

      {/* ЯРЛЫКИ: десктоп — колонки слева, мобайл — сетка */}
      <div className="absolute bottom-24 left-3 top-14 z-10 hidden flex-col flex-wrap content-start gap-1.5 md:flex">
        {APPS.map((app) => (
          <AppTile key={app.id} app={app} selected={sel === app.id} onOpen={() => openApp(app.id)} />
        ))}
      </div>

      <div className="absolute inset-x-3 bottom-24 top-14 z-10 grid grid-cols-4 content-start gap-x-2 gap-y-3 px-1 md:hidden">
        {APPS.map((app) => (
          <AppTile key={app.id} app={app} selected={sel === app.id} onOpen={() => openApp(app.id)} />
        ))}
      </div>

      {/* ВИДЖЕТЫ СПРАВА */}
      {showWidgets && (
        <aside
          className={`absolute right-4 top-14 z-10 hidden w-72 flex-col gap-3 xl:flex transition-opacity duration-250 ${
            hasMaxWin ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <WidgetsContent
            clock={clock}
            dateStr={dateStr}
            noteText={noteText}
            updateNote={updateNote}
            isPlayingSound={isPlayingSound}
            toggleSound={toggleSound}
          />
        </aside>
      )}

      {/* МОБИЛЬНАЯ ШТОРКА ВИДЖЕТОВ (<1280px) */}
      {mobileWidgetsOpen && (
        <div
          onClick={() => setMobileWidgetsOpen(false)}
          className="fixed inset-0 z-[60] flex justify-end bg-[var(--desk-scrim)] backdrop-blur-xs transition-opacity duration-200 xl:hidden"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="desk-pop flex h-full w-80 max-w-[85vw] flex-col border-l border-[var(--desk-border)] bg-[var(--desk-surface)] text-[var(--desk-fg)] shadow-2xl backdrop-blur-xl"
          >
            <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--desk-border)] px-4">
              <span className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--desk-fg)]">
                <Layers className="h-4 w-4 text-[var(--desk-accent)]" />
                Виджеты maeTtI
              </span>
              <button
                type="button"
                onClick={() => setMobileWidgetsOpen(false)}
                title="Закрыть виджеты"
                className="grid h-8 w-8 place-items-center rounded-lg border border-[var(--desk-border)] bg-[var(--desk-surface-2)] text-[var(--desk-muted)] transition-colors hover:bg-[var(--desk-surface-3)] hover:text-[var(--desk-fg)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="desk-scroll flex-1 space-y-3 overflow-y-auto p-4">
              <WidgetsContent
                clock={clock}
                dateStr={dateStr}
                noteText={noteText}
                updateNote={updateNote}
                isPlayingSound={isPlayingSound}
                toggleSound={toggleSound}
              />
            </div>
          </div>
        </div>
      )}

      {/* ОКНА */}
      {wins.map((w, i) => (
        <Win
          key={w.id}
          title={TITLES[w.id] || w.id}
          size={SIZES[w.id] ?? [520, 420]}
          offset={i}
          z={30 + i}
          min={w.min}
          focused={topWinId === w.id}
          phone={phone}
          dialog={w.id === "info"}
          noMaximize={["snake", "dragon", "info"].includes(w.id)}
          maximized={!!maxWins[w.id]}
          onToggleMax={() => {
            sounds.playGlassClick();
            setMaxWins((m) => ({ ...m, [w.id]: !m[w.id] }));
          }}
          onClose={() => closeWin(w.id)}
          onMin={() => minWin(w.id)}
          onFocus={() => focusWin(w.id)}
        >
          {APPS.find((a) => a.id === w.id)?.href && (
            <SiteIframe
              path={w.id === "contacts" ? contactsPath : APPS.find((a) => a.id === w.id)!.href!}
              title={TITLES[w.id]}
            />
          )}
          {w.id === "terminal" && (
            <TerminalApp onThemeChange={changeTheme} onOpenApp={openApp} />
          )}
          {w.id === "snake" && <Snake active={topWinId === "snake" && !w.min} />}
          {w.id === "dragon" && <Dragon active={topWinId === "dragon" && !w.min} />}
          {w.id === "info" && <InfoApp onClose={() => closeWin("info")} />}
        </Win>
      ))}

      {/* ДОК */}
      <div
        onMouseEnter={handleDockEnter}
        onMouseLeave={handleDockLeave}
        className={`absolute bottom-3 left-1/2 z-50 flex h-14 -translate-x-1/2 max-w-[calc(100vw-1.5rem)] items-center gap-2 overflow-hidden rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] px-2.5 text-[var(--desk-fg)] shadow-lg backdrop-blur-md transition-all duration-300 ease-out select-none before:absolute before:-bottom-3 before:inset-x-0 before:h-3 before:content-[''] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          !dockVisible
            ? "translate-y-[calc(100%+2rem)] opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100 pointer-events-auto"
        }`}
      >
        <button
          type="button"
          data-start-btn
          onClick={() => {
            sounds.playGlassClick();
            setStartOpen((s) => !s);
          }}
          aria-expanded={startOpen}
          className={`flex h-10 shrink-0 items-center gap-1.5 rounded-xl px-3 text-[0.8125rem] font-bold transition-colors cursor-pointer active:scale-95 ${
            startOpen
              ? "bg-[var(--desk-accent)] text-[var(--desk-accent-fg)]"
              : "bg-[var(--desk-surface-2)] text-[var(--desk-fg)] hover:bg-[var(--desk-surface-3)]"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${startOpen ? "bg-[var(--desk-accent-fg)]" : "bg-[var(--desk-accent)]"}`} />
          maeTtI
        </button>

        {wins.length > 0 && (
          <>
            <span className="h-6 w-px shrink-0 bg-[var(--desk-border)]" />
            <div className="flex shrink-0 items-center gap-1.5">
              {wins.map((w) => {
                const app = APPS.find((a) => a.id === w.id);
                if (!app) return null;
                const Glyph = app.glyph;
                const isTop = topWinId === w.id;
                return (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => toggleTask(w.id)}
                    aria-label={TITLES[w.id] || w.id}
                    title={`${TITLES[w.id] || w.id} — свёрнуть/развернуть`}
                    style={tileStyle(app.tint)}
                    className="group relative grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition-all duration-150 hover:scale-105 cursor-pointer active:scale-90"
                  >
                    <Glyph className="h-5 w-5 stroke-[1.75]" />
                    <span
                      className={`absolute bottom-0.5 left-1/2 h-1 -translate-x-1/2 rounded-full transition-all ${
                        isTop ? "w-4 bg-[var(--desk-accent)]" : w.min ? "w-1 bg-[var(--desk-muted)]" : "w-2 bg-[var(--desk-muted)]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="h-6 w-px shrink-0 bg-[var(--desk-border)]" />
            <button
              type="button"
              onClick={() => {
                sounds.playGlassClick();
                setWins((w) => w.map((x) => ({ ...x, min: !allMin })));
              }}
              title={allMin ? "Развернуть все окна" : "Свернуть все окна"}
              aria-label={allMin ? "Развернуть все окна" : "Свернуть все окна"}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--desk-border)] bg-[var(--desk-surface-2)] text-[var(--desk-muted)] transition-colors hover:bg-[var(--desk-surface-3)] hover:text-[var(--desk-fg)] cursor-pointer active:scale-90"
            >
              {allMin ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
            </button>
          </>
        )}
      </div>

      {/* ЛАУНЧЕР */}
      {startOpen && (
        <div
          data-start-menu
          onMouseEnter={handleDockEnter}
          onMouseLeave={handleDockLeave}
          className="desk-pop absolute bottom-[4.75rem] left-3 z-[55] w-[21rem] rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] p-4 text-[var(--desk-fg)] shadow-[var(--desk-shadow)] backdrop-blur-md"
        >
          <div className="mb-3 flex items-baseline justify-between">
            <span className="text-sm font-black tracking-tight text-[var(--desk-fg)]">
              maeTtI<span className="text-[var(--desk-muted)]">OS</span>
            </span>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-[var(--desk-muted)]">Все приложения</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {APPS.map((app) => (
              <button
                key={app.id}
                type="button"
                onClick={() => openApp(app.id)}
                className="flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-2)] cursor-pointer active:scale-95"
              >
                <span style={tileStyle(app.tint)} className="grid h-11 w-11 place-items-center rounded-2xl border">
                  <app.glyph className="h-5 w-5 stroke-[1.75]" />
                </span>
                <span className="text-[0.6875rem] font-semibold text-[var(--desk-fg)]">{app.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* SPOTLIGHT */}
      {spotlightOpen && (
        <div
          onClick={() => setSpotlightOpen(false)}
          className="absolute inset-0 z-[60] flex items-start justify-center bg-[var(--desk-scrim)] pt-24 backdrop-blur-[2px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="desk-pop w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] shadow-[var(--desk-shadow)] backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5 border-b border-[var(--desk-border)] px-4 py-3 text-[var(--desk-fg)]">
              <Search className="h-4.5 w-4.5 text-[var(--desk-muted)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setResultIdx(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setResultIdx((i) => Math.min(i + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setResultIdx((i) => Math.max(i - 1, 0));
                  } else if (e.key === "Enter" && results[resultIdx]) {
                    openApp(results[resultIdx].id);
                  }
                }}
                placeholder="Поиск по столу: услуги, кейсы, игры…"
                autoFocus
                className="flex-1 bg-transparent text-sm text-[var(--desk-fg)] outline-none placeholder:text-[var(--desk-muted)]"
              />
              <kbd className="rounded-md border border-[var(--desk-border)] bg-[var(--desk-surface-2)] px-1.5 py-0.5 font-mono text-[0.625rem] text-[var(--desk-muted)]">ESC</kbd>
            </div>
            <div className="desk-scroll max-h-64 overflow-auto p-1.5">
              {results.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => openApp(a.id)}
                  onMouseEnter={() => setResultIdx(i)}
                  className={`flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-xs transition-colors cursor-pointer ${
                    i === resultIdx ? "bg-[var(--desk-surface-3)]" : ""
                  }`}
                >
                  <span style={tileStyle(a.tint)} className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border">
                    <a.glyph className="h-4 w-4 stroke-[1.75]" />
                  </span>
                  <span className="font-bold text-[var(--desk-fg)]">{a.label}</span>
                  <span className="truncate text-[0.6875rem] text-[var(--desk-muted)]">{a.description}</span>
                </button>
              ))}
              {results.length === 0 && (
                <div className="p-4 text-center text-xs text-[var(--desk-muted)]">Ничего не найдено</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* КОНТЕКСТНОЕ МЕНЮ */}
      {menu && (
        <div
          data-context-menu
          style={{ left: menu.x, top: menu.y }}
          onClick={(e) => e.stopPropagation()}
          className="desk-pop absolute z-[60] w-56 overflow-hidden rounded-2xl border border-[var(--desk-border)] bg-[var(--desk-surface)] p-1.5 text-[var(--desk-fg)] shadow-[var(--desk-shadow)] backdrop-blur-md"
        >
          <div className="px-2.5 pb-1 pt-1.5 text-[0.625rem] font-bold uppercase tracking-widest text-[var(--desk-muted)]">
            Тема обоев
          </div>
          <div className="mb-1.5 grid grid-cols-5 gap-1 px-2 py-1">
            {THEME_ORDER.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  changeTheme(t);
                  setMenu(null);
                }}
                title={THEMES[t].name}
                aria-label={THEMES[t].name}
                style={{ background: THEME_SWATCH[t] }}
                className={`h-6 w-full rounded-lg border border-black/10 transition-transform cursor-pointer ${
                  theme === t ? "scale-105 ring-2 ring-[var(--desk-accent)]" : "opacity-75 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          <div className="my-1 h-px bg-[var(--desk-border)]" />

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth < 1280) {
                setMobileWidgetsOpen((s) => !s);
              } else {
                setShowWidgets((s) => !s);
              }
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-2)] cursor-pointer text-left"
          >
            <Layers className="h-3.5 w-3.5 text-[var(--desk-muted)]" />
            {(typeof window !== "undefined" && window.innerWidth < 1280 ? mobileWidgetsOpen : showWidgets)
              ? "Скрыть виджеты"
              : "Показать виджеты"}
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              setWins((w) => w.map((x) => ({ ...x, min: true })));
              setMenu(null);
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs text-[var(--desk-fg)] transition-colors hover:bg-[var(--desk-surface-2)] cursor-pointer text-left"
          >
            <Minus className="h-3.5 w-3.5 text-[var(--desk-muted)]" />
            Свернуть все окна
          </button>
        </div>
      )}
    </section>
  );
}

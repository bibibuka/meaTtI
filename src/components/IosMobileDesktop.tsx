"use client";

/* =========================================================================
   maeTtI iOS Mobile Desktop (iPhone Experience)
   Аутентичный интерфейс iOS на мобильных экранах:
   - Верхний статус-бар с Dynamic Island (реагирует на музыку и нажатия)
   - Умный iOS-виджет (плеер Муслима Магомаева / Заметки / Обои)
   - Сетка иконок SpringBoard со скруглениями squircle и яркими градиентами
   - Нижний стеклянный Dock с 4 ключевыми приложениями
   - Полноэкранный режим приложений с навигацией iOS и полоской Home Indicator
   - Поиск Spotlight в стиле iOS
   ========================================================================= */

import { useState, useEffect, useCallback, type CSSProperties } from "react";
import {
  ArrowUp,
  Briefcase,
  ChevronLeft,
  Disc3,
  Flame,
  Gamepad2,
  Info,
  Mail,
  Music,
  Pause,
  Play,
  Rocket,
  Search,
  SkipBack,
  SkipForward,
  Terminal,
  Users,
  Wifi,
  X,
  type LucideIcon,
} from "lucide-react";
import { THEMES, THEME_ORDER, THEME_SWATCH, type WallpaperTheme } from "./desk-themes";
import { Dragon, InfoApp, SiteIframe, Snake, sounds, TerminalApp } from "./win-apps";
import { haptic } from "@/utils/haptics";

export interface MobileApp {
  id: string;
  label: string;
  href?: string;
  glyph: LucideIcon;
  gradient: string;
  description: string;
  badge?: string;
}

export const IOS_APPS: MobileApp[] = [
  {
    id: "info",
    label: "Инфо",
    glyph: Info,
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    description: "Альтернативная версия взаимодействия с сайтом",
  },
  {
    id: "uslugi",
    label: "Услуги",
    href: "/uslugi",
    glyph: Briefcase,
    gradient: "from-blue-500 via-indigo-600 to-purple-600",
    description: "Разработка, дизайн, digital",
  },
  {
    id: "keysy",
    label: "Кейсы",
    href: "/keysy",
    glyph: Rocket,
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    description: "Наши проекты и результаты",
  },
  {
    id: "team",
    label: "Команда",
    href: "/team",
    glyph: Users,
    gradient: "from-emerald-400 via-green-500 to-teal-700",
    description: "Инженеры и разработчики",
  },
  {
    id: "contacts",
    label: "Контакты",
    href: "/contacts",
    glyph: Mail,
    gradient: "from-rose-500 via-pink-600 to-red-600",
    description: "Связаться с нами",
  },
  {
    id: "terminal",
    label: "Терминал",
    glyph: Terminal,
    gradient: "from-zinc-800 via-neutral-900 to-black",
    description: "Интерактивная консоль",
  },
  {
    id: "snake",
    label: "Змейка",
    glyph: Gamepad2,
    gradient: "from-lime-400 via-emerald-500 to-green-700",
    description: "Ретро-аркада на Canvas",
  },
  {
    id: "dragon",
    label: "Дракончик",
    glyph: Flame,
    gradient: "from-red-500 via-rose-600 to-amber-600",
    description: "Аркада Flappy Dragon",
  },
];

const IOS_TITLES: Record<string, string> = {
  info: "О системе maeTtI",
  uslugi: "Услуги студии",
  keysy: "Кейсы",
  team: "Команда",
  contacts: "Контакты",
  terminal: "maeTtI Shell",
  snake: "Змейка",
  dragon: "Дракончик",
};

interface Track {
  id: string;
  title: string;
  artist: string;
  type: "audio" | "synth";
  src?: string;
  startTime?: number;
}

function formatTime(sec: number): string {
  if (!sec || isNaN(sec) || !isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

export interface IosMobileDesktopProps {
  theme: WallpaperTheme;
  onThemeChange: (t: WallpaperTheme) => void;
  onExit: () => void;
  clock: string;
  dateStr: string;
  currentTrack: Track;
  isPlayingSound: boolean;
  toggleSound: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  currentTime: number;
  duration: number;
  onSeek: (t: number) => void;
  noteText: string;
  updateNote: (t: string) => void;
  secRef?: React.RefObject<HTMLElement | null>;
}

export default function IosMobileDesktop({
  theme,
  onThemeChange,
  onExit,
  clock,
  dateStr,
  currentTrack,
  isPlayingSound,
  toggleSound,
  nextTrack,
  prevTrack,
  currentTime,
  duration,
  onSeek,
  noteText,
  updateNote,
  secRef,
}: IosMobileDesktopProps) {
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [spotlightOpen, setSpotlightOpen] = useState(false);
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [dynamicIslandExpanded, setDynamicIslandExpanded] = useState(false);
  const [widgetTab, setWidgetTab] = useState<"music" | "notes" | "wallpaper">("music");

  const openApp = useCallback((id: string) => {
    sounds.playGlassClick();
    haptic.tap();
    setActiveAppId(id);
    setSpotlightOpen(false);
  }, []);

  const closeApp = useCallback(() => {
    sounds.playGlassClick();
    haptic.tick();
    setActiveAppId(null);
  }, []);

  // Закрытие Spotlight / приложения по Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (dynamicIslandExpanded) setDynamicIslandExpanded(false);
        else if (spotlightOpen) setSpotlightOpen(false);
        else if (activeAppId) closeApp();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dynamicIslandExpanded, spotlightOpen, activeAppId, closeApp]);

  const activeApp = IOS_APPS.find((a) => a.id === activeAppId);

  const searchResults = IOS_APPS.filter((a) => {
    const q = spotlightQuery.trim().toLowerCase();
    return !q || a.label.toLowerCase().includes(q) || a.description.toLowerCase().includes(q);
  });

  return (
    <section
      ref={secRef}
      aria-label="maeTtI iOS Mobile Desktop"
      style={{ ...(THEMES[theme].vars as CSSProperties), background: THEMES[theme].wall }}
      className="relative z-10 isolate h-[100svh] w-full shrink-0 select-none overflow-hidden font-sans text-[var(--desk-fg)]"
    >
      {/* ЖИВЫЕ ОБОИ (орбы темы) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {THEMES[theme].orbs.map((orb, i) => (
          <div
            key={i}
            aria-hidden
            className={`desk-orb pointer-events-none absolute rounded-full blur-[100px] ${orb.pos}`}
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

      {/* =========================================================================
          1. СТАТУС-БАР iOS + DYNAMIC ISLAND
          ========================================================================= */}
      <header className="relative z-40 flex h-11 items-center justify-between px-4 pt-1 select-none">
        {/* Слева: время и кнопка «К сайту» */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-white tracking-tight tabular-nums drop-shadow-xs">
            {clock}
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              haptic.tick();
              onExit();
            }}
            title="Вернуться к сайту"
            aria-label="Вернуться к сайту"
            className="flex items-center gap-1 rounded-full bg-white/20 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold text-white/95 border border-white/25 shadow-xs transition-transform hover:bg-white/30 active:scale-95 cursor-pointer"
          >
            <ArrowUp className="h-3 w-3 stroke-[2.5]" />
            <span>К сайту</span>
          </button>
        </div>

        {/* По центру: DYNAMIC ISLAND */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              haptic.tick();
              setDynamicIslandExpanded((v) => !v);
            }}
            className={`flex items-center justify-between rounded-full bg-black text-white shadow-lg transition-all duration-300 cursor-pointer active:scale-95 border border-white/15 ${
              isPlayingSound ? "h-7 px-2.5 gap-2 min-w-[7.5rem]" : "h-6 px-3 gap-1.5 w-24"
            }`}
          >
            {isPlayingSound ? (
              <>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-gradient-to-tr from-sky-400 to-blue-600 animate-spin [animation-duration:3s]">
                    <Disc3 className="h-3 w-3 text-white" />
                  </span>
                  <span className="truncate text-[9px] font-bold tracking-tight text-neutral-200 max-w-[4rem]">
                    {currentTrack.title}
                  </span>
                </div>
                {/* 3 анимированных столбика эквалайзера */}
                <div className="flex items-end gap-[1.5px] h-2.5 shrink-0">
                  <span className="w-[2px] bg-emerald-400 rounded-full animate-pulse h-2.5" />
                  <span className="w-[2px] bg-emerald-400 rounded-full animate-pulse h-1.5 [animation-delay:150ms]" />
                  <span className="w-[2px] bg-emerald-400 rounded-full animate-pulse h-2 [animation-delay:300ms]" />
                </div>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-neutral-800 border border-neutral-700" />
                <span className="text-[9px] font-semibold text-neutral-400">maeTtI</span>
                <span className="h-1.5 w-1.5 rounded-full bg-neutral-900" />
              </>
            )}
          </button>

          {/* Всплывающий оверлей управления из Dynamic Island при тапе */}
          {dynamicIslandExpanded && (
            <div
              onClick={() => setDynamicIslandExpanded(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-14 px-4"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xs rounded-[28px] bg-neutral-950/95 border border-white/20 p-4 text-white shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-150"
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 shadow-md">
                    <Music className={`h-6 w-6 ${isPlayingSound ? "animate-pulse" : ""}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-white">{currentTrack.title}</div>
                    <div className="truncate text-[11px] text-neutral-400">{currentTrack.artist}</div>
                  </div>
                </div>

                {/* Scrubber */}
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-neutral-400">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration > 0 ? duration : 100}
                    step={0.5}
                    value={currentTime}
                    onChange={(e) => onSeek(parseFloat(e.target.value))}
                    className="h-1.5 w-full appearance-none rounded-full bg-white/20 outline-none cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                  />
                  <span className="text-[10px] font-mono text-neutral-400">{formatTime(duration)}</span>
                </div>

                {/* Кнопки плеера */}
                <div className="mt-3 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playGlassClick();
                      prevTrack();
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-300 active:scale-90"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playGlassClick();
                      toggleSound();
                    }}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white text-black active:scale-90 shadow-md"
                  >
                    {isPlayingSound ? <Pause className="h-4 w-4 fill-black" /> : <Play className="h-4 w-4 ml-0.5 fill-black" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playGlassClick();
                      nextTrack();
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-neutral-300 active:scale-90"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Справа: сотовая связь, Wi-Fi и батарея */}
        <div className="flex items-center gap-1.5 text-white drop-shadow-xs">
          {/* 4 столбика сигнала */}
          <div className="flex items-end gap-[1.5px] h-3">
            <span className="w-[2.5px] h-1 bg-white rounded-xs" />
            <span className="w-[2.5px] h-1.5 bg-white rounded-xs" />
            <span className="w-[2.5px] h-2 bg-white rounded-xs" />
            <span className="w-[2.5px] h-3 bg-white rounded-xs" />
          </div>

          <Wifi className="h-3.5 w-3.5 stroke-[2.2]" />

          {/* Иконка батареи iOS */}
          <div className="flex items-center">
            <div className="relative h-3 w-5 rounded-[3px] border border-white/80 p-[1.5px] flex items-center">
              <span className="h-full w-4/5 rounded-[1px] bg-emerald-400" />
            </div>
            <span className="h-1 w-[2px] rounded-r-xs bg-white/80" />
          </div>
        </div>
      </header>

      {/* =========================================================================
          2. ГЛАВНЫЙ ЭКРАН (SPRINGBOARD)
          ========================================================================= */}
      <div className="relative z-20 flex h-[calc(100svh-2.75rem)] flex-col justify-between px-3 pb-3 pt-1 select-none">
        {/* ВЕРХНЯЯ ЧАСТЬ: iOS Smart Widget */}
        <div className="w-full">
          <div className="relative overflow-hidden rounded-[26px] border border-white/30 bg-white/20 p-3.5 shadow-xl backdrop-blur-2xl text-white">
            {/* Вкладки виджета */}
            <div className="mb-2.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-white/90">
                <Disc3 className={`h-3.5 w-3.5 text-sky-400 ${isPlayingSound ? "animate-spin [animation-duration:4s]" : ""}`} />
                {widgetTab === "music" ? "Медиаплеер" : widgetTab === "notes" ? "Заметки" : "Тема обоев"}
              </span>

              <div className="flex items-center gap-1 rounded-full bg-black/20 p-0.5 border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playGlassClick();
                    setWidgetTab("music");
                  }}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-colors cursor-pointer ${
                    widgetTab === "music" ? "bg-white text-black shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  Плеер
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playGlassClick();
                    setWidgetTab("notes");
                  }}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-colors cursor-pointer ${
                    widgetTab === "notes" ? "bg-white text-black shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  Заметки
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playGlassClick();
                    setWidgetTab("wallpaper");
                  }}
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-colors cursor-pointer ${
                    widgetTab === "wallpaper" ? "bg-white text-black shadow-xs" : "text-white/70 hover:text-white"
                  }`}
                >
                  Обои
                </button>
              </div>
            </div>

            {/* Контент: Плеер */}
            {widgetTab === "music" && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex min-w-0 flex-1 items-center gap-2.5">
                    <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-500 via-sky-600 to-indigo-700 shadow-md">
                      <Music className="h-5 w-5 text-white" />
                      {isPlayingSound && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-white/30" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-bold text-white drop-shadow-xs" title={currentTrack.title}>
                        {currentTrack.title}
                      </div>
                      <div className="truncate text-[11px] text-white/80" title={currentTrack.artist}>
                        {currentTrack.artist}
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playGlassClick();
                        haptic.tick();
                        prevTrack();
                      }}
                      title="Предыдущий трек"
                      className="grid h-7 w-7 place-items-center rounded-full text-white/80 transition-colors hover:text-white active:scale-90 cursor-pointer"
                    >
                      <SkipBack className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playGlassClick();
                        haptic.tap();
                        toggleSound();
                      }}
                      title={isPlayingSound ? "Пауза" : "Слушать"}
                      className="grid h-8 w-8 place-items-center rounded-full bg-white text-black shadow-md transition-transform hover:scale-105 active:scale-90 cursor-pointer"
                    >
                      {isPlayingSound ? (
                        <Pause className="h-3.5 w-3.5 fill-black" />
                      ) : (
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-black" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sounds.playGlassClick();
                        haptic.tick();
                        nextTrack();
                      }}
                      title="Следующий трек"
                      className="grid h-7 w-7 place-items-center rounded-full text-white/80 transition-colors hover:text-white active:scale-90 cursor-pointer"
                    >
                      <SkipForward className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Scrubber таймлайн */}
                {currentTrack.type === "audio" && (
                  <div className="flex flex-col gap-1 border-t border-white/15 pt-2">
                    <input
                      type="range"
                      min={0}
                      max={duration > 0 ? duration : 100}
                      step={0.5}
                      value={currentTime}
                      onChange={(e) => onSeek(parseFloat(e.target.value))}
                      className="h-1.5 w-full appearance-none rounded-full bg-black/20 outline-none cursor-pointer [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                      style={{
                        background: `linear-gradient(to right, #38bdf8 ${
                          duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0
                        }%, rgba(255,255,255,0.2) ${
                          duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0
                        }%)`,
                      }}
                    />
                    <div className="flex justify-between font-mono text-[9px] font-semibold text-white/80 tabular-nums">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Контент: Заметки */}
            {widgetTab === "notes" && (
              <div className="space-y-1.5">
                <textarea
                  value={noteText}
                  onChange={(e) => updateNote(e.target.value)}
                  rows={2}
                  placeholder="Запишите мысль или задачу…"
                  className="w-full resize-none rounded-xl border border-white/20 bg-black/20 p-2 text-xs text-white outline-none placeholder:text-white/50 focus:border-sky-400"
                />
                <div className="flex items-center justify-between text-[9px] text-white/70">
                  <span className="first-letter:uppercase">{dateStr}</span>
                  <span>автосохранение</span>
                </div>
              </div>
            )}

            {/* Контент: Обои */}
            {widgetTab === "wallpaper" && (
              <div className="py-1">
                <div className="text-[10px] text-white/80 mb-2 font-medium">Выберите стиль обоев:</div>
                <div className="grid grid-cols-5 gap-2">
                  {THEME_ORDER.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        sounds.playGlassClick();
                        haptic.tick();
                        onThemeChange(t);
                      }}
                      title={THEMES[t].name}
                      style={{ background: THEME_SWATCH[t] }}
                      className={`h-7 rounded-xl border border-white/20 transition-transform active:scale-90 cursor-pointer ${
                        theme === t ? "ring-2 ring-white scale-105 shadow-md" : "opacity-75"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* СРЕДНЯЯ ЧАСТЬ: Сетка приложений SpringBoard (4 колонки) */}
        <div className="my-auto grid grid-cols-4 content-center gap-x-2 gap-y-4 px-1">
          {IOS_APPS.map((app) => {
            const Glyph = app.glyph;
            return (
              <button
                key={app.id}
                type="button"
                onClick={() => openApp(app.id)}
                className="group flex flex-col items-center gap-1 outline-none cursor-pointer"
              >
                {/* Иконка squircle с градиентом и глянцевым бликом */}
                <span
                  className={`relative grid h-[56px] w-[56px] place-items-center rounded-[16px] bg-gradient-to-b ${app.gradient} border border-white/30 text-white shadow-[0_6px_20px_rgba(0,0,0,0.35)] transition-all duration-150 group-active:scale-90 group-active:brightness-90`}
                >
                  {/* Верхний глянцевый блик */}
                  <span className="pointer-events-none absolute inset-0 rounded-[16px] bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
                  <Glyph className="h-6 w-6 stroke-[1.8] drop-shadow-xs" />
                </span>

                {/* Подпись под иконкой */}
                <span className="max-w-[62px] truncate text-[11px] font-medium tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] text-center">
                  {app.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* НИЖНЯЯ ЧАСТЬ: Кнопка поиска + Стеклянный Dock */}
        <div className="flex flex-col items-center gap-2">
          {/* Кнопка iOS Spotlight Search */}
          <button
            type="button"
            onClick={() => {
              sounds.playGlassClick();
              haptic.tick();
              setSpotlightOpen(true);
            }}
            className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/25 px-3 py-1 text-xs font-semibold text-white/90 shadow-sm backdrop-blur-xl transition-transform hover:bg-black/35 active:scale-95 cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 stroke-[2.2]" />
            <span>Поиск</span>
          </button>

          {/* Фиксированный iOS Dock (4 главных приложения) */}
          <div className="w-full rounded-[30px] border border-white/30 bg-white/25 px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl flex items-center justify-around">
            {["uslugi", "keysy", "team", "contacts"].map((id) => {
              const app = IOS_APPS.find((a) => a.id === id);
              if (!app) return null;
              const Glyph = app.glyph;
              return (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => openApp(app.id)}
                  title={app.label}
                  aria-label={app.label}
                  className="group relative flex flex-col items-center outline-none cursor-pointer"
                >
                  <span
                    className={`relative grid h-[52px] w-[52px] place-items-center rounded-[15px] bg-gradient-to-b ${app.gradient} border border-white/30 text-white shadow-[0_6px_18px_rgba(0,0,0,0.3)] transition-all duration-150 group-active:scale-90 group-active:brightness-90`}
                  >
                    <span className="pointer-events-none absolute inset-0 rounded-[15px] bg-gradient-to-b from-white/35 via-white/5 to-transparent" />
                    <Glyph className="h-6 w-6 stroke-[1.8] drop-shadow-xs" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. ПОЛНОЭКРАННЫЙ РЕЖИМ ПРИЛОЖЕНИЯ (iOS APP VIEW)
          ========================================================================= */}
      {activeApp && (
        <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white select-none animate-in fade-in duration-200">
          {/* Верхняя навигационная панель iOS */}
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 bg-neutral-900/95 px-3 backdrop-blur-xl">
            {/* Кнопка «‹ Назад» в стиле iOS */}
            <button
              type="button"
              onClick={closeApp}
              className="flex items-center gap-1 text-sky-400 transition-opacity hover:opacity-80 active:opacity-50 cursor-pointer text-sm font-medium"
            >
              <ChevronLeft className="h-5 w-5 -ml-1 stroke-[2.5]" />
              <span>Назад</span>
            </button>

            {/* Название приложения по центру */}
            <span className="max-w-[170px] truncate text-center text-xs font-bold text-white">
              {IOS_TITLES[activeApp.id] || activeApp.label}
            </span>

            {/* Кнопка «Готово» справа */}
            <button
              type="button"
              onClick={closeApp}
              className="text-xs font-bold text-sky-400 transition-opacity hover:opacity-80 active:opacity-50 cursor-pointer"
            >
              Готово
            </button>
          </div>

          {/* Содержимое приложения */}
          <div className="relative min-h-0 flex-1 flex flex-col overflow-y-auto bg-neutral-950">
            {activeApp.href && (
              <SiteIframe
                path={activeApp.href}
                title={IOS_TITLES[activeApp.id] || activeApp.label}
              />
            )}
            {activeApp.id === "terminal" && (
              <TerminalApp onThemeChange={onThemeChange} onOpenApp={openApp} />
            )}
            {activeApp.id === "snake" && <Snake active={true} />}
            {activeApp.id === "dragon" && <Dragon active={true} />}
            {activeApp.id === "info" && <InfoApp onClose={closeApp} />}
          </div>

          {/* Нижняя полоска: iOS HOME INDICATOR */}
          <div
            onClick={closeApp}
            title="Закрыть приложение (свайп домой)"
            className="flex h-7 shrink-0 items-center justify-center border-t border-white/5 bg-neutral-900/95 backdrop-blur-xl cursor-pointer active:opacity-50 transition-opacity"
          >
            <span className="h-1 w-36 rounded-full bg-white/60 transition-all hover:bg-white active:w-44" />
          </div>
        </div>
      )}

      {/* =========================================================================
          4. SPOTLIGHT SEARCH (iOS ПОИСК)
          ========================================================================= */}
      {spotlightOpen && (
        <div
          onClick={() => setSpotlightOpen(false)}
          className="fixed inset-0 z-50 flex flex-col bg-black/70 p-4 backdrop-blur-xl animate-in fade-in duration-150"
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full flex-1 flex flex-col max-w-md mx-auto">
            {/* Поисковая строка iOS */}
            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex flex-1 items-center rounded-2xl border border-white/20 bg-white/15 px-3.5 py-2.5 text-white shadow-lg backdrop-blur-xl">
                <Search className="h-4 w-4 shrink-0 text-white/60 mr-2" />
                <input
                  type="text"
                  value={spotlightQuery}
                  onChange={(e) => setSpotlightQuery(e.target.value)}
                  placeholder="Поиск приложений, страниц…"
                  autoFocus
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/50"
                />
                {spotlightQuery && (
                  <button
                    type="button"
                    onClick={() => setSpotlightQuery("")}
                    className="grid h-4 w-4 place-items-center rounded-full bg-white/20 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSpotlightOpen(false)}
                className="text-sm font-semibold text-sky-400 active:opacity-50 cursor-pointer"
              >
                Отмена
              </button>
            </div>

            {/* Список результатов */}
            <div className="desk-scroll flex-1 space-y-2 overflow-y-auto">
              {searchResults.map((app) => {
                const Glyph = app.glyph;
                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => openApp(app.id)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/10 p-3 text-left transition-colors hover:bg-white/20 active:scale-[0.98] cursor-pointer"
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-b ${app.gradient} text-white shadow-md`}
                    >
                      <Glyph className="h-5 w-5 stroke-[1.8]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-white">{app.label}</div>
                      <div className="truncate text-[11px] text-white/70">{app.description}</div>
                    </div>
                  </button>
                );
              })}

              {searchResults.length === 0 && (
                <div className="py-12 text-center text-xs text-white/60">
                  По запросу «{spotlightQuery}» ничего не найдено
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

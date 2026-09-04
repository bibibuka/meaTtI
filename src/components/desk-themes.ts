/* =========================================================================
   maeTtI OS — палитры рабочего стола.
   Каждая тема = один набор CSS-переменных. Весь UI стола красится только
   этими токенами, поэтому контраст текста гарантируется построением:
   в светлой теме поверхности светлые + тёмный текст, в тёмных — наоборот.
   ========================================================================= */

export type WallpaperTheme = "aurora" | "light" | "sunset" | "ice" | "cyber";

export interface DeskOrb {
  /** цвет свечения орба */
  color: string;
  /** класс позиции и размера */
  pos: string;
  /** амплитуда дрейфа */
  dx: number;
  dy: number;
  /** длительность полупериода дрейфа */
  dur: number;
}

export interface DeskTheme {
  name: string;
  /** статичный фон-градиент обоев */
  wall: string;
  /** живые орбы (медленный дрейф) */
  orbs: DeskOrb[];
  /** CSS-переменные токенов */
  vars: Record<string, string>;
}

const dark = (
  name: string,
  wall: string,
  orbs: DeskOrb[],
  fg: string,
  muted: string,
  accent: string,
  accentFg: string,
  surface: string,
  surfaceOpaque: string,
  border: string,
): DeskTheme => ({
  name,
  wall,
  orbs,
  vars: {
    "--desk-fg": fg,
    "--desk-muted": muted,
    "--desk-accent": accent,
    "--desk-accent-fg": accentFg,
    "--desk-surface": surface,
    "--desk-surface-opaque": surfaceOpaque,
    "--desk-surface-2": "rgba(255, 255, 255, 0.08)",
    "--desk-surface-3": "rgba(255, 255, 255, 0.14)",
    "--desk-border": border,
    "--desk-shadow": "0 24px 64px rgba(0, 0, 0, 0.55)",
    "--desk-scrim": "rgba(0, 0, 0, 0.45)",
  },
});

export const THEMES: Record<WallpaperTheme, DeskTheme> = {
  aurora: dark(
    "Северное сияние",
    "linear-gradient(165deg, #0b1224 0%, #101a36 55%, #0a0f22 100%)",
    [
      { color: "rgba(45, 130, 190, 0.34)", pos: "-top-40 -left-32 h-[46rem] w-[46rem]", dx: 70, dy: 40, dur: 38 },
      { color: "rgba(99, 102, 241, 0.26)", pos: "-bottom-48 -right-24 h-[42rem] w-[42rem]", dx: -60, dy: -46, dur: 44 },
    ],
    "#e8edf7",
    "#9dabc4",
    "#8fd3f4",
    "#07243a",
    "rgba(14, 21, 40, 0.78)",
    "rgba(14, 21, 40, 0.98)",
    "rgba(151, 168, 196, 0.24)",
  ),
  light: {
    name: "Хрусталь",
    wall: "linear-gradient(165deg, #eef2fa 0%, #e6ecf7 55%, #dfe8f4 100%)",
    orbs: [
      { color: "rgba(120, 160, 220, 0.30)", pos: "-top-40 -left-32 h-[46rem] w-[46rem]", dx: 70, dy: 40, dur: 38 },
      { color: "rgba(160, 130, 210, 0.22)", pos: "-bottom-48 -right-24 h-[42rem] w-[42rem]", dx: -60, dy: -46, dur: 44 },
    ],
    vars: {
      "--desk-fg": "#1c2536",
      "--desk-muted": "#475569",
      "--desk-accent": "#2563eb",
      "--desk-accent-fg": "#ffffff",
      "--desk-surface": "rgba(255, 255, 255, 0.85)",
      "--desk-surface-opaque": "rgba(255, 255, 255, 0.98)",
      "--desk-surface-2": "rgba(28, 37, 54, 0.07)",
      "--desk-surface-3": "rgba(28, 37, 54, 0.13)",
      "--desk-border": "rgba(28, 37, 54, 0.16)",
      "--desk-shadow": "0 24px 64px rgba(30, 41, 59, 0.20)",
      "--desk-scrim": "rgba(15, 23, 42, 0.28)",
    },
  },
  sunset: dark(
    "Закат",
    "linear-gradient(165deg, #1d0f1e 0%, #2b1230 55%, #180b1c 100%)",
    [
      { color: "rgba(214, 120, 70, 0.30)", pos: "-top-40 left-1/4 h-[44rem] w-[44rem]", dx: 64, dy: 44, dur: 40 },
      { color: "rgba(190, 70, 120, 0.24)", pos: "-bottom-48 -right-24 h-[40rem] w-[40rem]", dx: -56, dy: -40, dur: 46 },
    ],
    "#f6ebe6",
    "#c4a8b2",
    "#fbbf24",
    "#3a2205",
    "rgba(41, 18, 42, 0.80)",
    "rgba(35, 14, 36, 0.98)",
    "rgba(214, 168, 178, 0.22)",
  ),
  ice: dark(
    "Арктический лёд",
    "linear-gradient(165deg, #071624 0%, #0d2a42 55%, #061220 100%)",
    [
      { color: "rgba(80, 160, 210, 0.30)", pos: "-top-40 -left-24 h-[46rem] w-[46rem]", dx: 66, dy: 38, dur: 42 },
      { color: "rgba(60, 110, 190, 0.26)", pos: "-bottom-48 right-0 h-[42rem] w-[42rem]", dx: -58, dy: -44, dur: 38 },
    ],
    "#e6f2fb",
    "#9ab7cb",
    "#7de4f5",
    "#053647",
    "rgba(9, 30, 48, 0.80)",
    "rgba(7, 24, 39, 0.98)",
    "rgba(148, 186, 210, 0.24)",
  ),
  cyber: dark(
    "Киберпанк",
    "linear-gradient(165deg, #0a0716 0%, #150e2e 55%, #080514 100%)",
    [
      { color: "rgba(190, 60, 150, 0.26)", pos: "-top-40 -left-32 h-[44rem] w-[44rem]", dx: 72, dy: 42, dur: 36 },
      { color: "rgba(50, 170, 200, 0.24)", pos: "-bottom-48 -right-24 h-[42rem] w-[42rem]", dx: -64, dy: -40, dur: 42 },
    ],
    "#ece9f8",
    "#a7a1c6",
    "#f472b6",
    "#33091e",
    "rgba(17, 12, 36, 0.80)",
    "rgba(15, 10, 32, 0.98)",
    "rgba(167, 161, 198, 0.24)",
  ),
};

export const THEME_ORDER: WallpaperTheme[] = ["aurora", "light", "sunset", "ice", "cyber"];

/** Свотчи для переключателя тем в панели и контекстном меню */
export const THEME_SWATCH: Record<WallpaperTheme, string> = {
  aurora: "linear-gradient(135deg, #1d3a6e, #63b3e4)",
  light: "linear-gradient(135deg, #dbe4f3, #ffffff)",
  sunset: "linear-gradient(135deg, #4a1d3d, #e8935c)",
  ice: "linear-gradient(135deg, #0e3348, #7de4f5)",
  cyber: "linear-gradient(135deg, #2b1350, #e35fae)",
};

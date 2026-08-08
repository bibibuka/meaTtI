"use client";

import { motion, useReducedMotion } from "framer-motion";

// Синяя волна-линейка вместо бывших шильдиков над заголовками.
// Фазовые кадры и 6s linear — те же, что у волны в шапке, чтобы
// колебались в такт. Амплитуда маленькая: рябь, а не синусоида.
const W = 100;
const H = 12;
const AMP = 2.2;
const PERIODS = 2;

const wavePoints = (phase: number) =>
  Array.from({ length: 41 }, (_, i) => {
    const x = (i / 40) * W;
    const y = H / 2 + AMP * Math.sin((x / W) * PERIODS * 2 * Math.PI + phase);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" L ");

const FRAMES = Array.from(
  { length: 9 },
  (_, i) => `M ${wavePoints((i * Math.PI) / 4)}`
);

export default function WaveRule({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-32 md:w-40 h-3 text-blue-600 ${className}`}
    >
      <motion.path
        d={FRAMES[0]}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        animate={reduce ? undefined : { d: FRAMES }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
    </svg>
  );
}

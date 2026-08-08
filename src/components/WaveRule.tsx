// Синяя волна-линейка вместо бывших шильдиков над заголовками.
// Ширину задаёт родитель (обычно w-fit по заголовку), волна тайлится фоном —
// период всегда 64px, какой бы длины ни был текст. Вся отрисовка и такт
// (6s linear, как у волны в шапке) — в .wave-rule в globals.css.
export default function WaveRule({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`wave-rule ${className}`} />;
}

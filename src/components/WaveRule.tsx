// Синяя волна-линейка вместо бывших шильдиков над заголовками.
// Длину задаёт родитель (обычно w-fit по заголовку), и ровно одна волна
// растягивается на эту длину — как у шапки, где период равен её ширине.
// Путь нарисован на два периода и едет влево на один: окно всегда показывает
// одну волну со сдвигающейся фазой. Анимация — .wave-rule в globals.css.
export default function WaveRule({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 16"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-4 text-blue-600 ${className}`}
    >
      <path
        className="wave-rule"
        d="M 0,8 q 50,-10 100,0 t 100,0 t 100,0 t 100,0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

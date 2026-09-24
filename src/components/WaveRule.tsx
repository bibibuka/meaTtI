
// Синяя волна-линейка вместо бывших шильдиков над заголовками.
// Длину задаёт родитель (обычно w-fit по заголовку), и ровно одна волна
// растягивается на эту длину — как у шапки, где период равен её ширине.
// Рисунок вдвое шире рамки и нарисован на два периода; рамка режет лишнее,
// а сам рисунок едет влево на свою половину (.wave-rule-track в globals.css).
// Это transform HTML-элемента — его ведёт видеокарта, а не перерисовка пути.
export default function WaveRule({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`block w-full h-4 overflow-hidden text-blue-600 ${className}`}>
      <svg
        viewBox="0 0 400 16"
        preserveAspectRatio="none"
        className="wave-rule-track block h-full w-[200%]"
      >
        <path
          d="M 0,8 q 50,-10 100,0 t 100,0 t 100,0 t 100,0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

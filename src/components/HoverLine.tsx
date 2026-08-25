"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Невидимая горизонтальная линия посреди экрана вместо курсора: на тачскрине
   элемент .group, который её пересёк, получает .at-line и те же стили, что при
   наведении мышью — вариант group-hover переопределён в globals.css.

   Наблюдателю с корневым прямоугольником нулевой высоты браузеры верят
   по-разному, поэтому берём узкую полосу вокруг линии. */
const BAND = 48; // % высоты экрана сверху и снизу → полоса в 4vh по центру

export default function HoverLine() {
  const pathname = usePathname();

  useEffect(() => {
    // Порог тот же, что у рабочего стола в WinDesktop: «мобильная версия» — это
    // ширина, а не отсутствие мыши. Иначе в суженном окне десктопа (и в режиме
    // устройства до перезагрузки) линия не включалась бы.
    const mq = matchMedia("(max-width: 767px)");
    let io: IntersectionObserver | null = null;

    const sync = () => {
      io?.disconnect();
      document.querySelectorAll(".at-line").forEach((el) => el.classList.remove("at-line"));
      if (!mq.matches) return;
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => e.target.classList.toggle("at-line", e.isIntersecting)),
        { rootMargin: `-${BAND}% 0px -${BAND}% 0px` },
      );
      // Список снимается один раз на страницу: карточки приезжают вместе с ней.
      document.querySelectorAll(".group").forEach((el) => io!.observe(el));
    };

    sync();
    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      io?.disconnect();
    };
  }, [pathname]);

  return null;
}

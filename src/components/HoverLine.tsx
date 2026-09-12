"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Горизонтальная линия-сенсор посреди экрана вместо курсора: на тачскрине
   элемент .group, который её пересёк, получает .at-line и те же стили, что при
   наведении мышью — вариант group-hover переопределён в globals.css. */
const BAND = 48; // % высоты экрана сверху и снизу → полоса в 4vh по центру

export default function HoverLine() {
  const pathname = usePathname();

  useEffect(() => {
    // Порог тот же, что у мобильной версии: ширина экрана до 768px
    const mq = matchMedia("(max-width: 767px)");
    let io: IntersectionObserver | null = null;

    const sync = () => {
      io?.disconnect();
      document.querySelectorAll(".at-line").forEach((el) => el.classList.remove("at-line"));
      if (!mq.matches) return;

      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            e.target.classList.toggle("at-line", e.isIntersecting);
          });
        },
        { rootMargin: `-${BAND}% 0px -${BAND}% 0px` },
      );

      document.querySelectorAll(".group").forEach((el) => io!.observe(el));
    };

    sync();

    // Наблюдаем за появлением новых .group при гидратации и динамических переходах
    const mo = new MutationObserver(() => {
      if (!io || !mq.matches) return;
      document.querySelectorAll(".group").forEach((el) => io!.observe(el));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      mo.disconnect();
      io?.disconnect();
      document.querySelectorAll(".at-line").forEach((el) => el.classList.remove("at-line"));
    };
  }, [pathname]);

  return null;
}


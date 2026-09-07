"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* На мобильных устройствах принудительное переключение .at-line во время скролла
   вызывает дергание верстки, скачки масштаба (scale) и дрожание карточек.
   Отключаем искусственную линию наведения для гладкого нативного скролла. */
export default function HoverLine() {
  const pathname = usePathname();

  useEffect(() => {
    document.querySelectorAll(".at-line").forEach((el) => el.classList.remove("at-line"));
  }, [pathname]);

  return null;
}


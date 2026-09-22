"use client";

import { useEffect, useState } from "react";

// Сайт свёрстан под телефон (до 768px) и под компьютер (от 1200px). Высоту и
// пропорции окна больше не требуем: ноутбуки 1366×768, Full HD с масштабом
// 150% и мониторы 5:4 раньше видели заглушку вместо сайта.
type Block = null | "rotate" | "resize";

function detect(): Block {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w <= 767 || w >= 1200) return null;
  // Телефон, повёрнутый горизонтально: ширина уже «планшетная», но просить
  // открыть сайт на телефоне тут нелепо.
  if (matchMedia("(pointer: coarse)").matches && w > h && h <= 600) return "rotate";
  return "resize";
}

export default function ViewportGate() {
  const [block, setBlock] = useState<Block>(null);

  useEffect(() => {
    if (window.self !== window.top) return;
    const sync = () => setBlock(detect());
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  if (!block) return null;

  return (
    <div className="fixed inset-0 z-[200] grid place-items-center bg-white px-8 text-center">
      <div>
        <p className="text-2xl font-black tracking-tighter">
          maetti<span className="text-blue-500">.</span>
        </p>
        <p className="mt-4 max-w-sm text-neutral-500">
          {block === "rotate"
            ? "Поверните телефон вертикально."
            : "Откройте сайт на телефоне или разверните окно браузера пошире."}
        </p>
      </div>
    </div>
  );
}

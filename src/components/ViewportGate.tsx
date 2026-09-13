"use client";

import { useEffect, useState } from "react";

function isPhoneOrPc() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  if (w <= 767) return true;
  return w >= 1200 && h >= 700 && w / h >= 1.5;
}

export default function ViewportGate() {
  const [block, setBlock] = useState(false);

  useEffect(() => {
    if (window.self !== window.top) return;
    const sync = () => setBlock(!isPhoneOrPc());
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
          Откройте сайт на телефоне или на компьютере в полноэкранном режиме.
        </p>
      </div>
    </div>
  );
}

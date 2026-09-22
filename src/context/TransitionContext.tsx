"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface TransitionContextType {
  pending: { href: string; from: string } | null;
  layout: number;
  startTransition: (
    href: string,
    e?: React.MouseEvent | { preventDefault?: () => void }
  ) => void;
  clearPending: () => void;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [pending, setPending] = useState<{
    href: string;
    from: string;
  } | null>(null);
  const [layout, setLayout] = useState(0);

  useEffect(() => {
    if (!pending || pending.from === pathname) return;
    const t = setTimeout(() => setPending(null), 400);
    return () => clearTimeout(t);
  }, [pending, pathname]);

  const startTransition = useCallback(
    (
      href: string,
      e?: React.MouseEvent | { preventDefault?: () => void }
    ) => {
      if (href.startsWith("#")) return;
      // Ctrl/Cmd/Shift/Alt-клик и не левая кнопка — это «открыть в новой
      // вкладке/окне»: отдаём браузеру, без шторки и preventDefault.
      if (
        e &&
        "button" in e &&
        (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
      ) {
        return;
      }

      const targetPath = href.split("#")[0] || "/";
      // Та же страница, только без hash. Берём путь из адресной строки: в нём
      // есть basePath, а в targetPath его нет — иначе /meaTtI выпадал из адреса.
      const clearHash = () => {
        history.replaceState(null, "", window.location.pathname + window.location.search);
        window.dispatchEvent(new Event("hashchange"));
      };
      if (targetPath === pathname) {
        if (href.includes("#")) {
          const targetHash = href.split("#")[1];
          if (targetHash) {
            window.location.hash = targetHash;
            window.dispatchEvent(new Event("hashchange"));
          } else if (window.location.hash) {
            clearHash();
          }
        } else {
          if (window.location.hash) {
            clearHash();
          }
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }

      setPending((prev) => {
        if (prev) return prev;
        setLayout(Math.floor(Math.random() * 10));
        return { href, from: pathname };
      });
    },
    [pathname]
  );

  const clearPending = useCallback(() => {
    setPending(null);
  }, []);

  return (
    <TransitionContext.Provider
      value={{ pending, layout, startTransition, clearPending }}
    >
      {children}
    </TransitionContext.Provider>
  );
}

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  return ctx;
}

export function TransitionLink({
  href,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Link>) {
  const transition = usePageTransition();

  return (
    <Link
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!e.defaultPrevented && transition) {
          const hrefStr = typeof href === "string" ? href : href.pathname || "/";
          transition.startTransition(hrefStr, e);
        }
      }}
      {...props}
    >
      {children}
    </Link>
  );
}

import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import WaveRule from "@/components/WaveRule";
import { TransitionLink } from "@/context/TransitionContext";

// При статическом экспорте из этой страницы собирается 404.html — её хостинг
// отдаёт на любой несуществующий адрес (ErrorDocument в public/.htaccess).
// noindex Next ставит на неё сам.
export const metadata: Metadata = {
  title: "Страница не найдена",
};

export default function NotFound() {
  return (
    <div className="bg-neutral-50 min-h-[80vh] flex flex-col justify-center px-6">
      <div className="max-w-3xl mx-auto w-full py-16">
        <div className="w-fit mb-6">
          <WaveRule className="mb-4" />
          <h1 className="text-4xl md:text-6xl font-light tracking-tight text-neutral-950">
            Страница не найдена
          </h1>
        </div>
        <p className="text-base md:text-lg text-neutral-500 font-light leading-relaxed mb-10 text-pretty">
          Ошибка 404: такой страницы нет или её переместили. Проверьте адрес или начните с главной.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <TransitionLink
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 active:scale-95"
          >
            <span>На главную</span>
            <ArrowRight className="w-4 h-4" />
          </TransitionLink>
          <TransitionLink
            href="/contacts"
            className="inline-flex items-center justify-center bg-neutral-900 hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 active:scale-95"
          >
            Связаться с нами
          </TransitionLink>
        </div>
      </div>
    </div>
  );
}

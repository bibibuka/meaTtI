"use client";

import React, { useState } from "react";
import { Send } from "lucide-react";
import { TransitionLink } from "@/context/TransitionContext";
import { haptic } from "@/utils/haptics";

const TELEGRAM = "https://t.me/maetti_mihail";
const GREETING = "Здравствуйте! Хочу обсудить проект.";
const MESSAGE_MAX = 2000;

// Сайт ничего не принимает и не хранит: описание задачи только подставляется
// в сообщение, а отправляет его сам посетитель — уже в Telegram. Так у сайта
// нет своих персональных данных, а значит, и обязанностей оператора по 152-ФЗ.
const telegramUrl = (message: string) => {
  const text = message.trim() ? `${GREETING}\n\n${message.trim()}` : GREETING;
  return `${TELEGRAM}?text=${encodeURIComponent(text)}`;
};

export default function ContactsPage() {
  const [message, setMessage] = useState("");
  // Ссылка на случай, если браузер не дал открыть Telegram в новой вкладке.
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    haptic.tap();
    const url = telegramUrl(message);
    // Без "noopener" в параметрах: с ним window.open всегда возвращает null,
    // и заблокированное окно не отличить от открытого.
    const w = window.open(url, "_blank");
    if (w) {
      try {
        w.opener = null;
      } catch {}
      setFallbackUrl(null);
    } else {
      setFallbackUrl(url);
    }
  };

  return (
    <div className="bg-neutral-950 min-h-[calc(100vh-4rem)] text-neutral-200 font-mono p-4 sm:p-8 md:p-12 flex flex-col justify-center items-center select-text py-8 sm:py-12">

      {/* md:-translate-y-7 — на десктопе вверх от центра */}
      <div className="w-full max-w-3xl md:-translate-y-7 bg-[#0c0c0c] border border-neutral-700 shadow-2xl rounded-sm overflow-hidden">

        <div className="bg-[#1f1f1f] px-4 py-3 border-b border-neutral-800">
          <h1 className="text-base font-semibold text-white">Обсудим ваш проект</h1>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 text-sm text-[#cccccc] font-mono leading-relaxed bg-black">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <p className="text-neutral-400">Опишите задачу — откроем Telegram с готовым сообщением.</p>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-xs text-blue-400 hover:text-blue-300 transition-colors underline font-semibold self-start sm:self-auto"
            >
              <span>@maetti_mihail</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-1">
              <label htmlFor="contact-message" className="block text-xs text-neutral-400 font-mono">
                О проекте
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ваш проект или задачу..."
                maxLength={MESSAGE_MAX}
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 resize-none rounded-none"
              />
            </div>

            <p className="text-xs text-neutral-500 leading-normal">
              Сайт не сохраняет и никуда не отправляет этот текст: он только подставится в сообщение, которое вы
              отправите сами. •{" "}
              <TransitionLink href="/policy" className="underline hover:text-white transition-colors">
                Политика
              </TransitionLink>
            </p>

            {fallbackUrl && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 p-2 font-mono space-y-1">
                <p>Браузер не открыл Telegram сам — откройте по ссылке, текст уже готов.</p>
                <a
                  href={fallbackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center min-h-[44px] px-1 underline font-semibold text-emerald-200 hover:text-white transition-colors"
                >
                  Открыть Telegram
                </a>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-200 text-black hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <span>Продолжить в Telegram</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>

        </div>

        <div className="bg-[#111111] px-4 py-2.5 border-t border-neutral-800 text-[11px] text-neutral-500">
          ИП Маетный Д. А.
        </div>

      </div>

    </div>
  );
}

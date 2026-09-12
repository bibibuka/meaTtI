"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Terminal, ShieldCheck } from "lucide-react";
import { TransitionLink } from "@/context/TransitionContext";
import { haptic } from "@/utils/haptics";

const TELEGRAM = "https://t.me/maetti_mihail";
const botBase = () => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/bot`;

const ERR: Record<string, string> = {
  captcha: "C:\\MAETTI> ERROR: Captcha failed.",
  consent: "C:\\MAETTI> ERROR: User consent required.",
  rate: "C:\\MAETTI> ERROR: Too many requests.",
  telegram: "C:\\MAETTI> ERROR: Telegram unavailable.",
  config: "C:\\MAETTI> ERROR: Bot not configured.",
};

export default function ContactsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [captcha, setCaptcha] = useState<{ q: string; token: string } | null>(null);
  const [captchaAnswer, setCaptchaAnswer] = useState("");

  const loadCaptcha = () => {
    fetch(`${botBase()}/captcha.php`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (d?.token && d?.q) setCaptcha({ q: d.q, token: d.token });
      })
      .catch(() => setCaptcha(null));
    setCaptchaAnswer("");
  };

  useEffect(() => {
    loadCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(ERR.consent);
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    haptic.tap();

    const fallback = () => {
      const text = `Заявка с сайта\nИмя: ${name}\nКонтакт: ${contact}\n\n${message}`;
      window.open(
        `${TELEGRAM}?text=${encodeURIComponent(text)}`,
        "_blank",
        "noopener,noreferrer",
      );
      setIsSubmitting(false);
    };

    try {
      const res = await fetch(`${botBase()}/send.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          contact,
          message,
          consent: true,
          captcha_token: captcha?.token ?? "",
          captcha_answer: captchaAnswer,
        }),
      });
      if (res.status === 404 || res.status === 405) {
        fallback();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!data) {
        fallback();
        return;
      }
      if (!res.ok || data.ok !== true) {
        setErrorMsg(ERR[data.error] ?? "C:\\MAETTI> ERROR: Send failed.");
        loadCaptcha();
        setIsSubmitting(false);
        return;
      }
      haptic.success();
      router.push("/spasibo");
    } catch {
      fallback();
    }
  };

  return (
    <div className="bg-neutral-950 min-h-[calc(100vh-4rem)] text-neutral-200 font-mono p-4 sm:p-8 md:p-12 flex flex-col justify-center items-center select-text py-8 sm:py-12">
      
      {/* CMD Window Container. md:-translate-y-7 — на десктопе вверх от центра */}
      <div className="w-full max-w-3xl md:-translate-y-7 bg-[#0c0c0c] border border-neutral-700 shadow-2xl rounded-sm overflow-hidden">
        
        {/* Windows CMD Title Bar */}
        <div className="bg-[#1f1f1f] px-3 py-2 sm:py-1.5 flex items-center justify-between border-b border-neutral-800 text-xs select-none">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center border border-neutral-600 rounded-xs">
              C:\
            </div>
            <span className="font-semibold tracking-wide truncate">Command Prompt - MAETTI.EXE</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-neutral-500 pointer-events-none" aria-hidden="true">
            <span className="px-1.5 py-0.5">_</span>
            <span className="px-1.5 py-0.5">□</span>
            <span className="px-1.5 py-0.5">✕</span>
          </div>
        </div>

        {/* CMD Terminal Body */}
        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 text-sm text-[#cccccc] font-mono leading-relaxed bg-black">
          
          {/* Header Info */}
          <div>
            <p className="text-neutral-400">
              C:\Users\Guest\MAETTI&gt; <span className="text-white font-bold">contact-us.cmd</span>
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="border border-neutral-800 bg-[#080808] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-neutral-400">
              <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Форма обратной связи. Заполните поля:</span>
            </div>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-xs text-blue-400 hover:text-blue-300 underline font-semibold self-start sm:self-auto"
            >
              <span>[ Наш Telegram @maetti_mihail ]</span>
            </a>
          </div>

          {/* Clean CMD Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Name */}
            <div className="space-y-1">
              <label htmlFor="contact-name" className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Имя]</span>=
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Петров"
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 rounded-none"
              />
            </div>

            {/* Field 2: Contact */}
            <div className="space-y-1">
              <label htmlFor="contact-reach" className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Контакты]</span>=
              </label>
              <input
                id="contact-reach"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram @username / Телефон / Email"
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 rounded-none"
              />
            </div>

            {/* Field 3: Message */}
            <div className="space-y-1">
              <label htmlFor="contact-message" className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Сообщение]</span>=
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ваш проект или задачу..."
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 resize-none rounded-none"
              />
            </div>

            {captcha && (
              <div className="space-y-1">
                <label htmlFor="contact-captcha" className="block text-xs text-neutral-400 font-mono">
                  C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Капча {captcha.q}]</span>=
                </label>
                <input
                  id="contact-captcha"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  value={captchaAnswer}
                  onChange={(e) => setCaptchaAnswer(e.target.value)}
                  placeholder="Ответ"
                  required
                  className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 rounded-none"
                />
              </div>
            )}

            {/* Consent Checkbox */}
            <div className="flex items-center gap-3 pt-1 text-xs text-neutral-400 select-none min-h-[44px]">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consent}
                required
                onChange={(e) => setConsent(e.target.checked)}
                className="accent-emerald-500 w-5 h-5 cursor-pointer shrink-0"
              />
              <label htmlFor="consentCheck" className="cursor-pointer leading-normal flex-1 py-2">
                Согласен на обработку данных •{" "}
                <TransitionLink href="/policy" className="underline hover:text-white">
                  Политика
                </TransitionLink>
              </label>
            </div>

            {/* Error Message if any */}
            {errorMsg && (
              <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 p-2 font-mono">
                {errorMsg}
              </div>
            )}

            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-neutral-500">
                C:\MAETTI\Contacts&gt; <span className="animate-pulse font-bold text-white">_</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-200 text-black hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <span>{isSubmitting ? "Отправка..." : "Отправить"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </form>

        </div>

        {/* Window Footer */}
        <div className="bg-[#111111] px-4 py-2.5 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Прямое подключение: Telegram @maetti_mihail</span>
          </div>
          <span className="text-[10px] sm:text-[11px] opacity-75">ИП Маетный Д. А.</span>
        </div>

      </div>

    </div>
  );
}

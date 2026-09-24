"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import { TransitionLink } from "@/context/TransitionContext";
import { haptic } from "@/utils/haptics";

const TELEGRAM = "https://t.me/maetti_mihail";
const botBase = () => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/bot`;

const ERR: Record<string, string> = {
  captcha: "Неверный ответ капчи. Попробуйте ещё раз.",
  consent: "Нужно согласие на обработку данных.",
  rate: "Слишком часто. Подождите немного и отправьте снова.",
  name: "Имя — от 2 до 80 символов.",
  contact: "Контакт — от 3 до 120 символов.",
  message: "Сообщение — от 3 до 2000 символов.",
};

// Те же пределы, что проверяет public/bot/send.php. Длину считаем по
// символам, как mb_strlen на сервере (эмодзи — один символ, а не два).
const LIMITS = {
  name: [2, 80],
  contact: [3, 120],
  message: [3, 2000],
} as const;
const charLen = (v: string) => [...v.trim()].length;

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
  // Ссылка на Telegram с готовым текстом заявки — когда сайт не смог
  // отправить её сам (нет PHP, бот не настроен, Telegram не ответил).
  const [fallbackUrl, setFallbackUrl] = useState<string | null>(null);

  const fetchCaptcha = () => {
    fetch(`${botBase()}/captcha.php`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        if (d?.token && d?.q) setCaptcha({ q: d.q, token: d.token });
      })
      .catch(() => setCaptcha(null));
  };

  const reloadCaptcha = () => {
    setCaptchaAnswer("");
    fetchCaptcha();
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg(ERR.consent);
      return;
    }
    const values = { name, contact, message };
    for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
      const [min, max] = LIMITS[key];
      const len = charLen(values[key]);
      if (len < min || len > max) {
        setErrorMsg(ERR[key]);
        return;
      }
    }

    setErrorMsg("");
    setFallbackUrl(null);
    setIsSubmitting(true);
    haptic.tap();

    // Сайт не смог отправить заявку сам — открываем Telegram с готовым
    // текстом. Окно открывается уже после ответа сервера, и браузер может его
    // заблокировать, поэтому ссылку показываем и в самой форме.
    const fallback = () => {
      const text = `Заявка с сайта\nИмя: ${name.trim()}\nКонтакт: ${contact.trim()}\n\n${message.trim()}`;
      const url = `${TELEGRAM}?text=${encodeURIComponent(text)}`;
      // Без "noopener" в параметрах: с ним window.open всегда возвращает null,
      // и заблокированное окно не отличить от открытого.
      const w = window.open(url, "_blank");
      if (w) {
        try {
          w.opener = null;
        } catch {}
      }
      setFallbackUrl(url);
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
      // 404/405 — на хостинге нет PHP; 5xx — бот не настроен или Telegram
      // не ответил. В обоих случаях заявка не должна пропасть.
      if (res.status === 404 || res.status === 405 || res.status >= 500) {
        fallback();
        return;
      }
      const data = await res.json().catch(() => null);
      if (!data) {
        fallback();
        return;
      }
      if (!res.ok || data.ok !== true) {
        setErrorMsg(ERR[data.error] ?? "Не удалось отправить. Попробуйте ещё раз.");
        reloadCaptcha();
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
      
      {/* md:-translate-y-7 — на десктопе вверх от центра */}
      <div className="w-full max-w-3xl md:-translate-y-7 bg-[#0c0c0c] border border-neutral-700 shadow-2xl rounded-sm overflow-hidden">
        
        <div className="bg-[#1f1f1f] px-4 py-3 border-b border-neutral-800">
          <h1 className="text-base font-semibold text-white">Обсудим ваш проект</h1>
        </div>

        <div className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6 text-sm text-[#cccccc] font-mono leading-relaxed bg-black">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <p className="text-neutral-400">Оставьте заявку или напишите нам напрямую.</p>
            <a
              href={TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 min-h-[44px] px-1 text-xs text-blue-400 hover:text-blue-300 transition-colors underline font-semibold self-start sm:self-auto"
            >
              <span>Написать в Telegram</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Name */}
            <div className="space-y-1">
              <label htmlFor="contact-name" className="block text-xs text-neutral-400 font-mono">
                Имя
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Петров"
                maxLength={LIMITS.name[1]}
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 rounded-none"
              />
            </div>

            {/* Field 2: Contact */}
            <div className="space-y-1">
              <label htmlFor="contact-reach" className="block text-xs text-neutral-400 font-mono">
                Как с вами связаться
              </label>
              <input
                id="contact-reach"
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Телефон, email или Telegram"
                maxLength={LIMITS.contact[1]}
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 rounded-none"
              />
            </div>

            {/* Field 3: Message */}
            <div className="space-y-1">
              <label htmlFor="contact-message" className="block text-xs text-neutral-400 font-mono">
                О проекте
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ваш проект или задачу..."
                maxLength={LIMITS.message[1]}
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2.5 text-base md:text-sm font-mono transition-colors placeholder:text-neutral-600 resize-none rounded-none"
              />
            </div>

            {captcha && (
              <div className="space-y-1">
                <label htmlFor="contact-captcha" className="block text-xs text-neutral-400 font-mono">
                  Проверка: {captcha.q}
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
                <TransitionLink href="/policy" className="underline hover:text-white transition-colors">
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

            {fallbackUrl && (
              <div className="text-xs text-emerald-300 bg-emerald-950/40 border border-emerald-800 p-2 font-mono space-y-1">
                <p>Не удалось отправить заявку. Отправьте её в Telegram — текст уже готов.</p>
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
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-neutral-200 text-black hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-3.5 transition-all duration-200 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <span>{isSubmitting ? "Отправка..." : "Отправить"}</span>
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

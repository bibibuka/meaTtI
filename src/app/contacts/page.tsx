"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Terminal, ShieldCheck, RefreshCw } from "lucide-react";
import { TransitionLink } from "@/context/TransitionContext";

export default function ContactsPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tier = params.get("tier");
    const budget = params.get("budget");
    const days = params.get("days");
    if (tier || budget || days) {
      const lines = [
        "Бриф из калькулятора maeTtI OS:",
        tier ? `• Тип проекта: ${tier}` : null,
        budget ? `• Оценка бюджета: ${Number(budget).toLocaleString("ru-RU")} ₽` : null,
        days ? `• Срок: ~${days} рабочих дней` : null,
      ].filter(Boolean);
      const text = lines.join("\n");
      queueMicrotask(() => {
        setMessage(text);
      });
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMsg("C:\\MAETTI> ERROR: User consent required.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);
    
    const newLogs = [
      `C:\\MAETTI\\Contacts> set [Имя]="${name}"`,
      `C:\\MAETTI\\Contacts> set [Контакты]="${contact}"`,
      `C:\\MAETTI\\Contacts> send-packet.exe --secure`,
      "Connecting to api.maetti.ru [192.168.1.100]...",
      "Status: 200 OK - Message delivered successfully.",
      "Redirecting to /spasibo..."
    ];

    newLogs.forEach((log, index) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, (index + 1) * 250);
    });

    setTimeout(() => {
      router.push("/spasibo");
    }, 2000);
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-neutral-200 font-mono p-4 sm:p-8 md:p-12 flex flex-col justify-center items-center select-text">
      
      {/* CMD Window Container. -translate-y-7 — 28px вверх от центра */}
      <div className="w-full max-w-3xl -translate-y-7 bg-[#0c0c0c] border border-neutral-700 shadow-2xl rounded-sm overflow-hidden">
        
        {/* Windows CMD Title Bar */}
        <div className="bg-[#1f1f1f] px-3 py-1.5 flex items-center justify-between border-b border-neutral-800 text-xs select-none">
          <div className="flex items-center gap-2 text-neutral-300">
            <div className="w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center border border-neutral-600 rounded-xs">
              C:\
            </div>
            <span className="font-semibold tracking-wide">Command Prompt - MAETTI.EXE</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span className="px-2 py-0.5 hover:bg-neutral-700 hover:text-white cursor-pointer transition-colors">_</span>
            <span className="px-2 py-0.5 hover:bg-neutral-700 hover:text-white cursor-pointer transition-colors">□</span>
            <span className="px-2 py-0.5 hover:bg-red-600 hover:text-white cursor-pointer transition-colors">✕</span>
          </div>
        </div>

        {/* CMD Terminal Body */}
        <div className="p-6 md:p-8 space-y-6 text-sm text-[#cccccc] font-mono leading-relaxed bg-black">
          
          {/* Header Info */}
          <div>
            <p className="text-neutral-400">
              C:\Users\Guest\MAETTI&gt; <span className="text-white font-bold">contact-us.cmd</span>
            </p>
          </div>

          {/* Quick Actions Bar */}
          <div className="border border-neutral-800 bg-[#080808] p-3 text-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-neutral-400">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Форма обратной связи. Заполните поля ниже:</span>
            </div>
            <a
              href="https://t.me/maetti_agency_stub"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 underline font-semibold"
            >
              <span>[ Наш Telegram ]</span>
            </a>
          </div>

          {/* Clean CMD Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Field 1: Name */}
            <div className="space-y-1">
              <label className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Имя]</span>=
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Петров"
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2 text-sm font-mono transition-colors placeholder:text-neutral-600"
              />
            </div>

            {/* Field 2: Contact */}
            <div className="space-y-1">
              <label className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Контакты]</span>=
              </label>
              <input
                type="text"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telegram @username / Телефон / Email"
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2 text-sm font-mono transition-colors placeholder:text-neutral-600"
              />
            </div>

            {/* Field 3: Message */}
            <div className="space-y-1">
              <label className="block text-xs text-neutral-400 font-mono">
                C:\MAETTI\Contacts&gt; set <span className="text-emerald-400 font-bold">[Сообщение]</span>=
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Опишите ваш проект или задачу..."
                required
                className="w-full bg-[#111111] border border-neutral-800 focus:border-emerald-500 outline-none text-white px-3 py-2 text-sm font-mono transition-colors placeholder:text-neutral-600 resize-none"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-center gap-2 pt-1 text-xs text-neutral-400 select-none">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="accent-emerald-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="consentCheck" className="cursor-pointer">
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

            {/* Dynamic Console Output Logs */}
            {logs.length > 0 && (
              <div className="bg-[#050505] border border-neutral-800 p-3 space-y-1 text-xs font-mono text-emerald-400">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-neutral-600">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-neutral-500">
                C:\MAETTI\Contacts&gt; <span className="animate-pulse font-bold text-white">_</span>
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 bg-neutral-200 text-black hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-2.5 transition-all duration-200 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    <span>Отправить</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

        {/* Window Footer */}
        <div className="bg-[#111111] px-4 py-2 border-t border-neutral-800 text-[11px] text-neutral-500 flex flex-wrap items-center justify-between gap-2 select-none">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Прямое подключение: Telegram @maetti</span>
          </div>
          <span>ИП Маетный Д. А. • ИНН 772412345678</span>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Terminal, Send, CheckSquare, Square, RefreshCw } from "lucide-react";

export default function ContactsPage() {
  const router = useRouter();
  const [bootLogs, setBootLogs] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    const logs = [
      "SYSTEM INITIATED: SECURE CLIENT HANDSHAKE PROTOCOL",
      "ESTABLISHING CRYPTO CHANNEL TO MAETTI BACKEND...",
      "CIPHER: AES-256-GCM / PROTOCOL: WSS://SECURE.MAETTI.RU",
      "GET /API/CONTACTS - STATUS: 200 OK",
      "TERMINAL SHELL INITIATED. WELCOME, GUEST CLIENT."
    ];
    
    logs.forEach((log, index) => {
      setTimeout(() => {
        setBootLogs((prev) => [...prev, log]);
      }, (index + 1) * 300);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setSubmitStatus("ERR: USER CONSENT REQ [152-FZ] NOT SPECIFIED.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("SENDING CLIENT ENVELOPE...");

    setTimeout(() => {
      setSubmitStatus("SUCCESS: PACKET TRANSMITTED. REDIRECTING...");
      setTimeout(() => {
        router.push("/spasibo");
      }, 800);
    }, 1500);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-[#00e5ff] font-mono p-6 md:p-12 relative flex flex-col justify-center items-center">
      {/* Neon Glow Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      <div className="relative max-w-3xl w-full border-2 border-[#00e5ff] bg-[#0c0c0c] rounded-lg p-6 md:p-8 shadow-[0_0_25px_rgba(0,229,255,0.15)] z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-4 mb-6 text-xs md:text-sm text-[#00e5ff]/70">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#00e5ff] animate-pulse" />
            <span className="font-bold">secure_shell_v1.0.8_maetti.exe</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full border border-[#00e5ff]/50 bg-transparent" />
            <div className="w-3 h-3 rounded-full border border-[#00e5ff]/50 bg-transparent" />
            <div className="w-3 h-3 rounded-full border border-[#00e5ff] bg-[#00e5ff]/20" />
          </div>
        </div>

        {/* Boot Logs */}
        <div className="space-y-1 mb-8 text-[11px] md:text-xs text-[#00e5ff]/80 bg-[#070707] p-4 border border-[#00e5ff]/20 rounded-md max-h-40 overflow-y-auto">
          {bootLogs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-[#00e5ff]/40">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
          {bootLogs.length === 5 && (
            <div className="text-[#00e5ff] animate-pulse flex items-center gap-1">
              <span>$ cursor_ready_</span>
            </div>
          )}
        </div>

        {/* Terminal Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-[#00e5ff]/30 py-2">
            <span className="text-[#00e5ff]/60 shrink-0">guest@maetti:~$ set_name --input=</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="введите ваше имя..."
              required
              className="bg-transparent border-none outline-none text-[#00e5ff] placeholder-[#00e5ff]/30 flex-1 py-1"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-2 border-b border-[#00e5ff]/30 py-2">
            <span className="text-[#00e5ff]/60 shrink-0">guest@maetti:~$ set_contact --input=</span>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="telegram / телефон / email..."
              required
              className="bg-transparent border-none outline-none text-[#00e5ff] placeholder-[#00e5ff]/30 flex-1 py-1"
            />
          </div>

          <div className="flex flex-col gap-2 border-b border-[#00e5ff]/30 py-2">
            <span className="text-[#00e5ff]/60">guest@maetti:~$ write_message</span>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="опишите вашу задачу или оставьте комментарий..."
              required
              className="bg-transparent border-none outline-none text-[#00e5ff] placeholder-[#00e5ff]/30 flex-1 py-1 resize-none h-24"
            />
          </div>

          {/* Consent Checkbox */}
          <div className="flex items-start gap-3 select-none">
            <button
              type="button"
              onClick={() => setConsent(!consent)}
              className="mt-0.5 shrink-0 text-[#00e5ff]"
              aria-label="Toggle Consent Checkbox"
            >
              {consent ? (
                <CheckSquare className="w-5 h-5" />
              ) : (
                <Square className="w-5 h-5" />
              )}
            </button>
            <p className="text-xs text-[#00e5ff]/60 leading-tight">
              согласен с{" "}
              <Link href="/policy" className="underline hover:text-[#00e5ff] transition-colors font-bold">
                политикой обработки данных
              </Link>{" "}
              согласно 152-ФЗ РФ.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-[#00e5ff]/30">
            {submitStatus && (
              <div className="text-xs font-bold uppercase tracking-wider text-[#00e5ff] flex items-center gap-2 bg-[#00e5ff]/10 px-3 py-2 border border-[#00e5ff]/30 rounded">
                {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{submitStatus}</span>
              </div>
            )}
            {!submitStatus && <div />}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center gap-2 bg-[#00e5ff] text-black font-extrabold px-6 py-3 rounded hover:bg-[#00e5ff]/80 active:scale-95 transition-all duration-200 shadow-[0_0_15px_rgba(0,229,255,0.4)] disabled:opacity-50 cursor-pointer text-sm"
            >
              <span>EXECUTE_SUBMIT</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Info Footnote */}
      <div className="mt-8 text-center text-xs text-[#00e5ff]/50 space-y-2">
        <p>прямая ссылка: <a href="https://t.me/maetti_agency_stub" className="underline hover:text-[#00e5ff]">t.me/maetti</a></p>
        <p>ИП Маетный Д. А. • ИНН 772412345678 • ОГРНИП 321774600123456</p>
      </div>
    </div>
  );
}

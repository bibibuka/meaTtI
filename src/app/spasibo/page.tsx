"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, MessageSquareCode } from "lucide-react";
import { motion } from "framer-motion";

export default function SpasiboPage() {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950 min-h-[80vh] flex flex-col justify-center items-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-xl"
      >
        {/* Success Icon */}
        <div className="w-20 h-20 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl font-extrabold text-foreground tracking-tight mb-4">
          Спасибо за заявку!
        </h1>
        
        <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base leading-relaxed mb-8">
          Ваш запрос успешно отправлен и зарегистрирован в системе. Мы свяжемся с вами в Telegram или по указанному номеру в течение 30 минут.
        </p>

        <div className="space-y-4">
          <a
            href="https://t.me/maetti_agency_stub"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-4 rounded-full transition-transform active:scale-95 shadow-md"
          >
            <MessageSquareCode className="w-5 h-5" />
            <span>Написать нам напрямую</span>
          </a>

          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-foreground font-bold px-6 py-4 rounded-full transition-transform active:scale-95"
          >
            <span>На главную страницу</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

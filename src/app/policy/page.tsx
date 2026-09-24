import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import WaveRule from "@/components/WaveRule";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Сайт maetti.ru не собирает персональные данные посетителей: связь — через Telegram.",
};

export default function PolicyPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 min-h-screen text-neutral-900 dark:text-neutral-100 font-sans py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/contacts"
          className="inline-flex items-center gap-2 min-h-[44px] text-sm text-neutral-500 hover:text-foreground transition mb-8 sm:mb-12 py-2.5 px-3 -ml-2 rounded-lg active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться к контактам</span>
        </Link>

        {/* Title */}
        <header className="mb-12 border-b border-neutral-200 dark:border-neutral-800 pb-8">
          <div className="w-fit">
            <WaveRule className="mb-4" />
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-neutral-950 dark:text-white break-words">
              Политика Конфиденциальности
            </h1>
          </div>
          <p className="text-sm text-neutral-400 mt-2">
            Редакция от 25.09.2026
          </p>
        </header>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none text-sm md:text-base text-neutral-600 dark:text-neutral-300 space-y-6 leading-relaxed">
          <p>
            Эта политика описывает, какие сведения о посетителях получает сайт maetti.ru, принадлежащий ИП Маетный Д. А.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            1. Сайт не собирает персональные данные
          </h2>
          <p>
            1.1. На сайте нет форм для отправки данных, регистрации и личных кабинетов. Сайт не принимает, не хранит и не передаёт третьим лицам имена, телефоны, адреса электронной почты или другие персональные данные посетителей.
          </p>
          <p>
            1.2. На сайте нет сервисов веб-аналитики, рекламных счётчиков и сторонних скриптов слежения.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            2. Как с нами связаться
          </h2>
          <p>
            2.1. Связаться с нами можно в Telegram: @maetti_mihail. Текст, который вы вводите на странице «Контакты», никуда не отправляется — он только подставляется в сообщение в Telegram, а отправляете его вы сами.
          </p>
          <p>
            2.2. Переписка ведётся в Telegram и подчиняется его правилам. Сведения, которые вы сообщите нам в переписке, мы используем только чтобы ответить на ваш запрос и обсудить работу, и не передаём их третьим лицам.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            3. Данные в вашем браузере
          </h2>
          <p>
            3.1. Настройки интерактивного рабочего стола на главной странице (тема оформления и заметка) и отметка о просмотренном окне «О системе» сохраняются только в вашем браузере (localStorage и sessionStorage). На сервер они не передаются, и удалить их можно, очистив данные сайта в браузере.
          </p>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white mt-8 mb-4">
            4. Изменения политики
          </h2>
          <p>
            4.1. Если сайт начнёт получать персональные данные, политика будет обновлена до начала их сбора. Актуальная редакция всегда опубликована на этой странице.
          </p>
        </div>
      </div>
    </div>
  );
}

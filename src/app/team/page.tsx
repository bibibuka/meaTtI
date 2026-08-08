"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Terminal, FileText, Globe, Heart } from "lucide-react";

const TEAM = [
  {
    name: "Дмитрий Маетный",
    role: "Founder & Lead Developer",
    desc: "Пишет сложную бэкенд-логику, проектирует базы данных и связывает несовместимые API. Фанатеет от оптимизации.",
    color: "bg-[#38b6ff]", // Sky Blue
    avatar: "👨‍💻",
    tags: ["Backend", "Telegram Bots", "System Architecture"]
  },
  {
    name: "Анна Кузнецова",
    role: "Art Director & UI/UX",
    desc: "Создает смелые визуальные концепции, собирает интерактивные прототипы и следит, чтобы дизайн вызывал мурашки.",
    color: "bg-[#a5b4fc]", // Lavender Indigo
    avatar: "🎨",
    tags: ["UI/UX Design", "Aesthetics", "Creative Concept"]
  },
  {
    name: "Михаил Петров",
    role: "Senior Frontend Engineer",
    desc: "Оживляет интерфейсы с помощью GSAP и Framer Motion. Заставляет пиксели двигаться плавно на любых устройствах.",
    color: "bg-[#60a5fa]", // Classic Blue
    avatar: "🚀",
    tags: ["React/Next.js", "Animations", "Tailwind CSS"]
  },
  {
    name: "Елена Смирнова",
    role: "SEO & Traffic Strategist",
    desc: "Анализирует выдачу, выводит сайты на первые позиции и настраивает рекламу так, чтобы лиды были горячими.",
    color: "bg-[#22d3ee]", // Cyan
    avatar: "📊",
    tags: ["SEO", "Yandex Direct", "Analytics"]
  }
];

export default function TeamPage() {
  const shouldReduceMotion = useReducedMotion();

  const hoverAnimation = shouldReduceMotion
    ? {}
    : {
        rotate: [-1, 1, -1],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatType: "reverse" as const,
        }
      };

  return (
    <div className="relative bg-[#FFFDF0] dark:bg-neutral-950 min-h-screen text-black dark:text-neutral-200 pb-24 font-sans bg-[radial-gradient(#e0e0d0_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#202020_1px,transparent_1px)]">
      
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tight text-black dark:text-white leading-none mb-8">
            НАША КОМАНДА
          </h1>
          <p className="text-lg md:text-xl text-neutral-700 dark:text-neutral-400 font-medium max-w-2xl leading-relaxed">
            Мы не просто фрилансеры-одиночки. Мы сплоченная студия инженеров и дизайнеров, любящих свое дело и готовых создавать продукты высшего пилотажа.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TEAM.map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={shouldReduceMotion ? {} : {
                y: -10,
                boxShadow: "10px 10px 0px 0px rgba(0,0,0,1)"
              }}
              className="group relative border-4 border-black dark:border-white bg-white dark:bg-neutral-900 p-6 flex flex-col justify-between transition-all duration-200 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
            >
              {/* Memphis avatar badge */}
              <div className={`w-16 h-16 border-4 border-black dark:border-white flex items-center justify-center text-4xl mb-6 ${member.color} shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]`}>
                {member.avatar}
              </div>

              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-1">
                  {member.name}
                </h2>
                <div className="text-xs font-mono font-bold text-neutral-500 uppercase mb-4">
                  // {member.role}
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6 font-medium">
                  {member.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-black dark:border-neutral-800">
                {member.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono font-bold px-2.5 py-1 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust / Requisites Block */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="border-4 border-black dark:border-white bg-[#38b6ff]/20 dark:bg-neutral-900 p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.8)]">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8" />
            <span>ОФИЦИАЛЬНОСТЬ И ДОВЕРИЕ</span>
          </h2>
          <p className="text-sm md:text-base text-neutral-800 dark:text-neutral-300 font-medium leading-relaxed mb-8">
            Мы дорожим репутацией и работаем исключительно прозрачно. Для каждого проекта заключается официальный двусторонний договор, предоставляются закрывающие документы, а оплата принимается на расчетный счет.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t-2 border-dashed border-black dark:border-neutral-800 text-xs font-mono">
            <div className="space-y-2">
              <div className="font-bold text-neutral-500 uppercase">// РЕКВИЗИТЫ СТУДИИ:</div>
              <div><strong>Название:</strong> Студия цифровых решений maeTtI</div>
              <div><strong>ИП:</strong> Маетный Дмитрий Александрович</div>
              <div><strong>ИНН:</strong> 772412345678</div>
              <div><strong>ОГРНИП:</strong> 321774600123456</div>
            </div>
            <div className="space-y-2">
              <div className="font-bold text-neutral-500 uppercase">// КОНТАКТЫ ДЛЯ ДОГОВОРОВ:</div>
              <div><strong>Банк:</strong> АО «ТБанк»</div>
              <div><strong>Расчетный счет:</strong> 40802810123456789012</div>
              <div><strong>Email:</strong> legal@maetti.ru</div>
              <div className="flex items-center gap-1 text-red-500 font-bold dark:text-red-400">
                <Heart className="w-4 h-4 fill-current" />
                <span>Сделано с любовью к коду</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

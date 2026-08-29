"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users } from "lucide-react";
import WaveRule from "@/components/WaveRule";

type TeamMember = {
  name: string;
  profession: string;
  desc: string;
  color: string;
  avatar: string;
  photo: string;
  awards?: string[];
};

const TEAM: TeamMember[] = [
  {
    name: "Орлов Михаил",
    profession: "Основатель команды.",
    desc: "Отвечает за разработку в целом: фронтенд, ИИ-логику и бэкенд - от идеи до запуска.",
    color: "bg-[#38b6ff]",
    avatar: "🧠",
    photo: "/team/orlov/photo",
    awards: [
      "1 место - Computer Vision Hackathon (Arduino)",
      "2 место - Data Science & Industrial AI Hackathon"
    ]
  },
  {
    name: "Егор Калач",
    profession: "Сооснователь команды.",
    desc: "Отвечает за серверную часть: API, базы данных, интеграции.",
    color: "bg-[#a5b4fc]",
    avatar: "⚙️",
    photo: "/team/kalach/photo",
    awards: ["1 место - Computer Vision Hackathon (Arduino) - в команде студии"]
  },
  {
    name: "Пастушенко Леонид",
    profession: "Инженер аппаратных решений.",
    desc: "Отвечает за электронику: микроконтроллеры, пайку и логику устройств.",
    color: "bg-[#60a5fa]",
    avatar: "⚡",
    photo: "/team/pastushenko/photo",
    awards: [
      "1 место - Computer Vision Hackathon (Arduino)",
      "2 место - Data Science & Industrial AI Hackathon"
    ]
  },
  {
    name: "Борисова Василиса",
    profession: "Медиа-специалист.",
    desc: "Отвечает за продвижение студии: SMM, видеопродакшн и весь медиаконтент.",
    color: "bg-[#22d3ee]",
    avatar: "🎬",
    photo: "/team/borisova/photo"
  }
];

function MemberPhoto({
  photo,
  name,
  color,
  emoji
}: {
  photo: string;
  name: string;
  color: string;
  emoji: string;
}) {
  const [step, setStep] = useState(0);
  // На GitHub Pages сайт живёт в /meaTtI, сырые src о basePath не знают
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

  return (
    <div
      className={`relative w-full aspect-square border-4 border-black dark:border-white mb-5 sm:mb-6 overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
        step < 1 ? "bg-neutral-100 dark:bg-neutral-800" : color
      }`}
    >
      {step < 1 ? (
        <img
          src={`${base}${photo}.jpg`}
          alt={name}
          onError={() => setStep(1)}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl">
          {emoji}
        </div>
      )}
    </div>
  );
}

export default function TeamPage() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative bg-[#FFFDF0] dark:bg-neutral-950 min-h-screen text-black dark:text-neutral-200 pb-20 md:pb-24 font-sans bg-[radial-gradient(#e0e0d0_1px,transparent_1px)] [background-size:20px_20px] dark:bg-[radial-gradient(#202020_1px,transparent_1px)]">

      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-20">
        <div className="max-w-3xl">
          <div className="w-fit mb-6 sm:mb-8">
            <WaveRule className="mb-5 sm:mb-6" />
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black uppercase tracking-tight text-black dark:text-white leading-none break-words">
              НАША КОМАНДА
            </h1>
          </div>
        </div>
        <p className="text-base sm:text-lg md:text-xl text-neutral-700 dark:text-neutral-400 font-medium leading-relaxed text-pretty">
          maeTtI - студия цифровых решений. В ядре команды четыре специалиста: разработчики, инженер аппаратных решений и специалист по медиа. Мы познакомились в университетских лабораториях, получили опыт на хакатонах и теперь реализуем коммерческие проекты.
        </p>
      </section>

      {/* Team Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {TEAM.map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={shouldReduceMotion ? {} : {
                y: -10,
                boxShadow: "10px 10px 0px 0px rgba(0,0,0,1)"
              }}
              className="group relative border-4 border-black dark:border-white bg-white dark:bg-neutral-900 p-5 sm:p-6 transition-all duration-200 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.8)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
            >
              {/* Photo / fallback badge */}
              <MemberPhoto
                photo={member.photo}
                name={member.name}
                color={member.color}
                emoji={member.avatar}
              />

              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-black dark:text-white mb-1 break-words whitespace-nowrap">
                  {member.name}
                </h2>
                <p className="text-sm font-bold text-black dark:text-white leading-snug mb-1.5">
                  {member.profession}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium text-pretty">
                  {member.desc}
                </p>

                {member.awards && member.awards.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {member.awards.map((award, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-1.5 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
                        <span className="shrink-0">🏆</span>
                        <span className="text-pretty">{award}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* Extended team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="border-4 border-black dark:border-white bg-white dark:bg-neutral-900 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-8 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.8)] sm:dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.8)]"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 border-4 border-black dark:border-white bg-[#38b6ff]/30 dark:bg-[#38b6ff]/20 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.8)]">
            <Users className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white mb-1.5">
              Проект будет выполнен
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed text-pretty">
              Ядро команды - четыре специалиста. При необходимости усиливаем его проверенными узкопрофильными экспертами: дизайн, вёрстка, тестирование, маркетинг. Любую задачу проекта закрываем своими силами - проект не встанет из-за нехватки рук.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

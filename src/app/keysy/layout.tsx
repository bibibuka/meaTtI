import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кейсы",
  description:
    "Проекты студии maeTtI: сайты, чат-боты, автоматизация и софт — задачи, решения и результаты.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

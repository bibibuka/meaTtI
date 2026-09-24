import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Опишите задачу и напишите нам в Telegram: @maetti_mihail.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

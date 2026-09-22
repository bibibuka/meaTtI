import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Услуги",
  description:
    "Веб-сайты, чат-боты и мини-приложения, автоматизация и интеграции: состав работ, сроки и стоимость.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

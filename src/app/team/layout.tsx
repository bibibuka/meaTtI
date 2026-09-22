import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Команда",
  description:
    "Команда maeTtI: разработчики, инженер аппаратных решений и медиа-специалист.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

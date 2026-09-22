import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Заявка отправлена",
  // Служебная страница после формы — в поиске ей делать нечего.
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

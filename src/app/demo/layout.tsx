import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo — Build Your Website",
  description:
    "Experience the AI-powered website builder. Complete a guided intake flow and get a professionally assembled website preview in minutes.",
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}

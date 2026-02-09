import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview — Your Generated Website",
  description:
    "Preview your AI-assembled website with responsive viewport controls, theme visualization, and export options.",
};

export default function DemoPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}

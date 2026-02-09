import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Complete technical documentation for EasyWebsiteBuild — architecture, component library, theme system, assembly engine, and more.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}

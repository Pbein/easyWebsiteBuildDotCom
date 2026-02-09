import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Component Preview",
  description:
    "Live preview of the EasyWebsiteBuild component library with interactive theme switching and personality vector controls.",
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return <>{children}</>;
}

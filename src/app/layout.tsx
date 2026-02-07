import type { Metadata } from "next";
import { Space_Grotesk, Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/platform/Navbar";
import { Footer } from "@/components/platform/Footer";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "EasyWebsiteBuild — AI-Powered Website Assembly",
  description:
    "Stop choosing templates. Start building with intelligence. EasyWebsiteBuild assembles professional websites from modular components using AI-driven decisions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased noise-bg`}
      >
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

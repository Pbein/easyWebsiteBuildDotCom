"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const HIDDEN_ROUTES = ["/preview"];

export function ConditionalLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const pathname = usePathname();
  const hideChrome = HIDDEN_ROUTES.includes(pathname);

  return (
    <>
      {!hideChrome && <Navbar />}
      <main className="min-h-screen">{children}</main>
      {!hideChrome && <Footer />}
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const HIDDEN_ROUTES = ["/preview", "/demo/preview"];

export function ConditionalLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const pathname = usePathname();
  const hideChrome = HIDDEN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  return (
    <>
      {!hideChrome && <Navbar />}
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      {!hideChrome && <Footer />}
    </>
  );
}

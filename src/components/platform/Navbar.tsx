"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  // { href: "/docs", label: "Docs" }, // Temporarily hidden — will be gated behind Clerk admin auth
];

export function Navbar(): React.ReactElement {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-[var(--color-border)] bg-[var(--color-bg-primary)]/80 backdrop-blur-xl"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] shadow-[var(--shadow-glow)] transition-shadow duration-300 group-hover:shadow-[0_0_60px_rgba(232,168,73,0.25)]">
              <Sparkles className="h-4 w-4 text-[var(--color-bg-primary)]" />
            </div>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <span className="text-[var(--color-text-primary)]">Easy</span>
              <span className="text-[var(--color-accent)]">Website</span>
              <span className="text-[var(--color-text-primary)]">Build</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg border border-[var(--color-border-accent)] bg-[var(--color-accent-glow)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth + CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            {hasClerk && (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="hidden cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors duration-200 hover:text-[var(--color-text-primary)] md:inline-flex">
                      Sign In
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="hidden md:flex">
                    <UserButton
                      appearance={{
                        elements: {
                          avatarBox: "h-8 w-8",
                        },
                      }}
                    />
                  </div>
                </SignedIn>
              </>
            )}
            <Link
              href="/demo"
              className="hidden items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-5 py-2 text-sm font-semibold text-[var(--color-bg-primary)] transition-transform duration-300 hover:scale-[1.02] hover:shadow-[var(--shadow-glow)] md:inline-flex"
            >
              Try the Demo
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[var(--color-bg-primary)]/95 px-6 pt-20 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`rounded-lg px-4 py-3 text-lg font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--color-accent-glow)] text-[var(--color-accent)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {hasClerk && (
                <>
                  <SignedOut>
                    <SignInButton mode="modal">
                      <button
                        onClick={() => setMobileOpen(false)}
                        className="mt-2 w-full cursor-pointer rounded-lg px-4 py-3 text-left text-lg font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
                      >
                        Sign In
                      </button>
                    </SignInButton>
                  </SignedOut>
                  <SignedIn>
                    <div className="mt-2 px-4 py-3">
                      <UserButton
                        appearance={{
                          elements: {
                            avatarBox: "h-9 w-9",
                          },
                        }}
                      />
                    </div>
                  </SignedIn>
                </>
              )}
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] px-5 py-3 text-center text-base font-semibold text-[var(--color-bg-primary)]"
              >
                Try the Demo
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

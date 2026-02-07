"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/demo", label: "Demo" },
  { href: "/docs", label: "Docs" },
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] flex items-center justify-center shadow-[var(--shadow-glow)] transition-shadow duration-300 group-hover:shadow-[0_0_60px_rgba(232,168,73,0.25)]">
              <Sparkles className="w-4 h-4 text-[var(--color-bg-primary)]" />
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
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "text-[var(--color-accent)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-lg bg-[var(--color-accent-glow)] border border-[var(--color-border-accent)]"
                      style={{ zIndex: -1 }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/demo"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)] hover:shadow-[var(--shadow-glow)] transition-all duration-300 hover:scale-[1.02]"
            >
              Try the Demo
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            className="fixed inset-0 z-40 bg-[var(--color-bg-primary)]/95 backdrop-blur-xl pt-20 px-6 md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`px-4 py-3 text-lg font-medium rounded-lg transition-colors ${
                      isActive
                        ? "text-[var(--color-accent)] bg-[var(--color-accent-glow)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/demo"
                onClick={() => setMobileOpen(false)}
                className="mt-4 text-center px-5 py-3 text-base font-semibold rounded-lg bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-dim)] text-[var(--color-bg-primary)]"
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

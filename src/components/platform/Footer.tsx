import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Demo", href: "/demo" },
    { label: "Pricing", href: "#" },
  ],
  Resources: [
    { label: "Component Library", href: "/preview" },
    { label: "Sample Site", href: "/preview" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Careers", href: "#" },
  ],
};

export function Footer(): React.ReactElement {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)]">
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
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-[var(--color-text-tertiary)]">
              AI-powered website assembly that learns and improves with every site built. Not
              templates — intelligent, modular composition.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="mb-4 text-sm font-semibold tracking-wider text-[var(--color-text-primary)] uppercase"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-tertiary)] transition-colors duration-200 hover:text-[var(--color-accent)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border-light)] pt-8 sm:flex-row">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} EasyWebsiteBuild. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-[var(--color-text-secondary)]"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

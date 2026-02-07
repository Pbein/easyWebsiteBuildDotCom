import Link from "next/link";
import { Sparkles } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Demo", href: "/demo" },
    { label: "Documentation", href: "/docs" },
    { label: "Roadmap", href: "/docs#roadmap" },
    { label: "Pricing", href: "#" },
  ],
  Resources: [
    { label: "Architecture", href: "/docs#architecture" },
    { label: "Component Library", href: "/docs#component-library" },
    { label: "Theme System", href: "/docs#theme-system" },
    { label: "Assembly Engine", href: "/docs#assembly-engine" },
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
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-accent-dim)] flex items-center justify-center">
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
            </div>
            <p className="text-[var(--color-text-tertiary)] text-sm leading-relaxed max-w-sm">
              AI-powered website assembly that learns and improves with every site built.
              Not templates — intelligent, modular composition.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] transition-colors duration-200"
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
        <div className="mt-16 pt-8 border-t border-[var(--color-border-light)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-text-tertiary)]">
            &copy; {new Date().getFullYear()} EasyWebsiteBuild. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

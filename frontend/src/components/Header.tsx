import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";

const navLinks = [
  { label: "होम", href: "#home" },
  { label: "हमारे बारे में", href: "#about" },
  { label: "गतिविधियाँ", href: "#activities" },
  { label: "दान करें", href: "#donate" },
  { label: "संपर्क", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 shadow-md" style={{ background: "oklch(0.24 0.09 15)" }}>
      {/* Warm gold accent bar */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, oklch(0.64 0.08 45), oklch(0.84 0.07 85), oklch(0.64 0.08 45))" }} />

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "oklch(0.84 0.07 85)" }}>
            <img
              src="/assets/generated/foundation-logo.dim_300x300.png"
              alt="Foundation Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-serif font-bold text-base leading-tight" style={{ color: "oklch(0.84 0.07 85)" }}>
              गौसिया अशरफिया फाउंडेशन
            </div>
            <div className="text-xs font-display tracking-widest uppercase" style={{ color: "oklch(0.74 0.06 45)" }}>
              Gausia Ashrafia Foundation
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{ color: "oklch(0.90 0.03 45)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
              onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.90 0.03 45)")}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            className="ml-3 flex items-center gap-1.5 px-4 py-2 rounded font-semibold text-sm transition-colors"
            style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.84 0.07 85)")}
            onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.64 0.08 45)")}
          >
            <Heart className="w-4 h-4" />
            दान करें
          </a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded transition-colors"
          style={{ color: "oklch(0.90 0.03 45)" }}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ background: "oklch(0.20 0.08 15)", borderColor: "oklch(0.30 0.10 15)" }}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded text-sm font-medium transition-colors"
              style={{ color: "oklch(0.90 0.03 45)" }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded font-semibold text-sm"
            style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
            onClick={() => setMenuOpen(false)}
          >
            <Heart className="w-4 h-4" />
            दान करें
          </a>
        </div>
      )}
    </header>
  );
}

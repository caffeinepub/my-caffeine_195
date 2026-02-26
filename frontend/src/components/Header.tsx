import { useState } from "react";
import { Menu, X, Heart, ShieldCheck, Search, Images, FileText, MapPin } from "lucide-react";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "होम", href: "#home" },
  { label: "हमारे बारे में", href: "#about" },
  { label: "गतिविधियाँ", href: "#activities" },
  { label: "दान करें", href: "#donate" },
  { label: "गैलेरी", href: "#gallery" },
  { label: "सरकारी योजनाएं", href: "#government-schemes" },
  { label: "हमसे जुड़े गाँव", href: "#villages" },
  { label: "सदस्यता", href: "#membership" },
  { label: "सहायता", href: "#assistance" },
  { label: "संपर्क", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    // If it's a hash route (like #/admin), just set the hash directly
    if (href.startsWith('#/')) {
      window.location.hash = href.slice(1); // remove leading '#'
      return;
    }
    // For section anchors, scroll to the element
    // First navigate to home if we're on admin route
    if (window.location.hash === '#/admin') {
      window.location.hash = '';
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    window.location.hash = '/admin';
  };

  return (
    <>
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

          {/* Desktop Nav — Admin link is NOT shown here */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-2.5 py-2 rounded text-xs font-medium transition-colors"
                style={{ color: "oklch(0.90 0.03 45)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
                onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.90 0.03 45)")}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
              </a>
            ))}

            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="ml-1 p-2 rounded transition-colors"
              style={{ color: "oklch(0.90 0.03 45)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
              onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.90 0.03 45)")}
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <a
              href="#donate"
              className="ml-2 flex items-center gap-1.5 px-3 py-2 rounded font-semibold text-xs transition-colors"
              style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.84 0.07 85)")}
              onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.64 0.08 45)")}
              onClick={(e) => { e.preventDefault(); handleNavClick("#donate"); }}
            >
              <Heart className="w-4 h-4" />
              दान करें
            </a>
          </nav>

          {/* Mobile: Search + Hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded transition-colors"
              style={{ color: "oklch(0.90 0.03 45)" }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="p-2 rounded transition-colors"
              style={{ color: "oklch(0.90 0.03 45)" }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ background: "oklch(0.20 0.08 15)", borderColor: "oklch(0.30 0.10 15)" }}>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded text-sm font-medium transition-colors flex items-center gap-2"
                style={{ color: "oklch(0.90 0.03 45)" }}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.href === "#gallery" && <Images className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.74 0.06 85)" }} />}
                {link.href === "#government-schemes" && <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.74 0.06 85)" }} />}
                {link.href === "#villages" && <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.74 0.06 85)" }} />}
                {link.label}
              </a>
            ))}

            {/* Admin Link — only in mobile hamburger menu */}
            <a
              href="#/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors border-t mt-1 pt-3"
              style={{ color: "oklch(0.74 0.06 85)", borderColor: "oklch(0.30 0.10 15)" }}
              onClick={handleAdminClick}
            >
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              Admin Panel
            </a>

            <a
              href="#donate"
              className="mt-2 flex items-center justify-center gap-1.5 px-4 py-2 rounded font-semibold text-sm"
              style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
              onClick={(e) => { e.preventDefault(); handleNavClick("#donate"); }}
            >
              <Heart className="w-4 h-4" />
              दान करें
            </a>
          </div>
        )}
      </header>

      {/* Search Bar Overlay */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}

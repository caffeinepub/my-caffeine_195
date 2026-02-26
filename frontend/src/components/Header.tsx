import { useState, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import SearchBar from "./SearchBar";

const navLinks = [
  { label: "होम", href: "#home" },
  { label: "हमारे बारे में", href: "#about" },
  { label: "गतिविधियाँ", href: "#activities" },
  { label: "सरकारी योजनाएं", href: "#schemes" },
  { label: "दान करें", href: "#donation" },
  { label: "सदस्यता", href: "#membership" },
  { label: "सहायता", href: "#assistance" },
  { label: "गैलेरी", href: "#/gallery" },
  { label: "गाँव", href: "#/villages" },
  { label: "संपर्क", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (href.startsWith("#/")) {
      window.location.hash = href.replace("#", "");
    } else if (href.startsWith("#")) {
      const id = href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
        style={{ background: "#632626" }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={e => { e.preventDefault(); handleNavClick("#home"); }}
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/generated/foundation-logo.dim_300x300.png"
              alt="Logo"
              className="w-10 h-10 rounded-full object-cover border-2 transition-transform duration-200 group-hover:scale-110"
              style={{ borderColor: "#dacc96" }}
            />
            <div>
              <div
                className="text-sm font-bold leading-tight"
                style={{ color: "#dacc96", fontFamily: "Noto Serif Devanagari, serif" }}
              >
                गौसिया अशरफिया
              </div>
              <div className="text-xs" style={{ color: "rgba(218,204,150,0.8)" }}>
                फाउंडेशन
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                className="relative px-2 py-1 text-xs font-medium transition-colors duration-200 group"
                style={{ color: "rgba(218,204,150,0.85)" }}
              >
                <span className="relative z-10 group-hover:text-[#dacc96] transition-colors duration-200">
                  {link.label}
                </span>
                <span
                  className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                  style={{ background: "#dacc96" }}
                />
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full transition-all duration-200 hover:scale-110"
              style={{ color: "#dacc96" }}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="lg:hidden p-2 rounded-full transition-all duration-200 hover:scale-110"
              onClick={() => setMenuOpen(v => !v)}
              style={{ color: "#dacc96" }}
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="lg:hidden border-t px-4 py-3 space-y-1"
            style={{ background: "#7a2e2e", borderColor: "#dacc96" }}
          >
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={e => { e.preventDefault(); handleNavClick(link.href); }}
                className="block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
                style={{ color: "#dacc96" }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(218,204,150,0.15)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                {link.label}
              </a>
            ))}
            {/* Admin link — mobile only */}
            <a
              href="#/admin"
              onClick={e => { e.preventDefault(); handleNavClick("#/admin"); }}
              className="block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]"
              style={{ color: "rgba(218,204,150,0.6)" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(218,204,150,0.15)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              🔐 Admin
            </a>
          </div>
        )}
      </header>

      {/* Search Bar — conditionally rendered, uses its own onClose prop */}
      {searchOpen && <SearchBar onClose={() => setSearchOpen(false)} />}
    </>
  );
}

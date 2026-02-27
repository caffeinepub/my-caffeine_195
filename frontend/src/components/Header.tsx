import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ShieldCheck } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  isHash?: boolean;
  isAdmin?: boolean;
}

const navItems: NavItem[] = [
  { label: 'होम', href: '#home', isHash: true },
  { label: 'हमारे बारे में', href: '#about', isHash: true },
  { label: 'गतिविधियाँ', href: '#activities', isHash: true },
  { label: 'सदस्यता', href: '#membership', isHash: true },
  { label: 'दान करें', href: '#donation', isHash: true },
  { label: 'संपर्क', href: '#contact', isHash: true },
  { label: 'जिले', href: '#/districts', isHash: false },
];

interface HeaderProps {
  onSearchOpen?: () => void;
}

export default function Header({ onSearchOpen }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavItem) => {
    setIsMenuOpen(false);
    if (item.isHash) {
      // Smooth scroll to section
      const sectionId = item.href.replace('#', '');
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // If not on home page, navigate to home first
        window.location.hash = '/';
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else {
      window.location.hash = item.href.replace('#', '');
    }
  };

  const handleAdminClick = () => {
    setIsMenuOpen(false);
    window.location.hash = '/admin';
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-maroon-950/95 backdrop-blur-md shadow-lg shadow-maroon-950/20'
          : 'bg-maroon-950/80 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="#/"
            className="flex items-center gap-3 group"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold-400/50 group-hover:border-gold-400 transition-colors">
              <img
                src="/assets/generated/foundation-logo.dim_300x300.png"
                alt="Foundation Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="hidden sm:block">
              <p className="text-gold-300 font-cinzel font-bold text-sm leading-tight">
                Gausiya Ashrafia
              </p>
              <p className="text-cream-400 text-xs font-devanagari">
                गौसिया अशरफिया फाउंडेशन
              </p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className="px-3 py-2 text-cream-300 hover:text-gold-300 font-devanagari text-sm rounded-lg hover:bg-white/5 transition-all"
              >
                {item.label}
              </button>
            ))}
            {/* Admin Panel Button - Desktop */}
            <button
              onClick={handleAdminClick}
              className="ml-1 flex items-center gap-1.5 px-3 py-2 text-gold-400 hover:text-gold-300 border border-gold-500/40 hover:border-gold-400/70 hover:bg-gold-500/10 font-devanagari text-sm rounded-lg transition-all"
              title="Admin Panel"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>प्रशासन</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {onSearchOpen && (
              <button
                onClick={onSearchOpen}
                className="p-2 text-cream-300 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-all"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-cream-300 hover:text-gold-300 hover:bg-white/5 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-maroon-950/98 backdrop-blur-md border-t border-gold-500/10">
          <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavClick(item)}
                className="text-left px-4 py-3 text-cream-300 hover:text-gold-300 font-devanagari text-sm rounded-lg hover:bg-white/5 transition-all"
              >
                {item.label}
              </button>
            ))}
            {/* Admin Panel Button - Mobile */}
            <button
              onClick={handleAdminClick}
              className="text-left flex items-center gap-2 px-4 py-3 text-gold-400 hover:text-gold-300 border border-gold-500/30 hover:border-gold-400/60 hover:bg-gold-500/10 font-devanagari text-sm rounded-lg transition-all mt-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>प्रशासन पैनल (Admin Panel)</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

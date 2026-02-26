import { useState, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

const searchItems = [
  { label: "होम", keywords: ["होम", "home", "मुख्य"], href: "#home" },
  { label: "हमारे बारे में", keywords: ["about", "बारे", "परिचय", "मिशन", "विजन"], href: "#about" },
  { label: "गतिविधियाँ", keywords: ["activities", "गतिविधि", "कार्यक्रम", "events"], href: "#activities" },
  { label: "दान करें", keywords: ["donation", "दान", "upi", "bank", "contribute"], href: "#donate" },
  { label: "गैलेरी", keywords: ["gallery", "गैलेरी", "photos", "फोटो", "images", "तस्वीरें"], href: "#gallery" },
  { label: "सरकारी योजनाएं", keywords: ["government", "scheme", "योजना", "सरकारी", "pm", "ayushman", "scholarship"], href: "#government-schemes" },
  { label: "सदस्यता", keywords: ["membership", "सदस्यता", "join", "member", "register"], href: "#membership" },
  { label: "सहायता", keywords: ["assistance", "सहायता", "help", "मदद", "support"], href: "#assistance" },
  { label: "संपर्क", keywords: ["contact", "संपर्क", "phone", "email", "address"], href: "#contact" },
];

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(searchItems);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults(searchItems);
      return;
    }
    const q = query.toLowerCase();
    setResults(
      searchItems.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.toLowerCase().includes(q))
      )
    );
  }, [query]);

  const handleSelect = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: "oklch(0.99 0.003 60)", border: "1.5px solid oklch(0.84 0.07 85)" }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "oklch(0.86 0.03 45)" }}>
          <Search className="w-5 h-5 flex-shrink-0" style={{ color: "oklch(0.64 0.08 45)" }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="खोजें... (Search sections)"
            className="flex-1 bg-transparent outline-none text-base font-sans"
            style={{ color: "oklch(0.24 0.09 15)" }}
          />
          <button
            onClick={onClose}
            className="p-1 rounded-full transition-colors"
            style={{ color: "oklch(0.50 0.05 30)" }}
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="py-2 max-h-72 overflow-y-auto">
          {results.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm" style={{ color: "oklch(0.55 0.05 30)" }}>
              कोई परिणाम नहीं मिला
            </div>
          ) : (
            results.map((item) => (
              <button
                key={item.href}
                onClick={() => handleSelect(item.href)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:rounded-none"
                style={{ color: "oklch(0.24 0.09 15)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "oklch(0.94 0.010 58)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Search className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.64 0.08 45)" }} />
                <span className="font-medium font-sans">{item.label}</span>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2 border-t text-xs" style={{ borderColor: "oklch(0.86 0.03 45)", color: "oklch(0.60 0.04 45)" }}>
          किसी सेक्शन पर क्लिक करें या ESC दबाएं
        </div>
      </div>
    </div>
  );
}

import { Heart } from "lucide-react";

const quickLinks = [
  { label: "होम", href: "#home" },
  { label: "हमारे बारे में", href: "#about" },
  { label: "गतिविधियाँ", href: "#activities" },
  { label: "दान करें", href: "#donate" },
  { label: "संपर्क", href: "#contact" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "gausia-ashrafia-foundation");

  return (
    <footer style={{ background: "oklch(0.18 0.08 15)" }}>
      {/* Warm gold/tan top border */}
      <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, oklch(0.64 0.08 45), oklch(0.84 0.07 85), oklch(0.64 0.08 45))" }} />

      {/* Pattern overlay */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 pattern-overlay" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: "oklch(0.84 0.07 85)" }}>
                  <img
                    src="/assets/generated/foundation-logo.dim_300x300.png"
                    alt="Foundation Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-sm leading-tight" style={{ color: "oklch(0.84 0.07 85)" }}>
                    गौसिया अशरफिया फाउंडेशन
                  </div>
                  <div className="text-xs font-display tracking-widest uppercase" style={{ color: "oklch(0.64 0.06 45)" }}>
                    Gausia Ashrafia Foundation
                  </div>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "oklch(0.62 0.05 30)" }}>
                जरूरतमंदों की सेवा में समर्पित। शिक्षा, स्वास्थ्य और समाज कल्याण के लिए निरंतर प्रयासरत।
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold font-serif mb-4 text-sm" style={{ color: "oklch(0.84 0.07 85)" }}>
                त्वरित लिंक
              </h4>
              <ul className="space-y-2">
                {quickLinks.map(link => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm transition-colors"
                      style={{ color: "oklch(0.62 0.05 30)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.62 0.05 30)")}
                    >
                      › {link.label}
                    </a>
                  </li>
                ))}
                {/* Discreet Admin Link */}
                <li>
                  <a
                    href="#/admin"
                    className="text-xs transition-colors opacity-40 hover:opacity-70"
                    style={{ color: "oklch(0.62 0.05 30)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.62 0.05 30)")}
                  >
                    › Admin
                  </a>
                </li>
              </ul>
            </div>

            {/* Quranic Quote */}
            <div>
              <h4 className="font-bold font-serif mb-4 text-sm" style={{ color: "oklch(0.84 0.07 85)" }}>
                कुरआनी आयत
              </h4>
              <div className="rounded-lg p-4 border" style={{ background: "oklch(0.22 0.09 15)", borderColor: "oklch(0.32 0.09 15)" }}>
                <p className="text-base text-right font-serif mb-2 leading-loose" style={{ color: "oklch(0.80 0.05 45)" }}>
                  وَأَحْسِنُوا إِنَّ اللَّهَ يُحِبُّ الْمُحْسِنِينَ
                </p>
                <p className="text-xs italic" style={{ color: "oklch(0.56 0.05 30)" }}>
                  "और भलाई करो, बेशक अल्लाह भलाई करने वालों से मुहब्बत करता है।" — सूरह बकरा: 195
                </p>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs" style={{ borderColor: "oklch(0.28 0.08 15)" }}>
            <p style={{ color: "oklch(0.50 0.05 25)" }}>
              © {year} गौसिया अशरफिया फाउंडेशन। सर्वाधिकार सुरक्षित।
            </p>
            <p className="flex items-center gap-1" style={{ color: "oklch(0.50 0.05 25)" }}>
              Built with <Heart className="w-3 h-3 inline" style={{ color: "oklch(0.64 0.08 45)" }} /> using{" "}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline transition-colors"
                style={{ color: "oklch(0.84 0.07 85)" }}
                onMouseEnter={e => (e.currentTarget.style.color = "oklch(0.64 0.08 45)")}
                onMouseLeave={e => (e.currentTarget.style.color = "oklch(0.84 0.07 85)")}
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

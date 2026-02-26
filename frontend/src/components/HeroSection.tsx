export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-[520px] flex items-center justify-center overflow-hidden"
      style={{ background: "oklch(0.24 0.09 15)" }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
      />
      {/* Dark maroon overlay */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(135deg, oklch(0.18 0.09 15 / 0.90) 0%, oklch(0.26 0.10 12 / 0.82) 100%)" }}
      />
      {/* Pattern overlay */}
      <div className="absolute inset-0 pattern-overlay" />

      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-16">
        {/* Bismillah */}
        <div className="text-2xl mb-4 font-serif" style={{ color: "oklch(0.84 0.07 85)" }}>
          ﷽
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-6" />

        {/* Foundation name */}
        <h1 className="text-3xl md:text-5xl font-bold font-serif mb-2 leading-tight" style={{ color: "oklch(0.97 0.006 60)" }}>
          गौसिया अशरफिया फाउंडेशन
        </h1>
        <div className="text-lg md:text-xl font-display tracking-widest uppercase mb-5" style={{ color: "oklch(0.84 0.07 85)" }}>
          Gausia Ashrafia Foundation
        </div>

        {/* Since 2011 tagline badge */}
        <div className="flex items-center justify-center gap-3 mb-5">
          <span
            className="h-px flex-1 max-w-[60px]"
            style={{ background: "oklch(0.84 0.07 85 / 0.6)" }}
          />
          <span
            className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full text-sm md:text-base font-semibold font-serif tracking-wide border"
            style={{
              color: "oklch(0.84 0.07 85)",
              borderColor: "oklch(0.84 0.07 85 / 0.55)",
              background: "oklch(0.18 0.08 15 / 0.55)",
              textShadow: "0 1px 6px oklch(0.10 0.05 15 / 0.5)",
            }}
          >
            ✦ 2011 से कौम की खिदमत में ✦
          </span>
          <span
            className="h-px flex-1 max-w-[60px]"
            style={{ background: "oklch(0.84 0.07 85 / 0.6)" }}
          />
        </div>

        {/* Gold divider */}
        <div className="gold-divider mb-6" />

        {/* Tagline */}
        <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: "oklch(0.88 0.04 45)" }}>
          जरूरतमंदों की सेवा में समर्पित — शिक्षा, स्वास्थ्य और समाज कल्याण के लिए
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#donate"
            className="px-8 py-3 rounded font-bold text-base transition-colors shadow-gold"
            style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.84 0.07 85)")}
            onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.64 0.08 45)")}
          >
            ❤️ दान करें
          </a>
          <a
            href="#about"
            className="px-8 py-3 rounded font-bold text-base transition-colors border-2"
            style={{ borderColor: "oklch(0.84 0.07 85)", color: "oklch(0.84 0.07 85)", background: "transparent" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "oklch(0.84 0.07 85)";
              e.currentTarget.style.color = "oklch(0.18 0.06 15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "oklch(0.84 0.07 85)";
            }}
          >
            हमारे बारे में जानें
          </a>
        </div>
      </div>
    </section>
  );
}

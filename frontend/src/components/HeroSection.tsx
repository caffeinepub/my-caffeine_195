import React, { useEffect, useRef, useState } from 'react';

export default function HeroSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
      />

      {/* Overlay with shimmer */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, rgba(99,38,38,0.92) 0%, rgba(99,38,38,0.75) 50%, rgba(60,20,20,0.92) 100%)',
        }}
      />

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(218,204,150,0.3) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
          animation: 'shimmer 4s ease-in-out infinite',
        }}
      />

      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/assets/generated/pattern-bg.dim_800x400.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '400px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Bismillah */}
        <div
          className="text-2xl md:text-3xl mb-4 transition-all duration-700"
          style={{
            color: '#dacc96',
            fontFamily: 'Noto Serif Devanagari, serif',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '0ms',
          }}
        >
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </div>

        {/* Divider */}
        <div
          className="flex items-center justify-center gap-3 mb-6 transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transitionDelay: '150ms',
          }}
        >
          <div className="h-px w-20" style={{ background: '#dacc96' }} />
          <span style={{ color: '#dacc96' }}>✦</span>
          <div className="h-px w-20" style={{ background: '#dacc96' }} />
        </div>

        {/* Foundation Name Hindi */}
        <h1
          className="text-4xl md:text-6xl font-bold mb-2 transition-all duration-700"
          style={{
            color: '#fff',
            fontFamily: 'Noto Serif Devanagari, serif',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '300ms',
          }}
        >
          गौसिया अशरफिया
        </h1>
        <h2
          className="text-3xl md:text-5xl font-bold mb-6 transition-all duration-700"
          style={{
            color: '#dacc96',
            fontFamily: 'Noto Serif Devanagari, serif',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transitionDelay: '450ms',
          }}
        >
          फाउंडेशन
        </h2>

        {/* Badge */}
        <div
          className="inline-block px-5 py-2 rounded-full text-sm font-semibold mb-8 transition-all duration-700"
          style={{
            background: 'rgba(218,204,150,0.2)',
            border: '1px solid #dacc96',
            color: '#dacc96',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.8)',
            transitionDelay: '600ms',
          }}
        >
          ✨ 2011 से कौम की खिदमत में ✨
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(40px)',
            transitionDelay: '750ms',
          }}
        >
          <button
            onClick={() => scrollToSection('donation')}
            className="px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: '#dacc96',
              color: '#632626',
              boxShadow: '0 4px 15px rgba(218,204,150,0.4)',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 6px 25px rgba(218,204,150,0.7)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px rgba(218,204,150,0.4)';
            }}
          >
            💝 दान करें
          </button>
          <button
            onClick={() => scrollToSection('membership')}
            className="px-8 py-3 rounded-full font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{
              background: 'transparent',
              border: '2px solid #dacc96',
              color: '#dacc96',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(218,204,150,0.15)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            🤝 सदस्य बनें
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700"
        style={{
          opacity: visible ? 1 : 0,
          transitionDelay: '1000ms',
          animation: 'bounce 2s infinite',
        }}
      >
        <div className="w-6 h-10 rounded-full border-2 flex items-start justify-center pt-2" style={{ borderColor: '#dacc96' }}>
          <div className="w-1 h-2 rounded-full" style={{ background: '#dacc96', animation: 'scrollDot 1.5s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% -200%; }
          100% { background-position: 200% 200%; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes scrollDot {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
      `}</style>
    </section>
  );
}

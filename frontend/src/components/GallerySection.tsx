import React, { useRef, useEffect } from 'react';
import { useGetGalleryEvents } from '../hooks/useQueries';
import { Loader2, ImageOff } from 'lucide-react';

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function GallerySection() {
  const sectionRef = useScrollAnimation();
  const { data: events, isLoading } = useGetGalleryEvents();

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-16 scroll-animate"
      style={{ background: '#fdf6e3' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
          >
            गैलेरी
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
            <span className="text-xl" style={{ color: '#dacc96' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin w-8 h-8" style={{ color: '#632626' }} />
          </div>
        ) : !events || events.length === 0 ? (
          <div className="text-center py-16">
            <ImageOff className="w-12 h-12 mx-auto mb-4" style={{ color: '#dacc96' }} />
            <p className="text-lg" style={{ color: '#8b6914' }}>
              अभी तक कोई फोटो नहीं जोड़ी गई
            </p>
            <p className="text-sm mt-1 text-gray-500">
              एडमिन पैनल से गैलरी में फोटो जोड़ें
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {events.map(event => (
              <div
                key={event.id.toString()}
                className="bg-white rounded-2xl shadow-md overflow-hidden border"
                style={{ borderColor: '#dacc96' }}
              >
                {event.images.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 p-1">
                    {event.images.map(img => (
                      <div key={img.id.toString()} className="relative overflow-hidden rounded-lg aspect-square group">
                        <img
                          src={img.imageData}
                          alt={img.caption || event.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {img.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                    इस इवेंट में कोई फोटो नहीं
                  </div>
                )}
                <div className="px-5 py-4 border-t" style={{ borderColor: '#dacc96' }}>
                  <h3 className="font-bold text-lg" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
                    {event.title}
                  </h3>
                  {event.subtitle && (
                    <p className="text-sm mt-0.5" style={{ color: '#8b6914' }}>{event.subtitle}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

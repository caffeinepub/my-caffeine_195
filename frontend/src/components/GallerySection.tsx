import { useRef, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import GalleryImageWithFallback from './GalleryImageWithFallback';

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

// Static gallery images from assets
const galleryImages = [
  { src: '/assets/generated/gallery-event-1.dim_600x400.jpg', caption: 'फाउंडेशन कार्यक्रम' },
  { src: '/assets/generated/gallery-event-2.dim_600x400.jpg', caption: 'सामुदायिक सेवा' },
  { src: '/assets/generated/gallery-event-3.dim_600x400.jpg', caption: 'शिक्षा अभियान' },
  { src: '/assets/generated/gallery-event-4.dim_600x400.jpg', caption: 'स्वास्थ्य शिविर' },
  { src: '/assets/generated/gallery-event-5.dim_600x400.jpg', caption: 'युवा सम्मेलन' },
  { src: '/assets/generated/gallery-event-6.dim_600x400.jpg', caption: 'महिला सशक्तिकरण' },
  { src: '/assets/generated/gallery-admin-meet-1.dim_800x600.png', caption: 'प्रशासनिक बैठक' },
  { src: '/assets/generated/gallery-admin-meet-2.dim_800x450.png', caption: 'वार्षिक सम्मेलन' },
  { src: '/assets/generated/gallery-admin-meet-3.dim_800x450.png', caption: 'कार्यकारिणी बैठक' },
  { src: '/assets/generated/gallery-admin-meet-4.dim_800x450.png', caption: 'विशेष कार्यक्रम' },
];

export default function GallerySection() {
  const sectionRef = useScrollAnimation();

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
          <p className="mt-4 text-sm" style={{ color: '#8b6914', fontFamily: 'Noto Sans Devanagari, sans-serif' }}>
            हमारी गतिविधियों और कार्यक्रमों की झलकियाँ
          </p>
        </div>

        {/* Gallery Grid */}
        {galleryImages.length === 0 ? (
          <div className="text-center py-16">
            <ImageOff className="w-12 h-12 mx-auto mb-4" style={{ color: '#dacc96' }} />
            <p className="text-lg" style={{ color: '#8b6914' }}>
              अभी तक कोई फोटो नहीं जोड़ी गई
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-xl aspect-square group border"
                style={{ borderColor: '#dacc96' }}
              >
                <GalleryImageWithFallback
                  src={img.src}
                  alt={img.caption}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ fontFamily: 'Noto Sans Devanagari, sans-serif' }}
                >
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

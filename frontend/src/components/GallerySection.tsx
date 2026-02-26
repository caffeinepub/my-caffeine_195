import { MapPin, Calendar } from 'lucide-react';

const adminMeetPhotos = [
  {
    src: '/assets/generated/gallery-admin-meet-1.dim_1200x800.png',
    alt: 'एडमिन पैनल मीटिंग – उपस्थित सदस्य (1)',
  },
  {
    src: '/assets/generated/gallery-admin-meet-2.dim_1200x800.png',
    alt: 'एडमिन पैनल मीटिंग – उपस्थित सदस्य (2)',
  },
  {
    src: '/assets/generated/gallery-admin-meet-3.dim_1200x800.png',
    alt: 'एडमिन पैनल मीटिंग – बड़ा समूह',
  },
  {
    src: '/assets/generated/gallery-admin-meet-4.dim_1200x800.png',
    alt: 'एडमिन पैनल मीटिंग – प्रेजेंटेशन स्लाइड',
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-16 px-4" style={{ background: 'oklch(0.97 0.005 60)' }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">गैलेरी</h2>
          <div className="gold-divider" />
        </div>

        {/* Event Card */}
        <div className="bg-white rounded-2xl shadow-card border border-maroon-200 overflow-hidden">
          {/* Card Header */}
          <div className="bg-maroon-700 px-6 py-5">
            <h3 className="text-xl md:text-2xl font-bold text-gold-300 font-serif mb-2">
              एडमिन पैनल मीटिंग – 21 सितंबर 2025
            </h3>
            <div className="flex flex-wrap gap-4 text-gold-400 text-sm">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                21 सितंबर 2025
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                मुंबरा (ठाणे), महाराष्ट्र, भारत
              </span>
            </div>
          </div>

          {/* Image Grid */}
          <div className="p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {adminMeetPhotos.map((photo, index) => (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-xl border border-maroon-100 shadow-sm"
                >
                  <div className="aspect-[3/4] md:aspect-[4/3] overflow-hidden bg-maroon-50">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-maroon-900/0 group-hover:bg-maroon-900/20 transition-colors duration-300 rounded-xl" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

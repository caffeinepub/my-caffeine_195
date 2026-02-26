const galleryItems = [
  {
    src: "/assets/generated/gallery-event-1.dim_600x400.jpg",
    caption: "सामुदायिक भोज कार्यक्रम",
  },
  {
    src: "/assets/generated/gallery-event-2.dim_600x400.jpg",
    caption: "शिक्षा सहायता वितरण",
  },
  {
    src: "/assets/generated/gallery-event-3.dim_600x400.jpg",
    caption: "मेडिकल कैंप",
  },
  {
    src: "/assets/generated/gallery-event-4.dim_600x400.jpg",
    caption: "वार्षिक जलसा",
  },
  {
    src: "/assets/generated/gallery-event-5.dim_600x400.jpg",
    caption: "राहत सामग्री वितरण",
  },
  {
    src: "/assets/generated/gallery-event-6.dim_600x400.jpg",
    caption: "युवा करियर गाइडेंस",
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="py-16 px-4" style={{ background: "oklch(0.97 0.005 60)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">गैलेरी</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-2xl mx-auto">
            हमारे कार्यक्रमों और सेवाओं की झलकियाँ — हर तस्वीर एक कहानी कहती है।
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl overflow-hidden border shadow-card hover:shadow-card-hover transition-all duration-300"
              style={{ background: "oklch(0.99 0.003 60)", borderColor: "oklch(0.86 0.03 45)" }}
            >
              <div className="relative overflow-hidden h-52">
                <img
                  src={item.src}
                  alt={item.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      parent.style.background = "oklch(0.88 0.04 30)";
                      parent.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:oklch(0.50 0.05 30);font-size:0.85rem;">तस्वीर उपलब्ध नहीं</div>`;
                    }
                  }}
                />
                {/* Overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
                  style={{ background: "linear-gradient(to top, oklch(0.18 0.09 15 / 0.85), transparent)" }}
                >
                  <p className="px-4 pb-4 text-sm font-medium" style={{ color: "oklch(0.84 0.07 85)" }}>
                    {item.caption}
                  </p>
                </div>
              </div>
              {/* Caption below */}
              <div
                className="px-4 py-3 border-t"
                style={{ borderColor: "oklch(0.90 0.03 45)" }}
              >
                <p className="text-sm font-medium font-sans" style={{ color: "oklch(0.30 0.08 15)" }}>
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

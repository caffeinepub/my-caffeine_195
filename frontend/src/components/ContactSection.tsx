import { useState, useRef, useEffect } from "react";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { useAddContactInquiry } from "@/hooks/useQueries";

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

const CONTACT_INFO = {
  address: "गौसिया अशरफिया फाउंडेशन, उत्तर प्रदेश, भारत",
  phone: "+91 XXXXX XXXXX",
  email: "info@gausiyaashrafia.org",
};

export default function ContactSection() {
  const sectionRef = useScrollAnimation();
  const addInquiry = useAddContactInquiry();

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "कृपया अपना नाम दर्ज करें।";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = "कृपया वैध ईमेल दर्ज करें।";
    if (!form.message.trim()) errs.message = "कृपया संदेश लिखें।";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addInquiry.mutateAsync({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      // handled by mutation
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 px-4 scroll-animate"
      style={{ background: "oklch(0.97 0.006 60)" }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">संपर्क करें</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-xl mx-auto">
            किसी भी जानकारी या सहायता के लिए हमसे संपर्क करें।
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold font-serif mb-6" style={{ color: "oklch(0.30 0.10 15)" }}>
              संपर्क जानकारी
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex gap-3 items-start">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.03 30)" }}
                >
                  <MapPin className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>पता</div>
                  <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{CONTACT_INFO.address}</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.03 30)" }}
                >
                  <Phone className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>फोन</div>
                  <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{CONTACT_INFO.phone}</div>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "oklch(0.93 0.03 30)" }}
                >
                  <Mail className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                </div>
                <div>
                  <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>ईमेल</div>
                  <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{CONTACT_INFO.email}</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3" style={{ color: "oklch(0.40 0.06 20)" }}>
                सोशल मीडिया
              </h4>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "oklch(0.93 0.03 30)", color: "oklch(0.46 0.10 15)" }}
                  aria-label="Facebook"
                >
                  <SiFacebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "oklch(0.93 0.03 30)", color: "oklch(0.46 0.10 15)" }}
                  aria-label="Instagram"
                >
                  <SiInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-lg font-bold font-serif mb-6" style={{ color: "oklch(0.30 0.10 15)" }}>
              संदेश भेजें
            </h3>

            {submitted ? (
              <div
                className="rounded-xl p-6 border text-center"
                style={{ background: "oklch(0.93 0.06 145 / 0.15)", borderColor: "oklch(0.60 0.10 145)" }}
              >
                <div className="text-3xl mb-2">✅</div>
                <p className="font-semibold" style={{ color: "oklch(0.30 0.10 145)" }}>
                  संदेश सफलतापूर्वक भेजा गया!
                </p>
                <p className="text-sm mt-1" style={{ color: "oklch(0.45 0.08 145)" }}>
                  हम जल्द आपसे संपर्क करेंगे।
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-sm underline"
                  style={{ color: "oklch(0.46 0.10 15)" }}
                >
                  एक और संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "oklch(0.30 0.08 15)" }}>
                    नाम <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="आपका नाम"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.name ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.name && <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "oklch(0.30 0.08 15)" }}>
                    ईमेल <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="आपका ईमेल"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.email ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.email && <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.email}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "oklch(0.30 0.08 15)" }}>
                    फोन{" "}
                    <span className="text-xs font-normal" style={{ color: "oklch(0.60 0.04 45)" }}>
                      (वैकल्पिक)
                    </span>
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="आपका फोन नंबर"
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: "oklch(0.80 0.04 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium" style={{ color: "oklch(0.30 0.08 15)" }}>
                    संदेश <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="आपका संदेश..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors resize-none"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.message ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.message && <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={addInquiry.isPending}
                  className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "oklch(0.24 0.09 15)", color: "oklch(0.84 0.07 85)" }}
                >
                  {addInquiry.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      भेजा जा रहा है...
                    </>
                  ) : (
                    "संदेश भेजें"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

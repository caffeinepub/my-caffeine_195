import { useState } from "react";
import { MapPin, Phone, Mail, Loader2 } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { useGetFoundationInfo, useAddContactInquiry } from "@/hooks/useQueries";

export default function ContactSection() {
  const { data: info } = useGetFoundationInfo();
  const addInquiry = useAddContactInquiry();

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
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
      await addInquiry.mutateAsync(form);
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    } catch {
      // handled by mutation
    }
  };

  return (
    <section id="contact" className="py-16 px-4" style={{ background: "oklch(0.97 0.006 60)" }}>
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
              {info?.address && (
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.93 0.03 30)" }}>
                    <MapPin className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>पता</div>
                    <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{info.address}</div>
                  </div>
                </div>
              )}
              {info?.phone && (
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.93 0.03 30)" }}>
                    <Phone className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>फोन</div>
                    <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{info.phone}</div>
                  </div>
                </div>
              )}
              {info?.email && (
                <div className="flex gap-3 items-start">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "oklch(0.93 0.03 30)" }}>
                    <Mail className="w-4 h-4" style={{ color: "oklch(0.46 0.10 15)" }} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "oklch(0.50 0.05 30)" }}>ईमेल</div>
                    <div className="text-sm" style={{ color: "oklch(0.30 0.07 18)" }}>{info.email}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Media */}
            <div>
              <div className="text-sm font-semibold mb-3" style={{ color: "oklch(0.50 0.05 30)" }}>सोशल मीडिया</div>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "oklch(0.46 0.10 15)", color: "oklch(0.97 0.006 60)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.64 0.08 45)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.46 0.10 15)")}
                >
                  <SiFacebook className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "oklch(0.46 0.10 15)", color: "oklch(0.97 0.006 60)" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "oklch(0.64 0.08 45)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "oklch(0.46 0.10 15)")}
                >
                  <SiInstagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitted ? (
              <div className="rounded-xl p-8 text-center border" style={{ background: "oklch(0.93 0.03 30)", borderColor: "oklch(0.84 0.07 85)" }}>
                <div className="text-4xl mb-4">✉️</div>
                <h3 className="text-lg font-bold font-serif mb-2" style={{ color: "oklch(0.24 0.09 15)" }}>
                  संदेश भेजा गया!
                </h3>
                <p style={{ color: "oklch(0.35 0.06 20)" }}>
                  हम जल्द ही आपसे संपर्क करेंगे।
                </p>
                <button
                  className="mt-4 px-5 py-2 rounded font-semibold text-sm transition-colors"
                  style={{ background: "oklch(0.46 0.10 15)", color: "oklch(0.97 0.006 60)" }}
                  onClick={() => setSubmitted(false)}
                >
                  नया संदेश भेजें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.35 0.06 20)" }}>
                    नाम *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="आपका नाम"
                    className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.name ? "oklch(0.55 0.22 25)" : "oklch(0.86 0.03 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.name && <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.22 25)" }}>{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.35 0.06 20)" }}>
                    ईमेल *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="आपका ईमेल"
                    className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.email ? "oklch(0.55 0.22 25)" : "oklch(0.86 0.03 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.email && <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.22 25)" }}>{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.35 0.06 20)" }}>
                    संदेश *
                  </label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="आपका संदेश..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors resize-none"
                    style={{
                      background: "oklch(0.99 0.003 60)",
                      borderColor: errors.message ? "oklch(0.55 0.22 25)" : "oklch(0.86 0.03 45)",
                      color: "oklch(0.20 0.06 15)",
                    }}
                  />
                  {errors.message && <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.22 25)" }}>{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={addInquiry.isPending}
                  className="w-full py-3 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                  style={{ background: "oklch(0.46 0.10 15)", color: "oklch(0.97 0.006 60)" }}
                  onMouseEnter={e => { if (!addInquiry.isPending) (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.30 0.10 15)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.46 0.10 15)"; }}
                >
                  {addInquiry.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> भेजा जा रहा है...</>
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

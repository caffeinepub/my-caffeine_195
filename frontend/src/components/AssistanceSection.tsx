import { useState, useRef, useEffect } from "react";
import { HandHeart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAddAssistanceRequest } from "@/hooks/useQueries";

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

interface FormState {
  name: string;
  mobile: string;
  address: string;
  requestType: string;
  description: string;
}

const initialForm: FormState = {
  name: "",
  mobile: "",
  address: "",
  requestType: "",
  description: "",
};

export default function AssistanceSection() {
  const sectionRef = useScrollAnimation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const addAssistanceRequest = useAddAssistanceRequest();

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = "पूरा नाम आवश्यक है";
    if (!form.mobile.trim()) {
      newErrors.mobile = "मोबाइल नंबर आवश्यक है";
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = "10 अंकों का मोबाइल नंबर दर्ज करें";
    }
    if (!form.address.trim()) newErrors.address = "पता आवश्यक है";
    if (!form.requestType.trim()) newErrors.requestType = "सहायता का प्रकार आवश्यक है";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    addAssistanceRequest.mutate(
      {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
        requestType: form.requestType.trim(),
        description: form.description.trim(),
      },
      {
        onSuccess: () => {
          toast.success("आपका सहायता अनुरोध सफलतापूर्वक दर्ज हो गया! हम जल्द संपर्क करेंगे। 🤲");
          setForm(initialForm);
          setErrors({});
        },
        onError: () => {
          toast.error("कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।");
        },
      }
    );
  }

  return (
    <section
      id="assistance"
      ref={sectionRef}
      className="py-16 px-4 scroll-animate"
      style={{ background: "oklch(0.94 0.010 58)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">सहायता अनुरोध फार्म</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-xl mx-auto">
            यदि आपको किसी प्रकार की सहायता की आवश्यकता है, तो नीचे दिया गया फार्म भरें। हम आपसे जल्द संपर्क करेंगे।
          </p>
        </div>

        {/* Form Card */}
        <div
          className="rounded-2xl p-8 border shadow-card"
          style={{
            background: "oklch(0.99 0.003 60)",
            borderColor: "oklch(0.86 0.03 45)",
          }}
        >
          {/* Card Header */}
          <div
            className="flex items-center gap-3 mb-6 pb-4 border-b"
            style={{ borderColor: "oklch(0.86 0.03 45)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: "oklch(0.45 0.12 25)" }}
            >
              <HandHeart className="w-5 h-5" style={{ color: "oklch(0.95 0.04 80)" }} />
            </div>
            <div>
              <h3 className="font-bold font-serif text-lg" style={{ color: "oklch(0.24 0.09 15)" }}>
                सहायता के लिए आवेदन
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.55 0.05 30)" }}>
                नीचे दी गई जानकारी भरें
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="asst-name" style={{ color: "oklch(0.30 0.08 15)" }}>
                पूरा नाम <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="asst-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="अपना पूरा नाम लिखें"
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.name ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.name && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.name}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="asst-mobile" style={{ color: "oklch(0.30 0.08 15)" }}>
                मोबाइल नंबर <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="asst-mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 अंकों का मोबाइल नंबर"
                maxLength={10}
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.mobile ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.mobile && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.mobile}</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <Label htmlFor="asst-address" style={{ color: "oklch(0.30 0.08 15)" }}>
                पता <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="asst-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="अपना पूरा पता लिखें"
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.address ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.address && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.address}</p>
              )}
            </div>

            {/* Request Type */}
            <div className="space-y-1.5">
              <Label htmlFor="asst-requestType" style={{ color: "oklch(0.30 0.08 15)" }}>
                सहायता का प्रकार <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="asst-requestType"
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
                placeholder="जैसे: शिक्षा, चिकित्सा, आर्थिक सहायता..."
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.requestType ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.requestType && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.requestType}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="asst-description" style={{ color: "oklch(0.30 0.08 15)" }}>
                विवरण{" "}
                <span className="text-xs font-normal" style={{ color: "oklch(0.60 0.04 45)" }}>
                  (वैकल्पिक)
                </span>
              </Label>
              <Textarea
                id="asst-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="अपनी समस्या या आवश्यकता का विस्तृत विवरण लिखें..."
                rows={4}
                className="border focus-visible:ring-1 resize-none"
                style={{
                  borderColor: "oklch(0.80 0.04 45)",
                }}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={addAssistanceRequest.isPending}
              className="w-full font-semibold text-base py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "oklch(0.45 0.12 25)",
                color: "oklch(0.95 0.04 80)",
              }}
            >
              {addAssistanceRequest.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  दर्ज हो रहा है...
                </>
              ) : (
                "सहायता अनुरोध भेजें"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

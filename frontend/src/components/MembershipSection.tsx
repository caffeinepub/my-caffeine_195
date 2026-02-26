import { useState, useRef, useEffect } from "react";
import { UserPlus, Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddMembership } from "@/hooks/useQueries";

function useScrollAnimation() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("animate-in");
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
  fullName: string;
  mobile: string;
  email: string;
  city: string;
  aadhaar: string;
}

const initialForm: FormState = {
  fullName: "",
  mobile: "",
  email: "",
  city: "",
  aadhaar: "",
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

function FileUploadField({
  id,
  label,
  file,
  error,
  onFileChange,
  onClear,
}: {
  id: string;
  label: string;
  file: File | null;
  error?: string;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
    e.target.value = "";
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} style={{ color: "oklch(0.30 0.08 15)" }}>
        {label}{" "}
        <span className="text-xs font-normal" style={{ color: "oklch(0.60 0.04 45)" }}>
          (वैकल्पिक)
        </span>
      </Label>

      {file ? (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg border"
          style={{
            borderColor: error ? "oklch(0.50 0.18 25)" : "oklch(0.70 0.06 85)",
            background: "oklch(0.96 0.01 85)",
          }}
        >
          <FileText className="w-4 h-4 flex-shrink-0" style={{ color: "oklch(0.40 0.08 45)" }} />
          <span className="text-sm flex-1 truncate" style={{ color: "oklch(0.30 0.08 15)" }}>
            {file.name}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="flex-shrink-0 p-0.5 rounded-full transition-colors"
            style={{ color: "oklch(0.50 0.18 25)" }}
            aria-label="फ़ाइल हटाएं"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed transition-all duration-200 text-sm hover:scale-[1.01]"
          style={{
            borderColor: error ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
            color: "oklch(0.50 0.06 45)",
            background: "oklch(0.98 0.003 60)",
          }}
        >
          <Upload className="w-4 h-4 flex-shrink-0" />
          <span>फ़ाइल चुनें (JPG, PNG, PDF — अधिकतम 2MB)</span>
        </button>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="hidden"
        onChange={handleChange}
      />

      {error && (
        <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export default function MembershipSection() {
  const sectionRef = useScrollAnimation();
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [files, setFiles] = useState<{ addressProof: File | null; identityProof: File | null }>({
    addressProof: null,
    identityProof: null,
  });
  const [fileErrors, setFileErrors] = useState<{ addressProof?: string; identityProof?: string }>({});
  const addMembership = useAddMembership();

  function validateFile(file: File | null): string | undefined {
    if (!file) return undefined;
    if (!ACCEPTED_TYPES.includes(file.type)) return "केवल JPG, PNG, या PDF फ़ाइल स्वीकार्य है";
    if (file.size > MAX_SIZE_BYTES) return "फ़ाइल का आकार 2MB से कम होना चाहिए";
    return undefined;
  }

  function handleFileChange(field: "addressProof" | "identityProof", file: File | null) {
    setFiles(prev => ({ ...prev, [field]: file }));
    setFileErrors(prev => ({ ...prev, [field]: validateFile(file) }));
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.fullName.trim()) newErrors.fullName = "पूरा नाम आवश्यक है";
    if (!form.mobile.trim()) {
      newErrors.mobile = "मोबाइल नंबर आवश्यक है";
    } else if (!/^\d{10}$/.test(form.mobile.trim())) {
      newErrors.mobile = "10 अंकों का मोबाइल नंबर दर्ज करें";
    }
    if (!form.city.trim()) newErrors.city = "शहर/पता आवश्यक है";
    if (!form.aadhaar.trim()) {
      newErrors.aadhaar = "आधार नंबर आवश्यक है";
    } else if (!/^\d{12}$/.test(form.aadhaar.trim())) {
      newErrors.aadhaar = "12 अंकों का आधार नंबर दर्ज करें";
    }

    const newFileErrors: { addressProof?: string; identityProof?: string } = {};
    if (files.addressProof) {
      const err = validateFile(files.addressProof);
      if (err) newFileErrors.addressProof = err;
    }
    if (files.identityProof) {
      const err = validateFile(files.identityProof);
      if (err) newFileErrors.identityProof = err;
    }

    setErrors(newErrors);
    setFileErrors(newFileErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newFileErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    let addressProof = "";
    let identityProof = "";

    try {
      if (files.addressProof) addressProof = await fileToBase64(files.addressProof);
      if (files.identityProof) identityProof = await fileToBase64(files.identityProof);
    } catch {
      toast.error("फ़ाइल प्रोसेस करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।");
      return;
    }

    addMembership.mutate(
      {
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim(),
        city: form.city.trim(),
        aadhaar: form.aadhaar.trim(),
        addressProof,
        identityProof,
      },
      {
        onSuccess: () => {
          toast.success("सदस्यता सफलतापूर्वक दर्ज हो गई! जज़ाकल्लाह खैर 🌙");
          setForm(initialForm);
          setErrors({});
          setFiles({ addressProof: null, identityProof: null });
          setFileErrors({});
        },
        onError: () => {
          toast.error("कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।");
        },
      }
    );
  }

  return (
    <section
      id="membership"
      ref={sectionRef}
      className="py-16 px-4 scroll-animate"
      style={{ background: "oklch(0.97 0.006 60)" }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="ornament">✦ ✦ ✦</div>
          <h2 className="section-heading mb-3">सदस्यता फार्म</h2>
          <div className="gold-divider" />
          <p className="section-subheading mt-4 max-w-xl mx-auto">
            गौसिया अशरफिया फाउंडेशन का हिस्सा बनें और समाज सेवा में अपना योगदान दें।
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
              style={{ background: "oklch(0.24 0.09 15)" }}
            >
              <UserPlus className="w-5 h-5" style={{ color: "oklch(0.84 0.07 85)" }} />
            </div>
            <div>
              <h3 className="font-bold font-serif text-lg" style={{ color: "oklch(0.24 0.09 15)" }}>
                सदस्यता पंजीकरण
              </h3>
              <p className="text-xs" style={{ color: "oklch(0.55 0.05 30)" }}>
                नीचे दी गई जानकारी भरें
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-fullName" style={{ color: "oklch(0.30 0.08 15)" }}>
                पूरा नाम <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-fullName"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="अपना पूरा नाम लिखें"
                className="border focus-visible:ring-1"
                style={{ borderColor: errors.fullName ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)" }}
              />
              {errors.fullName && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-mobile" style={{ color: "oklch(0.30 0.08 15)" }}>
                मोबाइल नंबर <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="10 अंकों का मोबाइल नंबर"
                maxLength={10}
                className="border focus-visible:ring-1"
                style={{ borderColor: errors.mobile ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)" }}
              />
              {errors.mobile && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.mobile}</p>
              )}
            </div>

            {/* Email (optional) */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-email" style={{ color: "oklch(0.30 0.08 15)" }}>
                ईमेल{" "}
                <span className="text-xs font-normal" style={{ color: "oklch(0.60 0.04 45)" }}>
                  (वैकल्पिक)
                </span>
              </Label>
              <Input
                id="mem-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="आपका ईमेल पता (यदि हो)"
                className="border focus-visible:ring-1"
                style={{ borderColor: "oklch(0.80 0.04 45)" }}
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-city" style={{ color: "oklch(0.30 0.08 15)" }}>
                शहर / पता <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-city"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="अपना शहर या पता लिखें"
                className="border focus-visible:ring-1"
                style={{ borderColor: errors.city ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)" }}
              />
              {errors.city && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.city}</p>
              )}
            </div>

            {/* Aadhaar */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-aadhaar" style={{ color: "oklch(0.30 0.08 15)" }}>
                आधार नंबर <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-aadhaar"
                name="aadhaar"
                value={form.aadhaar}
                onChange={handleChange}
                placeholder="12 अंकों का आधार नंबर"
                maxLength={12}
                className="border focus-visible:ring-1"
                style={{ borderColor: errors.aadhaar ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)" }}
              />
              {errors.aadhaar && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.aadhaar}</p>
              )}
            </div>

            {/* Address Proof */}
            <FileUploadField
              id="mem-addressProof"
              label="पता प्रमाण"
              file={files.addressProof}
              error={fileErrors.addressProof}
              onFileChange={f => handleFileChange("addressProof", f)}
              onClear={() => handleFileChange("addressProof", null)}
            />

            {/* Identity Proof */}
            <FileUploadField
              id="mem-identityProof"
              label="पहचान प्रमाण"
              file={files.identityProof}
              error={fileErrors.identityProof}
              onFileChange={f => handleFileChange("identityProof", f)}
              onClear={() => handleFileChange("identityProof", null)}
            />

            {/* Submit */}
            <Button
              type="submit"
              disabled={addMembership.isPending}
              className="w-full font-semibold text-base py-5 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
              style={{
                background: "oklch(0.24 0.09 15)",
                color: "oklch(0.84 0.07 85)",
              }}
            >
              {addMembership.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  दर्ज हो रहा है...
                </>
              ) : (
                "सदस्यता आवेदन करें"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

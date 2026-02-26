import { useState, useRef } from "react";
import { UserPlus, Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAddMembership } from "@/hooks/useQueries";
import { ExternalBlob } from "@/backend";

interface FormState {
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  aadhaarNumber: string;
}

interface FileState {
  addressProof: File | null;
  identityProof: File | null;
}

interface FileErrors {
  addressProof?: string;
  identityProof?: string;
}

const initialForm: FormState = {
  fullName: "",
  mobileNumber: "",
  email: "",
  city: "",
  aadhaarNumber: "",
};

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_SIZE_MB = 2;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

function fileToExternalBlob(file: File): Promise<ExternalBlob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      resolve(ExternalBlob.fromBytes(uint8Array));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function FileUploadField({
  id,
  label,
  required,
  file,
  error,
  onFileChange,
  onClear,
}: {
  id: string;
  label: string;
  required?: boolean;
  file: File | null;
  error?: string;
  onFileChange: (file: File | null) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    onFileChange(selected);
    // Reset input so same file can be re-selected after clearing
    e.target.value = "";
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} style={{ color: "oklch(0.30 0.08 15)" }}>
        {label}{" "}
        {required ? (
          <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
        ) : (
          <span className="text-xs font-normal" style={{ color: "oklch(0.60 0.04 45)" }}>
            (वैकल्पिक)
          </span>
        )}
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
          className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border-2 border-dashed transition-colors text-sm"
          style={{
            borderColor: error ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
            color: "oklch(0.50 0.06 45)",
            background: "oklch(0.98 0.003 60)",
          }}
        >
          <Upload className="w-4 h-4 flex-shrink-0" />
          <span>फ़ाइल चुनें (JPG, PNG, PDF — अधिकतम {MAX_SIZE_MB}MB)</span>
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
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [files, setFiles] = useState<FileState>({ addressProof: null, identityProof: null });
  const [fileErrors, setFileErrors] = useState<FileErrors>({});
  const addMembership = useAddMembership();

  function validateFile(file: File | null, fieldName: string): string | undefined {
    if (!file) return undefined;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "केवल JPG, PNG, या PDF फ़ाइल स्वीकार्य है";
    }
    if (file.size > MAX_SIZE_BYTES) {
      return `फ़ाइल का आकार ${MAX_SIZE_MB}MB से कम होना चाहिए`;
    }
    return undefined;
  }

  function handleFileChange(field: keyof FileState, file: File | null) {
    setFiles((prev) => ({ ...prev, [field]: file }));
    const err = validateFile(file, field);
    setFileErrors((prev) => ({ ...prev, [field]: err }));
  }

  function clearFile(field: keyof FileState) {
    setFiles((prev) => ({ ...prev, [field]: null }));
    setFileErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.fullName.trim()) newErrors.fullName = "पूरा नाम आवश्यक है";
    if (!form.mobileNumber.trim()) {
      newErrors.mobileNumber = "मोबाइल नंबर आवश्यक है";
    } else if (!/^\d{10}$/.test(form.mobileNumber.trim())) {
      newErrors.mobileNumber = "10 अंकों का मोबाइल नंबर दर्ज करें";
    }
    if (!form.city.trim()) newErrors.city = "शहर/पता आवश्यक है";
    if (!form.aadhaarNumber.trim()) {
      newErrors.aadhaarNumber = "आधार नंबर आवश्यक है";
    } else if (!/^\d{12}$/.test(form.aadhaarNumber.trim())) {
      newErrors.aadhaarNumber = "12 अंकों का आधार नंबर दर्ज करें";
    }

    const newFileErrors: FileErrors = {};
    if (files.addressProof) {
      const err = validateFile(files.addressProof, "addressProof");
      if (err) newFileErrors.addressProof = err;
    }
    if (files.identityProof) {
      const err = validateFile(files.identityProof, "identityProof");
      if (err) newFileErrors.identityProof = err;
    }

    setErrors(newErrors);
    setFileErrors(newFileErrors);
    return Object.keys(newErrors).length === 0 && Object.keys(newFileErrors).length === 0;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    let addressProofBlob: ExternalBlob | null = null;
    let identityProofBlob: ExternalBlob | null = null;

    try {
      if (files.addressProof) {
        addressProofBlob = await fileToExternalBlob(files.addressProof);
      }
      if (files.identityProof) {
        identityProofBlob = await fileToExternalBlob(files.identityProof);
      }
    } catch {
      toast.error("फ़ाइल प्रोसेस करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।");
      return;
    }

    addMembership.mutate(
      {
        fullName: form.fullName.trim(),
        mobileNumber: form.mobileNumber.trim(),
        email: form.email.trim() || null,
        city: form.city.trim(),
        aadhaarNumber: form.aadhaarNumber.trim(),
        addressProofFile: addressProofBlob,
        identityProofFile: identityProofBlob,
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
    <section id="membership" className="py-16 px-4" style={{ background: "oklch(0.97 0.006 60)" }}>
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
                style={{
                  borderColor: errors.fullName ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.fullName && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-mobileNumber" style={{ color: "oklch(0.30 0.08 15)" }}>
                मोबाइल नंबर <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-mobileNumber"
                name="mobileNumber"
                type="tel"
                value={form.mobileNumber}
                onChange={handleChange}
                placeholder="10 अंकों का मोबाइल नंबर"
                maxLength={10}
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.mobileNumber ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.mobileNumber && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.mobileNumber}</p>
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

            {/* City / Address */}
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
                style={{
                  borderColor: errors.city ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.city && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.city}</p>
              )}
            </div>

            {/* Aadhaar Number */}
            <div className="space-y-1.5">
              <Label htmlFor="mem-aadhaarNumber" style={{ color: "oklch(0.30 0.08 15)" }}>
                आधार नंबर <span style={{ color: "oklch(0.50 0.18 25)" }}>*</span>
              </Label>
              <Input
                id="mem-aadhaarNumber"
                name="aadhaarNumber"
                type="text"
                inputMode="numeric"
                value={form.aadhaarNumber}
                onChange={handleChange}
                placeholder="12 अंकों का आधार नंबर"
                maxLength={12}
                className="border focus-visible:ring-1"
                style={{
                  borderColor: errors.aadhaarNumber ? "oklch(0.50 0.18 25)" : "oklch(0.80 0.04 45)",
                }}
              />
              {errors.aadhaarNumber && (
                <p className="text-xs" style={{ color: "oklch(0.50 0.18 25)" }}>{errors.aadhaarNumber}</p>
              )}
            </div>

            {/* Divider */}
            <div
              className="border-t pt-4"
              style={{ borderColor: "oklch(0.86 0.03 45)" }}
            >
              <p className="text-sm font-medium mb-4" style={{ color: "oklch(0.40 0.08 15)" }}>
                दस्तावेज़ अपलोड करें
              </p>

              {/* Address Proof */}
              <div className="mb-4">
                <FileUploadField
                  id="mem-addressProof"
                  label="पता प्रमाण (Address Proof)"
                  file={files.addressProof}
                  error={fileErrors.addressProof}
                  onFileChange={(f) => handleFileChange("addressProof", f)}
                  onClear={() => clearFile("addressProof")}
                />
              </div>

              {/* Identity Proof */}
              <FileUploadField
                id="mem-identityProof"
                label="पहचान प्रमाण (Identity Proof)"
                file={files.identityProof}
                error={fileErrors.identityProof}
                onFileChange={(f) => handleFileChange("identityProof", f)}
                onClear={() => clearFile("identityProof")}
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={addMembership.isPending}
              className="w-full font-semibold text-base py-5 rounded-xl transition-all"
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
                "सदस्यता दर्ज करें"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

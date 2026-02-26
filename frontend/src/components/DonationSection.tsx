import { useState } from "react";
import { Heart, Loader2, Copy, Check, Building2, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { useAddDonation } from "@/hooks/useQueries";
import { copyToClipboard } from "@/utils/clipboard";

const presetAmounts = [101, 251, 501, 1001, 2501, 5001];

const UPI_ID = "76800701@ubin";
const BANK_DETAILS = [
  { label: "ACCOUNT NAME", value: "Gausiya Ashrafiya Foundation" },
  { label: "ACCOUNT NO.", value: "353901010037412" },
  { label: "IFSC CODE", value: "UBIN0535397" },
];

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      toast.success(`${label} कॉपी हो गया!`);
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("कॉपी नहीं हो सका। कृपया मैन्युअली कॉपी करें।");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all border"
      style={{
        background: copied ? "oklch(0.64 0.08 45)" : "oklch(0.32 0.09 15)",
        borderColor: copied ? "oklch(0.64 0.08 45)" : "oklch(0.46 0.10 15)",
        color: copied ? "oklch(0.18 0.06 15)" : "oklch(0.84 0.07 85)",
      }}
      title={`${label} कॉपी करें`}
    >
      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function DonationSection() {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ name?: string; amount?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const addDonation = useAddDonation();

  const validate = () => {
    const errs: { name?: string; amount?: string } = {};
    if (!name.trim()) errs.name = "कृपया अपना नाम दर्ज करें।";
    const amt = Number(amount);
    if (!amount || isNaN(amt) || amt <= 0) errs.amount = "कृपया वैध राशि दर्ज करें।";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addDonation.mutateAsync({ donorName: name, amount: BigInt(Number(amount)), message });
      setSubmitted(true);
      setName(""); setAmount(""); setMessage("");
    } catch {
      // error handled by mutation
    }
  };

  return (
    <section id="donate" className="py-16 px-4" style={{ background: "oklch(0.24 0.09 15)" }}>
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <div className="ornament" style={{ color: "oklch(0.84 0.07 85)" }}>✦ ✦ ✦</div>
          <h2 className="text-2xl md:text-3xl font-bold font-serif mb-3" style={{ color: "oklch(0.97 0.006 60)" }}>
            दान करें
          </h2>
          <div className="gold-divider" />
          <p className="mt-4 text-sm md:text-base" style={{ color: "oklch(0.80 0.05 45)" }}>
            आपका दान किसी की जिंदगी बदल सकता है। हर छोटी मदद मायने रखती है।
          </p>
        </div>

        {/* UPI + Bank Details Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* UPI QR Code Panel */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ background: "oklch(0.28 0.09 15)", borderColor: "oklch(0.38 0.10 15)" }}
          >
            {/* Panel Header */}
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ background: "oklch(0.32 0.09 15)", borderBottom: "1px solid oklch(0.38 0.10 15)" }}
            >
              <Smartphone className="w-5 h-5" style={{ color: "oklch(0.84 0.07 85)" }} />
              <span className="font-bold text-sm tracking-wide" style={{ color: "oklch(0.84 0.07 85)" }}>
                UPI से दान करें
              </span>
            </div>

            <div className="p-5 flex flex-col items-center">
              {/* QR Code Image - full official bank QR */}
              <div className="rounded-2xl overflow-hidden shadow-lg mb-4 w-full max-w-[260px] border-2" style={{ borderColor: "oklch(0.46 0.10 15)" }}>
                <img
                  src="/assets/generated/upi-qr-code.dim_500x600.png"
                  alt="UPI QR Code - Scan to Pay - GAUSIYA ASHRAFIA FOUNDATION"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Copyable UPI ID */}
              <div
                className="w-full flex items-center justify-between gap-3 rounded-lg px-4 py-3 border"
                style={{ background: "oklch(0.22 0.08 15)", borderColor: "oklch(0.46 0.10 15)" }}
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: "oklch(0.70 0.06 45)" }}>
                    UPI ID
                  </p>
                  <p className="font-bold text-sm" style={{ color: "oklch(0.93 0.015 60)" }}>
                    {UPI_ID}
                  </p>
                </div>
                <CopyButton value={UPI_ID} label="UPI ID" />
              </div>

              {/* Supported Apps */}
              <p className="text-xs mt-4 text-center" style={{ color: "oklch(0.70 0.06 45)" }}>
                Paytm, Google Pay, PhonePe या किसी भी UPI ऐप से स्कैन करें
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
                {["Paytm", "GPay", "PhonePe", "VYOM"].map((app) => (
                  <span
                    key={app}
                    className="text-xs px-2.5 py-1 rounded-full border font-semibold"
                    style={{ borderColor: "oklch(0.46 0.10 15)", color: "oklch(0.84 0.07 85)", background: "oklch(0.30 0.09 15)" }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bank Details Card */}
          <div
            className="rounded-xl overflow-hidden border"
            style={{ background: "oklch(0.28 0.09 15)", borderColor: "oklch(0.38 0.10 15)" }}
          >
            {/* Card Header */}
            <div
              className="px-5 py-3 flex items-center gap-2"
              style={{ background: "oklch(0.32 0.09 15)", borderBottom: "1px solid oklch(0.38 0.10 15)" }}
            >
              <Building2 className="w-5 h-5" style={{ color: "oklch(0.84 0.07 85)" }} />
              <span className="font-bold text-sm tracking-wide" style={{ color: "oklch(0.84 0.07 85)" }}>
                बैंक डिटेल्स
              </span>
            </div>

            <div className="p-5 flex flex-col gap-0">
              {BANK_DETAILS.map((item, idx) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-3 py-4"
                  style={{
                    borderBottom: idx < BANK_DETAILS.length - 1 ? "1px solid oklch(0.34 0.09 15)" : "none",
                  }}
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "oklch(0.70 0.06 45)" }}>
                      {item.label}
                    </p>
                    <p className="font-bold text-sm break-all" style={{ color: "oklch(0.93 0.015 60)" }}>
                      {item.value}
                    </p>
                  </div>
                  <CopyButton value={item.value} label={item.label} />
                </div>
              ))}
            </div>

            {/* Union Bank branding note */}
            <div
              className="mx-5 mb-5 rounded-lg px-4 py-3 text-center"
              style={{ background: "oklch(0.22 0.08 15)", border: "1px solid oklch(0.38 0.10 15)" }}
            >
              <p className="text-xs font-semibold" style={{ color: "oklch(0.84 0.07 85)" }}>
                🏦 Union Bank of India
              </p>
              <p className="text-xs mt-0.5" style={{ color: "oklch(0.70 0.06 45)" }}>
                NEFT / RTGS / IMPS द्वारा भी दान करें
              </p>
            </div>
          </div>
        </div>

        {/* Dua text */}
        <p className="text-center text-sm mb-8 italic" style={{ color: "oklch(0.80 0.05 45)" }}>
          अल्लाह आपके सदके को क़बूल फ़रमाए और आपको जज़ा-ए-खैर दे। आमीन।
        </p>

        {/* Donation Form */}
        {submitted ? (
          <div className="rounded-xl p-8 text-center border" style={{ background: "oklch(0.28 0.09 15)", borderColor: "oklch(0.84 0.07 85)" }}>
            <div className="text-4xl mb-4">🤲</div>
            <h3 className="text-xl font-bold font-serif mb-2" style={{ color: "oklch(0.84 0.07 85)" }}>
              जज़ाकल्लाह खैर!
            </h3>
            <p style={{ color: "oklch(0.88 0.04 45)" }}>
              आपका दान स्वीकार किया गया। अल्लाह आपको इसका बेहतरीन बदला दे।
            </p>
            <button
              className="mt-6 px-6 py-2 rounded font-semibold transition-colors"
              style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
              onClick={() => setSubmitted(false)}
            >
              और दान करें
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl p-6 md:p-8 border"
            style={{ background: "oklch(0.28 0.09 15)", borderColor: "oklch(0.38 0.10 15)" }}
          >
            <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: "oklch(0.84 0.07 85)" }}>
              <Heart className="w-4 h-4" />
              ऑनलाइन फॉर्म से दान करें
            </h3>

            {/* Preset amounts */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3" style={{ color: "oklch(0.80 0.05 45)" }}>
                राशि चुनें (₹)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {presetAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(String(amt))}
                    className="py-2 px-3 rounded text-sm font-semibold border transition-colors"
                    style={
                      amount === String(amt)
                        ? { background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)", borderColor: "oklch(0.64 0.08 45)" }
                        : { background: "transparent", color: "oklch(0.88 0.04 45)", borderColor: "oklch(0.46 0.10 15)" }
                    }
                  >
                    ₹{amt.toLocaleString("hi-IN")}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.80 0.05 45)" }}>
                आपका नाम *
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="अपना नाम लिखें"
                className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors"
                style={{
                  background: "oklch(0.20 0.08 15)",
                  borderColor: errors.name ? "oklch(0.55 0.22 25)" : "oklch(0.46 0.10 15)",
                  color: "oklch(0.93 0.015 60)",
                }}
              />
              {errors.name && <p className="text-xs mt-1" style={{ color: "oklch(0.72 0.18 25)" }}>{errors.name}</p>}
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.80 0.05 45)" }}>
                दान राशि (₹) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="राशि दर्ज करें"
                min={1}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors"
                style={{
                  background: "oklch(0.20 0.08 15)",
                  borderColor: errors.amount ? "oklch(0.55 0.22 25)" : "oklch(0.46 0.10 15)",
                  color: "oklch(0.93 0.015 60)",
                }}
              />
              {errors.amount && <p className="text-xs mt-1" style={{ color: "oklch(0.72 0.18 25)" }}>{errors.amount}</p>}
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-1" style={{ color: "oklch(0.80 0.05 45)" }}>
                संदेश (वैकल्पिक)
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="कोई संदेश लिखें..."
                rows={3}
                className="w-full px-4 py-2.5 rounded border text-sm outline-none transition-colors resize-none"
                style={{
                  background: "oklch(0.20 0.08 15)",
                  borderColor: "oklch(0.46 0.10 15)",
                  color: "oklch(0.93 0.015 60)",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={addDonation.isPending}
              className="w-full py-3 rounded font-bold text-base flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              style={{ background: "oklch(0.64 0.08 45)", color: "oklch(0.18 0.06 15)" }}
              onMouseEnter={e => { if (!addDonation.isPending) (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.84 0.07 85)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "oklch(0.64 0.08 45)"; }}
            >
              {addDonation.isPending ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> प्रक्रिया हो रही है...</>
              ) : (
                <><Heart className="w-5 h-5" /> दान करें</>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Building2, QrCode, X, ZoomIn } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

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

const UPI_ID = '76800701@ubin';
const UPI_NAME = 'GAUSIYA+ASHRAFIA+FOUNDATION';
const ACCOUNT_NAME = 'Gausiya Ashrafiya Foundation';
const ACCOUNT_NO = '353901010037412';
const IFSC = 'UBIN0535397';
const BANK_NAME = 'Union Bank of India';

const presetAmounts = [100, 251, 500, 1001, 2100, 5000];

// UPI deep-link base URL
const UPI_DEEP_LINK = `upi://pay?pa=${UPI_ID}&pn=${UPI_NAME}&cu=INR`;

// UPI app configurations
const UPI_APPS = [
  {
    name: 'GPay',
    color: '#4285F4',
    svgIcon: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="white"/>
        <text x="24" y="30" textAnchor="middle" fontSize="20" fontWeight="900" fontFamily="'Product Sans',Arial,sans-serif">
          <tspan fill="#4285F4">G</tspan>
        </text>
      </svg>
    ),
    deepLink: `${UPI_DEEP_LINK}`,
  },
  {
    name: 'PhonePe',
    color: '#5f259f',
    svgIcon: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="24" fill="#5f259f"/>
        <text x="24" y="30" textAnchor="middle" fontSize="16" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">Pe</text>
      </svg>
    ),
    deepLink: `${UPI_DEEP_LINK}`,
  },
  {
    name: 'Paytm',
    color: '#00BAF2',
    svgIcon: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00BAF2"/>
        <text x="24" y="30" textAnchor="middle" fontSize="11" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">Paytm</text>
      </svg>
    ),
    deepLink: `${UPI_DEEP_LINK}`,
  },
  {
    name: 'BHIM',
    color: '#00529C',
    svgIcon: (
      <svg viewBox="0 0 48 48" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="10" fill="#00529C"/>
        <text x="24" y="22" textAnchor="middle" fontSize="9" fontWeight="900" fontFamily="Arial,sans-serif" fill="white">BHIM</text>
        <text x="24" y="34" textAnchor="middle" fontSize="7" fontFamily="Arial,sans-serif" fill="#FF9933">UPI</text>
      </svg>
    ),
    deepLink: `${UPI_DEEP_LINK}`,
  },
];

// Static QR Code Modal — shows the UPI QR image for users to scan with their UPI app
function QRCodeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm w-full p-0 overflow-hidden rounded-2xl" style={{ background: '#fff' }}>
        <DialogHeader className="px-5 pt-5 pb-3" style={{ background: '#632626' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-white" />
              <DialogTitle className="text-white font-bold text-base">
                UPI QR Code से दान करें
              </DialogTitle>
            </div>
            <DialogClose asChild>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                aria-label="बंद करें"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center px-5 py-5 gap-4">
          {/* Bilingual instruction */}
          <div
            className="w-full rounded-xl px-4 py-3 text-center"
            style={{ background: '#fdf6e3', border: '1.5px solid #dacc96' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
              दान करने के लिए अपना UPI ऐप खोलें और इस QR कोड को स्कैन करें
            </p>
            <p className="text-xs mt-1" style={{ color: '#8a6a2a' }}>
              Open your UPI app and scan this QR code to donate
            </p>
          </div>

          {/* Static QR Code Image */}
          <div className="relative">
            <img
              src="/assets/generated/upi-qr-code.dim_500x600.png"
              alt="UPI QR Code – Gausiya Ashrafiya Foundation"
              className="rounded-xl shadow-lg"
              style={{
                width: '280px',
                height: '280px',
                objectFit: 'contain',
                border: '3px solid #c0392b',
                imageRendering: 'crisp-edges',
                background: '#fff',
              }}
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.dataset.fallback) {
                  target.dataset.fallback = '1';
                  target.src = '/assets/generated/upi-qr-code.dim_400x500.png';
                } else if (target.dataset.fallback === '1') {
                  target.dataset.fallback = '2';
                  target.src = '/assets/generated/upi-qr-76800701-ubin.dim_400x400.png';
                }
              }}
            />
          </div>

          {/* UPI ID below QR */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl w-full justify-center"
            style={{ background: '#f5f5f5', border: '1.5px solid #dacc96' }}
          >
            <span className="text-sm font-bold" style={{ color: '#222' }}>
              UPI ID:&nbsp;<span style={{ color: '#1565c0' }}>{UPI_ID}</span>
            </span>
          </div>

          <p className="text-xs text-center" style={{ color: '#8a6a2a' }}>
            GPay, PhonePe, Paytm, BHIM या किसी भी UPI ऐप से स्कैन करें
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// UPI App Button component
function UpiAppButton({ app }: { app: typeof UPI_APPS[0] }) {
  const handleClick = () => {
    window.location.href = app.deepLink;
    setTimeout(() => {
      toast.info(`${app.name} ऐप नहीं खुली? कृपया ऐप इंस्टॉल करें या UPI ID से भुगतान करें।`, { duration: 4000 });
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 border-2"
      style={{
        background: `${app.color}15`,
        borderColor: `${app.color}40`,
      }}
      title={`${app.name} से भुगतान करें`}
    >
      <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-sm" style={{ background: app.color }}>
        {app.svgIcon}
      </div>
      <span className="text-xs font-bold" style={{ color: app.color }}>
        {app.name}
      </span>
    </button>
  );
}

export default function DonationSection() {
  const sectionRef = useScrollAnimation();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAccName, setCopiedAccName] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ name: '', message: '', upiTransactionId: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const handleCopy = async (text: string, setter: (v: boolean) => void) => {
    const ok = await copyToClipboard(text);
    if (ok) {
      setter(true);
      setTimeout(() => setter(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount || selectedAmount;
    if (!amount || !form.name.trim()) {
      toast.error('कृपया नाम और राशि भरें');
      return;
    }
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('दान की जानकारी दर्ज की गई। जज़ाकल्लाह खैर! 💝');
      setForm({ name: '', message: '', upiTransactionId: '' });
      setSelectedAmount('');
      setCustomAmount('');
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="donation"
      ref={sectionRef}
      className="py-16 scroll-animate"
      style={{ background: '#fdf6e3' }}
    >
      {/* Static QR Code Modal */}
      <QRCodeModal open={showQRModal} onClose={() => setShowQRModal(false)} />

      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
          >
            दान करें
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
            <span className="text-xl" style={{ color: '#dacc96' }}>✦</span>
            <div className="h-px w-16" style={{ background: '#dacc96' }} />
          </div>
          <p className="mt-3 text-sm" style={{ color: '#8a6a2a' }}>
            आपका हर दान एक नेक काम में सहयोग है
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Info Column */}
          <div className="space-y-6">

            {/* Official UPI QR Image with "Enlarge" button */}
            <div className="flex flex-col items-center">
              <div className="relative group cursor-pointer" onClick={() => setShowQRModal(true)}>
                <img
                  src="/assets/generated/upi-qr-code.dim_500x600.png"
                  alt="Scan & Pay – UPI QR Code for GAUSIYA ASHRAFIA Foundation"
                  className="w-full max-w-xs mx-auto rounded-2xl shadow-2xl transition-transform duration-200 group-hover:scale-[1.02]"
                  style={{
                    border: '4px solid #c0392b',
                    display: 'block',
                    imageRendering: 'crisp-edges',
                    minHeight: '280px',
                    objectFit: 'contain',
                    background: '#fff',
                  }}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = '1';
                      target.src = '/assets/generated/upi-qr-code.dim_400x500.png';
                    } else if (target.dataset.fallback === '1') {
                      target.dataset.fallback = '2';
                      target.src = '/assets/generated/upi-qr-76800701-ubin.dim_400x400.png';
                    } else if (target.dataset.fallback === '2') {
                      target.dataset.fallback = '3';
                      target.src = '/assets/generated/upi-qr-scanner.dim_400x400.png';
                    }
                  }}
                />
                {/* Overlay hint */}
                <div className="absolute inset-0 flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none rounded-2xl"
                  style={{ background: 'linear-gradient(to top, rgba(99,38,38,0.7) 0%, transparent 60%)' }}>
                  <span className="flex items-center gap-1 text-white text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(99,38,38,0.85)' }}>
                    <ZoomIn className="w-3.5 h-3.5" />
                    बड़ा करके देखें
                  </span>
                </div>
              </div>

              {/* Instruction text below QR */}
              <div className="mt-3 text-center px-2">
                <p className="text-xs font-medium" style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}>
                  अपना UPI ऐप खोलें और इस QR कोड को स्कैन करें
                </p>
                <p className="text-xs mt-0.5" style={{ color: '#8a6a2a' }}>
                  Open your UPI app and scan this QR code to donate
                </p>
              </div>

              {/* Scan QR button */}
              <button
                onClick={() => setShowQRModal(true)}
                className="mt-3 flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95 shadow-md"
                style={{ background: '#632626', color: '#fff' }}
              >
                <QrCode className="w-4 h-4" />
                QR Code देखें / Scan QR
              </button>

              {/* UPI ID copy row below image */}
              <div
                className="mt-3 flex items-center gap-2 px-4 py-2 rounded-xl shadow"
                style={{ background: '#fff', border: '1.5px solid #dacc96' }}
              >
                <span className="text-sm font-bold" style={{ color: '#222' }}>
                  UPI ID:&nbsp;<span style={{ color: '#1565c0' }}>{UPI_ID}</span>
                </span>
                <button
                  onClick={() => handleCopy(UPI_ID, setCopiedUpi)}
                  title="UPI ID कॉपी करें"
                  className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                  style={{ background: '#632626', color: 'white' }}
                >
                  {copiedUpi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              {copiedUpi && (
                <p className="text-xs mt-1" style={{ color: '#2e7d32' }}>✓ UPI ID कॉपी हो गई!</p>
              )}
            </div>

            {/* UPI App Buttons */}
            <div
              className="rounded-2xl p-4 shadow-md"
              style={{ background: '#fff', border: '1.5px solid #dacc96' }}
            >
              <p
                className="text-center text-sm font-bold mb-3"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                किसी भी UPI ऐप से भुगतान करें
              </p>
              <div className="grid grid-cols-4 gap-2">
                {UPI_APPS.map((app) => (
                  <UpiAppButton key={app.name} app={app} />
                ))}
              </div>
            </div>

            {/* Bank Transfer Details */}
            <div
              className="rounded-2xl p-4 shadow-md"
              style={{ background: '#fff', border: '1.5px solid #dacc96' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-5 h-5" style={{ color: '#632626' }} />
                <h3
                  className="font-bold text-base"
                  style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
                >
                  बैंक ट्रांसफर
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'खाताधारक', value: ACCOUNT_NAME, setter: setCopiedAccName, copied: copiedAccName },
                  { label: 'खाता संख्या', value: ACCOUNT_NO, setter: setCopiedAcc, copied: copiedAcc },
                  { label: 'IFSC कोड', value: IFSC, setter: setCopiedIfsc, copied: copiedIfsc },
                  { label: 'बैंक', value: BANK_NAME, setter: setCopiedBank, copied: copiedBank },
                ].map(({ label, value, setter, copied }) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg"
                    style={{ background: '#fdf6e3', border: '1px solid #dacc96' }}
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium" style={{ color: '#8a6a2a' }}>{label}</p>
                      <p className="text-sm font-bold truncate" style={{ color: '#222' }}>{value}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(value, setter)}
                      title={`${label} कॉपी करें`}
                      className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110 flex-shrink-0"
                      style={{ background: '#632626', color: 'white' }}
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Donation Form Column */}
          <div>
            <div
              className="rounded-2xl p-6 shadow-md"
              style={{ background: '#fff', border: '1.5px solid #dacc96' }}
            >
              <h3
                className="text-xl font-bold mb-5 text-center"
                style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
              >
                दान की जानकारी दर्ज करें
              </h3>

              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 gap-4 text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg"
                    style={{ background: '#fdf6e3', border: '3px solid #dacc96' }}
                  >
                    💝
                  </div>
                  <p
                    className="text-lg font-bold"
                    style={{ color: '#632626', fontFamily: 'Noto Serif Devanagari, serif' }}
                  >
                    जज़ाकल्लाह खैर!
                  </p>
                  <p className="text-sm" style={{ color: '#8a6a2a' }}>
                    आपका दान दर्ज हो गया। अल्लाह आपको जज़ा-ए-खैर दे।
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ background: '#632626', color: '#fff' }}
                  >
                    और दान करें
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Preset Amounts */}
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: '#632626' }}>
                      राशि चुनें (₹)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {presetAmounts.map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => { setSelectedAmount(String(amt)); setCustomAmount(''); }}
                          className="py-2 rounded-xl text-sm font-bold transition-all duration-200 hover:scale-105 border-2"
                          style={{
                            background: selectedAmount === String(amt) ? '#632626' : '#fdf6e3',
                            color: selectedAmount === String(amt) ? '#fff' : '#632626',
                            borderColor: selectedAmount === String(amt) ? '#632626' : '#dacc96',
                          }}
                        >
                          ₹{amt.toLocaleString('hi-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#632626' }}>
                      या अपनी राशि लिखें
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-base"
                        style={{ color: '#632626' }}
                      >₹</span>
                      <input
                        type="number"
                        min="1"
                        placeholder="जैसे: 500"
                        value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(''); }}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                        style={{
                          borderColor: customAmount ? '#632626' : '#dacc96',
                          background: '#fdf6e3',
                          color: '#222',
                        }}
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#632626' }}>
                      आपका नाम *
                    </label>
                    <input
                      type="text"
                      placeholder="अपना नाम लिखें"
                      value={form.name}
                      onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{
                        borderColor: form.name ? '#632626' : '#dacc96',
                        background: '#fdf6e3',
                        color: '#222',
                      }}
                    />
                  </div>

                  {/* UPI Transaction ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#632626' }}>
                      UPI Transaction ID (वैकल्पिक)
                    </label>
                    <input
                      type="text"
                      placeholder="जैसे: 123456789012"
                      value={form.upiTransactionId}
                      onChange={(e) => setForm(f => ({ ...f, upiTransactionId: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{
                        borderColor: form.upiTransactionId ? '#632626' : '#dacc96',
                        background: '#fdf6e3',
                        color: '#222',
                      }}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-1" style={{ color: '#632626' }}>
                      संदेश (वैकल्पिक)
                    </label>
                    <textarea
                      placeholder="कोई संदेश लिखें..."
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none transition-all resize-none"
                      style={{
                        borderColor: form.message ? '#632626' : '#dacc96',
                        background: '#fdf6e3',
                        color: '#222',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting || (!selectedAmount && !customAmount) || !form.name.trim()}
                    className="w-full py-3 rounded-xl font-bold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    style={{ background: '#632626', color: '#fff' }}
                  >
                    {submitting ? 'दर्ज हो रहा है...' : '💝 दान दर्ज करें'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

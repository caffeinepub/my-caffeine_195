import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';
import { copyToClipboard } from '../utils/clipboard';
import { useAddDonation } from '../hooks/useQueries';
import { toast } from 'sonner';

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

const UPI_ID = 'gausiyaashrafiya@upi';
const BANK_NAME = 'State Bank of India';
const ACCOUNT_NO = '1234567890';
const IFSC = 'SBIN0001234';

const presetAmounts = [100, 251, 500, 1001, 2100, 5000];

export default function DonationSection() {
  const sectionRef = useScrollAnimation();
  const addDonation = useAddDonation();

  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [form, setForm] = useState({ name: '', message: '', upiTransactionId: '' });

  const handleCopy = async (text: string, setter: (v: boolean) => void) => {
    const ok = await copyToClipboard(text);
    if (ok) { setter(true); setTimeout(() => setter(false), 2000); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = customAmount || selectedAmount;
    if (!amount || !form.name.trim()) {
      toast.error('कृपया नाम और राशि भरें');
      return;
    }
    await addDonation.mutateAsync({ ...form, amount });
    setForm({ name: '', message: '', upiTransactionId: '' });
    setSelectedAmount('');
    setCustomAmount('');
  };

  return (
    <section
      id="donation"
      ref={sectionRef}
      className="py-16 scroll-animate"
      style={{ background: '#fdf6e3' }}
    >
      <div className="max-w-5xl mx-auto px-4">
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
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Info */}
          <div className="space-y-6">
            {/* QR Code */}
            <div
              className="bg-white rounded-2xl p-6 border-2 text-center"
              style={{ borderColor: '#dacc96' }}
            >
              <img
                src="/assets/generated/upi-qr-code.dim_400x500.png"
                alt="UPI QR Code"
                className="w-48 h-48 object-contain mx-auto mb-4"
              />
              <p className="text-sm font-medium mb-2" style={{ color: '#632626' }}>UPI से स्कैन करें</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-sm px-3 py-1 rounded-lg" style={{ background: '#fdf6e3', color: '#632626' }}>
                  {UPI_ID}
                </code>
                <button
                  onClick={() => handleCopy(UPI_ID, setCopiedUpi)}
                  className="p-1.5 rounded-lg transition-all duration-200 hover:scale-110"
                  style={{ background: '#632626', color: 'white' }}
                >
                  {copiedUpi ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Bank Details */}
            <div
              className="bg-white rounded-2xl p-6 border-2"
              style={{ borderColor: '#dacc96' }}
            >
              <h3 className="font-bold mb-4" style={{ color: '#632626' }}>बैंक विवरण</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">बैंक:</span>
                  <span className="font-medium" style={{ color: '#632626' }}>{BANK_NAME}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">खाता नंबर:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#632626' }}>{ACCOUNT_NO}</span>
                    <button onClick={() => handleCopy(ACCOUNT_NO, setCopiedAcc)} className="p-1 rounded transition-all hover:scale-110" style={{ color: '#632626' }}>
                      {copiedAcc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">IFSC:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: '#632626' }}>{IFSC}</span>
                    <button onClick={() => handleCopy(IFSC, setCopiedIfsc)} className="p-1 rounded transition-all hover:scale-110" style={{ color: '#632626' }}>
                      {copiedIfsc ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Donation Form */}
          <div
            className="bg-white rounded-2xl p-6 border-2"
            style={{ borderColor: '#dacc96' }}
          >
            <h3 className="font-bold mb-4" style={{ color: '#632626' }}>दान की जानकारी दर्ज करें</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>आपका नाम *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
                  placeholder="पूरा नाम"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#632626' }}>राशि चुनें *</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {presetAmounts.map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setSelectedAmount(String(amt)); setCustomAmount(''); }}
                      className="py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:scale-105 hover:shadow-md"
                      style={{
                        borderColor: selectedAmount === String(amt) ? '#632626' : '#dacc96',
                        background: selectedAmount === String(amt) ? '#632626' : '#fdf6e3',
                        color: selectedAmount === String(amt) ? 'white' : '#632626',
                      }}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={customAmount}
                  onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(''); }}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
                  placeholder="या अपनी राशि दर्ज करें"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>UPI Transaction ID</label>
                <input
                  type="text"
                  value={form.upiTransactionId}
                  onChange={e => setForm(f => ({ ...f, upiTransactionId: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none"
                  style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
                  placeholder="Transaction ID (वैकल्पिक)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#632626' }}>संदेश</label>
                <textarea
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none resize-none"
                  style={{ borderColor: '#dacc96', background: '#fdf6e3' }}
                  placeholder="कोई संदेश (वैकल्पिक)"
                />
              </div>

              <button
                type="submit"
                disabled={addDonation.isPending}
                className="w-full py-3 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                style={{ background: '#632626' }}
              >
                {addDonation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : '💝'}
                {addDonation.isPending ? 'दर्ज हो रहा है...' : 'दान दर्ज करें'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

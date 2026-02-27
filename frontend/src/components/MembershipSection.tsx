import React, { useState } from 'react';
import { UserPlus, CheckCircle, Phone, Mail, MapPin, User, CreditCard } from 'lucide-react';
import { useAddMembershipApplication } from '../hooks/useQueries';
import { MembershipType } from '../backend';

interface FormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  membershipType: MembershipType | '';
  paymentConfirmed: boolean;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  address: '',
  membershipType: '',
  paymentConfirmed: false,
};

export default function MembershipSection() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const addMembership = useAddMembershipApplication();

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.name.trim()) newErrors.name = 'नाम आवश्यक है / Name is required';
    if (!form.phone.trim()) newErrors.phone = 'फोन नंबर आवश्यक है / Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) newErrors.phone = 'वैध मोबाइल नंबर दर्ज करें / Enter valid mobile number';
    if (!form.address.trim()) newErrors.address = 'पता आवश्यक है / Address is required';
    if (!form.membershipType) newErrors.membershipType = 'सदस्यता प्रकार चुनें / Select membership type';
    if (!form.paymentConfirmed) newErrors.paymentConfirmed = 'भुगतान की पुष्टि करें / Confirm payment';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await addMembership.mutateAsync({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        membershipType: form.membershipType as MembershipType,
        paymentConfirmed: form.paymentConfirmed,
      });
      setSubmitted(true);
      setForm(initialForm);
      setErrors({});
    } catch {
      // Error handled by mutation
    }
  };

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section id="membership" className="py-16 bg-cream-50">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-maroon-100 text-maroon-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <UserPlus className="w-4 h-4" />
            <span className="font-devanagari">सदस्यता</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-cinzel font-bold text-maroon-900 mb-3">
            Join Our Foundation
          </h2>
          <p className="text-xl font-devanagari text-maroon-700 mb-2">
            हमारी फाउंडेशन से जुड़ें
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto">
            गौसिया अशरफिया फाउंडेशन का सदस्य बनकर कौम की खिदमत में भागीदार बनें।
            Be a part of our mission to serve the community.
          </p>
        </div>

        {/* Membership Types Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { type: 'Monthly / मासिक', desc: 'मासिक सदस्यता', color: 'border-teal-200 bg-teal-50', badge: 'bg-teal-100 text-teal-800' },
            { type: 'Yearly / वार्षिक', desc: 'वार्षिक सदस्यता', color: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-800' },
            { type: 'Lifetime / आजीवन', desc: 'आजीवन सदस्यता', color: 'border-purple-200 bg-purple-50', badge: 'bg-purple-100 text-purple-800' },
          ].map((item) => (
            <div key={item.type} className={`rounded-xl border-2 p-4 text-center ${item.color}`}>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${item.badge}`}>
                {item.type}
              </span>
              <p className="text-gray-600 text-sm font-devanagari">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 flex items-start gap-4">
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-800 font-devanagari">आवेदन सफलतापूर्वक जमा हुआ!</h3>
              <p className="text-green-700 text-sm mt-1">
                आपका सदस्यता आवेदन प्राप्त हो गया है। हम जल्द ही आपसे संपर्क करेंगे।
              </p>
              <p className="text-green-600 text-sm">
                Your membership application has been received. We will contact you soon.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 text-green-700 hover:text-green-900 text-sm underline"
              >
                Submit another application
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        {!submitted && (
          <div className="bg-white rounded-2xl border border-maroon-100 shadow-lg p-6 md:p-8">
            <h3 className="text-lg font-semibold text-maroon-900 mb-6 flex items-center gap-2 font-devanagari">
              <UserPlus className="w-5 h-5 text-maroon-600" />
              सदस्यता आवेदन फॉर्म / Membership Application Form
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="font-devanagari">पूरा नाम</span> / Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="अपना पूरा नाम लिखें"
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-maroon-400 focus:ring-maroon-400'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="font-devanagari">मोबाइल नंबर</span> / Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors ${
                      errors.phone ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-maroon-400 focus:ring-maroon-400'
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.phone}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="font-devanagari">ईमेल</span> / Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="your@email.com (optional)"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-maroon-400 focus:ring-1 focus:ring-maroon-400 transition-colors"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="font-devanagari">पता</span> / Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <textarea
                    value={form.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="अपना पूरा पता लिखें / Enter your full address"
                    rows={3}
                    className={`w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors resize-none ${
                      errors.address ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-maroon-400 focus:ring-maroon-400'
                    }`}
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.address}</p>}
              </div>

              {/* Membership Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  <span className="font-devanagari">सदस्यता प्रकार</span> / Membership Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.membershipType}
                  onChange={(e) => handleChange('membershipType', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-colors bg-white ${
                    errors.membershipType ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : 'border-gray-200 focus:border-maroon-400 focus:ring-maroon-400'
                  }`}
                >
                  <option value="">-- सदस्यता प्रकार चुनें / Select Type --</option>
                  <option value={MembershipType.Monthly}>Monthly / मासिक</option>
                  <option value={MembershipType.Yearly}>Yearly / वार्षिक</option>
                  <option value={MembershipType.Lifetime}>Lifetime / आजीवन</option>
                </select>
                {errors.membershipType && <p className="text-red-500 text-xs mt-1 font-devanagari">{errors.membershipType}</p>}
              </div>

              {/* Payment Confirmation */}
              <div className={`rounded-lg border p-4 ${errors.paymentConfirmed ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input
                      type="checkbox"
                      checked={form.paymentConfirmed}
                      onChange={(e) => handleChange('paymentConfirmed', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-maroon-600 focus:ring-maroon-500"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700 font-devanagari">भुगतान की पुष्टि</span>
                      <span className="text-sm text-gray-600">/ Payment Confirmation</span>
                      <span className="text-red-500 text-sm">*</span>
                    </div>
                    <p className="text-xs text-gray-500 font-devanagari">
                      मैं पुष्टि करता/करती हूँ कि मैंने UPI/बैंक ट्रांसफर के माध्यम से सदस्यता शुल्क का भुगतान कर दिया है।
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      I confirm that I have made the membership fee payment via UPI/bank transfer.
                    </p>
                  </div>
                </label>
                {errors.paymentConfirmed && <p className="text-red-500 text-xs mt-2 font-devanagari">{errors.paymentConfirmed}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={addMembership.isPending}
                className="w-full bg-maroon-800 hover:bg-maroon-700 disabled:bg-maroon-400 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {addMembership.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span className="font-devanagari">जमा हो रहा है...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span className="font-devanagari">आवेदन जमा करें</span>
                    <span>/ Submit Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
}

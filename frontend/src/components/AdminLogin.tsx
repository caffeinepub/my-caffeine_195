import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import { useVerifyAdminPassword } from '../hooks/useQueries';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const verifyMutation = useVerifyAdminPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password.trim()) {
      setError('कृपया पासवर्ड दर्ज करें / Please enter password');
      return;
    }

    try {
      const isValid = await verifyMutation.mutateAsync(password);
      if (isValid) {
        sessionStorage.setItem('adminSession', 'true');
        onLoginSuccess();
      } else {
        setError('गलत पासवर्ड / Incorrect password. Please try again.');
        setPassword('');
      }
    } catch (err: any) {
      setError('सत्यापन में त्रुटि / Verification error: ' + (err?.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gold-500/20 border-2 border-gold-400 mb-4">
            <Shield className="w-10 h-10 text-gold-400" />
          </div>
          <h1 className="text-2xl font-cinzel font-bold text-gold-300 mb-1">
            Admin Panel
          </h1>
          <p className="text-cream-300 text-sm font-devanagari">
            गौसिया अशरफिया फाउंडेशन
          </p>
          <p className="text-cream-400 text-xs mt-1">
            Gausiya Ashrafia Foundation
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-gold-500/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-semibold text-cream-100">
              Admin Login / एडमिन लॉगिन
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-cream-300 mb-2">
                Password / पासवर्ड
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin password"
                  className="w-full bg-white/10 border border-gold-500/30 rounded-lg px-4 py-3 pr-12 text-cream-100 placeholder-cream-500 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
                  disabled={verifyMutation.isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-400 hover:text-cream-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                <p className="text-red-300 text-sm font-devanagari">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifyMutation.isPending || !password.trim()}
              className="w-full bg-gold-500 hover:bg-gold-400 disabled:bg-gold-700 disabled:cursor-not-allowed text-maroon-950 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {verifyMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-maroon-900/30 border-t-maroon-900 rounded-full animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Login / लॉगिन करें</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gold-500/10">
            <p className="text-center text-cream-500 text-xs font-devanagari">
              केवल अधिकृत व्यक्ति ही लॉगिन करें
            </p>
            <p className="text-center text-cream-600 text-xs mt-1">
              Authorized personnel only
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a
            href="#/"
            className="text-cream-400 hover:text-gold-300 text-sm transition-colors"
          >
            ← वापस मुख्य पृष्ठ पर / Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

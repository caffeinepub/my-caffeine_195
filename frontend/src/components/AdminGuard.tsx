import React, { useEffect, useState } from 'react';
import AdminLogin from './AdminLogin';
import { Shield } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('adminSession');
    setIsAuthenticated(session === 'true');
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-maroon-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          <div className="flex items-center gap-2 text-gold-300">
            <Shield className="w-5 h-5" />
            <span className="font-devanagari">सत्यापन हो रहा है...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <>{children}</>;
}

import React, { useState } from 'react';
import { LogOut, Users, Heart, MessageSquare, UserCheck, Shield, LayoutDashboard } from 'lucide-react';
import AdminGuard from './AdminGuard';
import MembershipRequestsTab from './MembershipRequestsTab';
import DonationsTab from './DonationsTab';
import ContactRequestsTab from './ContactRequestsTab';
import MembersListTab from './MembersListTab';

type TabId = 'membership-requests' | 'donations' | 'contact-requests' | 'members-list';

interface Tab {
  id: TabId;
  label: string;
  labelHindi: string;
  icon: React.ReactNode;
}

const tabs: Tab[] = [
  {
    id: 'membership-requests',
    label: 'Membership Requests',
    labelHindi: 'सदस्यता आवेदन',
    icon: <Users className="w-4 h-4" />,
  },
  {
    id: 'donations',
    label: 'Donation Records',
    labelHindi: 'दान रिकॉर्ड',
    icon: <Heart className="w-4 h-4" />,
  },
  {
    id: 'contact-requests',
    label: 'Contact / General',
    labelHindi: 'संपर्क / सामान्य',
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: 'members-list',
    label: 'Members List',
    labelHindi: 'सदस्य सूची',
    icon: <UserCheck className="w-4 h-4" />,
  },
];

function AdminPanelContent() {
  const [activeTab, setActiveTab] = useState<TabId>('membership-requests');

  const handleLogout = () => {
    sessionStorage.removeItem('adminSession');
    window.location.hash = '#/admin';
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-maroon-900 shadow-lg border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between py-3 border-b border-gold-500/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-500/20 border border-gold-400 flex items-center justify-center">
                <Shield className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <h1 className="text-gold-300 font-cinzel font-bold text-sm md:text-base leading-tight">
                  Admin Dashboard
                </h1>
                <p className="text-cream-400 text-xs font-devanagari hidden sm:block">
                  गौसिया अशरफिया फाउंडेशन
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#/"
                className="text-cream-400 hover:text-gold-300 text-xs transition-colors hidden sm:flex items-center gap-1"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Main Site</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/30 text-red-300 hover:text-red-200 px-3 py-1.5 rounded-lg text-sm transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex overflow-x-auto scrollbar-hide py-1 gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gold-500 text-maroon-950'
                    : 'text-cream-300 hover:text-gold-300 hover:bg-white/5'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden font-devanagari text-xs">{tab.labelHindi}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'membership-requests' && <MembershipRequestsTab />}
        {activeTab === 'donations' && <DonationsTab />}
        {activeTab === 'contact-requests' && <ContactRequestsTab />}
        {activeTab === 'members-list' && <MembersListTab />}
      </main>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <AdminGuard>
      <AdminPanelContent />
    </AdminGuard>
  );
}

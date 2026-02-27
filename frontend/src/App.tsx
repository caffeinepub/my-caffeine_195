import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ActivitiesSection from './components/ActivitiesSection';
import DonationSection from './components/DonationSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AssistanceSection from './components/AssistanceSection';
import GallerySection from './components/GallerySection';
import GovernmentSchemesSection from './components/GovernmentSchemesSection';
import VillagesSection from './components/VillagesSection';
import MembershipSection from './components/MembershipSection';
import SearchBar from './components/SearchBar';
import DistrictsPage from './components/DistrictsPage';
import VillagesPage from './components/VillagesPage';
import AdminPanel from './components/AdminPanel';

type Route =
  | { type: 'home' }
  | { type: 'districts' }
  | { type: 'villages'; districtId: bigint; districtName: string }
  | { type: 'admin' };

function parseRoute(): Route {
  const hash = window.location.hash;

  if (hash.startsWith('#/villages-manage/')) {
    const match = hash.match(/^#\/villages-manage\/(\d+)\/(.+)$/);
    if (match) {
      return {
        type: 'villages',
        districtId: BigInt(match[1]),
        districtName: decodeURIComponent(match[2]),
      };
    }
  }

  if (hash === '#/districts') {
    return { type: 'districts' };
  }

  if (hash === '#/admin' || hash === '#/admin/dashboard') {
    return { type: 'admin' };
  }

  return { type: 'home' };
}

export default function App() {
  const [route, setRoute] = useState<Route>(parseRoute());
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(parseRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToVillages = (districtId: bigint, districtName: string) => {
    window.location.hash = `/villages-manage/${districtId}/${encodeURIComponent(districtName)}`;
  };

  const navigateToDistricts = () => {
    window.location.hash = '/districts';
  };

  // Admin route - full page takeover
  if (route.type === 'admin') {
    return (
      <>
        <AdminPanel />
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Districts page
  if (route.type === 'districts') {
    return (
      <>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="pt-16">
          <DistrictsPage onNavigateToVillages={navigateToVillages} />
        </main>
        <Footer />
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Villages page
  if (route.type === 'villages') {
    return (
      <>
        <Header onSearchOpen={() => setIsSearchOpen(true)} />
        <main className="pt-16">
          <VillagesPage
            districtId={route.districtId}
            districtName={route.districtName}
            onBack={navigateToDistricts}
          />
        </main>
        <Footer />
        {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
        <Toaster richColors position="top-right" />
      </>
    );
  }

  // Home page
  return (
    <>
      <Header onSearchOpen={() => setIsSearchOpen(true)} />
      <main>
        <HeroSection />
        <AboutSection />
        <ActivitiesSection />
        <GallerySection />
        <GovernmentSchemesSection />
        <VillagesSection />
        <MembershipSection />
        <DonationSection />
        <AssistanceSection />
        <ContactSection />
      </main>
      <Footer />
      {isSearchOpen && <SearchBar onClose={() => setIsSearchOpen(false)} />}
      <Toaster richColors position="top-right" />
    </>
  );
}

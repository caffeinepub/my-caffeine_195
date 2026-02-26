import { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import DonationSection from './components/DonationSection';
import ActivitiesSection from './components/ActivitiesSection';
import GallerySection from './components/GallerySection';
import GovernmentSchemesSection from './components/GovernmentSchemesSection';
import VillagesSection from './components/VillagesSection';
import MembershipSection from './components/MembershipSection';
import AssistanceSection from './components/AssistanceSection';
import ContactSection from './components/ContactSection';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/sonner';

function getRoute(): string {
  return window.location.hash;
}

export default function App() {
  const [route, setRoute] = useState<string>(getRoute);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(getRoute());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const isAdminRoute = route === '#/admin';

  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <AdminPanel />
        </main>
        <Toaster richColors position="top-center" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section id="home">
          <HeroSection />
        </section>
        <AboutSection />
        <DonationSection />
        <ActivitiesSection />
        <GallerySection />
        <GovernmentSchemesSection />
        <VillagesSection />
        <MembershipSection />
        <AssistanceSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

import React from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ActivitiesSection from './components/ActivitiesSection';
import DonationSection from './components/DonationSection';
import MembershipSection from './components/MembershipSection';
import AssistanceSection from './components/AssistanceSection';
import GovernmentSchemesSection from './components/GovernmentSchemesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import GallerySection from './components/GallerySection';
import VillagesSection from './components/VillagesSection';
import AdminPanel from './components/AdminPanel';
import { Toaster } from './components/ui/sonner';

function getHash() {
  return window.location.hash.replace('#', '').split('?')[0];
}

function App() {
  const [hash, setHash] = React.useState(getHash);

  React.useEffect(() => {
    const onHashChange = () => setHash(getHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  if (hash === '/gallery') {
    return (
      <>
        <Header />
        <main>
          <GallerySection />
        </main>
        <Footer />
        <Toaster />
      </>
    );
  }

  if (hash === '/villages') {
    return (
      <>
        <Header />
        <main>
          <VillagesSection />
        </main>
        <Footer />
        <Toaster />
      </>
    );
  }

  if (hash === '/admin') {
    return (
      <>
        <AdminPanel />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <ActivitiesSection />
        <GovernmentSchemesSection />
        <DonationSection />
        <MembershipSection />
        <AssistanceSection />
        <GallerySection />
        <VillagesSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </>
  );
}

export default App;

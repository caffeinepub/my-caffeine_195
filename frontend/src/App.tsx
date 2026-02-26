import Header from './components/Header';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import DonationSection from './components/DonationSection';
import ActivitiesSection from './components/ActivitiesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <DonationSection />
        <ActivitiesSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster richColors position="top-center" />
    </div>
  );
}

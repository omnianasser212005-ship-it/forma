import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from '@/hooks/useTranslation';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/features/home/Hero';
import { HowItWorks } from '@/features/home/HowItWorks';
import { Pricing } from '@/features/pricing/Pricing';
import { ServicesGrid } from '@/features/services/ServicesGrid';
import { AuthModal } from '@/features/auth/AuthModal';
import { ServiceModal } from '@/features/services/ServiceModal';

// Dashboard Imports
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import DashboardOverview from '@/pages/Dashboard';
import RequestsPage from '@/pages/dashboard/RequestsPage';
import ProfilesPage from '@/pages/dashboard/ProfilesPage';

import './index.css';

function LandingPage({ openServiceModal }: { openServiceModal: (ar: string, en: string) => void }) {
  useScrollReveal();
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ServicesGrid onOpenService={openServiceModal} />
        <HowItWorks />
        <Pricing />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { lang } = useTranslation();
  
  const [authOpen, setAuthOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState(false);
  const [activeService, setActiveService] = useState({ ar: '', en: '' });

  useEffect(() => {
    const handleAuthClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('.open-auth-btn')) {
        e.preventDefault();
        setAuthOpen(true);
      }
    };
    document.addEventListener('click', handleAuthClick);
    return () => document.removeEventListener('click', handleAuthClick);
  }, []);

  const openServiceModal = (ar: string, en: string) => {
    setActiveService({ ar, en });
    setServiceOpen(true);
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage openServiceModal={openServiceModal} />} />
        
        {/* Dashboard Routes Protected by Layout Guard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardOverview />} />
          <Route path="requests" element={<RequestsPage />} />
          <Route path="profiles" element={<ProfilesPage />} />
        </Route>
      </Routes>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <ServiceModal 
        isOpen={serviceOpen} 
        onClose={() => setServiceOpen(false)} 
        serviceAr={activeService.ar}
        serviceEn={activeService.en}
      />
    </>
  );
}

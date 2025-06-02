// app/page.tsx

import Link from "next/link";
import Image from "next/image";
// Import the client wrapper for DashboardTabs
import HeroSection from "./components/HeroSection";
import NotCRMSection from "./components/NotCRMSection";
import WOWDashboardSection from "./components/WOWDashboardSection";

import ConsultingSection from "./components/ConsultingSection";
import MergedAIIndustryUseCases from "./components/MergedAIIndustryUseCases";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import HomeDashboardTabsClient from "./components/HomeDashboardTabsClient";

import BeyondTraditionalSection from "./components/BeyondTraditionalSection";

import SecuritySection from "./components/SecuritySection";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1321] text-[#e2e8f0]">
      {/* Hero Section */}
      <HeroSection />

      {/* AI Use Cases Section */}
      <MergedAIIndustryUseCases />

      {/* WOW Sales & Marketing Dashboard Section */}
      <WOWDashboardSection />

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Not CRM Section */}
      <NotCRMSection />

      {/* Transform Your Industry with AI Agents Section */}
      

      {/* Security Section */}
      <SecuritySection />

      {/* Consulting Section */}
      <ConsultingSection />

      {/* Beyond Traditional Sales Tools Section */}
      <BeyondTraditionalSection />



    </div>
  );
}
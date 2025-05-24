// app/page.tsx

import Link from "next/link";
import Image from "next/image";
// Import the client wrapper for DashboardTabs
import HeroSection from "./components/HeroSection";
import NotCRMSection from "./components/NotCRMSection";

import ConsultingSection from "./components/ConsultingSection";
import AIUseCasesSection from "./components/AIUseCasesSection";
import TestimonialsCarousel from "./components/TestimonialsCarousel";
import HomeDashboardTabsClient from "./components/HomeDashboardTabsClient";
import TransformIndustrySection from "./components/TransformIndustrySection";
import BeyondTraditionalSection from "./components/BeyondTraditionalSection";

import SecuritySection from "./components/SecuritySection";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d1321] text-[#e2e8f0]">
      {/* Hero Section */}
      <section className="hero min-h-screen flex items-center justify-center pt-48 pb-24 relative bg-gradient-to-br from-[#0d1321] to-[#091018]">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Hero Content */}
          <div className="max-w-xl">
            <span className="inline-block bg-[#00c2cb]/10 text-[#00c2cb] font-bold text-sm px-4 py-2 rounded-full border border-[#00c2cb]/30 mb-6 uppercase tracking-wider">Predictive Autonomous Agents</span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-[#00c2cb]/80 bg-clip-text text-transparent leading-tight">
  ApexSalesAI<br />Predictive Autonomous Revenue Execution
</h1>
<p className="text-xl md:text-2xl font-semibold text-[#00c2cb] mb-6 animate-fade-in delay-100">
  Smarter Selling. Autonomous Execution. Real Results.
</p>
            {/* Micro-benefits bar */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="inline-block bg-[#181f2f] text-[#00c2cb] px-3 py-1 rounded-full text-xs font-semibold border border-[#00c2cb]/40">SOC2 Compliant</span>
              <span className="inline-block bg-[#181f2f] text-[#00c2cb] px-3 py-1 rounded-full text-xs font-semibold border border-[#00c2cb]/40">24/7 Support</span>
              <span className="inline-block bg-[#181f2f] text-[#00c2cb] px-3 py-1 rounded-full text-xs font-semibold border border-[#00c2cb]/40">Integrates with Microsoft & AWS</span>
              <span className="inline-block bg-[#181f2f] text-[#00c2cb] px-3 py-1 rounded-full text-xs font-semibold border border-[#00c2cb]/40">GDPR Ready</span>
            </div>
            <p className="text-lg md:text-xl text-[#cbd5e0] mb-8">
              Transform your revenue operations with predictive autonomous agents that see opportunities others miss, deliver real-time decisions, and execute with unmatched precision.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <Link href="/demo" className="cta bg-[#00c2cb] text-[#0d1321] font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-[#00b3bf] transition-all duration-300 text-lg">Schedule Demo</Link>
              <Link href="/contact" className="cta-outline border-2 border-[#00c2cb] text-[#00c2cb] font-bold py-4 px-10 rounded-xl hover:bg-[#00c2cb]/10 transition-all duration-300 text-lg">Contact Sales</Link>
            </div>
            <div className="flex gap-10 mt-8">
              <div>
                <div className="text-3xl font-extrabold text-[#00c2cb]">+37%</div>
                <div className="text-[#a0aec0] text-sm">Pipeline Growth</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#00c2cb]">4x</div>
                <div className="text-[#a0aec0] text-sm">Rep Productivity</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#00c2cb]">24/7</div>
                <div className="text-[#a0aec0] text-sm">AI Engagement</div>
              </div>
            </div>
          </div>
          {/* Optionally, you could add a product image or animation here */}
        </div>
        {/* Sticky/Floating CTA Button */}
        <div className="fixed bottom-8 right-32 z-[100]">
          <Link href="/demo" className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-full shadow-2xl hover:bg-[#00b3bf] transition-all duration-300 text-lg animate-bounce">Schedule Demo</Link>
        </div>
      </section>

      {/* Not CRM Section */}
      <NotCRMSection />

      {/* AI Use Cases Section */}
      <AIUseCasesSection />

      {/* Consulting Section */}
      <ConsultingSection />

      {/* Testimonials Section */}
      <TestimonialsCarousel />

      {/* Security Section */}
      <SecuritySection />

      {/* Transform Your Industry with AI Agents Section */}
      <TransformIndustrySection />

      {/* Beyond Traditional Sales Tools Section */}
      <BeyondTraditionalSection />

      {/* WOW Sales & Marketing Dashboard Section */}
      <section className="relative z-20 py-24 bg-gradient-to-b from-[#091018]/80 to-[#0d1321]">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent animate-fade-in">
              Real-Time Sales & Marketing Intelligence
            </h2>
            <p className="text-lg text-[#cbd5e0] max-w-2xl mx-auto animate-fade-in delay-200">
              Instantly visualize your pipeline, conversion trends, and revenue momentum—all powered by ApexSalesAI's predictive engine.
            </p>
          </div>
          <div className="rounded-3xl shadow-2xl border border-[#00c2cb]/30 bg-[#181f2f]/90 p-2 md:p-8 animate-fade-in-up">
            <HomeDashboardTabsClient />
          </div>
        </div>
      </section>



    </div>
  );
}
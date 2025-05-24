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
      {/* Navigation */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-6 px-4">
          <Link href="/" aria-label="ApexSalesAI Home" className="flex items-center">
            <Image src="/images/apex-logo.png" alt="ApexSalesAI" width={96} height={32} priority style={{width: 'auto', height: 'auto'}} className="h-8 w-auto" />
          </Link>
          <ul className="hidden md:flex space-x-8 font-semibold">
            <li><Link href="/" className="text-[#0d1321] hover:text-[#00c2cb]">Home</Link></li>
            <li><Link href="/about" className="text-[#0d1321] hover:text-[#00c2cb]">About</Link></li>
            <li><Link href="/platform" className="text-[#0d1321] hover:text-[#00c2cb]">Platform</Link></li>
            <li><Link href="/pricing" className="text-[#0d1321] hover:text-[#00c2cb]">Pricing</Link></li>
            <li><Link href="/consulting" className="text-[#0d1321] hover:text-[#00c2cb]">Consulting</Link></li>
            <li><Link href="/demo" className="text-[#0d1321] hover:text-[#00c2cb]">Demo</Link></li>
            <li><Link href="/reseller" className="text-[#0d1321] hover:text-[#00c2cb]">Reseller</Link></li>
            <li><Link href="/onboarding" className="text-[#0d1321] hover:text-[#00c2cb]">Onboarding</Link></li>
            <li><Link href="/blog" className="text-[#0d1321] hover:text-[#00c2cb]">Blog</Link></li>
            <li><Link href="/contact" className="text-[#0d1321] hover:text-[#00c2cb]">Contact</Link></li>
          </ul>
        </div>
      </nav>

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



      {/* Footer */}
      <footer className="bg-[#091018] py-12 mt-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <Image src="/images/apex-logo-white.png" alt="ApexSalesAI" width={80} height={28} style={{width: 'auto', height: 'auto'}} className="h-7 w-auto" />
            <span className="font-bold text-lg text-white">ApexSalesAI</span>
          </div>
          <div className="flex flex-wrap gap-6 text-[#a0aec0] text-sm">
            <Link href="/about" className="hover:text-[#00c2cb]">About</Link>
            <Link href="/platform" className="hover:text-[#00c2cb]">Platform</Link>
            <Link href="/pricing" className="hover:text-[#00c2cb]">Pricing</Link>
            <Link href="/consulting" className="hover:text-[#00c2cb]">Consulting</Link>
            <Link href="/blog" className="hover:text-[#00c2cb]">Blog</Link>
            <Link href="/contact" className="hover:text-[#00c2cb]">Contact</Link>
          </div>
          <div className="text-[#a0aec0] text-xs">&copy; {new Date().getFullYear()} ApexSalesAI. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
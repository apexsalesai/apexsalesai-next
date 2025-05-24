'use client';

import dynamic from 'next/dynamic';
const ROICalculator = dynamic(() => import('../components/ROICalculator'), { ssr: false });
const ROIAnalysisPanel = dynamic(() => import('../components/ROIAnalysisPanel'), { ssr: false });
import AnnualBillingToggle from './AnnualBillingToggle';
import PricingCard from './PricingCard';

import { useState } from 'react';

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);
  return (
    <div className="min-h-screen bg-[#101522] text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-10 text-center bg-gradient-to-b from-[#101522] to-[#1a1e29]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Flexible Pricing. Immediate ROI.</h1>
        <p className="text-xl text-[#cbd5e0] max-w-2xl mx-auto mb-6">
          Only pay for results. ApexSalesAI delivers measurable value from day one—see your potential ROI below.
        </p>
      </section>

      {/* ROI Calculator */}
      <section className="py-8">
        <div className="max-w-3xl mx-auto">
          <ROICalculator />
        </div>
      </section>

      {/* ROI Analysis Panel */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto">
          <ROIAnalysisPanel />
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4 text-center">Choose Your Plan</h2>
          <p className="text-center text-[#cbd5e0] mb-6 max-w-2xl mx-auto">
            <span className="font-semibold text-[#00c2cb]">What is an AI Agent?</span> An AI Agent is an autonomous digital worker that can handle sales, support, operations, or other workflows—customized for your business and seamlessly integrated with your systems.
          </p>
          {/* Annual Billing Toggle */}
          <div className="flex justify-center mb-8">
            <AnnualBillingToggle onChange={setIsAnnual} />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <PricingCard
              title="Starter"
              priceMonthly={499}
              priceAnnual={5490}
              features={[
                '1 AI Agent',
                'Core Integrations',
                'Email & Chat Automation',
                'Basic Analytics',
                'Email Support',
              ]}
              cta="Get Started"
              isAnnual={isAnnual}
            />
            {/* Growth Plan */}
            <PricingCard
              title="Growth"
              priceMonthly={1499}
              priceAnnual={16490}
              features={[
                'Up to 5 AI Agents',
                'Advanced Integrations',
                'Multi-channel Automation',
                'Advanced Analytics & Insights',
                'Priority Support',
              ]}
              bestValue
              cta="Start Free Trial"
              isAnnual={isAnnual}
            />
            {/* Enterprise Plan */}
            <PricingCard
              title="Enterprise"
              priceMonthly={0}
              priceAnnual={0}
              features={[
                'Unlimited AI Agents',
                'Custom Integrations',
                'Dedicated Success Manager',
                'Custom Analytics',
                '24/7 Support',
              ]}
              cta="Contact Sales"
              custom
              isAnnual={isAnnual}
            />
          </div>
          {/* Free Trial or Guarantee */}
          <div className="text-center mt-8">
            <span className="inline-block bg-[#00c2cb]/10 text-[#00c2cb] px-4 py-2 rounded-full font-semibold">
              14-day Free Trial &mdash; 30-day Money-Back Guarantee
            </span>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-8 bg-[#101522]">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6 text-center">Compare Features</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-center border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[#00c2cb]">
                  <th className="px-4 py-2"></th>
                  <th className="px-4 py-2">Starter</th>
                  <th className="px-4 py-2">Growth</th>
                  <th className="px-4 py-2">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-[#cbd5e0]">
                <tr>
                  <td className="font-semibold">AI Agents Included</td>
                  <td>1</td>
                  <td>5</td>
                  <td>Unlimited</td>
                </tr>
                <tr>
                  <td className="font-semibold">Integrations</td>
                  <td>Core</td>
                  <td>Advanced</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td className="font-semibold">Automation</td>
                  <td>Email & Chat</td>
                  <td>Multi-channel</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td className="font-semibold">Analytics</td>
                  <td>Basic</td>
                  <td>Advanced</td>
                  <td>Custom</td>
                </tr>
                <tr>
                  <td className="font-semibold">Support</td>
                  <td>Email</td>
                  <td>Priority</td>
                  <td>24/7 + Dedicated</td>
                </tr>
                <tr>
                  <td className="font-semibold">Success Manager</td>
                  <td>–</td>
                  <td>–</td>
                  <td>Yes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons Section */}
      <section className="py-8 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-4 text-center">Add-ons & Optional Services</h3>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="bg-[#0d1321] rounded-xl p-6 min-w-[220px] flex flex-col items-center">
              <span className="text-[#00c2cb] text-3xl mb-2">🚀</span>
              <span className="font-bold mb-1">White-Glove Onboarding</span>
              <span className="text-[#cbd5e0] text-sm">Custom setup, training, and integration support.</span>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 min-w-[220px] flex flex-col items-center">
              <span className="text-[#00c2cb] text-3xl mb-2">🔌</span>
              <span className="font-bold mb-1">Premium Integrations</span>
              <span className="text-[#cbd5e0] text-sm">Connect to advanced CRMs, ERPs, or custom APIs.</span>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 min-w-[220px] flex flex-col items-center">
              <span className="text-[#00c2cb] text-3xl mb-2">📊</span>
              <span className="font-bold mb-1">Custom Analytics</span>
              <span className="text-[#cbd5e0] text-sm">Tailored dashboards and reporting for your KPIs.</span>
            </div>
            <div className="bg-[#0d1321] rounded-xl p-6 min-w-[220px] flex flex-col items-center">
              <span className="text-[#00c2cb] text-3xl mb-2">🤝</span>
              <span className="font-bold mb-1">Consulting & AI Strategy</span>
              <span className="text-[#cbd5e0] text-sm">Expert guidance to maximize your AI ROI.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Social Proof (if any) */}
      {/* You could add a fun AI-generated quote or "AI Agent of the Month" badge here for creativity, but no testimonials/logos per user request. */}

      {/* Final CTA */}
      <section className="py-12 text-center bg-[#101522]">
        <h2 className="text-3xl font-bold mb-4">Ready to See Results?</h2>
        <p className="text-lg text-[#cbd5e0] mb-6">Book your personalized demo and discover how ApexSalesAI can drive ROI for your business.</p>
        <button className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg hover:bg-[#00a8b3] transition-all duration-300">Book a Demo</button>
      </section>
    </div>
  );
}

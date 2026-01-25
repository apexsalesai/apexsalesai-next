import React from 'react';
import Image from 'next/image';

export default function LeadNurturingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="flex-shrink-0">
          <Image
            src="/images/happy-matu-magic-nqte.jpeg"
            alt="Max AI Mascot"
            width={120}
            height={120}
            className="rounded-full shadow-xl border-4 border-[#00c2cb] animate-bounce-slow"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">AI-Powered Lead Nurturing</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Transform your lead nurturing with autonomous AI agents—engage, qualify, and convert more leads 24/7.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI helps businesses of all sizes automate personalized follow-ups, boost conversions, and accelerate sales cycles.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">35%</span>
          <span className="text-[#a0aec0] text-center">Increase in reply rates using AI-driven nurturing for SaaS & B2B companies.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">3x</span>
          <span className="text-[#a0aec0] text-center">More qualified meetings booked for enterprise and SMB clients.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">80%</span>
          <span className="text-[#a0aec0] text-center">Reduction in manual follow-ups for sales teams with ApexSalesAI.</span>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enterprise Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Envelope for Email Nurturing */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Global SaaS Company Boosts Conversions by 35% with AI Email Nurturing</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI-driven email sequences and hyper-personalized follow-ups increased reply rates and deal closures, reducing manual sales effort by 50%.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 35% increase in email reply rates</li>
              <li>✅ 28% faster deal closures</li>
              <li>✅ 50% reduction in manual sales effort</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Autonomous Email Nurturing system ensures no lead slips through the cracks.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Message/Chat for Chatbot */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Fortune 500 Retailer Cuts Lead Response Time from Hours to Seconds</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI chatbots instantly qualify leads and book meetings, with real-time lead scoring to prioritize hot prospects.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 50% faster lead response times</li>
              <li>✅ 3x more qualified meetings booked</li>
              <li>✅ 20% increase in revenue per lead</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Smart Chat Assist acts as a 24/7 sales rep, ensuring you never miss a high-value lead.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Star/Chart for Predictive Lead Engine */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-6"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Financial Services Firm Shortens Sales Cycle by 25% with Predictive AI</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Predictive lead scoring and dynamic content delivery helped identify high-intent leads, boosting conversion rates and upsell opportunities.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 25% shorter sales cycle</li>
              <li>✅ 40% higher conversion rates</li>
              <li>✅ 30% increase in upsell opportunities</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Predictive Lead Engine nurtures your hottest prospects with personalized content.</div>
          </div>

          {/* SMB Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Shopping Cart for E-Commerce */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">E-Commerce Store Increases Revenue by 40% with AI-Powered Retargeting</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI-driven retargeting ads and automated SMS follow-ups recovered sales and boosted retention for a small online retailer.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 40% increase in recovered sales</li>
              <li>✅ 30% higher customer retention</li>
              <li>✅ 50% lower cost per lead</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Ad & SMS Nurturing turns window shoppers into buyers—without a large team.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Wrench for Local Services */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22.7 19.3-1.4 1.4a2 2 0 0 1-2.8 0l-7.8-7.8a2 2 0 0 1 0-2.8l1.4-1.4a5 5 0 0 1 5.6-1l-2.8 2.8 6.4 6.4 2.8-2.8a5 5 0 0 1-1 5.6z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Local HVAC Company Books 50% More Appointments with AI Follow-Ups</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Automated SMS & WhatsApp nurturing and instant lead qualification led to more booked appointments and repeat customers.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 50% more service appointments booked</li>
              <li>✅ 15% increase in repeat customers</li>
              <li>✅ 80% reduction in manual follow-ups</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our AI Lead Engagement Suite lets your team focus on closing deals, not chasing leads.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Briefcase for Consulting */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">B2B Consulting Firm 3x’s Lead Conversions with AI Chat & Email</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI chatbots and automated email nurturing filled the pipeline and boosted close rates for a small consultancy.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 3x more qualified leads</li>
              <li>✅ 20% higher close rates</li>
              <li>✅ Fully booked calendar without hiring more staff</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Lead Nurturing System works while you sleep, filling your pipeline with ready-to-buy prospects.</div>
          </div>
        </div>
      </div>

      {/* Testimonial/Case Study Section */}
      <div className="bg-[#23272f] rounded-xl p-8 shadow-lg mb-10 border-l-4 border-[#00c2cb]">
        <h3 className="text-lg font-bold text-[#00c2cb] mb-2">Case Study: 35% More Conversions</h3>
        <p className="text-[#a0aec0] mb-2">"With ApexSalesAI, our sales team doubled their pipeline and closed 35% more deals in just 4 months. The AI agent handled nurturing and qualification, letting us focus on closing."</p>
        <span className="text-xs text-[#a0aec0]">— VP Sales, Global SaaS Company</span>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Lead Nurturing
        </a>
      </div>
    </div>
  );
}

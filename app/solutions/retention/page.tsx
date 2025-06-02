import React from 'react';
import Image from 'next/image';

export default function RetentionPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">AI-Powered Customer Retention Automation</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Turn at-risk customers into loyal advocates with predictive, autonomous retention campaigns.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI predicts churn, triggers personalized win-back flows, and boosts retention—automatically.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">30%</span>
          <span className="text-[#a0aec0] text-center">Reduction in churn for SaaS, telecom, and e-commerce brands using AI-driven retention.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">65%</span>
          <span className="text-[#a0aec0] text-center">Success rate on payment recovery attempts with predictive AI.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">3-6x</span>
          <span className="text-[#a0aec0] text-center">Typical ROI from saved revenue with ApexSalesAI Retention Automation.</span>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Predictive Churn Scoring */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Heartbeat/Alert Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 12 6 12 9 21 15 3 18 12 21 12" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Predictive Churn Scoring</h4>
            <p className="text-[#0d1321] text-sm">Identify at-risk customers before they leave—90%+ accuracy.</p>
          </div>
        </div>
        {/* Automated Win-Back Campaigns */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Mail/Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Automated Win-Back Campaigns</h4>
            <p className="text-[#0d1321] text-sm">Trigger personalized email, SMS, and in-app offers to save customers at scale.</p>
          </div>
        </div>
        {/* Silent Attrition Detector */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Eye/Watch Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Silent Attrition Detector</h4>
            <p className="text-[#0d1321] text-sm">Spot disengagement early and trigger timely interventions.</p>
          </div>
        </div>
        {/* Seamless Integration */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Link/Integration Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 7l-1.5 1.5a5 5 0 0 1-7-7" /><path d="M14 11a5 5 0 0 0-7-7L5.5 5.5a5 5 0 0 0 7 7" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Seamless Integration</h4>
            <p className="text-[#0d1321] text-sm">Connects to your CRM, helpdesk, and payment systems for end-to-end retention.</p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enterprise Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Heart for Retention */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Global SaaS Company Reduces Churn by 30% with AI-Powered Retention</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Predictive churn scoring and automated win-back campaigns saved millions in recurring revenue.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li> 30% reduction in annual churn</li>
              <li> 22% increase in expansion revenue</li>
              <li> Fully automated retention system</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Churn Prediction Engine triggers hyper-targeted save campaigns automatically.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Gift/Offer for Telecom */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3v4M8 3v4"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Fortune 500 Telecom Cuts Cancellations by $4M Annually</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI flagged contract expirations and triggered automated retention offers, saving millions in revenue.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li> $4M+ in annual saved revenue</li>
              <li> 40% improvement in offer acceptance</li>
              <li> 18% higher ARPU from upgrades</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Contract Renewal AI auto-delivers the perfect retention offer.</div>
          </div>

          {/* SMB Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Repeat/Sync for Subscription */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 22v-6h6"/><path d="M21 12A9 9 0 0 1 12 21c-4.97 0-9-4.03-9-9"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Subscription Box Company Saves 300+ Customers Monthly</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI predicted cancellation risks and automated win-back flows, saving thousands in revenue for a DTC brand.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li> 300+ customers saved monthly</li>
              <li> 65% success rate on payment recovery</li>
              <li> 22% higher LTV from retained subscribers</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Subscription Rescue Module automatically recovers failed payments and re-engages lapsing customers.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Smile/Thumbs-up for Loyalty */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 9V5a3 3 0 0 0-6 0v4"/><path d="M5 12h14"/><path d="M17 16a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">E-Commerce Brand Slashes Returns & Increases Loyalty</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI identified serial returners and personalized offers, reducing returns and boosting repeat purchases.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li> 28% reduction in return rates</li>
              <li> 15% increase in repeat purchases</li>
              <li> Higher margins from fewer return costs</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Returns Prediction AI improves satisfaction while protecting profits.</div>
          </div>
        </div>
      </div>

      {/* Testimonial/Case Study Section */}
      <div className="bg-[#23272f] rounded-xl p-8 shadow-lg mb-10 border-l-4 border-[#00c2cb]">
        <h3 className="text-lg font-bold text-[#00c2cb] mb-2">Case Study: 30% Lower Churn</h3>
        <p className="text-[#a0aec0] mb-2">"With ApexSalesAI, we cut churn by 30% and increased expansion revenue by 22%. The AI agent automatically triggered personalized retention offers and payment recovery flows."</p>
        <span className="text-xs text-[#a0aec0]">— Head of Customer Success, SaaS Leader</span>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Retention
        </a>
      </div>
    </div>
  );
}

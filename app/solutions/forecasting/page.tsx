import React from 'react';
import Image from 'next/image';

export default function ForecastingPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">AI-Powered Predictive Revenue Forecasting</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Drive smarter growth with real-time, AI-driven revenue forecasting and pipeline insights.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI uses machine learning to deliver actionable forecasts, minimize risk, and maximize revenue—no spreadsheets required.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">60%</span>
          <span className="text-[#a0aec0] text-center">Reduction in forecast errors for SaaS & B2B companies using AI.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">90%+</span>
          <span className="text-[#a0aec0] text-center">Forecast accuracy with ApexSalesAI’s Predictive Revenue Engine.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">80%</span>
          <span className="text-[#a0aec0] text-center">Less time spent on manual forecasting and reporting.</span>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Opportunity Scoring */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Bar Chart Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="8" rx="1" /><rect x="9" y="8" width="4" height="12" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">AI Opportunity Scoring</h4>
            <p className="text-[#0d1321] text-sm">Predict which deals will close—and when—with machine learning.</p>
          </div>
        </div>
        {/* Real-Time Pipeline Health */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Pulse/Heartbeat Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 12 6 12 9 21 15 3 18 12 21 12" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Real-Time Pipeline Health</h4>
            <p className="text-[#0d1321] text-sm">Get instant visibility into pipeline risks and upside with live analytics.</p>
          </div>
        </div>
        {/* Scenario Modeling */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Layers/Scenario Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Scenario Modeling</h4>
            <p className="text-[#0d1321] text-sm">Model best- and worst-case outcomes instantly—no spreadsheets required.</p>
          </div>
        </div>
        {/* Seamless CRM Integration */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Link/Integration Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 1 7 7l-1.5 1.5a5 5 0 0 1-7-7" /><path d="M14 11a5 5 0 0 0-7-7L5.5 5.5a5 5 0 0 0 7 7" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Seamless CRM Integration</h4>
            <p className="text-[#0d1321] text-sm">Works with Salesforce, HubSpot, Pipedrive, and more—no IT team needed.</p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enterprise Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Analytics for Forecasting */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="12" width="4" height="8" rx="1" /><rect x="9" y="8" width="4" height="12" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Global SaaS Company Reduces Forecast Errors by 60% with AI</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning models analyzed historical deals and market signals for real-time, highly accurate forecasting.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 60% reduction in forecast variance</li>
              <li>✅ 25% improvement in quota attainment</li>
              <li>✅ Faster adjustments to market shifts</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Predictive Revenue Engine provides forecasts with 90%+ accuracy.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Calendar/Clock for Real-Time */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Financial Services Firm Cuts Month-End Crunch with Real-Time Forecasting</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Self-updating AI forecasts and scenario modeling replaced manual spreadsheets for a global bank.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 80% less time spent on manual forecasting</li>
              <li>✅ Real-time visibility into revenue performance</li>
              <li>✅ More accurate board reporting</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Automated Forecasting Dashboard gives your team always-on insights.</div>
          </div>

          {/* SMB Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Chart/Trend for SMBs */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 17 9 11 13 15 21 7" /><polyline points="14 7 21 7 21 14" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Mid-Sized Tech Agency Grows Revenue 30% with AI Pipeline Insights</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI-powered analytics predicted monthly revenue and flagged stalled deals, improving cash flow and hiring decisions.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 30% revenue growth in 6 months</li>
              <li>✅ 50% fewer "surprise" misses on targets</li>
              <li>✅ Improved hiring/timing decisions</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Pipeline Intelligence System helps SMBs forecast like enterprises.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Shopping Bag for E-Commerce */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v6h12V2" /><path d="M3 6h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">E-Commerce Brand Cuts Inventory Costs by 25% with AI Demand Forecasting</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Unified forecasting tied sales pipeline data to inventory, reducing stockouts and excess costs for a DTC brand.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 25% reduction in excess inventory costs</li>
              <li>✅ 18% fewer stockouts</li>
              <li>✅ Optimized ad spend by tying forecasts to ROI</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Demand Forecasting Module connects sales pipelines to operational planning.</div>
          </div>
        </div>
      </div>

      {/* Testimonial/Case Study Section */}
      <div className="bg-[#23272f] rounded-xl p-8 shadow-lg mb-10 border-l-4 border-[#00c2cb]">
        <h3 className="text-lg font-bold text-[#00c2cb] mb-2">Case Study: 90%+ Forecast Accuracy</h3>
        <p className="text-[#a0aec0] mb-2">"With ApexSalesAI, our finance team eliminated manual spreadsheets and now forecasts revenue with 92% accuracy. The AI dashboard gives us real-time insights and confidence in every board meeting."</p>
        <span className="text-xs text-[#a0aec0]">— CFO, Global SaaS Company</span>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Forecasting
        </a>
      </div>
    </div>
  );
}

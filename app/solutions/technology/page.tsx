import React from 'react';
import Image from 'next/image';

export default function TechnologySolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Technology Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Supercharge your tech sales with AI agents that automate, personalize, and accelerate every stage of the buyer journey.</p>
          <p className="text-md text-[#a0aec0]">From SaaS to cloud, ApexSalesAI helps tech companies close deals faster, qualify leads smarter, and scale growth with precision.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">78%</span>
          <span className="text-[#a0aec0] text-center">of high-growth tech firms report increased revenue after adopting AI-driven sales tools.<br/><span className="text-xs">(McKinsey, 2024)</span></span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">3.5x</span>
          <span className="text-[#a0aec0] text-center">Increase in sales pipeline velocity for SaaS companies using automated lead qualification.<br/><span className="text-xs">(Forrester, 2023)</span></span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">60%</span>
          <span className="text-[#a0aec0] text-center">Reduction in time-to-demo after implementing AI-powered scheduling and nurturing.<br/><span className="text-xs">(Gartner, 2024)</span></span>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* 1. Automated Code Review & Bug Detection */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Automated Code Review & Bug Detection</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI-powered tools analyze code in real-time, catching bugs, security vulnerabilities, and performance issues before they reach production.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">GitHub Copilot (used by Shopify)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced code review time by <span className="font-bold">50%</span></li>
                <li>Identified <span className="font-bold">30% more critical bugs</span> before deployment</li>
                <li>Boosted developer productivity by <span className="font-bold">35%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Faster shipping, fewer outages, and happier engineers—without hiring more staff.</div>
          </div>

          {/* 2. AI-Powered Demand Forecasting */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Demand Forecasting</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI analyzes historical data, market trends, and even social signals to optimize inventory and server allocation for tech hardware/cloud.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">NVIDIA (AI for GPU Supply Chain)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced excess inventory costs by <span className="font-bold">$100M+</span> annually</li>
                <li>Improved delivery times during chip shortages</li>
                <li>Cut stockouts by <span className="font-bold">40%</span> in key markets</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Prevents overproduction (saving millions) while ensuring customers get hardware on time.</div>
          </div>

          {/* 3. AI-Powered IT Helpdesk & Support Automation */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered IT Helpdesk & Support</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI-driven chatbots and virtual assistants autonomously resolve routine IT support requests, troubleshoot issues, and escalate complex tickets.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">IBM Watson Assistant for IT Support</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Handled <span className="font-bold">40%</span> of employee IT queries without human intervention</li>
                <li>Reduced ticket resolution time from hours to minutes</li>
                <li>Cut IT support costs by <span className="font-bold">30%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Frees up IT staff for strategic work and improves employee satisfaction.</div>
          </div>
        </div>
      </div>

      {/* Case Study Section */}
      <div className="bg-[#23272f] rounded-xl p-8 shadow-lg mb-10 border-l-4 border-[#00c2cb]">
        <h3 className="text-lg font-bold text-[#00c2cb] mb-2">Case Study: Accelerating SaaS Growth</h3>
        <p className="text-[#a0aec0] mb-2">"With ApexSalesAI, we reduced our sales cycle by 41% and doubled our pipeline in just 6 months. The AI agent handled initial qualification and demo scheduling, letting our reps focus on closing deals."</p>
        <span className="text-xs text-[#a0aec0]">— CTO, Leading SaaS Company</span>
      </div>

      {/* Did You Know Section */}
      <div className="flex items-center gap-4 bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 mb-10">
        <Image
          src="/images/happy-matu-magic-nqte.jpeg"
          alt="Max AI Mascot"
          width={48}
          height={48}
          className="rounded-full border-2 border-[#00c2cb]"
        />
        <div>
          <h4 className="text-md font-bold text-[#00c2cb] mb-1">Did you know?</h4>
          <p className="text-[#a0aec0]">AI can personalize product demos in real time and even suggest upsell features based on live prospect feedback—giving your sales team a superhuman edge.</p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Tech Solutions
        </a>
      </div>
    </div>
  );
}

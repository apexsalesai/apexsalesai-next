import React from 'react';
import Image from 'next/image';

export default function SupportPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Conversational AI Support</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Automate, personalize, and scale customer support with ApexSalesAI's advanced conversational agents.</p>
          <p className="text-md text-[#a0aec0]">Deliver instant, human-like responses 24/7—freeing your team to focus on complex cases and relationship building.</p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">70%</span>
          <span className="text-[#a0aec0] text-center">Reduction in average response time with AI-powered support agents.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">95%+</span>
          <span className="text-[#a0aec0] text-center">Customer satisfaction for companies using ApexSalesAI support automation.</span>
        </div>
        <div className="bg-[#23272f] rounded-xl p-6 shadow-lg flex flex-col items-center">
          <span className="text-3xl font-bold text-[#00c2cb] mb-2">24/7</span>
          <span className="text-[#a0aec0] text-center">Always-on support—no more missed questions or leads.</span>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Natural Language Understanding */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Chat Bubble Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Natural Language Understanding</h4>
            <p className="text-[#0d1321] text-sm">AI understands context and intent for truly human-like conversations.</p>
          </div>
        </div>
        {/* Omnichannel Support */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Globe/Channels Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Omnichannel Support</h4>
            <p className="text-[#0d1321] text-sm">Seamlessly handle chats, emails, SMS, and social—one AI agent, every channel.</p>
          </div>
        </div>
        {/* Automated Issue Resolution */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* Check/Lightning Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Automated Issue Resolution</h4>
            <p className="text-[#0d1321] text-sm">Resolve common questions instantly—no human needed for 80%+ of cases.</p>
          </div>
        </div>
        {/* Handoff to Human Agents */}
        <div className="bg-white rounded-xl shadow p-5 flex items-start gap-4 border-l-4 border-[#00c2cb]">
          <span className="mt-1">
            {/* User/Arrow Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M8 12l4-4 4 4" /></svg>
          </span>
          <div>
            <h4 className="font-semibold text-[#00c2cb] mb-1">Handoff to Human Agents</h4>
            <p className="text-[#0d1321] text-sm">Seamlessly escalate complex issues to your team with full context preserved.</p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Success Stories</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Enterprise Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Headset for Support */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15v2a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-2" /><path d="M9 19V8a3 3 0 0 1 6 0v11" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">SaaS Company Boosts CSAT to 98% with 24/7 AI Support</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI resolved 82% of customer queries instantly, freeing agents for high-value work.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 98% CSAT (Customer Satisfaction)</li>
              <li>✅ 70% reduction in response time</li>
              <li>✅ 24/7 support coverage</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Conversational AI Agent delivers always-on, human-like support at scale.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Globe for Global Support */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">E-Commerce Brand Expands Globally with Multilingual AI Support</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI agents handled 12 languages, supporting customers worldwide and increasing NPS by 20 points.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 20pt NPS increase</li>
              <li>✅ 12 languages supported</li>
              <li>✅ 60% lower support costs</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Multilingual AI scales support across continents and time zones.</div>
          </div>

          {/* SMB Success Stories */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: Lightning for Fast Resolution */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 2 13 13 22 13" /><polyline points="2 13 11 13 11 22" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Startup Cuts Ticket Volume by 75% with Automated Answers</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI resolved repetitive questions instantly, letting the team focus on product and growth.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 75% fewer support tickets</li>
              <li>✅ 80%+ first-contact resolution</li>
              <li>✅ Happier, less-burned-out staff</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Automated Answer Engine lets your team focus on what matters most.</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col min-h-[370px]">
            {/* Icon: User/Arrow for Handoff */}
            <span className="mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M8 12l4-4 4 4" /></svg>
            </span>
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">B2B Agency Elevates Support Quality with Seamless AI-Human Handoff</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI handled FAQs and smoothly escalated high-value clients to dedicated reps, improving retention and satisfaction.</p>
            <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
              <li>✅ 40% higher retention for managed accounts</li>
              <li>✅ 100% context transfer to human agents</li>
              <li>✅ 2x faster resolution for escalated tickets</li>
            </ul>
            <div className="text-xs text-[#a0aec0] italic mt-2">Our Smart Handoff System ensures nothing gets lost between AI and your team.</div>
          </div>
        </div>
      </div>

      {/* Testimonial/Case Study Section */}
      <div className="bg-[#23272f] rounded-xl p-8 shadow-lg mb-10 border-l-4 border-[#00c2cb]">
        <h3 className="text-lg font-bold text-[#00c2cb] mb-2">Case Study: 98% CSAT with AI Support</h3>
        <p className="text-[#a0aec0] mb-2">"With ApexSalesAI, our support team delivers instant answers and 24/7 coverage. Customer satisfaction is at an all-time high, and our agents are happier than ever."</p>
        <span className="text-xs text-[#a0aec0]">— Director of Support, Leading SaaS Company</span>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Support
        </a>
      </div>
    </div>
  );
}

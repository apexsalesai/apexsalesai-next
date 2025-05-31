import React from 'react';
import Image from 'next/image';

export default function RealEstateSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Real Estate Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Accelerate deals, automate leasing, and win more clients with AI agents for residential and commercial real estate.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI empowers agents, brokers, and property managers to close faster and operate smarter with proven AI.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. AI-Powered Property Valuation & Automated Appraisals */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Property Valuation & Automated Appraisals</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Instant, data-driven home valuations (AVMs) with 90%+ accuracy, reducing reliance on manual appraisers.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">HouseCanary</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Major lenders use it to cut loan approval times by 50%</li>
                <li>iBuyers (e.g., Opendoor) make instant offers with &lt;3% error</li>
                <li>Reduced appraisal costs from $500+ to $5/property</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI eliminates a 100-year-old bottleneck in real estate transactions.</div>
          </div>

          {/* 2. AI Leasing Agents & Virtual Assistants */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Leasing Agents & Virtual Assistants</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI handles 80% of tenant inquiries, applications, and tours—no staff needed after hours.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Rently</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Lease conversions up 30% for property managers</li>
                <li>60% fewer no-shows for tours</li>
                <li>Equity Residential handles 500K+ annual inquiries with AI</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI turns leasing into a self-service process for large portfolios.</div>
          </div>

          {/* 3. AI for Commercial Real Estate (CRE) Investment */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Commercial Real Estate (CRE) Investment</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Predicts optimal acquisitions using satellite data, foot traffic, and alternative data sources.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Skyline AI (JLL)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Blackstone identified $200M+ in undervalued assets</li>
                <li>Brookfield cut due diligence time by 70%</li>
                <li>JLL reported 18% higher IRR on AI-guided deals</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI turns CRE into quantitative investing—like Wall Street for buildings.</div>
          </div>

          {/* 4. AI-Generated Property Listings & Marketing Content */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Generated Property Listings & Marketing Content</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Automatically writes compelling listing descriptions, social posts, and email campaigns in seconds.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Listings to Leads</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Saved agents 10+ hours/week on copywriting</li>
                <li>Increased lead inquiries by 25%</li>
                <li>Cut agency costs by 60% for brokerages</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI eliminates "blank page syndrome" for solopreneurs and teams.</div>
          </div>

          {/* 5. AI-Powered Lead Response & Nurturing */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Lead Response & Nurturing</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Instant 24/7 response to inquiries with personalized follow-ups and predictive lead scoring.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">BoomTown!</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>1-person team increased converted leads by 40%</li>
                <li>Cost: $99/month replaces a $15/hr VA</li>
                <li>AI handles "tire kickers" so agents focus on serious buyers</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI lets agents respond instantly and nurture more leads.</div>
          </div>

          {/* 6. AI Visual Tools for DIY Property Staging */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Visual Tools for DIY Property Staging</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Virtually stage empty rooms or suggest decor upgrades—no expensive stagers required.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Apply Design</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>$25/photo vs. $500+ for physical staging</li>
                <li>Sold vacant listings 22 days faster with AI staging</li>
                <li>Use before/after images in ads to showcase potential</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI staging helps listings stand out and sell faster—on any budget.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Real Estate Solutions
        </a>
      </div>
    </div>
  );
}

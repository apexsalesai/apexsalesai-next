import React from 'react';
import Image from 'next/image';

export default function FinanceSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Finance Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Modernize banking, wealth management, and fintech with AI agents that deliver security, speed, and personalization.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI empowers financial institutions to fight fraud, optimize portfolios, and serve clients 24/7—at scale.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. AI-Powered Fraud Detection & Prevention */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Fraud Detection & Prevention</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning analyzes transactions, device fingerprints, and biometrics to flag fraud in real-time—protecting banks and customers.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Mastercard's Decision Intelligence</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced false declines by <span className="font-bold">40%</span></li>
                <li>Improved fraud detection by <span className="font-bold">30%</span></li>
                <li>Saved <span className="font-bold">$500M+</span> annually in prevented fraud</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI balances security with customer experience—every false decline costs merchants $118 in lost loyalty.</div>
          </div>

          {/* 2. AI-Driven Algorithmic Trading & Portfolio Optimization */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Algorithmic Trading & Portfolio Optimization</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Reinforcement learning algorithms execute trades at millisecond speeds using news, sentiment, and macro trends.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">J.P. Morgan's LOXM</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced trading costs by <span className="font-bold">20%</span></li>
                <li>Generated <span className="font-bold">$300M+</span> in annual alpha</li>
                <li>Cut trade settlement errors to <span className="font-bold">0.001%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI now handles 60% of equity trades—humans focus on strategy, not execution.</div>
          </div>

          {/* 3. AI for Hyper-Personalized Wealth Management */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Hyper-Personalized Wealth Management</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Autonomous agents optimize portfolios dynamically for every client, combining risk, life events, and tax laws.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Betterment's AI Tax Loss Harvesting</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Outperformed human advisors by <span className="font-bold">2.3%</span> annually after taxes/fees</li>
                <li>Scaled to <span className="font-bold">800,000+</span> accounts with $45B AUM</li>
                <li>Increased retention by <span className="font-bold">35%</span> via personalized nudges</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Democratizes access to sophisticated strategies once reserved for the ultra-wealthy.</div>
          </div>

          {/* 4. AI Bookkeeping & Cash Flow Forecasting for SMB Accountants */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Bookkeeping & Cash Flow Forecasting</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Autonomous bookkeeping agents sync with bank feeds, auto-categorize expenses, and forecast cash shortfalls for SMBs.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Botkeeper (50+ Small Accounting Firms)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Saved 15 hours/month per client on data entry</li>
                <li>Improved cash flow prediction accuracy by <span className="font-bold">40%</span></li>
                <li>Enabled accountants to 2X client load without hiring</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI lets accountants focus on advice, not data entry.</div>
          </div>

          {/* 5. AI Chatbots for Personalized Community Banking */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Chatbots for Personalized Community Banking</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI handles FAQs, loan applications, and financial coaching with a local touch—24/7.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Kasisto’s KAI (Fairwinds Credit Union)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced call center volume by <span className="font-bold">45%</span></li>
                <li>Increased cross-sell success by <span className="font-bold">20%</span></li>
                <li>Boosted mobile app engagement by <span className="font-bold">60%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI helps community banks compete with the big guys—without losing their personal touch.</div>
          </div>

          {/* 6. AI Fraud Detection for Crowdfunding/P2P Platforms */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Fraud Detection for Crowdfunding/P2P Platforms</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Computer vision and NLP cross-check ID photos, social media, and device fingerprints to spot scams on P2P platforms.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">SeedLegals (EU Crowdfunding Startups)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Blocked <span className="font-bold">94%</span> of fraudulent campaigns pre-launch</li>
                <li>Reduced chargebacks by <span className="font-bold">62%</span></li>
                <li>Cut manual review time from 45 mins to &lt;2 mins per case</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI keeps P2P and crowdfunding platforms safe, fast, and scalable.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Finance Solutions
        </a>
      </div>
    </div>
  );
}

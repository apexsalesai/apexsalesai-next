import React from 'react';
import Image from 'next/image';

export default function ServicesSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Professional Services Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Automate workflows, improve accuracy, and deliver better client outcomes with AI agents for law, accounting, consulting, and more.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI helps services firms win more business and deliver at scale with smarter automation.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. AI-Powered Contract Review & Legal Document Analysis */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Contract Review & Legal Document Analysis</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">NLP-powered AI scans contracts to flag risks, suggest edits, and extract key terms in seconds.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Kira Systems (Deloitte Legal)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced contract review time by <span className="font-bold">80%</span></li>
                <li>Cut client billing hours by <span className="font-bold">35%</span></li>
                <li>Increased deal velocity by <span className="font-bold">50%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI frees up $1M+/year in associate time for higher-value work.</div>
          </div>

          {/* 2. AI-Driven Talent Matching for Consulting & Staffing Firms */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Talent Matching for Consulting & Staffing Firms</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning analyzes skills, project history, and client needs to build optimal teams and boost project success.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">PwC’s Talent Exchange</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Improved project profitability by <span className="font-bold">18%</span></li>
                <li>Reduced bench time by <span className="font-bold">25%</span></li>
                <li>Increased employee retention by <span className="font-bold">30%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI turns staffing into a predictive science.</div>
          </div>

          {/* 3. AI for Automated Financial Auditing */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Automated Financial Auditing</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI cross-checks 100% of transactions to detect fraud or errors—impossible for humans to match.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">EY’s Helix (Unilever Audit)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Cut audit time from 3 weeks to 4 days</li>
                <li>Identified $2.3M in hidden tax savings</li>
                <li>Reduced compliance risk with <span className="font-bold">99.9%</span> anomaly detection</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI makes 100% transaction testing feasible.</div>
          </div>

          {/* 4. AI for Automated Proposal Generation */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Automated Proposal Generation</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">GPT-based AI drafts, customizes, and formats proposals—suggesting pricing, legal clauses, and differentiators.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">PandaDoc (Consulting & Marketing)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced proposal creation time from hours to minutes</li>
                <li>Increased win rates by <span className="font-bold">20%+</span></li>
                <li>Freed up BD teams for client relationships</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI levels the playing field for SMBs in RFPs.</div>
          </div>

          {/* 5. AI Chatbots for Client Onboarding */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Chatbots for Client Onboarding</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI automates intake, FAQ responses, and compliance checks for new clients.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Docyt (Financial Services Automation)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced onboarding time from days to hours</li>
                <li>Cut admin costs by <span className="font-bold">40%</span></li>
                <li>Improved compliance with auto-flagging</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI lets solo practitioners scale without extra staff.</div>
          </div>

          {/* 6. AI for Automated Proposal Generation (SMB Focus) */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Automated Proposal Generation (SMB Focus)</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Drafts, customizes, and formats proposals for SMBs—enabling small firms to compete for enterprise contracts.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">PandaDoc (Startups & SMBs)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced proposal time from hours to minutes</li>
                <li>Increased win rates by <span className="font-bold">20%+</span></li>
                <li>Freed up small teams for growth</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI lets SMBs punch above their weight in business development.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Services Solutions
        </a>
      </div>
    </div>
  );
}

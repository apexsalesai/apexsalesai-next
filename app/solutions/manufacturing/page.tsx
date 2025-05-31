import React from 'react';
import Image from 'next/image';

export default function ManufacturingSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Manufacturing Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Unlock operational excellence with AI agents that predict failures, cut waste, and deliver Six Sigma+ quality at scale.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI empowers manufacturers to boost uptime, reduce costs, and win more contracts with autonomous intelligence.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. Predictive Maintenance for Industrial Equipment */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Predictive Maintenance for Industrial Equipment</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning analyzes sensor data to predict failures before they occur, preventing costly downtime.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Siemens (Amberg Electronics Plant)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced unplanned downtime by <span className="font-bold">75%</span></li>
                <li>Cut maintenance costs by <span className="font-bold">30%</span></li>
                <li>Extended equipment lifespan by <span className="font-bold">20%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">For a mid-sized plant, predictive AI can save $3M+/year in lost production.</div>
          </div>

          {/* 2. AI-Driven Quality Control (Computer Vision) */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Quality Control (Computer Vision)</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Deep learning analyzes production line images to spot microscopic defects in real time—no more missed flaws.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Foxconn (iPhone Production)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced escape defects by <span className="font-bold">90%</span></li>
                <li>Cut QC labor costs by <span className="font-bold">50%</span></li>
                <li>Accelerated line speed by <span className="font-bold">25%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI achieves Six Sigma+ quality (99.99966% accuracy) at scale.</div>
          </div>

          {/* 3. Autonomous Material Optimization & Waste Reduction */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Autonomous Material Optimization & Waste Reduction</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Reinforcement learning algorithms calculate the most efficient material usage patterns, cutting waste and costs.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Stanley Black & Decker</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced raw material waste by <span className="font-bold">15%</span> ($7M/year savings)</li>
                <li>Improved energy efficiency by <span className="font-bold">12%</span></li>
                <li>Shortened design-to-production time by <span className="font-bold">30%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI turns waste into profit and accelerates innovation.</div>
          </div>

          {/* 4. AI-Powered Production Scheduling for Job Shops */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Production Scheduling for Job Shops</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Autonomous scheduling algorithms optimize job sequences, boosting utilization and reducing late deliveries.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">JobPack (50+ European SMMs)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Increased machine utilization from <span className="font-bold">65% to 85%</span></li>
                <li>Reduced late deliveries by <span className="font-bold">40%</span></li>
                <li>Cut overtime costs by <span className="font-bold">$120K/year</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI delivers ERP-level scheduling at a fraction of the cost.</div>
          </div>

          {/* 5. AI Visual Inspection for Small Production Lines */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Visual Inspection for Small Production Lines</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Cloud-based AI uses existing cameras to check quality—no $250K smart cameras needed.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Qualitas Technologies (Indian Auto Parts Supplier)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced customer returns by <span className="font-bold">60%</span></li>
                <li>Cut inspection costs by <span className="font-bold">75%</span></li>
                <li>Enabled a $5M/year Tier 1 contract (AI QC required)</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI quality control is now affordable for every factory.</div>
          </div>

          {/* 6. AI-Driven Energy Optimization for Small Factories */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Energy Optimization for Small Factories</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">ML analyzes smart meter data to pinpoint waste and recommend savings—no sub-metering required.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Verdigris (U.S. Metal Fabricators)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced energy bills by <span className="font-bold">22%</span> ($45K/year savings)</li>
                <li>Identified a failing motor before burnout (saved $80K)</li>
                <li>Achieved ISO 50001 certification (won new contracts)</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI energy insights drive profit and sustainability for SMMs.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Manufacturing Solutions
        </a>
      </div>
    </div>
  );
}

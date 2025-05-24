// app/components/BeyondTraditionalSection.tsx
"use client";

export default function BeyondTraditionalSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#181f2f] to-[#0d1321]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">Beyond Traditional Sales Tools</h2>
        <p className="text-lg text-[#cbd5e0] mb-12 max-w-2xl mx-auto">Discover how ApexSalesAI's autonomous agents outperform conventional sales technologies.</p>
        <div className="grid md:grid-cols-2 gap-10 mb-8">
          <div className="panel flex flex-col items-center shadow-lg radius-lg bg-[#1a202c]/70 border border-[#00c2cb]/10 p-8">
            <h3 className="heading-lg mt-2 mb-2 text-[#00c2cb]">ApexSalesAI Autonomous Agents</h3>
            <p className="text-[#a0aec0] text-base mb-4">AI agents that think, decide, and act independently to drive revenue—without requiring constant human oversight.</p>
            <ul className="text-left mb-6 space-y-2">
              <li className="flex items-start"><span className="text-[#00c2cb] mr-2 mt-1">✓</span>Autonomous execution (no manual intervention)</li>
              <li className="flex items-start"><span className="text-[#00c2cb] mr-2 mt-1">✓</span>24/7 operation across channels</li>
              <li className="flex items-start"><span className="text-[#00c2cb] mr-2 mt-1">✓</span>Personalized, real-time outreach</li>
              <li className="flex items-start"><span className="text-[#00c2cb] mr-2 mt-1">✓</span>Learns and improves with every interaction</li>
              <li className="flex items-start"><span className="text-[#00c2cb] mr-2 mt-1">✓</span>Books meetings, qualifies leads, closes deals</li>
            </ul>
            <a href="/platform" className="btn-primary mt-auto">Experience Autonomous Revenue</a>
          </div>
          <div className="panel flex flex-col items-center shadow-lg radius-lg bg-[#1a202c]/70 border border-[#00c2cb]/10 p-8">
            <h3 className="heading-lg mt-2 mb-2 text-[#a0aec0]">Traditional Sales Tools</h3>
            <p className="text-[#a0aec0] text-base mb-4">Passive systems that analyze data and provide suggestions but require constant human management to deliver value.</p>
            <ul className="text-left mb-6 space-y-2">
              <li className="flex items-start"><span className="text-[#ff4d4f] mr-2 mt-1">✗</span>Require constant human management</li>
              <li className="flex items-start"><span className="text-[#ff4d4f] mr-2 mt-1">✗</span>Limited to business hours</li>
              <li className="flex items-start"><span className="text-[#ff4d4f] mr-2 mt-1">✗</span>One-size-fits-all messaging</li>
              <li className="flex items-start"><span className="text-[#ff4d4f] mr-2 mt-1">✗</span>Only provide suggestions, not actions</li>
              <li className="flex items-start"><span className="text-[#ff4d4f] mr-2 mt-1">✗</span>Can’t learn or adapt on their own</li>
            </ul>
            <a href="/demo" className="btn-secondary mt-auto">See Why Companies Are Switching</a>
          </div>
        </div>
      </div>
    </section>
  );
}

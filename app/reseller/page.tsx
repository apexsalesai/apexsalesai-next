'use client';
import React from 'react';

export default function ResellerPage() {
  return (
    <div className="bg-[#0d1321] text-slate-100 min-h-screen font-inter">
      {/* Hero Section with Sharpened Value Prop */}
      <section className="hero py-20 text-center relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">Partner Ecosystem Program</h1>
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">Built for MSPs, VARs, Distributors & Channel Innovators</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg text-slate-300">Whether you’re an MSP, VAR, distributor, or SaaS consultant, ApexSalesAI gives you the tools, support, and margins to dominate the AI sales revolution.</p>
          <div>
            <a href="#partner-tiers" className="btn bg-cyan-400 text-[#0d1321] font-semibold px-6 py-3 rounded-lg shadow-lg mr-3 hover:bg-cyan-500 transition">Explore Program Tiers</a>
            <a href="/contact" className="btn border-2 border-cyan-400 text-cyan-400 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-900 transition">Apply Now</a>
          </div>
        </div>
      </section>

      {/* Who Should Partner Section */}
      <section className="who-partner-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Who Should Partner With Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🛠️</span>
              <h4 className="font-semibold mb-2">Managed Service Providers (MSPs)</h4>
              <p>Expand your portfolio with AI-driven revenue solutions.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🏢</span>
              <h4 className="font-semibold mb-2">Value-Added Resellers (VARs)</h4>
              <p>Deliver next-gen automation to your enterprise clients.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">🌐</span>
              <h4 className="font-semibold mb-2">Distributors</h4>
              <p>Bring AI innovation to your channel network.</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">💡</span>
              <h4 className="font-semibold mb-2">Consultants & ISVs</h4>
              <p>Enhance offerings with proven AI sales tech.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section py-16 bg-gradient-to-r from-cyan-900 to-[#0d1321]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-cyan-300">Why ApexSalesAI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center bg-[#13203a] rounded-xl p-6 shadow-lg">
              <span className="text-5xl mb-3">💰</span>
              <h4 className="font-semibold mb-2 text-cyan-400">Unmatched Margins</h4>
              <p>Industry-leading commissions and recurring revenue for every deal.</p>
            </div>
            <div className="flex flex-col items-center bg-[#13203a] rounded-xl p-6 shadow-lg">
              <span className="text-5xl mb-3">⚡</span>
              <h4 className="font-semibold mb-2 text-cyan-400">Lightning-Fast Enablement</h4>
              <p>Onboard in days, not weeks—with full sandbox access and white-glove support.</p>
            </div>
            <div className="flex flex-col items-center bg-[#13203a] rounded-xl p-6 shadow-lg">
              <span className="text-5xl mb-3">🤝</span>
              <h4 className="font-semibold mb-2 text-cyan-400">True Partnership</h4>
              <p>Co-marketing, lead sharing, and joint wins—your success is our mission.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Success Stories */}
      <section className="success-stories-section py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Partner Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#232b3a] rounded-xl p-6 shadow-lg text-center">
              <h4 className="text-xl font-bold text-cyan-400 mb-2">$100K+ new ARR in 6 months</h4>
              <p>One of our MSP partners closed six-figure new business in their first two quarters.</p>
            </div>
            <div className="bg-[#232b3a] rounded-xl p-6 shadow-lg text-center">
              <h4 className="text-xl font-bold text-cyan-400 mb-2">Doubled client retention with AI automation</h4>
              <p>A VAR leveraged our platform to deliver automated sales support, doubling their client retention rate.</p>
            </div>
            <div className="bg-[#232b3a] rounded-xl p-6 shadow-lg text-center">
              <h4 className="text-xl font-bold text-cyan-400 mb-2">White-labeled for 20+ enterprise clients</h4>
              <p>A distributor successfully deployed our white-label solution to over 20 enterprise customers in under a year.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Revenue Calculator */}
      <section className="revenue-calculator-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Estimate Your Revenue Potential</h2>
          <RevenueCalculator />
        </div>
      </section>

      {/* Co-Marketing & Lead Sharing Section */}
      <section className="co-marketing-section py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Co-Marketing & Lead Sharing</h2>
          <p className="max-w-2xl mx-auto text-center text-lg">We invest in our partners: co-branded campaigns, lead referrals, and joint events help you grow faster and win more business. Our marketing team works hand-in-hand with you to generate demand and accelerate your pipeline.</p>
        </div>
      </section>

      {/* Technical Enablement Section */}
      <section className="technical-enablement-section py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Technical Enablement & Integration Support</h2>
          <ul className="max-w-xl mx-auto text-lg list-disc list-inside space-y-3">
            <li>✔️ Guided onboarding and sandbox access for your team</li>
            <li>✔️ Comprehensive API documentation</li>
            <li>✔️ Dedicated integration specialists</li>
            <li>✔️ Access to our developer community and support resources</li>
          </ul>
        </div>
      </section>

      {/* Call To Action Section */}
      <section className="cta-section py-20 bg-gradient-to-r from-cyan-400 to-blue-600 text-center text-[#0d1321]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-4 drop-shadow-lg">Ready to Dominate the AI Sales Revolution?</h2>
          <p className="text-xl mb-8 font-semibold">Join the ApexSalesAI Partner Ecosystem and unlock new revenue, unrivaled support, and a real competitive edge.</p>
          <a href="/contact" className="inline-block bg-[#0d1321] text-cyan-300 px-10 py-4 rounded-xl font-bold text-2xl shadow-xl hover:bg-cyan-950 hover:text-white transition">Apply Now</a>
        </div>
      </section>
    </div>
  );
}

// Interactive Revenue Calculator Component
function RevenueCalculator() {
  const [clients, setClients] = React.useState(10);
  const [dealSize, setDealSize] = React.useState(5000);
  const [margin, setMargin] = React.useState(40);
  const [revenue, setRevenue] = React.useState<number|null>(null);

  function calculate() {
    const est = clients * dealSize * (margin / 100);
    setRevenue(est);
  }

  return (
    <form className="bg-[#232b3a] rounded-xl p-8 shadow-lg max-w-md mx-auto text-center">
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Number of Clients</label>
        <input type="number" min={1} value={clients} onChange={e => setClients(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#1a202c] text-white" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">Average Deal Size ($)</label>
        <input type="number" min={1000} value={dealSize} onChange={e => setDealSize(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#1a202c] text-white" />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-semibold">First-Year Margin (%)</label>
        <input type="number" min={10} max={50} value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full px-3 py-2 rounded bg-[#1a202c] text-white" />
      </div>
      <button type="button" onClick={calculate} className="btn bg-cyan-400 text-[#0d1321] font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-cyan-500 transition">Calculate</button>
      {revenue !== null && (
        <div className="mt-6 text-xl font-bold text-cyan-400">Estimated First-Year Revenue: ${revenue.toLocaleString()}</div>
      )}
    </form>
  );
}

'use client';
import Link from "next/link";

export default function AiAgentsPage() {
  return (
    <div className="min-h-screen bg-[#0d1321] text-[#e2e8f0]">
      {/* Hero Section */}
      <section className="pt-28 pb-16 text-center bg-gradient-to-b from-[#00c2cb]/10 to-[#0d1321]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-[#00c2cb]/80 bg-clip-text text-transparent">Meet the ApexSalesAI Agents</h1>
          <p className="text-xl md:text-2xl font-semibold text-[#00c2cb] mb-8 max-w-3xl mx-auto">Predictive. Autonomous. Relentless. Our AI agents are transforming revenue execution for the boldest teams on the planet.</p>
          <Link href="/demo" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-[#00b3bf] transition-all duration-300 text-lg">Request a Demo</Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#00c2cb]">What Makes Our Agents Unstoppable?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#181f2f] rounded-xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <span className="mb-4 text-5xl text-[#00c2cb] inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Predictive Insights</h3>
              <p className="text-[#cbd5e0]">Our agents see around corners. They surface opportunities before anyone else and drive action with real-time intelligence.</p>
            </div>
            <div className="bg-[#181f2f] rounded-xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <span className="mb-4 text-5xl text-[#00c2cb] inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h2l1 2h13l1-2h2" /></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Autonomous Execution</h3>
              <p className="text-[#cbd5e0]">No more waiting. No more manual busywork. Our agents engage, follow up, and execute—automatically and relentlessly.</p>
            </div>
            <div className="bg-[#181f2f] rounded-xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <span className="mb-4 text-5xl text-[#00c2cb] inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" /></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Seamless Integration</h3>
              <p className="text-[#cbd5e0]">Plug into your CRM, email, and sales stack. Our agents work where you work—no friction, no barriers, just results.</p>
            </div>
            <div className="bg-[#181f2f] rounded-xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-300">
              <span className="mb-4 text-5xl text-[#00c2cb] inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 8c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6z" /></svg>
              </span>
              <h3 className="font-bold text-xl mb-2">Always Learning</h3>
              <p className="text-[#cbd5e0]">Our agents never stop improving. Every interaction, every deal, every insight makes them smarter and more effective.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-[#00c2cb]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-[#052438]">How Teams Use ApexSalesAI Agents</h2>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-lg text-left">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Pipeline Acceleration</h3>
              <p className="text-[#052438]">Agents identify high-potential leads and move them through the funnel faster—no more missed opportunities.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-left">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Customer Engagement</h3>
              <p className="text-[#052438]">Agents engage prospects 24/7, answer questions, and nurture relationships so your team can focus on closing.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-left">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Forecasting & Insights</h3>
              <p className="text-[#052438]">Agents deliver real-time insights and forecasts, empowering leaders to make bold, data-driven decisions.</p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-left">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Seamless Handoffs</h3>
              <p className="text-[#052438]">Agents coordinate handoffs between sales, marketing, and customer success so nothing falls through the cracks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center bg-gradient-to-b from-[#0d1321] to-[#00c2cb]/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to See the Future of Revenue?</h2>
          <p className="text-xl text-[#00c2cb] mb-8 max-w-2xl mx-auto">Book a personalized demo and discover how ApexSalesAI Agents can transform your business—today.</p>
          <Link href="/demo" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-4 px-10 rounded-xl shadow-xl hover:bg-[#00b3bf] transition-all duration-300 text-lg">Schedule Your Demo</Link>
        </div>
      </section>
    </div>
  );
}

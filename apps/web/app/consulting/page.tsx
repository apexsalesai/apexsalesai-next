'use client';
import ConsultingSection from '../components/ConsultingSection';

export default function ConsultingPage() {
  return (
    <main className="bg-gradient-to-b from-white/90 to-[#f8fafc] min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-[#0d1321] text-white text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Unleash Growth with Apex Consulting</h1>
          <p className="text-lg md:text-2xl mb-8 max-w-2xl mx-auto">From IT to AI, MSP to Channel—our experts help startups and enterprises scale, automate, and win. Our AI agents <span className='text-[#00c2cb] font-bold'>enhance your team</span>, never replace the human touch.</p>
          <a href="#book" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#00b3bf] transition-all duration-300">Book a Free Consultation</a>
        </div>
      </section>

      {/* Consulting Solutions Cards (from homepage section) */}
      <ConsultingSection />

      {/* Professional & Managed Services */}
      <section className="py-16 bg-[#f8fafc] border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#0d1321]">Professional & Managed Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Custom Web Development</h3>
              <p className="text-gray-600">Modern websites & apps using React, Next.js, and Tailwind CSS.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Website Modernization</h3>
              <p className="text-gray-600">Upgrade legacy sites to fast, secure, and scalable platforms.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Managed Hosting & Maintenance</h3>
              <p className="text-gray-600">Ongoing support, updates, and security for your web presence.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Content & SEO Services</h3>
              <p className="text-gray-600">Content creation, optimization, and analytics integration.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">API & Backend Integration</h3>
              <p className="text-gray-600">Connect your site to CRMs, ERPs, payment gateways, and more.</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">White-Label Development</h3>
              <p className="text-gray-600">Development for agencies and partners under your brand.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6 mb-6">
            <a href="/contact" className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#00b3bf] transition-all duration-300">Request a Quote</a>
            <a href="#book" className="bg-[#0d1321] text-[#00c2cb] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#091018] transition-all duration-300">Book a Discovery Call</a>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#0d1321]">Solutions for Every Stage</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">IT & Cloud Consulting</h3>
              <p className="text-gray-600">Infrastructure, security, migrations, and managed services for modern businesses.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">AI Agent Enablement</h3>
              <p className="text-gray-600">Deploy AI agents to automate, augment, and empower your workforce—24/7 productivity, always-on support.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">MSP & Outsourcing</h3>
              <p className="text-gray-600">Flexible managed services, IT helpdesk, and operational support for startups and scale-ups.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
              <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">VAR & Channel Partnerships</h3>
              <p className="text-gray-600">Leverage our vendor relationships to access best-in-class technology, pricing, and support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Agents as Staff Enhancers */}
      <section className="py-16 bg-gradient-to-r from-[#f8fafc] to-[#e0f7fa] border-b border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 text-[#0d1321]">AI Agents: Your Team, Enhanced</h2>
            <p className="text-lg text-gray-700 mb-4">Our AI agents don’t replace people—they <span className="text-[#00c2cb] font-semibold">amplify your best talent</span> and fill gaps 24/7. Use them as digital co-workers, not just bots.</p>
            <ul className="list-disc ml-6 text-gray-700 mb-4">
              <li>Handle repetitive tasks so your team can focus on high-value work</li>
              <li>Provide after-hours coverage and instant response</li>
              <li>Complement your staff, support rapid scaling, or fill open roles</li>
            </ul>
            <a href="#book" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-2 px-6 rounded-lg shadow hover:bg-[#00b3bf] transition-all">See AI in Action</a>
          </div>
          <div className="flex-1 flex justify-center">
            <img src="/images/ai-enhance-team.svg" alt="AI Enhances Teams" width="400" height="400" loading="lazy" className="w-full max-w-md" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
          </div>
        </div>
      </section>

      {/* Features Grid for MSP/VAR/Channel */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10 text-[#0d1321]">Why Choose Apex?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Startup Specialists</h3>
              <p className="text-gray-600">We help new ventures launch, scale, and automate—fast. Fractional CTO, IT, and AI expertise on demand.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">Enterprise Ready</h3>
              <p className="text-gray-600">Scalable solutions for growing companies—security, compliance, and best practices built in.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">MSP & VAR Channel</h3>
              <p className="text-gray-600">Access to top-tier vendors, exclusive pricing, and seamless integration through our channel partnerships.</p>
            </div>
            <div className="bg-[#f8fafc] rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="font-bold text-lg mb-2 text-[#00c2cb]">White-Glove Support</h3>
              <p className="text-gray-600">Dedicated specialists, 24/7 helpdesk, and ongoing enablement for your team’s success.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (placeholder) */}
      <section className="py-16 bg-[#f8fafc]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-[#0d1321]">What Our Clients Say</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md border border-gray-100">
              <p className="text-gray-700 italic mb-4">“Apex helped us launch our SaaS startup with zero IT headaches and instant AI support for our sales team. We scaled 3x in 6 months.”</p>
              <div className="font-bold text-[#00c2cb]">Founder, FinTech Startup</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md border border-gray-100">
              <p className="text-gray-700 italic mb-4">“Their MSP and channel expertise gave us access to best-in-class tech and pricing. Our operations are now fully automated.”</p>
              <div className="font-bold text-[#00c2cb]">COO, SaaS Company</div>
            </div>
          </div>
        </div>
      </section>

      {/* Book a Consultation CTA */}
      <section id="book" className="py-16 bg-[#00c2cb] text-[#0d1321] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Your Growth?</h2>
          <p className="text-lg mb-8">Book a free strategy session with our consulting team—discover how Apex can help you automate, scale, and win in your market.</p>
          <a href="/contact" className="inline-block bg-[#0d1321] text-[#00c2cb] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#091018] transition-all duration-300">Book Now</a>
        </div>
      </section>
    </main>
  );
}


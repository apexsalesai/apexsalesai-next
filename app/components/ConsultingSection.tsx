export default function ConsultingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-white/90 to-[#f8fafc] border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-[#0d1321]">Consulting Solutions for Enterprise Growth</h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">Unlock the full potential of your revenue operations with our expert consulting services. We partner with your team to design, implement, and optimize AI-driven sales and marketing strategies tailored to your business goals.</p>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
            <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">AI Strategy & Roadmap</h3>
            <p className="text-gray-600">Custom AI adoption plans, readiness assessments, and change management for your organization.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
            <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Sales Process Optimization</h3>
            <p className="text-gray-600">Streamline workflows, automate tasks, and accelerate deal cycles with AI-powered insights.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs text-left border border-gray-100 hover:shadow-xl transition">
            <h3 className="font-bold text-xl mb-2 text-[#00c2cb]">Change Enablement</h3>
            <p className="text-gray-600">Training, onboarding, and ongoing support to maximize adoption and ROI from AI agents.</p>
          </div>
        </div>
        <a href="/consulting" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg shadow-lg hover:bg-[#00b3bf] transition-all duration-300">Book a Consultation</a>
      </div>
    </section>
  );
}

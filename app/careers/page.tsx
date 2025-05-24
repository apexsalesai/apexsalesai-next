import Link from "next/link";

export default function Careers() {
  return (
    <div className="min-h-screen bg-white text-[#052438]">
      <section className="pt-24 pb-12 text-center bg-gradient-to-b from-[#00c2cb]/10 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Join the ApexSalesAI Team</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 text-[#00c2cb] font-semibold">We are seeking passionate innovators, builders, and leaders who want to change the way the world works. If you are ready to make an impact, you belong here.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Roles</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">AI Ethics Researcher</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Help us build responsible AI by developing frameworks and guidelines for ethical AI deployment in sales contexts, focusing on transparency, fairness, and user trust.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">Sales Engineer</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Work directly with customers to implement and optimize ApexSalesAI solutions, bridging the gap between technology and business value.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">AI Product Manager</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Drive the roadmap for our AI platform, collaborating with engineering, design, and customers to deliver breakthrough features.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">Customer Success Leader</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Champion customer adoption, satisfaction, and growth by delivering world-class support and insights for our clients.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">Enterprise Account Executive</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Drive new business and expand relationships with enterprise clients, bringing ApexSalesAI solutions to organizations worldwide.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
            <div className="bg-[#f7fafc] rounded-lg p-6 border-t-4 border-[#00c2cb] shadow hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-bold mb-2">Solution Architect</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="mb-4">Design and deliver scalable AI solutions, working closely with clients and internal teams to ensure success from concept to deployment.</p>
              <a href="mailto:careers@apexsalesai.com" className="text-[#00c2cb] font-semibold hover:underline">Apply Now</a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-[#00c2cb]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00c2cb]">Why ApexSalesAI?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-[#052438]">We are a team of relentless innovators and passionate builders. We move fast. We support each other. We celebrate big wins and learn from every challenge. Here, you will find energy, purpose, and the opportunity to make a real impact.</p>
          <Link href="/about" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">Learn More About Us</Link>
        </div>
      </section>

      <section className="py-12 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Change the World?</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6">Send your resume and a note about why you want to join our mission to <a className="underline text-[#00c2cb] font-bold" href="mailto:careers@apexsalesai.com">careers@apexsalesai.com</a>. We cannot wait to meet you.</p>
        </div>
      </section>
    </div>
  );
}

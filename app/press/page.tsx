import Link from "next/link";

export default function Press() {
  return (
    <div className="min-h-screen bg-white text-[#052438]">
      <section className="pt-24 pb-12 text-center bg-gradient-to-b from-[#00c2cb]/10 to-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">ApexSalesAI Press & Media</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 text-[#00c2cb] font-semibold">Find our latest news, media resources, and company announcements here. For media inquiries, please contact <a href="mailto:press@apexsalesai.com" className="underline text-[#00c2cb] font-bold">press@apexsalesai.com</a>.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-[#00c2cb]">Latest Announcements</h2>
          <ul className="space-y-6 max-w-2xl mx-auto text-left">
            <li className="bg-[#f7fafc] p-6 rounded-lg shadow">
              <h3 className="font-bold text-lg mb-2">ApexSalesAI Launches Next-Generation Revenue AI Platform</h3>
              <p className="mb-2 text-[#052438]">ApexSalesAI unveils its predictive autonomous agents platform, setting a new standard for enterprise sales and marketing automation.</p>
              <span className="text-sm text-[#a0aec0]">May 2025</span>
            </li>
            {/* Add more news as they happen */}
          </ul>
        </div>
      </section>

      <section className="py-12 bg-[#00c2cb]/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#00c2cb]">Press Kit</h2>
          <p className="text-lg max-w-2xl mx-auto mb-6 text-[#052438]">Download our logo, product screenshots, and company boilerplate for media use. For custom requests, email <a href="mailto:press@apexsalesai.com" className="underline text-[#00c2cb] font-bold">press@apexsalesai.com</a>.</p>
          <a href="/images/apex-logo.png" download className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">Download Logo</a>
        </div>
      </section>
    </div>
  );
}

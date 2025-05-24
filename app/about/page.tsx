// app/about/page.tsx
import Link from 'next/link';
import Image from 'next/image';

export default function About() {
  return (
    <>
      <section className="pt-20 pb-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#00c2cb] opacity-10 filter blur-[100px] z-0"></div>
          <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#005f6b] opacity-10 filter blur-[80px] z-0"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Revolutionizing the Way the World Works</h1>
<p className="text-xl text-[#00c2cb] font-semibold max-w-3xl mx-auto mb-2">
  ApexSalesAI brings next-generation AI agents to every corner of your organization—empowering teams to move faster, serve smarter, and unlock new growth in every interaction.
</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
<p className="text-[#cbd5e0] mb-6 text-lg">
  Turning every customer interaction—across every department and industry—into an opportunity for growth.
</p>
<p className="text-[#cbd5e0] text-lg">
  We believe AI should do the heavy lifting: predicting, engaging, and executing so your business can scale faster and smarter than ever before. Whether in sales, support, operations, or beyond, ApexSalesAI empowers teams to deliver more value, with less effort, everywhere.
</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership</h2>
          
          <div className="max-w-lg mx-auto">
            <div className="bg-[#2d3748] rounded-xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="w-32 h-32 rounded-full border-4 border-[#00c2cb] overflow-hidden mx-auto mb-6">
                <Image 
                  src="/max-avatar.png" 
                  alt="Tim Bryant, CEO"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-2xl font-bold mb-1">Tim Bryant</h3>
              <div className="text-[#00c2cb] font-medium mb-4">Chief Executive Officer</div>
              <p className="text-[#cbd5e0] mb-4">
                Tim is a visionary AI strategist and seasoned executive with over 20 years of leadership experience driving growth for technology and enterprise sales organizations.
              </p>
              <a href="https://www.linkedin.com/in/y2kdad" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-10 h-10 bg-[rgba(0,194,203,0.1)] text-[#00c2cb] rounded-full hover:bg-[#00c2cb] hover:text-[#0d1321] transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Join Our Team</h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#1a202c] rounded-lg p-6 border-t-4 border-[#00c2cb] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2">Senior AI/ML Engineer</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="text-[#cbd5e0] mb-4">Lead the development of our next-generation conversational AI models. You'll architect and implement sophisticated NLP systems that power our autonomous sales agents.</p>
              <Link href="/careers" className="text-[#00c2cb] font-semibold hover:underline">
                Learn More
              </Link>
            </div>
            
            <div className="bg-[#1a202c] rounded-lg p-6 border-t-4 border-[#00c2cb] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2">NLP Specialist</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="text-[#cbd5e0] mb-4">Enhance our language understanding capabilities to help our AI agents handle complex sales conversations, objection handling, and nuanced customer interactions.</p>
              <Link href="/careers" className="text-[#00c2cb] font-semibold hover:underline">
                Learn More
              </Link>
            </div>
            
            <div className="bg-[#1a202c] rounded-lg p-6 border-t-4 border-[#00c2cb] transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <h3 className="text-xl font-bold mb-2">AI Ethics Researcher</h3>
              <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] text-sm py-1 px-3 rounded-full mb-4">Full-time • Remote</span>
              <p className="text-[#cbd5e0] mb-4">Help us build responsible AI by developing frameworks and guidelines for ethical AI deployment in sales contexts, focusing on transparency, fairness, and user trust.</p>
              <Link href="/careers" className="text-[#00c2cb] font-semibold hover:underline">
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link href="/careers" className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              View All Positions
            </Link>
          </div>
        </div>
      </section>

      {/* We're Also Looking For Section */}
      <section className="py-12 bg-[#00c2cb]/10">
  <div className="container mx-auto px-4 text-center">
    <h3 className="text-2xl md:text-3xl font-bold mb-4 text-[#00c2cb]">We’re Also Looking For:</h3>
    <p className="mb-6 text-lg text-[#1a202c]">Do you have a passion for AI, automation, and driving business growth? We’re always interested in connecting with exceptional talent, even if your ideal role isn’t listed above.</p>
    <div className="flex flex-wrap justify-center gap-4 mb-6">
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">Sales Engineers</span>
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">AI Product Managers</span>
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">Customer Success Leaders</span>
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">Enterprise Account Executives</span>
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">AI Evangelists</span>
      <span className="bg-white text-[#00c2cb] border border-[#00c2cb] px-4 py-2 rounded-full font-semibold shadow">Solution Architects</span>
    </div>
    <p className="mb-4 text-[#1a202c]">If you’re ready to help shape the future of autonomous revenue operations, <Link href="/contact" className="underline text-[#00c2cb] font-bold">reach out to us</Link> — we’d love to hear from you!</p>
  </div>
</section>

      <section className="py-16 bg-[#091018] text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">From Pipeline to Profit—Let AI Do the Heavy Lifting.</h2>
          <p className="text-xl text-[#9ca3af] mb-8 max-w-3xl mx-auto">
            Book a personalized demo to see how ApexSalesAI can help your team automate, optimize, and win more deals—without the busywork.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link href="/demo" className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Schedule Your Demo
            </Link>
            <Link href="/contact" className="border-2 border-[#00c2cb] text-[#00c2cb] font-bold py-3 px-6 rounded-lg hover:bg-[#00c2cb]/10 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
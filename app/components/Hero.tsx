// components/Hero.tsx
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[#0d1321] z-0"></div>
        <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#00c2cb] opacity-10 filter blur-[100px] z-0"></div>
        <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#005f6b] opacity-10 filter blur-[80px] z-0"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-[rgba(0,194,203,0.1)] text-[#00c2cb] font-bold text-sm py-2 px-4 rounded-full mb-6 border border-[rgba(0,194,203,0.3)]">
              PREDICTIVE AUTONOMOUS REVENUE EXECUTION
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Anticipate.<br/>
              Execute.<br/>
              Elevate.
            </h1>
            <p className="text-xl text-[#cbd5e0] mb-8">
              ApexSalesAI's predictive autonomous agents see revenue opportunities others miss—delivering real-time decisions, hyper-personalized interactions, and unmatched execution velocity.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/demo" 
                className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Experience Max
              </Link>
              <Link 
                href="/platform" 
                className="bg-transparent text-[#00c2cb] border-2 border-[#00c2cb] font-bold py-3 px-6 rounded-lg hover:bg-[rgba(0,194,203,0.1)] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl"
              >
                Discover the Platform
              </Link>
            </div>

            <div className="flex flex-wrap mt-12 gap-8 md:gap-12">
              <div>
                <span className="text-4xl font-bold text-[#00c2cb] block mb-1">47%</span>
                <span className="text-sm text-[#a0aec0]">Pipeline Growth</span>
              </div>
              <div>
                <span className="text-4xl font-bold text-[#00c2cb] block mb-1">3.2x</span>
                <span className="text-sm text-[#a0aec0]">ROI</span>
              </div>
              <div>
                <span className="text-4xl font-bold text-[#00c2cb] block mb-1">67%</span>
                <span className="text-sm text-[#a0aec0]">Faster Response</span>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="bg-[rgba(26,32,44,0.6)] border border-[rgba(0,194,203,0.2)] rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-[rgba(0,194,203,0.08)] border-b border-[rgba(0,194,203,0.2)] p-4 flex justify-between items-center">
                <div className="flex items-center text-[#00c2cb] font-bold">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                  Max • ApexSalesAI Agent
                </div>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f57]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#febc2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#28c840]"></div>
                </div>
              </div>

              <div className="p-6 h-[400px]">
                <div className="flex flex-col">
                  <div className="bg-[#1a202c] text-white rounded-xl rounded-bl-none p-4 max-w-[80%] mb-4 self-start">
                    <div>Good morning! I'm Max, your autonomous sales agent. I've identified 3 high-intent accounts that visited your pricing page in the last 24 hours.</div>
                    <div className="text-xs text-[#a0aec0] mt-2">9:01 AM</div>
                  </div>

                  <div className="bg-[#00c2cb] text-[#0d1321] rounded-xl rounded-br-none p-4 max-w-[80%] mb-4 self-end">
                    <div>Thanks Max. Can you tell me more about these accounts?</div>
                    <div className="text-xs text-[#052438] mt-2">9:02 AM</div>
                  </div>

                  <div className="bg-[#1a202c] text-white rounded-xl rounded-bl-none p-4 max-w-[80%] mb-4 self-start">
                    <div>Absolutely. The highest value lead is TechForward Solutions. They've viewed your enterprise pricing 4 times and downloaded your security whitepaper.</div>
                    <div className="text-xs text-[#a0aec0] mt-2">9:02 AM</div>
                    <div className="mt-2 pt-2 border-t border-dashed border-[rgba(255,255,255,0.1)]">
                      <span className="text-[#00c2cb] font-semibold mr-2">Predictive Score:</span>
                      <span>87% likelihood to convert</span>
                    </div>
                    <div className="mt-1">
                      <span className="text-[#00c2cb] font-semibold mr-2">Estimated Value:</span>
                      <span>$380,000 ARR</span>
                    </div>
                  </div>

                  <div className="flex gap-2 self-start">
                    <div className="w-2 h-2 bg-[#a0aec0] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#a0aec0] rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-[#a0aec0] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[rgba(255,255,255,0.1)] p-4 flex">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-1 bg-[rgba(26,32,44,0.8)] border border-[rgba(255,255,255,0.2)] rounded-full py-2 px-4 text-white text-sm"
                />
                <button className="ml-2 text-[#00c2cb]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

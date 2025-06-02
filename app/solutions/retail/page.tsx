import React from 'react';
import Image from 'next/image';

export default function RetailSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Retail Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Drive revenue, personalize shopping, and automate operations with AI agents for retail—built for SMBs and global chains alike.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI helps retailers win with dynamic pricing, AI-powered checkout, and 24/7 customer service.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. AI-Powered Dynamic Pricing & Promotions */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Heroicons chart-bar as analytics icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="12" width="4" height="8" rx="1" />
                <rect x="9" y="8" width="4" height="12" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Dynamic Pricing & Promotions</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning adjusts prices in real time based on demand, inventory, and competitor signals—maximizing revenue.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Zara's AI Markdown Optimization</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced unsold inventory by <span className="font-bold">28%</span></li>
                <li>Increased gross margins by <span className="font-bold">3.5pp</span></li>
                <li>Shortened markdown cycles from weeks to hours</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI pricing turns missed markdowns into profit—at scale.</div>
          </div>

          {/* 2. Computer Vision for Checkout-Free Stores */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Lucide handshake icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Computer Vision for Checkout-Free Stores</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Camera networks and deep learning enable grab-and-go payments, reducing theft and boosting throughput.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Amazon Go (1,000+ Stores)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Eliminated checkout lines, increasing throughput by <span className="font-bold">40%</span></li>
                <li>Reduced shrinkage by <span className="font-bold">90%</span></li>
                <li>Achieved <span className="font-bold">30%</span> higher revenue/sqft</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Checkout-free tech is now affordable for mid-sized chains.</div>
          </div>

          {/* 3. AI-Driven Personalized Recommendations */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Lucide heart-handshake icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                <path d="M19 13a3 3 0 0 0-3-3V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3z" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Personalized Recommendations</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Deep learning analyzes browsing, purchase, and in-store data to serve hyper-relevant offers and boost conversions.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Sephora's AI Color IQ</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Increased average order value by <span className="font-bold">18%</span></li>
                <li>Boosted repeat purchases by <span className="font-bold">25%</span></li>
                <li>Reduced returns by <span className="font-bold">15%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Personalization drives 35% of Amazon's revenue—AI lets SMBs compete.</div>
          </div>

          {/* 4. AI-Powered Inventory Management for Boutiques */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Heroicons chart-bar as analytics icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="12" width="4" height="8" rx="1" />
                <rect x="9" y="8" width="4" height="12" rx="1" />
                <rect x="15" y="4" width="4" height="16" rx="1" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Inventory Management for Boutiques</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Predictive analytics syncs POS data, weather, and trends to forecast demand and automate reordering.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Stocky (500+ Shopify SMBs)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced overstock by <span className="font-bold">35%</span> ($28K freed up)</li>
                <li>Cut stockouts by <span className="font-bold">50%</span> (sales +18%)</li>
                <li>Automated 80% of POs (saved 10 hrs/week)</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI keeps shelves stocked and cash flowing for small retailers.</div>
          </div>

          {/* 5. AI Chatbots for 24/7 Customer Service */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Lucide headset icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Chatbots for 24/7 Customer Service</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI handles FAQs, tracks orders, and processes returns via SMS, WhatsApp, or web chat.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">ApexsalesAI (Chubbies Shorts, Pet Supply Chains)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Resolved 62% of inquiries without staff</li>
                <li>Increased post-purchase upsells by <span className="font-bold">15%</span></li>
                <li>Cut service costs by <span className="font-bold">40%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI delivers 24/7 service—no missed sales after hours.</div>
          </div>

          {/* 6. AI Visual Search for Local Stores */}
          <div className="bg-white rounded-xl p-6 border border-[#00c2cb]/10 shadow-lg flex flex-col items-center min-h-[370px]">
            {/* Lucide heart-handshake icon */}
            <span className="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#00c2cb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
                <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
                <path d="M19 13a3 3 0 0 0-3-3V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1a3 3 0 0 0 3 3z" />
              </svg>
            </span>
            <div className="flex gap-6 mb-2">
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Visual Search for Local Stores</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Camera-based search lets shoppers snap photos to instantly find similar products and store locations.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Syte (Fashion Boutiques)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Increased conversion by <span className="font-bold">22%</span></li>
                <li>Reduced staff interruptions by <span className="font-bold">70%</span></li>
                <li>Boosted social engagement (3X more photo shares)</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI visual search bridges online inspiration to in-store sales.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Retail Solutions
        </a>
      </div>
    </div>
  );
}

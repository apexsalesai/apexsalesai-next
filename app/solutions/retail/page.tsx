import React from 'react';

export default function RetailSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Retail Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI creates seamless omnichannel experiences and increases customer lifetime value for retailers using predictive AI agents.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Personalize product recommendations at scale</li>
        <li>Identify and engage high-intent shoppers</li>
        <li>Boost basket size and repeat purchases</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

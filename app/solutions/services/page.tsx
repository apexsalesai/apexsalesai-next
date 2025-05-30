import React from 'react';

export default function ServicesSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Professional Services Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI helps services firms nurture prospects, qualify opportunities, and expand their pipeline with AI.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Nurture and qualify leads with intelligent agents</li>
        <li>Surface cross-sell and upsell opportunities</li>
        <li>Enhance client satisfaction and retention</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

import React from 'react';

export default function RealEstateSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Real Estate Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI helps real estate professionals qualify prospects, schedule showings, and provide personalized property recommendations using AI agents.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Qualify and nurture real estate leads automatically</li>
        <li>Automate property recommendations and follow-ups</li>
        <li>Reduce time to close and increase conversions</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

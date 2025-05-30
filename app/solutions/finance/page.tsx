import React from 'react';

export default function FinanceSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Financial Services Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI delivers compliant, personalized customer interactions and financial guidance for banks and financial services firms.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Retain more clients with proactive engagement</li>
        <li>Accelerate acquisition with AI-powered outreach</li>
        <li>Deliver consistent, compliant advice at scale</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

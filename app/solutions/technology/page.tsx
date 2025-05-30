import React from 'react';

export default function TechnologySolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Technology Solutions</h1>
      <p className="text-lg mb-4">Discover how ApexSalesAI empowers technology companies to accelerate sales cycles, personalize demos, and nurture technical buyers using AI agents.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Shorten complex sales cycles with intelligent lead qualification</li>
        <li>Automate demo scheduling and follow-ups</li>
        <li>Deliver hyper-personalized product recommendations</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

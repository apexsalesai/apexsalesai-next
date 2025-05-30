import React from 'react';

export default function HealthcareSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Healthcare Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI helps healthcare organizations navigate compliance, drive patient engagement, and accelerate onboarding with AI-powered agents.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Boost patient engagement with automated follow-ups</li>
        <li>Streamline onboarding and paperwork</li>
        <li>Ensure regulatory compliance in every interaction</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

import React from 'react';

export default function EducationSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Education Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI personalizes student outreach and automates enrollment to increase engagement and reduce admin workload for educational institutions.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Automate enrollment and onboarding</li>
        <li>Personalize student communications at scale</li>
        <li>Increase enrollment and engagement rates</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

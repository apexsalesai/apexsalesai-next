import React from 'react';

export default function ManufacturingSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-6 text-[#00c2cb]">Manufacturing Solutions</h1>
      <p className="text-lg mb-4">ApexSalesAI streamlines distribution and supply chain management with real-time insights and automation for manufacturers.</p>
      <ul className="list-disc ml-6 mb-6 text-[#a0aec0]">
        <li>Improve order accuracy and fulfillment speed</li>
        <li>Automate inventory checks and reporting</li>
        <li>Enhance partner and distributor relationships</li>
      </ul>
      <div className="mt-8">
        <a href="/contact" className="btn-primary px-6 py-3 rounded-full bg-[#00c2cb] text-[#181c20] font-bold">Contact Us for a Demo</a>
      </div>
    </div>
  );
}

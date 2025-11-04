// components/ROIBlock.tsx
'use client';

import { useState } from 'react';

export default function ROIBlock() {
  const [dealSize, setDealSize] = useState(5000);
  const [closeRate, setCloseRate] = useState(20);
  const [salesReps, setSalesReps] = useState(5);
  const [dealsPerMonth, setDealsPerMonth] = useState(10);
  
  // Calculate ROI metrics
  const dealSizeImprovement = dealSize * 0.15;
  const closeRateImprovement = closeRate * 0.3;
  const productivityImprovement = dealsPerMonth * 0.4;
  
  const currentRevenue = dealSize * (closeRate / 100) * salesReps * dealsPerMonth * 12;
  const improvedRevenue = (dealSize + dealSizeImprovement) * 
                         ((closeRate + closeRateImprovement) / 100) * 
                         salesReps * 
                         (dealsPerMonth + productivityImprovement) * 12;
  
  const revenueLift = improvedRevenue - currentRevenue;
  const roi = (revenueLift / 50000) * 100; // Assuming $50k annual investment
  
  return (
    <div className="bg-gray-900 text-white py-12 px-6 md:px-16 rounded-xl">
      <h2 className="text-3xl font-bold mb-4 text-center">Calculate Your ROI</h2>
      <p className="text-xl mx-auto text-gray-300 text-center mb-8">
        Use this strategic calculator to visualize potential revenue lift,
        productivity gains, and customer retention improvements with ApexSalesAI.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <div>
          <label className="block mb-2 text-sm text-gray-400">Avg Deal Size ($)</label>
          <input
            type="number"
            value={dealSize}
            onChange={(e) => setDealSize(Number(e.target.value))}
            placeholder="5000"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Close Rate Improvement (%)</label>
          <input
            type="number"
            value={closeRate}
            onChange={(e) => setCloseRate(Number(e.target.value))}
            placeholder="20"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Number of Sales Reps</label>
          <input
            type="number"
            value={salesReps}
            onChange={(e) => setSalesReps(Number(e.target.value))}
            placeholder="5"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        
        <div>
          <label className="block mb-2 text-sm text-gray-400">Deals per Month per Rep</label>
          <input
            type="number"
            value={dealsPerMonth}
            onChange={(e) => setDealsPerMonth(Number(e.target.value))}
            placeholder="10"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600"
          />
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-gray-800 p-4 rounded-lg h-full">
            <h3 className="text-lg font-bold mb-4 text-[#00c2cb]">Projected Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Revenue Lift</p>
                <p className="text-2xl font-bold">${revenueLift.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">ROI</p>
                <p className="text-2xl font-bold">{roi.toFixed(1)}x</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Productivity</p>
                <p className="text-2xl font-bold">+{productivityImprovement.toFixed(1)} deals/mo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-8 rounded-lg hover:bg-[#00a8b3] transition-all duration-300">
          Get Detailed Analysis
        </button>
      </div>
    </div>
  );
}
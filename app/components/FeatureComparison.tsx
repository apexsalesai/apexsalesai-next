import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Feature {
  name: string;
  apexSalesAI: boolean;
  competitor1: boolean;
  competitor2: boolean;
  competitor3: boolean;
}

const features: Feature[] = [
  {
    name: "Predictive Lead Scoring",
    apexSalesAI: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
  },
  {
    name: "Autonomous Sales Execution",
    apexSalesAI: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
  },
  {
    name: "Real-time Decision Making",
    apexSalesAI: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
  },
  {
    name: "Custom AI Workflows",
    apexSalesAI: true,
    competitor1: false,
    competitor2: false,
    competitor3: false,
  },
  {
    name: "Multi-channel Integration",
    apexSalesAI: true,
    competitor1: true,
    competitor2: true,
    competitor3: false,
  },
  {
    name: "Advanced Analytics",
    apexSalesAI: true,
    competitor1: true,
    competitor2: false,
    competitor3: false,
  },
];

const FeatureComparison: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">Why Choose ApexSalesAI?</h2>
        <p className="text-gray-400">Compare our features with leading competitors</p>
      </div>

      <div className="bg-[#1a1e29] rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0d1321]">
              <th className="py-4 px-6 text-left text-white font-semibold">Features</th>
              <th className="py-4 px-6 text-center text-white font-semibold">ApexSalesAI</th>
              <th className="py-4 px-6 text-center text-white font-semibold">SalesForce</th>
              <th className="py-4 px-6 text-center text-white font-semibold">HubSpot</th>
              <th className="py-4 px-6 text-center text-white font-semibold">Pardot</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-t border-[#2d3748]"
              >
                <td className="py-4 px-6 text-gray-300">{feature.name}</td>
                <td className="py-4 px-6 text-center">
                  {feature.apexSalesAI ? (
                    <CheckIcon className="w-6 h-6 text-[#0ea5e9]" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {feature.competitor1 ? (
                    <CheckIcon className="w-6 h-6 text-[#0ea5e9]" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {feature.competitor2 ? (
                    <CheckIcon className="w-6 h-6 text-[#0ea5e9]" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {feature.competitor3 ? (
                    <CheckIcon className="w-6 h-6 text-[#0ea5e9]" />
                  ) : (
                    <XMarkIcon className="w-6 h-6 text-gray-400" />
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeatureComparison;

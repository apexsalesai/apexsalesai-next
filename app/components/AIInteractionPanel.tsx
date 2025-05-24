import React from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon, ArrowPathIcon, SparklesIcon } from '@heroicons/react/24/outline';

const interactionData = [
  {
    title: 'Conversational AI',
    description: 'Natural language processing at its finest',
    stats: [
      { label: 'Response Time', value: '99.9%', icon: <ArrowPathIcon className="w-5 h-5" /> },
      { label: 'Accuracy', value: '98.5%', icon: <SparklesIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Sales Intelligence',
    description: 'Predictive analytics in real-time',
    stats: [
      { label: 'Lead Qualification', value: '95%', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
      { label: 'Conversion Rate', value: '45%', icon: <SparklesIcon className="w-5 h-5" /> },
    ],
  },
  {
    title: 'Customer Engagement',
    description: 'Personalized interactions at scale',
    stats: [
      { label: 'Customer Satisfaction', value: '97%', icon: <SparklesIcon className="w-5 h-5" /> },
      { label: 'Response Rate', value: '99%', icon: <ChatBubbleLeftRightIcon className="w-5 h-5" /> },
    ],
  },
];

export default function AIInteractionPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1e29] rounded-2xl p-6"
    >
      <h3 className="text-xl font-bold text-white mb-6">AI Agent Interactions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {interactionData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#0d1321] rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#0ea5e9] flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white">{item.title}</h4>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
            <div className="space-y-4">
              {item.stats.map((stat, statIndex) => (
                <div key={statIndex} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {stat.icon}
                    <span className="text-gray-400">{stat.label}</span>
                  </div>
                  <div className="text-2xl font-bold text-[#0ea5e9]">{stat.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function MaxAgentPreview() {
  const [isPlaying, setIsPlaying] = React.useState(false);

  const sampleVoice = "Hello, I'm Max, your AI sales assistant. I'll help you identify high-value opportunities and close deals faster. Ready to see how I can transform your sales process?";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1a1e29] rounded-2xl p-6 relative overflow-hidden"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-[#0ea5e9] flex items-center justify-center">
          <Image
            src="/images/max-avatar.png"
            alt="Max AI Agent"
            width={64}
            height={64}
            className="rounded-full"
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Meet Max</h3>
          <p className="text-gray-400">Your AI Sales Assistant</p>
        </div>
      </div>

      <div className="relative w-full h-48 mb-4">
        <div className="absolute inset-0 bg-[#0d1321] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0ea5e9] flex items-center justify-center">
                <PlayIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm text-gray-300">
                <span className="font-medium text-white">Max</span> • 30 seconds
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-[#0ea5e9] rounded-full hover:bg-[#0284c7] transition-colors duration-200"
              >
                {isPlaying ? (
                  <XMarkIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-300">
        {sampleVoice.split(' ').map((word, index) => (
          <span
            key={index}
            className={`transition-opacity duration-500 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {word}
            {index < sampleVoice.split(' ').length - 1 ? ' ' : ''}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

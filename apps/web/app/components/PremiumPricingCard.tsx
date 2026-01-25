import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/24/outline';

interface PremiumPricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  ctaLink: string;
}

const PremiumPricingCard: React.FC<PremiumPricingCardProps> = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  ctaText,
  ctaLink,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`bg-[#1a1e29] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
        isPopular ? 'border-2 border-[#0ea5e9] border-dashed' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 -right-4 bg-[#0ea5e9] text-white px-4 py-2 rounded-full transform rotate-12">
          Most Popular
        </div>
      )}

      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      <div className="text-center mb-8">
        <span className="text-4xl font-bold text-[#0ea5e9]">{price}</span>
        <span className="text-gray-400">/month</span>
      </div>

      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center text-gray-300">
            <CheckIcon className="w-5 h-5 text-[#0ea5e9] mr-2" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-[#0ea5e9] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#0284c7] transition-colors duration-200"
      >
        <a href={ctaLink} className="block">
          {ctaText}
        </a>
      </motion.button>
    </motion.div>
  );
};

export default PremiumPricingCard;

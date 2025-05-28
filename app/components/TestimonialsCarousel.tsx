'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Sarah Johnson",
    role: "VP of Sales",
    company: "TechCorp",
    quote: "ApexSalesAI has completely transformed our sales process. The predictive insights and autonomous execution capabilities have exceeded our expectations.",
    image: "/images/testimonials/placeholder.jpg",
  },
  {
    name: "Michael Chen",
    role: "Sales Director",
    company: "GrowthTech",
    quote: "The ROI from implementing ApexSalesAI has been phenomenal. We've seen a 40% increase in deal velocity and a 25% improvement in win rates.",
    image: "/images/testimonials/placeholder.jpg",
  },
  {
    name: "Lisa Rodriguez",
    role: "Sales Operations Manager",
    company: "InnovateX",
    quote: "The platform's AI-powered insights have helped us identify high-value opportunities we would have otherwise missed. It's like having a sales genius in our team.",
    image: "/images/testimonials/placeholder.jpg",
  },
];

const TestimonialsCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-2">What Our Customers Say</h2>
        <p className="text-gray-400">Real results from real businesses</p>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1e29] rounded-2xl p-8 relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <img
                  src={testimonials[currentSlide].image}
                  alt={testimonials[currentSlide].name}
                  className="w-16 h-16 rounded-full border-2 border-[#0ea5e9]"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {testimonials[currentSlide].name}
                  </h3>
                  <p className="text-gray-400">
                    {testimonials[currentSlide].role} at {testimonials[currentSlide].company}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-300 italic">
                "{testimonials[currentSlide].quote}"
              </p>
            </div>

            <div className="flex justify-center space-x-4">
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentSlide
                      ? 'bg-[#0ea5e9]'
                      : 'bg-gray-500 hover:bg-gray-400'
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute -left-4 top-1/2 -translate-y-1/2">
          <button
            onClick={prevSlide}
            className="p-2 bg-[#1a1e29] rounded-full hover:bg-[#0ea5e9] transition-colors duration-200"
          >
            <ChevronLeftIcon className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute -right-4 top-1/2 -translate-y-1/2">
          <button
            onClick={nextSlide}
            className="p-2 bg-[#1a1e29] rounded-full hover:bg-[#0ea5e9] transition-colors duration-200"
          >
            <ChevronRightIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsCarousel;

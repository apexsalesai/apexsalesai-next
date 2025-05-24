'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const onboardingSteps = [
  {
    title: "Initial Consultation & Discovery",
    description: "We begin with a personalized consultation to understand your unique challenges, goals, and expectations. This allows us to identify the best AI solution to exceed your needs.",
    image: "/images/onboarding/welcome.svg",
    content: [
      "🤝 One-on-one discovery call with our experts",
      "🔍 Deep dive into your business processes and pain points",
      "🎯 Align on success metrics and desired outcomes"
    ]
  },
  {
    title: "Configure Your AI Agents",
    description: "Customize your autonomous sales execution team.",
    image: "/images/onboarding/agents.svg",
    content: [
      "🤖 Create your first AI sales agent",
      "🎯 Set up custom workflows",
      "📊 Configure analytics dashboards"
    ]
  },
  {
    title: "Connect Your Data",
    description: "Integrate with your existing systems seamlessly.",
    image: "/images/onboarding/integration.svg",
    content: [
      "🔗 Connect your CRM",
      "📊 Sync your analytics",
      "🎯 Automate your workflows"
    ]
  },
  {
    title: "Start Selling Smarter",
    description: "Begin transforming your sales process with AI.",
    image: "/images/onboarding/success.svg",
    content: [
      "🎯 Begin using your AI agents",
      "📊 Monitor your performance",
      "🚀 Scale your success"
    ]
  }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(
    Array(onboardingSteps.length).fill(false)
  );

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCompleted((prev) => {
        const updated = [...prev];
        updated[currentStep] = true;
        return updated;
      });
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1321]">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1e29] rounded-2xl p-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-4">
                {onboardingSteps[currentStep].title}
              </h1>
              <p className="text-gray-400">
                {onboardingSteps[currentStep].description}
              </p>


            </div>

            {/* Stepper Progress Bar - moved down for better separation */}
            <div className="relative mb-16 mt-8">
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2">
                <div className="flex justify-between">
                  {completed.map((isComplete, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        index <= currentStep
                          ? 'bg-[#0ea5e9] text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {index <= currentStep ? (
                        isComplete ? (
                          <CheckIcon className="w-6 h-6" />
                        ) : (
                          <span>{index + 1}</span>
                        )
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2">
                <div className="flex-1 h-0.5 bg-gray-600 rounded-full"></div>
              </div>
            </div>

            <div className="space-y-4">
              {onboardingSteps[currentStep].content.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 text-gray-300"
                >
                  <div className="w-4 h-4 rounded-full bg-[#0ea5e9]" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
              <div className="flex-1 flex justify-start">
                {currentStep > 0 && (
                  <button
                    onClick={handleBack}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Go to previous onboarding step"
                  >
                    Back
                  </button>
                )}
              </div>
              {/* Inline CTA: Talk to an Expert */}
              <div className="flex-1 flex justify-center">
                <a
                  href="/contact"
                  className="inline-block px-6 py-3 bg-cyan-400 text-[#0d1321] font-semibold rounded-lg shadow-lg hover:bg-cyan-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  tabIndex={0}
                  aria-label="Talk to an Expert"
                >
                  Talk to an Expert
                </a>
              </div>
              <div className="flex-1 flex justify-end">
                {currentStep < onboardingSteps.length - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-6 py-3 bg-[#0ea5e9] text-white rounded-lg hover:bg-[#0284c7] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    aria-label="Go to next onboarding step"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      // Show confetti animation on finish (simple CSS/JS fallback)
                      const confetti = document.createElement('div');
                      confetti.className = 'fixed inset-0 pointer-events-none z-50 flex justify-center items-center';
                      confetti.innerHTML = `<svg width="200" height="200"><g><circle cx="100" cy="100" r="80" fill="#00c2cb" opacity="0.2"/><circle cx="60" cy="80" r="8" fill="#00c2cb"/><circle cx="140" cy="120" r="12" fill="#fff"/><circle cx="120" cy="60" r="6" fill="#00c2cb"/><circle cx="80" cy="140" r="10" fill="#fff"/></g></svg>`;
                      document.body.appendChild(confetti);
                      setTimeout(() => confetti.remove(), 1800);
                    }}
                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                    aria-label="Finish onboarding"
                  >
                    Finish
                  </button>
                )}
              </div>
            </div>
            {/* Final Step: Show 'Go to Dashboard' CTA and fun animation */}
            {currentStep === onboardingSteps.length - 1 && (
              <div className="mt-10 flex flex-col items-center">
                <div aria-hidden="true" className="mb-6 animate-bounce">
                  <svg width="96" height="96" viewBox="0 0 96 96"><g><circle cx="48" cy="48" r="40" fill="#00c2cb" opacity="0.15"/><circle cx="32" cy="40" r="8" fill="#00c2cb"/><circle cx="64" cy="60" r="12" fill="#fff"/><circle cx="56" cy="28" r="6" fill="#00c2cb"/><circle cx="40" cy="68" r="10" fill="#fff"/></g></svg>
                </div>
                <p className="text-xl font-semibold text-cyan-300 mb-4">🎉 Onboarding Complete!</p>
                <a
                  href="/dashboard"
                  className="inline-block bg-cyan-400 text-[#0d1321] font-bold px-8 py-3 rounded-xl text-lg shadow-xl hover:bg-cyan-500 transition focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  tabIndex={0}
                  aria-label="Go to Dashboard"
                >
                  Go to Dashboard
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    {/* --- Additional Onboarding Content Below Stepper --- */}

    {/* Features Section */}
    <section className="features-section bg-[#1a202c] py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Comprehensive Onboarding Services</h2>
        <p className="text-center text-[#a0aec0] mb-12">Our expert team guides you through every step of your AI transformation journey with specialized services designed to maximize success.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">⚙️</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Tailored Agent Configuration</h3>
            <p className="text-[#cbd5e0]">Configure AI agents with brand-specific voice, industry targeting parameters, and intelligent workflows that match your exact business needs.</p>
          </div>
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">🔄</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Seamless System Integration</h3>
            <p className="text-[#cbd5e0]">Connect ApexSalesAI with your existing technology ecosystem including CRM, communication channels, and knowledge bases with minimal IT resources.</p>
          </div>
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">🧠</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">AI Training & Calibration</h3>
            <p className="text-[#cbd5e0]">Provide your agents with historical data, product knowledge, and industry context to ensure accurate, consistent interactions from day one.</p>
          </div>
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">📊</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Reporting & Analytics Setup</h3>
            <p className="text-[#cbd5e0]">Configure dashboards and reports that track the metrics that matter most to your business, from pipeline impact to customer satisfaction.</p>
          </div>
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">🔒</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Security & Compliance</h3>
            <p className="text-[#cbd5e0]">Implement enterprise-grade security measures and configure compliance settings that meet regulatory requirements in your industry.</p>
          </div>
          <div className="feature-card bg-[rgba(45,55,72,0.5)] border border-cyan-900 rounded-xl p-8 flex flex-col items-center text-center">
            <div className="feature-icon text-4xl mb-4">👨‍💼</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Team Enablement</h3>
            <p className="text-[#cbd5e0]">Train your sales and support teams to work effectively alongside AI agents with role-specific training sessions and best practice guides.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Timeline Section */}
    <section className="timeline-section bg-[#181f2f] py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Typical Onboarding Timeline</h2>
        <p className="text-center text-[#a0aec0] mb-12">Our structured approach delivers results quickly while ensuring proper configuration and integration. Most clients are fully operational within 2-4 weeks.</p>
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          {[
            { label: 'Discovery & Planning', time: 'Week 1' },
            { label: 'Integration & Setup', time: 'Week 2' },
            { label: 'Configuration & Training', time: 'Week 3' },
            { label: 'Testing & Launch', time: 'Week 4' },
            { label: 'Optimization & Support', time: 'Ongoing' },
          ].map((step, idx) => (
            <div key={idx} className="flex flex-col items-center relative flex-1">
              <div className="w-20 h-20 bg-[#1a202c] border-2 border-cyan-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
                <span className="text-cyan-400 font-bold text-lg">{step.time}</span>
              </div>
              <div className="text-center font-semibold text-[#e2e8f0]">{step.label}</div>
              {idx !== 4 && (
                <div className="hidden md:block absolute top-1/2 right-0 w-full h-1 border-t-2 border-cyan-900 z-0" style={{ left: '100%', width: '80px' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Support Section */}
    <section className="support-section bg-[#1a202c] py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Comprehensive Support Throughout Your Journey</h2>
        <p className="text-center text-[#a0aec0] mb-12">Our dedicated team ensures your success at every stage of implementation and beyond.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="support-card bg-[rgba(45,55,72,0.5)] rounded-xl p-10 flex flex-col items-center text-center">
            <div className="support-icon text-4xl mb-4">👨‍💼</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Dedicated Onboarding Manager</h3>
            <p className="text-[#cbd5e0]">Work with a dedicated onboarding specialist who coordinates your implementation and serves as your main point of contact.</p>
          </div>
          <div className="support-card bg-[rgba(45,55,72,0.5)] rounded-xl p-10 flex flex-col items-center text-center">
            <div className="support-icon text-4xl mb-4">👨‍🏫</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Training & Documentation</h3>
            <p className="text-[#cbd5e0]">Access comprehensive training sessions, documentation, and best practices to ensure your team can maximize your AI investment.</p>
          </div>
          <div className="support-card bg-[rgba(45,55,72,0.5)] rounded-xl p-10 flex flex-col items-center text-center">
            <div className="support-icon text-4xl mb-4">🛡️</div>
            <h3 className="font-semibold text-lg text-cyan-300 mb-2">Ongoing Technical Support</h3>
            <p className="text-[#cbd5e0]">Receive priority technical support and regular check-ins to ensure your agents continue to perform at their best.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Testimonial Section */}
    <section className="testimonial-section bg-[#181f2f] py-24">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-4">What Our Clients Say</h2>
        <p className="text-center text-[#a0aec0] mb-12">Hear from organizations that have transformed their operations with our onboarding process.</p>
        <div className="max-w-2xl mx-auto bg-[rgba(26,32,44,0.6)] border border-cyan-900 rounded-xl p-10 flex flex-col items-center">
          <p className="italic text-[#e2e8f0] mb-6">"The ApexSalesAI onboarding team exceeded our expectations at every turn. What impressed me most was how quickly they understood our unique sales process and translated it into an AI-powered workflow. Within just three weeks, we had fully operational AI agents that were booking qualified meetings and nurturing leads as effectively as our best reps."</p>
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-[#2d3748] mr-4 overflow-hidden">
              <img src="/images/testimonials/sarah-johnson.jpg" alt="Sarah Johnson" className="w-full h-full object-cover" />
            </div>
            <div>
              <h4 className="text-cyan-300 font-semibold">Sarah Johnson</h4>
              <p className="text-[#a0aec0] text-sm">VP of Sales Operations, TechForward</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="cta-section bg-[#0d1321] py-24 text-center">
      <div className="container mx-auto">
        <h2 className="cta-heading text-3xl md:text-4xl font-extrabold mb-4 bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent inline-block">Ready to Transform Your Operations?</h2>
        <p className="cta-text text-lg max-w-xl mx-auto mb-8 text-[#cbd5e0]">Start your onboarding journey and deploy AI agents that deliver immediate impact for your business.</p>
        <a href="/contact" className="inline-block bg-[#00c2cb] text-[#0d1321] font-bold px-10 py-4 rounded-xl text-xl shadow-xl hover:bg-[#00a8b3] transition">Schedule Your Onboarding</a>
      </div>
    </section>
  </div>
);
}

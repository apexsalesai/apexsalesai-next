// app/components/HowItWorksSection.tsx
"use client";
const steps = [
  {
    icon: "/images/step-detect.svg",
    title: "Predictive Opportunity Spotting",
    stat: "Identify high-intent buying signals across channels before competitors even notice them, with AI that predicts which leads will convert—and why.",
    highlight: "Explore Predictive Intelligence",
    emoji: "⚡"
  },
  {
    icon: "/images/step-engage.svg",
    title: "Autonomous Engagement",
    stat: "Max handles entire customer relationships from first touch to close, sending personalized communications, handling objections, and nurturing opportunities 24/7.",
    highlight: "Discover Autonomous Engagement",
    emoji: "🧠"
  },
  {
    icon: "/images/step-engine.svg",
    title: "Revenue Intelligence Engine",
    stat: "Our proprietary AI engine continuously learns from every interaction, optimizing messaging, timing, and engagement strategies to increase conversion rates.",
    highlight: "Explore the Engine",
    emoji: "🔄"
  },
  {
    icon: "/images/step-multichannel.svg",
    title: "Multi-Channel Orchestration",
    stat: "Seamlessly coordinate sales activities across email, LinkedIn, SMS, and phone with perfect timing and personalization—automatically.",
    highlight: "See Multi-Channel in Action",
    emoji: "📊"
  },
  {
    icon: "/images/step-forecast.svg",
    title: "Revenue Forecasting",
    stat: "Predict revenue with unmatched accuracy using AI that analyzes deal context, history, engagement patterns, and market factors.",
    highlight: "Learn About Forecasting",
    emoji: "🔌"
  },
  {
    icon: "/images/step-integration.svg",
    title: "Enterprise Integration",
    stat: "Seamlessly connect with your existing tech stack including CRM, marketing automation, and communication platforms for a unified revenue ecosystem.",
    highlight: "Explore Integration",
    emoji: "🔌"
  }
];

export default function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#091018] to-[#181f2f]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">From Signal to Success: The ApexSalesAI Journey</h2>
        <div className="flex flex-col md:flex-row md:items-stretch justify-center gap-8 md:gap-4 mb-8 animate-fade-in">
          {steps.map((step, i) => (
            <div key={i} className="flex-1 min-w-[220px] max-w-[260px] bg-[#1a202c]/80 rounded-2xl shadow-xl border border-[#00c2cb]/10 flex flex-col items-center px-6 py-8 relative transition-transform hover:-translate-y-2 animate-step-in">
              <img src={step.icon} alt={step.title + ' icon'} className="mb-4" style={{height: 56}} />
              <div className="text-[#00c2cb] text-lg font-extrabold mb-1 uppercase tracking-wide">{step.highlight}</div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">{step.title}</h3>
              <p className="text-[#a0aec0] text-sm mb-4 text-center">{step.stat}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-[-32px] top-1/2 -translate-y-1/2">
                  <svg width="32" height="32" fill="none"><path d="M0 16h24m0 0l-7-7m7 7l-7 7" stroke="#00c2cb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a href="/demo" className="btn-primary text-lg px-8 py-3 rounded-full shadow-lg">See ApexSalesAI in Action</a>
        </div>
        <div className="mt-8 text-[#00c2cb] font-semibold text-lg">ApexSalesAI is your autonomous business partner—delivering results, not just recommendations.</div>
      </div>
    </section>
  );
}

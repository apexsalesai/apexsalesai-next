// app/components/AIUseCasesGridSection.tsx
"use client";

const useCases = [
  {
    icon: "/images/ai-nurture.svg",
    label: "Autonomous Lead Nurturing",
    desc: "AI agents engage, qualify, and nurture leads 24/7, ensuring no opportunity slips through the cracks.",
    stats: [
      { value: "+35%", label: "Reply Rate" },
      { value: "-50%", label: "Manual Effort" }
    ],
    cta: { text: "Explore Lead Nurturing", href: "/solutions/lead-nurturing" }
  },
  {
    icon: "/images/ai-forecast.svg",
    label: "Predictive Revenue Forecasting",
    desc: "Real-time forecasting and pipeline insights powered by machine learning.",
    stats: [
      { value: "+40%", label: "Forecast Accuracy" },
      { value: "-80%", label: "Manual Forecasting" }
    ],
    cta: { text: "Explore Forecasting", href: "/solutions/forecasting" }
  },
  {
    icon: "/images/ai-retention.svg",
    label: "Customer Retention Automation",
    desc: "Proactively identify churn risks and trigger retention campaigns autonomously.",
    stats: [
      { value: "-30%", label: "Churn Rate" },
      { value: "+4M$", label: "Revenue Saved" }
    ],
    cta: { text: "Explore Retention AI", href: "/solutions/retention" }
  },
  {
    icon: "/images/ai-support.svg",
    label: "Conversational AI Support",
    desc: "Automated, human-like support for prospects and customers at every stage.",
    stats: [
      { value: "-40%", label: "Support Costs" },
      { value: "+90%", label: "Faster Response" }
    ],
    cta: { text: "Explore Support AI", href: "/solutions/support" }
  }
];

export default function AIUseCasesGridSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#f8fafc] to-[#e6f8fa] border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">AI Agent Use Cases</h2>
        <p className="text-lg text-[#0d1321] mb-12 max-w-2xl mx-auto">Discover how ApexSalesAI delivers results with specialized AI agents for every stage of the customer journey.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          {useCases.map((uc, i) => (
            <div key={i} className="panel flex flex-col justify-between shadow-lg radius-lg hover:-translate-y-2 transition-all bg-white border border-[#00c2cb]/10 min-h-[370px]">
              {/* Top section: icon + stats */}
              <div className="flex flex-col items-center pt-8 pb-4 border-b border-[#2d3748]/10 w-full">
                <div className="mb-4 flex items-center justify-center w-full">
                  <img src={uc.icon} alt={uc.label + ' icon'} width={72} height={72} className="drop-shadow-xl animate-fade-in" style={{transition: 'transform 0.3s', filter: 'brightness(1.15) saturate(1.2)'}} loading="eager" />
                </div>
                <div className="flex gap-6 mb-2">
                  {uc.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-[#00c2cb] leading-tight">{stat.value}</span>
                      <span className="text-xs text-[#7b8a99] font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom section: description + CTA */}
              <div className="flex flex-col items-center px-6 pb-8 pt-4 grow">
                <h3 className="heading-lg mb-1 text-lg font-bold text-[#0d1321]">{uc.label}</h3>
                <p className="text-[#4a5568] text-sm mb-4 text-center">{uc.desc}</p>
                <a href={uc.cta.href} className="inline-block mt-auto btn-secondary text-sm px-4 py-2 rounded-full border border-[#00c2cb] text-[#00c2cb] hover:bg-[#00c2cb]/10 transition-all font-semibold">
                  {uc.cta.text}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-[#7b8a99] italic">“ApexSalesAI’s AI agents helped us double our sales pipeline in just 3 months.” — Fortune 500 Customer</div>
      </div>
    </section>
  );
}

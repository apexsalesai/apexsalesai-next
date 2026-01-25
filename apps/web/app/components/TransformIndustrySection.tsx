// app/components/TransformIndustrySection.tsx
"use client";

const industries = [
  {
    icon: "/images/industry-technology.svg",
    label: "Technology",
    desc: "Accelerate sales cycles and reduce CAC with AI agents that automatically qualify leads, personalize demos, and nurture technical buyers through complex buying journeys.",
    stats: [
      { value: "41%", label: "Shorter Sales Cycles" },
      { value: "3.8x", label: "Conversion Rate" }
    ],
    cta: { text: "Explore Technology Solutions", href: "/solutions/technology" }
  },
  {
    icon: "/images/industry-healthcare.svg",
    label: "Healthcare",
    desc: "Navigate complex compliance environments while driving growth with agents that understand healthcare regulations and decision-making processes.",
    stats: [
      { value: "2.5x", label: "Patient Engagement" },
      { value: "+32%", label: "Faster Onboarding" }
    ],
    cta: { text: "Explore Healthcare Solutions", href: "/solutions/healthcare" }
  },
  {
    icon: "/images/industry-finance.svg",
    label: "Financial Services",
    desc: "Maintain regulatory compliance while increasing efficiency with AI agents that deliver consistent, compliant customer interactions and personalized financial guidance.",
    stats: [
      { value: "+29%", label: "Retention Rate" },
      { value: "2.1x", label: "Acquisition Speed" }
    ],
    cta: { text: "Explore Financial Solutions", href: "/solutions/finance" }
  },
  {
    icon: "/images/industry-manufacturing.svg",
    label: "Manufacturing",
    desc: "Streamline complex distribution channels and optimize supply chain relationships with AI agents that provide real-time inventory insights and automate order processing.",
    stats: [
      { value: "+23%", label: "Order Accuracy" },
      { value: "1.7x", label: "Workflow Speed" }
    ],
    cta: { text: "Explore Manufacturing Solutions", href: "/solutions/manufacturing" }
  },
  {
    icon: "/images/industry-retail.svg",
    label: "Retail",
    desc: "Convert browsers into buyers with predictive agents that identify high-intent signals, personalize product recommendations, and create seamless omnichannel experiences.",
    stats: [
      { value: "3.2x", label: "Customer Lifetime Value" },
      { value: "+38%", label: "Basket Size" }
    ],
    cta: { text: "Explore Retail Solutions", href: "/solutions/retail" }
  },
  {
    icon: "/images/industry-services.svg",
    label: "Professional Services",
    desc: "Build deeper client relationships while expanding your pipeline with AI agents that nurture prospects, qualify opportunities, and surface cross-sell possibilities.",
    stats: [
      { value: "2.9x", label: "Pipeline Growth" },
      { value: "+34%", label: "Client Satisfaction" }
    ],
    cta: { text: "Explore Professional Solutions", href: "/solutions/services" }
  },
  {
    icon: "/images/industry-education.svg",
    label: "Education",
    desc: "Increase enrollment and engagement while reducing administrative workload with AI agents that personalize student outreach and automate enrollment processes.",
    stats: [
      { value: "+26%", label: "Enrollment Rate" },
      { value: "2.2x", label: "Engagement" }
    ],
    cta: { text: "Explore Education Solutions", href: "/solutions/education" }
  },
  {
    icon: "/images/industry-realestate.svg",
    label: "Real Estate",
    desc: "Convert more leads into clients with AI agents that qualify prospects, schedule showings, and provide personalized property recommendations based on behavior patterns.",
    stats: [
      { value: "3.5x", label: "Lead Conversion" },
      { value: "-28%", label: "Time to Close" }
    ],
    cta: { text: "Explore Real Estate Solutions", href: "/solutions/realestate" }
  }
];

export default function TransformIndustrySection() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#181f2f] to-[#0d1321]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">Transform Your Industry with AI Agents</h2>
        <p className="text-lg text-[#cbd5e0] mb-12 max-w-2xl mx-auto">ApexSalesAI adapts to your business—driving results across every vertical with autonomous, intelligent agents.</p>
        <div className="grid md:grid-cols-3 gap-10 mb-8">
          {industries.map((ind, i) => (
            <div key={i} className="panel flex flex-col justify-between shadow-lg radius-lg hover:-translate-y-2 transition-all bg-[#1a202c]/70 border border-[#00c2cb]/10 min-h-[370px]">
              {/* Top section: icon + stats */}
              <div className="flex flex-col items-center pt-8 pb-4 border-b border-[#2d3748]/40 w-full">
                <div className="mb-4 flex items-center justify-center w-full">
  <img src={ind.icon} alt={ind.label + ' icon'} width={72} height={72} className="drop-shadow-xl animate-fade-in" style={{transition: 'transform 0.3s', filter: 'brightness(1.15) saturate(1.2)'}} loading="eager" />
</div>
                <div className="flex gap-6 mb-2">
                  {ind.stats.map((stat, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-2xl font-extrabold text-[#00c2cb] leading-tight">{stat.value}</span>
                      <span className="text-xs text-[#a0aec0] font-medium">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Bottom section: description + CTA */}
              <div className="flex flex-col items-center px-6 pb-8 pt-4 grow">
                <h3 className="heading-lg mb-1 text-lg font-bold text-white">{ind.label}</h3>
                <p className="text-[#a0aec0] text-sm mb-4 text-center">{ind.desc}</p>
                <a href={ind.cta.href} className="inline-block mt-auto btn-secondary text-sm px-4 py-2 rounded-full border border-[#00c2cb] text-[#00c2cb] hover:bg-[#00c2cb]/10 transition-all font-semibold">
                  {ind.cta.text}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-[#a0aec0] italic">“ApexSalesAI helped us double our sales pipeline in just 3 months.” — Fortune 500 Customer</div>
      </div>
    </section>
  );
}

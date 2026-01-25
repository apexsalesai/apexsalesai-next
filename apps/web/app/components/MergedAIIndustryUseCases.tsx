// app/components/MergedAIIndustryUseCases.tsx
"use client";

const useCases = [
  {
    label: "Autonomous Lead Nurturing",
    desc: "AI agents engage, qualify, and nurture leads 24/7, ensuring no opportunity slips through the cracks.",
    stats: [
      { value: "+35%", label: "Reply Rate" },
      { value: "-50%", label: "Manual Effort" }
    ],
    cta: { text: "Explore Lead Nurturing", href: "/solutions/lead-nurturing" }
  },
  {
    label: "Predictive Revenue Forecasting",
    desc: "AI agents analyze pipeline, deals, and signals to deliver accurate, actionable revenue forecasts.",
    stats: [
      { value: "+22%", label: "Forecast Accuracy" },
      { value: "2x", label: "Faster Pipeline Insights" }
    ],
    cta: { text: "Explore Forecasting AI", href: "/solutions/forecasting" }
  },
  {
    label: "Customer Retention Automation",
    desc: "Predict churn, automate retention campaigns, and turn at-risk customers into loyal advocates with AI.",
    stats: [
      { value: "-30%", label: "Churn Rate" },
      { value: "+4M$", label: "Revenue Saved" }
    ],
    cta: { text: "Explore Retention AI", href: "/solutions/retention" }
  },
  {
    label: "Conversational AI Support",
    desc: "Automated, human-like support for prospects and customers at every stage.",
    stats: [
      { value: "-40%", label: "Support Costs" },
      { value: "+90%", label: "Faster Response" }
    ],
    cta: { text: "Explore Support AI", href: "/solutions/support" }
  }
];

import React from "react";

export default function MergedAIIndustryUseCases() {
  // Content from ai-for-sales.md
  const heading = "AI for Sales & Revenue Operations";
  const overview = "ApexSalesAI leverages advanced artificial intelligence to transform sales and revenue operations. By automating repetitive tasks, predicting customer needs, and delivering actionable insights, AI empowers sales teams to focus on building relationships and closing deals.";
  const keyCapabilities = [
    {
      title: "Predictive Lead Scoring",
      desc: "Identify high-potential leads using data-driven insights."
    },
    {
      title: "Automated Outreach",
      desc: "Personalize communications at scale with AI-powered messaging."
    },
    {
      title: "Opportunity Forecasting",
      desc: "Anticipate deal outcomes and pipeline health with real-time analytics."
    },
    {
      title: "Sales Coaching",
      desc: "Provide instant feedback and recommendations to reps based on call and email analysis."
    }
  ];
  const action = "ApexSalesAI’s predictive autonomous agents integrate seamlessly with your workflow, boosting productivity and enabling smarter, faster selling.";

  // AI Agent Use Cases (move these to the top)
    // Industry verticals
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

  // AI Agent Use Cases
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
      desc: "AI agents analyze pipeline, deals, and signals to deliver accurate, actionable revenue forecasts.",
      stats: [
        { value: "+22%", label: "Forecast Accuracy" },
        { value: "2x", label: "Faster Pipeline Insights" }
      ],
      cta: { text: "Explore Forecasting AI", href: "/solutions/forecasting" }
    },
    {
      icon: "/images/ai-retention.svg",
      label: "Customer Retention Automation",
      desc: "Predict churn, automate retention campaigns, and turn at-risk customers into loyal advocates with AI.",
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

  return (
    <section className="py-24 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4 text-center">
        <h1 className="heading-xl font-extrabold mb-3 text-[#67b9c7] text-center">{heading}</h1>
        <p className="text-lg text-[#0d1321] mb-6 text-center max-w-3xl mx-auto">{overview}</p>
        {/* Key Capabilities as grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-5xl mx-auto">
          {keyCapabilities.map((cap, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-5 flex flex-col border-l-4 border-[#00c2cb] min-h-[120px]">
              <h4 className="font-semibold text-[#00c2cb] mb-1">{cap.title}</h4>
              <p className="text-[#0d1321] text-sm">{cap.desc}</p>
            </div>
          ))}
        </div>
        <div className="mb-8 text-[#4a5568] text-base max-w-2xl mx-auto italic">{action}</div>
        {/* AI Agent Use Cases Grid - now at the top */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {useCases.map((uc, i) => (
            <div key={i} className="panel flex flex-col justify-between shadow-lg radius-lg hover:-translate-y-2 transition-all bg-white border border-[#00c2cb]/10 min-h-[370px]">
              {/* Stats section only, no icon */}
              <div className="flex flex-col items-center pt-8 pb-4 border-b border-[#e6f8fa]/10 w-full">
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
        {/* Industry Grid - now below use cases */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-8">
          {industries.map((ind, i) => (
            <div key={i} className="panel flex flex-col justify-between shadow-lg radius-lg hover:-translate-y-2 transition-all bg-white border border-[#00c2cb]/10 min-h-[370px]">
              {/* Top section: icon + stats */}
              <div className="flex flex-col items-center pt-8 pb-4 border-b border-[#e6f8fa]/10 w-full">
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
                <h3 className="heading-lg mb-1 text-lg font-bold text-[#0d1321]">{ind.label}</h3>
                <p className="text-[#4a5568] text-sm mb-4 text-center">{ind.desc}</p>
                <a href={ind.cta.href} className="inline-block mt-auto btn-secondary text-sm px-4 py-2 rounded-full border border-[#00c2cb] text-[#00c2cb] hover:bg-[#00c2cb]/10 transition-all font-semibold">
                  {ind.cta.text}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-[#7b8a99] italic text-center">
          “ApexSalesAI’s AI agents helped us double our sales pipeline in just 3 months.” — Fortune 500 Customer
        </div>
      </div>
    </section>
  );
}



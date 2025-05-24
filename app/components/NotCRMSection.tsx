// app/components/NotCRMSection.tsx
"use client";
import Image from "next/image";

const features = [
  {
    icon: "/images/feature-multichannel.svg",
    title: "Multi-Channel Orchestration",
    desc: "Coordinate outreach seamlessly across email, SMS, voice, and social to maximize engagement and coverage."
  },
  {
    icon: "/images/feature-revenue.svg",
    title: "Revenue Orchestration",
    desc: "Automate and optimize every step of the revenue process—from lead to close—with AI-driven precision."
  },
  {
    icon: "/images/feature-integration.svg",
    title: "Enterprise Integration",
    desc: "Connect effortlessly with your existing tech stack, CRM, and data sources for unified, actionable insights."
  },
  {
    icon: "/images/feature-predictive.svg",
    title: "Predictive Opportunity Spotting",
    desc: "Identify high-intent buying signals across channels before competitors even notice them, with AI that predicts which leads will convert—and why."
  },
  {
    icon: "/images/feature-engagement.svg",
    title: "Autonomous Engagement",
    desc: "Max handles entire customer relationships from first touch to close, sending personalized communications, handling objections, and nurturing opportunities 24/7."
  },
  {
    icon: "/images/feature-forecast.svg",
    title: "Revenue Forecasting",
    desc: "Forecast revenue with confidence using AI that learns from every interaction and market shift."
  }
];

export default function NotCRMSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-[#091018] to-[#181f2f]">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] bg-clip-text text-transparent">This isn't CRM. It's Autonomous Revenue Intelligence.</h2>
        {/* If you only see three boxes, check for missing images, parent overflow:hidden, or custom CSS in styles.css that could affect grid children. All six features are rendered below. */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((f, i) => (
            <div key={i} className="flex flex-col items-center bg-[#1a202c]/80 rounded-2xl shadow-xl border border-[#00c2cb]/10 px-8 py-12 transition-transform hover:-translate-y-2 hover:shadow-2xl">
              <Image src={f.icon} alt={f.title + ' icon'} width={72} height={72} className="mb-6 drop-shadow-lg" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/feature-engine.svg'; }} />
              <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[#a0aec0] text-base mb-2">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

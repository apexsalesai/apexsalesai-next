// app/components/HeroSection.tsx
"use client";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="hero min-h-screen flex items-center justify-center pt-32 pb-24 relative bg-gradient-to-br from-[#0d1321] to-[#091018] overflow-hidden">
      <div className="absolute inset-0 z-0 animate-pulse-slow">
        {/* Example animated SVG background or looping video could go here */}
        <Image src="/images/hero-bg-animated.svg" alt="AI Background" fill className="object-cover opacity-30" onError={(e: any) => { e.target.src = '/images/placeholder.svg'; }} />
      </div>
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Hero Content */}
        <div className="max-w-xl">
          <span className="inline-block bg-[#00c2cb]/10 text-[#00c2cb] font-bold text-sm px-4 py-2 rounded-full border border-[#00c2cb]/30 mb-6 uppercase tracking-wider">
            Meet Your Autonomous Revenue Team
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-[#00c2cb]/80 bg-clip-text text-transparent leading-tight drop-shadow-lg">
            Revenue, Reimagined.<br />Autonomous. Predictive. Always On.
          </h1>
          <p className="text-xl md:text-2xl text-[#cbd5e0] mb-8">
            ApexSalesAI deploys AI agents that anticipate, execute, and elevate your revenue—24/7, across every channel.
          </p>
          <div className="flex flex-wrap gap-4 mb-8">
            <a href="/demo" className="btn-primary text-lg py-3 px-8">See ApexSalesAI in Action</a>
            <a href="/platform" className="btn-secondary text-lg py-3 px-8">Explore the Platform</a>
          </div>
          <div className="flex gap-10 mt-8">
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">+41%</div>
              <div className="text-[#a0aec0] text-base">Shorter Sales Cycles</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">3.8x</div>
              <div className="text-[#a0aec0] text-base">Conversion Rate</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">24/7</div>
              <div className="text-[#a0aec0] text-base">AI Execution</div>
            </div>
          </div>
        </div>
        {/* Animated/hero visual */}
        <div className="hidden md:flex items-center justify-center relative">
          <Image src="/images/hero-ai-visual.svg" alt="AI Agent Visual" width={420} height={420} className="drop-shadow-2xl animate-float" onError={(e: any) => { e.target.src = '/images/placeholder.svg'; }} />
        </div>
      </div>
    </section>
  );
}

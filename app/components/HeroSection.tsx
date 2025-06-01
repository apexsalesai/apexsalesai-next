// app/components/HeroSection.tsx
"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Typewriter from "./Typewriter";
import ParticlesAdvanced from "./ParticlesAdvanced";
import AnimatedGradient from "./AnimatedGradient";
import MascotAnimated from "./MascotAnimated";
import AnimatedCTA from "./AnimatedCTA";
import TrustBar from "./TrustBar";
import ScrollIndicator from "./ScrollIndicator";

export default function HeroSection() {
  return (
    <section className="hero min-h-screen flex items-center justify-center pt-32 pb-24 relative overflow-hidden">
      {/* Animated Gradient and Advanced AI Network Particles Background */}
      <AnimatedGradient />
      <ParticlesAdvanced />
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Hero Content with staggered entrance */}
        <motion.div
          className="max-w-xl"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.18 } }
          }}
        >
          <motion.span
            className="inline-block bg-[#00c2cb]/10 text-[#00c2cb] font-bold text-sm px-4 py-2 rounded-full border border-[#00c2cb]/30 mb-6 uppercase tracking-wider shadow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >Production-Ready AI Agents</motion.span>
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-white to-[#00c2cb]/80 bg-clip-text text-transparent leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.13 }}
          >
            <Typewriter
              words={[
                "Autonomous AI Agents. Production-Ready.",
                "Deploy, Scale, and Trust Your AI Sales Team.",
                "Enterprise-Grade AI for Revenue Operations.",
                "AI Agents. Real Results. Always On."
              ]}
              className="inline"
              speed={80} // slower typing speed
              delay={1600} // slightly longer delay
            />
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-[#cbd5e0] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.24 }}
          >
            Built for reliability, security, and scale—trusted by teams who need results, not just promises.
          </motion.p>
          <motion.div
            className="flex flex-wrap gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <AnimatedCTA href="/demo" aria-label="See production demo">See Production Demo</AnimatedCTA>
            <a href="/contact" aria-label="Contact sales" className="btn-secondary text-lg py-3 px-8 rounded-xl font-bold border border-[#00c2cb] text-[#00c2cb] bg-transparent hover:bg-[#00c2cb]/10 transition-all duration-300 shadow">Contact Sales</a>
          </motion.div>
          <motion.div
            className="flex flex-row flex-nowrap justify-center items-baseline gap-2 mt-2 mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{background:'none', border:'none', boxShadow:'none', padding:0, minHeight:0, height:'24px'}}
          >
            {[
              { value: '99.99%', label: 'uptime' },
              { value: 'SOC2 & GDPR', label: 'compliant' },
              { value: 'API-First', label: 'integration' },
              { value: 'Enterprise', label: 'support' }
            ].map((stat, i) => (
              <div key={stat.label} className="flex flex-col items-center px-0 min-w-[72px]">
                <span className="text-[20px] text-white font-normal leading-tight whitespace-nowrap text-center" style={{lineHeight:'24px', minWidth:'72px', display:'inline-block'}}>{stat.value}</span>
                <span className="text-[16px] text-[#a0aec0] font-normal opacity-60 mt-0.5 whitespace-nowrap text-center" style={{lineHeight:'18px'}}>{stat.label}</span>
                {i < 3 && <span className="mx-1 text-[#23272f] opacity-30 select-none text-[10px]" aria-hidden="true">|</span>}
              </div>
            ))}
          </motion.div>
        </motion.div>
        {/* Animated/hero visual with mascot */}
        <div className="hidden md:flex items-center justify-center relative min-h-[420px]">
          {/* Glowing ring background */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full w-[210px] h-[210px] bg-gradient-to-tr from-[#00c2cb33] via-[#00c2cb77] to-[#fff0] blur-2xl z-10" style={{boxShadow: '0 0 64px 16px #00c2cb44'}} />
          {/* Mascot with animation */}
          <MascotAnimated />
        </div>
      </div>
    </section>
  );
}

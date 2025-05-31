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
              speed={55}
              delay={1200}
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
            <a href="/docs" aria-label="Explore documentation" className="btn-secondary text-lg py-3 px-8 rounded-xl font-bold border border-[#00c2cb] text-[#00c2cb] bg-transparent hover:bg-[#00c2cb]/10 transition-all duration-300 shadow">Explore Documentation</a>
          </motion.div>
          <motion.div
            className="flex gap-10 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
          >
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">99.99%</div>
              <div className="text-[#a0aec0] text-base">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">SOC2 & GDPR</div>
              <div className="text-[#a0aec0] text-base">Compliant</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">API-First</div>
              <div className="text-[#a0aec0] text-base">Integration</div>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#00c2cb] drop-shadow">Enterprise</div>
              <div className="text-[#a0aec0] text-base">Support</div>
            </div>
          </motion.div>
        </motion.div>
        {/* Animated/hero visual with mascot */}
        <div className="hidden md:flex items-center justify-center relative">
          <MascotAnimated />
          <Image src="/images/hero-ai-visual.svg" alt="AI Agent Visual" width={420} height={420} className="drop-shadow-2xl animate-float" onError={(e: any) => { e.target.src = '/images/placeholder.svg'; }} />
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import Image from 'next/image';

export default function HealthcareSolutionsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
        <div className="flex-shrink-0">
          <Image
            src="/images/happy-matu-magic-nqte.jpeg"
            alt="Max AI Mascot"
            width={120}
            height={120}
            className="rounded-full shadow-xl border-4 border-[#00c2cb] animate-bounce-slow"
            priority
          />
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Healthcare Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Transform patient care, streamline operations, and boost outcomes with AI agents tailored for healthcare organizations.</p>
          <p className="text-md text-[#a0aec0]">From triage to precision medicine, ApexSalesAI empowers hospitals and clinics to deliver smarter, faster, and more compassionate care.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. Autonomous Patient Triage & Virtual Nursing Agents */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Autonomous Patient Triage & Virtual Nursing Agents</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI agents act as 24/7 virtual nurses, conducting initial interviews, assessing symptoms, and prioritizing cases based on urgency.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Sensely’s "Molly" (NHS, UC San Diego Health)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced ER wait times by <span className="font-bold">35%</span></li>
                <li>Cut nurse workload by <span className="font-bold">50%</span> for follow-up check-ins</li>
                <li>Improved patient satisfaction by <span className="font-bold">22%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Always-available support means happier patients and less staff burnout.</div>
          </div>

          {/* 2. AI Agent-Driven Precision Medicine Orchestration */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Agent-Driven Precision Medicine</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI analyzes genomic data, EHRs, and research to recommend personalized treatment plans and coordinate care end-to-end.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Tempus AI Agent Ecosystem (Northwestern Medicine)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced time to start cancer therapy from <span className="font-bold">4 weeks to 7 days</span></li>
                <li>Increased trial enrollment by <span className="font-bold">40%</span></li>
                <li>Lowered adverse drug reactions by <span className="font-bold">30%</span></li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Precision medicine, delivered faster and safer for every patient.</div>
          </div>

          {/* 3. Proactive Hospital Resource Allocation Agents */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Proactive Hospital Resource Allocation</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI agents predict admissions, optimize staff schedules, and manage inventory in real-time to prevent bottlenecks.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Qventus (Stanford Health Care)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced ER boarding times by <span className="font-bold">60%</span></li>
                <li>Cut overtime costs by <span className="font-bold">$1.2M/year</span></li>
                <li>Eliminated <span className="font-bold">95%</span> of stockouts for critical medications</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Smarter resource allocation means better outcomes and lower costs.</div>
          </div>

          {/* 4. AI-Powered Patient Scheduling & No-Show Prediction */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Patient Scheduling & No-Show Prediction</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI predicts high-risk no-shows and automates reminders—filling empty slots and boosting revenue for clinics.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Solutionreach + AI (Dental Clinics)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced no-shows by <span className="font-bold">40%</span></li>
                <li>Increased revenue by <span className="font-bold">$50K/year</span> for a small practice</li>
                <li>Automated reminders at 1/10th the cost of manual staff</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI keeps schedules full and patients engaged—without extra staff effort.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Healthcare Solutions
        </a>
      </div>
    </div>
  );
}

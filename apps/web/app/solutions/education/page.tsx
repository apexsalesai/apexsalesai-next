import React from 'react';
import Image from 'next/image';

export default function EducationSolutionsPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-[#00c2cb]">Education Solutions</h1>
          <p className="text-lg text-[#a0aec0] mb-2">Personalize learning, improve retention, and automate admin tasks at scale with AI agents for K-12, higher ed, and corporate training.</p>
          <p className="text-md text-[#a0aec0]">ApexSalesAI helps educators deliver better outcomes and operate efficiently with proven AI solutions.</p>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white mb-4">Real-World AI Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-8">

          {/* 1. AI-Powered Personalized Tutoring (Adaptive Learning) */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Personalized Tutoring (Adaptive Learning)</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning adapts lessons to each student’s pace and style, delivering one-on-one learning at scale.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Squirrel AI</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Improved test scores by <span className="font-bold">20–30%</span></li>
                <li>Reduced tutoring costs by <span className="font-bold">50%+</span></li>
                <li>Scaled to 2,000+ centers</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">Hyper-personalized learning now affordable for all.</div>
          </div>

          {/* 2. AI-Driven Predictive Analytics for Student Retention */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Driven Predictive Analytics for Student Retention</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Machine learning identifies at-risk students and recommends interventions to improve completion rates.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Civitas Learning</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Improved graduation rates by <span className="font-bold">22%</span> (Georgia State)</li>
                <li>Decreased dropouts by <span className="font-bold">15%</span> (Lone Star College)</li>
                <li>Retained $10M+/year in tuition per school</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI closes equity gaps and boosts student success.</div>
          </div>

          {/* 3. AI-Powered Language Learning at Scale */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI-Powered Language Learning at Scale</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Neural networks personalize language exercises and simulate human tutors for K-12, higher ed, and corporate training.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Duolingo (Birdbrain Model)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>10x more efficient than classroom instruction</li>
                <li>Used by 500+ districts & global companies</li>
                <li>100M+ learners worldwide</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI delivers immersive language learning at massive scale.</div>
          </div>

          {/* 4. AI for Institutional Research & Accreditation */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI for Institutional Research & Accreditation</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">AI automates data collection/reporting for accreditation and compliance, flagging gaps for corrective action.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Watermark (Higher Ed Analytics)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Cut accreditation prep time from 6 months to 6 weeks</li>
                <li>Saved $250K/year per school in labor</li>
                <li>Adopted by 1,200+ colleges</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI eliminates costly consultants and reduces compliance risk.</div>
          </div>

          {/* 5. Automated Essay Grading & Feedback */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">Automated Essay Grading & Feedback</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">NLP and computer vision instantly grade essays and assignments, providing detailed, bias-free feedback.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Gradescope (Turnitin)</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Cut grading time by <span className="font-bold">70%+</span></li>
                <li>Improved feedback consistency</li>
                <li>Adopted by 500+ universities</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI solves grading burnout for teachers and TAs.</div>
          </div>

          {/* 6. AI Chatbots for Student Support (Administrative Automation) */}
          <div className="bg-[#181c20] rounded-lg p-6 border border-[#00c2cb]/20 shadow flex flex-col items-center">
            <Image src="/images/happy-matu-magic-nqte.jpeg" alt="Max AI Mascot" width={40} height={40} className="rounded-full border-2 border-[#00c2cb] mb-2" />
            <h3 className="text-lg font-semibold text-[#00c2cb] mb-2 text-center">AI Chatbots for Student Support (Administrative Automation)</h3>
            <p className="text-[#a0aec0] mb-2 text-sm text-center">Conversational AI handles student queries, transcribes lectures, and summarizes classes 24/7.</p>
            <div className="bg-[#23272f] rounded p-3 mb-2 w-full">
              <span className="font-bold text-[#a0aec0]">Example: </span>
              <span className="text-[#00c2cb]">Otter.ai for Education</span>
              <ul className="list-disc ml-6 text-[#a0aec0] text-xs mt-1">
                <li>Reduced admin workload by <span className="font-bold">40%</span></li>
                <li>Increased student engagement (+30% lecture reviews)</li>
                <li>Deployed at community colleges and bootcamps</li>
              </ul>
            </div>
            <div className="text-xs text-[#a0aec0] italic">AI delivers always-on support for every student.</div>
          </div>

        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-8 text-center">
        <a
          href="/contact"
          className="btn-primary px-8 py-4 rounded-full bg-gradient-to-r from-[#00c2cb] to-[#a0aec0] text-[#181c20] font-bold text-lg shadow-xl hover:scale-105 hover:shadow-2xl transition-transform duration-300"
        >
          Talk to Max About Education Solutions
        </a>
      </div>
    </div>
  );
}

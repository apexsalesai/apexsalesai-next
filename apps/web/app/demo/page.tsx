"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Only one set of helpers above. No duplicates below.

export default function DemoPage() {    
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  return (
    <main className="min-h-screen bg-[#0d1321] text-[#e2e8f0] py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <span className="inline-block bg-[#00c2cb]/20 text-[#00c2cb] font-bold px-4 py-1 rounded-full mb-4 text-sm">Live Demo Coming Soon</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">Max: The AI Sales Agent</h1>
          <p className="text-lg md:text-xl text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            We’re putting the finishing touches on our interactive demo. Sign up below and be among the first to experience Max in action!
          </p>
          <a href="#demo-form" className="inline-block bg-[#00c2cb] text-[#0d1321] font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#00a8b3] transition mb-2">Request Early Access</a>
        </section>

        {/* Features Grid */}

        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">What You'll Experience in Your Demo</h2>
            <p className="text-[#a0aec0] max-w-xl mx-auto">Our personalized demonstrations showcase how Max becomes an integral part of your revenue team.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Feature icon="🔍" title="Intelligent Prospecting" desc="Watch Max analyze your ideal customer profile, research prospects, and initiate personalized outreach campaigns—all while you focus on strategy." />
            <Feature icon="💬" title="Natural Conversations" desc="Experience how Max engages in human-like conversations across email, chat, and messaging platforms, adjusting tone and messaging to match prospect personas." />
            <Feature icon="⚡" title="Real-time Deal Progression" desc="See Max's sophisticated follow-up sequences in action, including how it identifies buying signals and automatically progresses prospects through your pipeline." />
            <Feature icon="📊" title="CRM Integration" desc="Watch how Max automatically logs interactions, updates deal status, and provides actionable insights in your existing CRM environment." />
            <Feature icon="🤝" title="Human Handoff" desc="Experience Max's intelligent escalation process when human intervention is optimal, ensuring your sales team steps in at exactly the right moment." />
            <Feature icon="📱" title="Multi-channel Orchestration" desc="See how Max coordinates outreach across email, LinkedIn, SMS, and other channels, creating a cohesive buyer experience that never feels spammy." />
          </div>
        </section>

        {/* Demo Process Section */}

        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">Your Demo Journey</h2>
            <p className="text-[#a0aec0] max-w-xl mx-auto">Our interactive demo process is designed to show you exactly how Max would work in your specific business context.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <ProcessStep number={1} title="Schedule" desc="Book a time that works for your team using our simple scheduling tool." />
            <ProcessStep number={2} title="Customize" desc="Share your business context so we can tailor the demo to your specific industry and use case." />
            <ProcessStep number={3} title="Experience" desc="Join our interactive demo session where you'll see Max in action in scenarios relevant to your business." />
            <ProcessStep number={4} title="Plan" desc="Discuss implementation options and create your custom deployment roadmap with our team." />
          </div>
        </section>

        {/* Testimonials Section */}

        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">What Our Customers Say</h2>
            <p className="text-[#a0aec0] max-w-xl mx-auto">Hear from companies that have transformed their sales process with Max.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Testimonial quote="After implementing Max, our SDR team's productivity increased by 300%. Max handles all the initial prospecting and follow-ups, allowing our human reps to focus on high-value conversations that actually close deals." author="Sarah Landry" role="VP of Sales, TechVantage Solutions" avatar="SL" />
            <Testimonial quote="The demo blew us away. We saw Max identify prospects, personalize outreach, and handle objections better than most of our human SDRs. Within six weeks of deployment, our pipeline grew by 78%." author="Michael Brenner" role="CRO, GlobalFinance" avatar="MB" />
            <Testimonial quote="What impressed me most was the seamless CRM integration. Max updates everything in real-time, provides incredible analytics, and our team finally has accurate data without the manual entry. The ROI was visible within the first month." author="Aisha Khan" role="Sales Operations Director, NexusHealth" avatar="AK" />
          </div>
        </section>

        {/* Demo Form Section */}

        <section id="demo-form" className="mb-20">
          <div className="bg-[#052438] rounded-2xl shadow-lg p-8 md:p-12">
            <div className="md:flex md:items-center md:gap-12">

              {/* Demo Form Section */}
              <div className="flex-1 mb-8 md:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">Request Early Access to the Demo</h2>
                <p className="text-[#a0aec0] mb-6">Sign up to be among the first to experience Max in action. Our team will reach out as soon as the live demo is available.</p>
                <ul className="text-[#00c2cb] text-base space-y-2 mb-4">
                  <li>✔️ 30-minute interactive demonstration</li>
                  <li>✔️ Customized to your industry and use case</li>
                  <li>✔️ Q&A with a solution architect</li>
                  <li>✔️ Personalized implementation proposal</li>
                </ul>
              </div>
              <div className="flex-1">
                {/* Replace with a real form integration if desired */}

                <form className="space-y-4" onSubmit={async (e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const formData = new FormData(form);
                  const data = {
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    company: formData.get('company') as string,
                    jobTitle: formData.get('jobTitle') as string,
                    phone: formData.get('phone') as string,
                    teamSize: formData.get('teamSize') as string,
                    industry: formData.get('industry') as string,
                    message: formData.get('message') as string,
                  };
                  setStatus('loading');
                  try {
                    const res = await fetch('/api/request-demo', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data),
                    });
                    if (res.ok) {
                      setStatus('success');
                      form.reset();
                    } else {
                      setStatus('error');
                    }

                  } catch {
                    setStatus('error');
                  }

                }}>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Full Name*</label>
                    <input required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" type="text" name="name" />
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Business Email*</label>
                    <input required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" type="email" name="email" />
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Company*</label>
                    <input required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" type="text" name="company" />
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Job Title*</label>
                    <input required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" type="text" name="jobTitle" />
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Phone Number</label>
                    <input className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" type="tel" name="phone" />
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Sales Team Size*</label>
                    <select required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" name="teamSize">
                      <option value="">Select an option</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">Industry*</label>
                    <select required className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]" name="industry">
                      <option value="">Select an option</option>
                      <option value="SaaS">SaaS</option>
                      <option value="Financial Services">Financial Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#e2e8f0] font-semibold mb-1">What specific challenges would you like to address?</label>
                    <textarea className="w-full bg-[#181f2f] border border-[#2d3748] rounded-lg px-4 py-2 text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb] min-h-[100px]" name="message" />
                  </div>
                  <div className="flex items-start gap-2">
                    <input required type="checkbox" className="accent-[#00c2cb] mt-1" name="consent" id="consent" />
                    <label htmlFor="consent" className="text-[#a0aec0] text-sm">I agree to receive communications from ApexSalesAI. I understand I can unsubscribe at any time. View our <Link href="/privacy" className="underline text-[#00c2cb]">Privacy Policy</Link>.</label>
                  </div>
                  <button type="submit" className="w-full bg-[#00c2cb] text-[#0d1321] font-semibold px-8 py-3 rounded-lg shadow hover:bg-[#00a8b3] transition">Request Early Access</button>
                  {status === 'success' && <p className="text-green-400 mt-2">Thank you! We will notify you when the demo is ready.</p>}

                  {status === 'error' && <p className="text-red-400 mt-2">Sorry, something went wrong. Please try again later.</p>}

                  {status === 'loading' && <p className="text-blue-400 mt-2">Submitting...</p>}

                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}

        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2 text-white">Frequently Asked Questions</h2>
            <p className="text-[#a0aec0] max-w-xl mx-auto">Get answers to common questions about our demo process and technology.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <FAQ question="How long does a typical demo session last?" answer="Our standard demo sessions are scheduled for 30 minutes, with an additional 15 minutes for Q&A. For enterprise clients or more complex use cases, we can arrange extended sessions of up to 60 minutes to ensure we cover all aspects of our solution relevant to your business." />
            <FAQ question="Is the demo customized to my business?" answer="Absolutely! We tailor every demo to your industry, team size, and specific goals to ensure you see the most relevant capabilities." />
            <FAQ question="What happens after I request early access?" answer="Our team will reach out as soon as the live demo is available to schedule your session and discuss your needs." />
            <FAQ question="Can I invite colleagues to the demo?" answer="Yes, you can invite as many team members as you’d like to join the session." />
          </div>
        </section>
      </div>
    </main>
  );
}


function Feature({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="feature-card bg-[#1a202c] border border-[#2d3748] rounded-xl p-6 flex flex-col shadow hover:shadow-lg transition">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-[#a0aec0]">{desc}</p>
    </div>
  );
}


function ProcessStep({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="text-center">
      <div className="w-14 h-14 rounded-full bg-[#00c2cb]/10 border-2 border-[#00c2cb] text-[#00c2cb] flex items-center justify-center mx-auto text-2xl font-bold mb-4">{number}</div>
      <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
      <p className="text-[#a0aec0] text-sm">{desc}</p>
    </div>
  );
}


function Testimonial({ quote, author, role, avatar }: { quote: string; author: string; role: string; avatar: string }) {
  return (
    <div className="testimonial-card bg-[#1a202c] border border-[#2d3748] rounded-xl p-6 shadow flex flex-col">
      <p className="italic text-[#e2e8f0] mb-4">“{quote}”</p>
      <div className="flex items-center gap-3 mt-auto">
        <div className="testimonial-avatar w-12 h-12 rounded-full bg-[#00c2cb] text-[#0d1321] flex items-center justify-center font-bold text-lg">{avatar}</div>
        <div>
          <h4 className="text-white font-semibold leading-tight">{author}</h4>
          <p className="text-[#a0aec0] text-xs">{role}</p>
        </div>
      </div>
    </div>
  );
}


function FAQ({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="faq-question bg-[#1a202c] border border-[#2d3748] rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-2">{question}</h3>
      <p className="text-[#a0aec0] text-sm">{answer}</p>
    </div>
  );
}


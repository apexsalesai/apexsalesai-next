// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

// To enable live chat, insert your Intercom (or other provider) snippet in _app.tsx or _document.tsx.
// For TypeScript, declare Intercom on window:
declare global {
  interface Window {
    Intercom?: (...args: any[]) => void;
    MaxLiveAgent?: (...args: any[]) => void; // Add Max live agent to window for type safety
  }
}

export default function Contact() {
  const [showCallbackSuccess, setShowCallbackSuccess] = useState(false);
  const [showCallbackError, setShowCallbackError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    interest: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // NOTE: To make email sending work, set CONTACT_EMAIL_USER and CONTACT_EMAIL_PASS in your .env.local file with your email and app password.
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      setSubmitted(true);
      setFormData({ name: '', email: '', phone: '', company: '', interest: '', message: '' });
    } catch (err) {
      setError('There was an error submitting your message. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <section className="pt-20 pb-16 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#00c2cb] opacity-10 filter blur-[100px] z-0"></div>
          <div className="absolute top-1/2 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#005f6b] opacity-10 filter blur-[80px] z-0"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          
          <p className="text-xl text-[#cbd5e0] max-w-3xl mx-auto">
            Connect with our team to learn how ApexSalesAI can transform your revenue operations.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Team Mascot Image */}
            <div className="flex flex-col items-center justify-center mb-8 md:mb-0">
              <Image
                src="/images/team-mascot.jpg"
                alt="ApexSalesAI Team Mascot"
                width={360}
                height={240}
                className="rounded-2xl shadow-2xl object-cover border-4 border-[#00c2cb]/30 bg-white max-w-full h-auto"
                priority
              />
              <div className="mt-4 text-[#00c2cb] font-semibold text-lg text-center">Our team is here for you.</div>
            </div>
            {/* Contact Form Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Request a Callback</h2>
<form className="mb-8 bg-[#e0f7fa] border border-[#00c2cb] rounded-lg p-6 flex flex-col items-center" onSubmit={async e => {
  e.preventDefault();
  setShowCallbackSuccess(false);
  setShowCallbackError('');
  const form = e.currentTarget;
  const name = (form.callbackName as HTMLInputElement).value;
  const phone = (form.callbackPhone as HTMLInputElement).value;
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, type: 'callback' }),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    setShowCallbackSuccess(true);
    form.reset();
  } catch (err) {
    setShowCallbackError('There was an error submitting your callback request. Please try again.');
  }
}}>
  <label htmlFor="callbackName" className="block text-[#0d1321] font-semibold mb-2">Name</label>
  <input id="callbackName" name="callbackName" type="text" required className="mb-4 px-4 py-2 rounded border border-[#00c2cb] w-full max-w-xs" />
  <label htmlFor="callbackPhone" className="block text-[#0d1321] font-semibold mb-2">Phone Number</label>
  <input id="callbackPhone" name="callbackPhone" type="tel" required pattern="[0-9\-\+\s\(\)]{7,}" className="mb-4 px-4 py-2 rounded border border-[#00c2cb] w-full max-w-xs" />
  <button type="submit" className="bg-[#00c2cb] text-[#0d1321] font-bold py-2 px-6 rounded-lg shadow hover:bg-[#00b3bf] transition-all duration-300">Request Callback</button>
  {showCallbackSuccess && <span className="text-green-700 font-semibold mt-4">Thank you! We'll call you back soon.</span>}
  {showCallbackError && <span className="text-red-700 font-semibold mt-4">{showCallbackError}</span>}
</form>
<h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-[#cbd5e0] mb-6">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>
              
              {submitted ? (
                <div className="bg-[rgba(0,194,203,0.1)] border border-[#00c2cb] p-4 rounded-lg mb-6">
                  <p className="text-white font-medium">Thank you for your message! Our team will be in touch with you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="bg-[rgba(244,67,54,0.1)] border border-[#f44336] p-4 rounded-lg mb-6">
                      <p className="text-[#f44336]">{error}</p>
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <label htmlFor="name" className="block mb-2 text-white">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="email" className="block mb-2 text-white">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="phone" className="block mb-2 text-white">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="company" className="block mb-2 text-white">Company</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="interest" className="block mb-2 text-white">I'm interested in:</label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    >
                      <option value="">Select an option</option>
                      <option value="sales">ApexSalesAI</option>
                      <option value="support">ApexSupportAI</option>
                      <option value="consulting">Consulting Services</option>
                      <option value="reseller">Reseller Program</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="message" className="block mb-2 text-white">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full p-3 bg-[#1a202c] border border-[rgba(255,255,255,0.1)] rounded-lg focus:outline-none focus:border-[#00c2cb] text-white"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#00c2cb] text-[#0d1321] font-bold py-3 px-6 rounded-lg hover:bg-[#00a8b3] transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-[#cbd5e0] mb-6">
                Reach out to us directly or schedule a call with our team.
              </p>
              <div className="bg-[#1a202c] p-6 rounded-lg mb-6">
                <div className="flex items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-[rgba(0,194,203,0.1)] flex items-center justify-center text-[#00c2cb] mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Phone</h3>
                    <p className="text-[#cbd5e0]">Phone: <a href="tel:+18609977929" className="text-[#00c2cb]">860-997-7929</a></p>
                  </div>
                </div>
                <div className="flex items-start mb-6">
                  <div className="w-10 h-10 rounded-full bg-[rgba(0,194,203,0.1)] flex items-center justify-center text-[#00c2cb] mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-white mb-1">Email</h3>
                    <p className="text-[#cbd5e0]">Sales: <a href="mailto:sales@apexsalesai.com" className="text-[#00c2cb]">sales@apexsalesai.com</a></p>
                    <p className="text-[#cbd5e0]">Support: <a href="mailto:support@apexsalesai.com" className="text-[#00c2cb]">support@apexsalesai.com</a></p>
                    <p className="text-[#cbd5e0]">Partners: <a href="mailto:partners@apexsalesai.com" className="text-[#00c2cb]">partners@apexsalesai.com</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1a202c]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-white">How quickly can we implement ApexSalesAI?</h3>
              <p className="text-[#cbd5e0]">Most clients are fully operational within 2-4 weeks, depending on the complexity of your existing systems and integration requirements. Our implementation team will work with you to create a customized onboarding plan.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-white">Does ApexSalesAI integrate with our existing CRM?</h3>
              <p className="text-[#cbd5e0]">Yes, ApexSalesAI integrates with all major CRM platforms including Salesforce, HubSpot, Microsoft Dynamics, and others. We also offer custom API integration for proprietary systems.</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-2 text-white">How do you ensure data security and compliance?</h3>
              <p className="text-[#cbd5e0]">ApexSalesAI is SOC 2 Type II certified and GDPR compliant. We implement industry-leading encryption, access controls, and security protocols. Our platform is hosted in secure, enterprise-grade cloud environments with 99.9% uptime.</p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-2 text-white">What kind of support is included?</h3>
              <p className="text-[#cbd5e0]">All plans include access to our customer success team via chat, email, and scheduled calls. Enterprise plans include a dedicated customer success manager and 24/7 priority support.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
'use client';

import Link from 'next/link';

import { useState } from 'react';

export default function Footer() {
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subFeedback, setSubFeedback] = useState('');
  return (
    <footer className="bg-[#091018] text-[#a0aec0]" aria-label="Footer">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <Link href="/" className="block mb-6">
              <span className="sr-only">ApexSalesAI</span>
              <img src="/images/apex-logo.png" alt="ApexSalesAI Logo" width={180} height={60} style={{height: 'auto'}} loading="lazy" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/placeholder.svg'; }} />
            </Link>
            <p className="text-[#a0aec0] mb-6">
              Intelligent AI agents designed to drive revenue and elevate every customer interaction — built on the ApexOpsAI execution engine.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.linkedin.com/company/apexsalesai" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-10 h-10 rounded-full bg-[rgba(26,32,44,0.6)] flex items-center justify-center text-[#a0aec0] hover:bg-[rgba(0,194,203,0.1)] hover:text-white transition-colors transform hover:scale-110 duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a 
                href="https://twitter.com/apexsalesai" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="w-10 h-10 rounded-full bg-[rgba(26,32,44,0.6)] flex items-center justify-center text-[#a0aec0] hover:bg-[rgba(0,194,203,0.1)] hover:text-white transition-colors transform hover:scale-110 duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-[#a0aec0] hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/blog" className="text-[#a0aec0] hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/careers" className="text-[#a0aec0] hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-[#a0aec0] hover:text-white transition-colors">Press</Link></li>
              <li><Link href="/contact" className="text-[#a0aec0] hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Product</h4>
            <ul className="space-y-3">
              <li><Link href="/platform" className="text-[#a0aec0] hover:text-white transition-colors">Platform</Link></li>
              <li><Link href="/pricing" className="text-[#a0aec0] hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/demo" className="text-[#a0aec0] hover:text-white transition-colors">Request Demo</Link></li>
              
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-white">Contact</h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[rgba(26,32,44,0.6)] flex items-center justify-center text-[#00c2cb] mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <span className="text-[#a0aec0]">860-997-7929</span>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[rgba(26,32,44,0.6)] flex items-center justify-center text-[#00c2cb] mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <span className="text-[#a0aec0]">200 Continental Drive, Newark, DE 19713</span>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
          <div className="mb-6 md:mb-0">
            <h5 className="text-lg font-semibold text-white mb-2">Subscribe for Updates</h5>
            <p className="text-[#a0aec0] text-sm">Get the latest on AI innovation, consulting tips, and product news.</p>
          </div>
          <form
  className="flex flex-col sm:flex-row gap-4"
  aria-label="Newsletter Signup"
  onSubmit={async (e) => {
    e.preventDefault();
    setSubLoading(true);
    setSubFeedback('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail })
      });
      if (!res.ok) throw new Error('Failed to subscribe');
      setSubFeedback('Thank you for subscribing!');
      setSubEmail('');
    } catch {
      setSubFeedback('There was a problem subscribing. Please try again.');
    } finally {
      setSubLoading(false);
    }
  }}
>
  <input
    type="email"
    name="email"
    required
    placeholder="Your email address"
    className="px-4 py-2 rounded-lg bg-[#181f2f] border border-[#2d3748] text-[#e2e8f0] focus:outline-none focus:border-[#00c2cb]"
    value={subEmail}
    onChange={e => setSubEmail(e.target.value)}
    disabled={subLoading}
  />
  <button
    type="submit"
    className="px-6 py-2 rounded-lg bg-[#00c2cb] text-[#0d1321] font-bold hover:bg-[#00b3bf] transition-all"
    disabled={subLoading}
  >
    {subLoading ? 'Subscribing...' : 'Subscribe'}
  </button>
</form>
{subFeedback && (
  <div className="mt-2 text-sm text-[#00c2cb]">{subFeedback}</div>
)}

        </div>

        {/* Tagline */}
        <div className="text-center mb-6">
          <span className="inline-block text-[#00c2cb] font-semibold text-lg">ApexSalesAI: Enterprise AI Agents & Consulting for Revenue Growth</span>
        </div>

        {/* Footer Bottom */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.1)] flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#a0aec0] text-sm">&copy; 2025 ApexSalesAI. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/terms" className="text-[#a0aec0] hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="text-[#a0aec0] hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
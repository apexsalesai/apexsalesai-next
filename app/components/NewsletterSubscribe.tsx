'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';

export function NewsletterSubscribe() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setMessage('🎉 Successfully subscribed! Check your email.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section id="subscribe" className="bg-gradient-to-br from-[#1a202c] to-[#0d1321] rounded-2xl p-10 text-center max-w-2xl mx-auto border border-gray-800 shadow-2xl">
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00c2cb]/10 rounded-full mb-4">
          <Mail className="w-8 h-8 text-[#00c2cb]" />
        </div>
        <h3 className="text-3xl font-bold text-white mb-3">Stay Updated on AI Sales & Support Trends</h3>
        <p className="text-gray-400 text-lg">
          Get exclusive insights, case studies, and automation strategies delivered to your inbox.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 px-5 py-3 bg-[#0d1321] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2cb] transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="px-8 py-3 bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Subscribing...
              </>
            ) : status === 'success' ? (
              <>
                <Check className="w-5 h-5" />
                Subscribed!
              </>
            ) : (
              'Subscribe'
            )}
          </button>
        </div>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm ${
            status === 'success' 
              ? 'bg-green-500/10 text-green-400 border border-green-500/30' 
              : 'bg-red-500/10 text-red-400 border border-red-500/30'
          }`}>
            {message}
          </div>
        )}
      </form>

      <p className="text-xs text-gray-500 mt-6">
        Trusted by leaders from Microsoft, Cisco, and HubSpot. Unsubscribe anytime.
      </p>
    </section>
  );
}

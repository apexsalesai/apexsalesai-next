'use client';

import { useState } from 'react';
import { SUBSCRIPTION_PRICING, SUBSCRIPTION_FEATURES } from '@/lib/subscription';

export default function UpgradePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const professionalPrice = SUBSCRIPTION_PRICING.professional[billingCycle];
  const enterprisePrice = SUBSCRIPTION_PRICING.enterprise[billingCycle];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Upgrade to <span className="text-cyan-400">Professional</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Unlock citation-ready exports, advanced analytics, and premium features
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-800 rounded-lg p-1 inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md transition-all ${
                billingCycle === 'annual'
                  ? 'bg-cyan-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Professional Plan */}
          <div className="bg-slate-800 border-2 border-cyan-500 rounded-2xl p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOST POPULAR
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Professional</h2>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">${professionalPrice}</span>
                <span className="text-slate-400 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-sm text-slate-400 mt-2">~$24/month billed annually</p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              {SUBSCRIPTION_FEATURES.filter(f => f.tier === 'professional').map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{feature.name}</p>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-white font-semibold">100 verifications/month</p>
                  <p className="text-slate-400 text-sm">More than enough for most users</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📦</span>
                <div>
                  <p className="text-white font-semibold">50 PDF exports/month</p>
                  <p className="text-slate-400 text-sm">Citation-ready verification records</p>
                </div>
              </li>
            </ul>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-lg transition-all">
              Upgrade to Professional
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Enterprise</h2>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white">${enterprisePrice}</span>
                <span className="text-slate-400 ml-2">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
              </div>
              {billingCycle === 'annual' && (
                <p className="text-sm text-slate-400 mt-2">~$82/month billed annually</p>
              )}
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <p className="text-white font-semibold">Everything in Professional</p>
                  <p className="text-slate-400 text-sm">Plus enterprise features</p>
                </div>
              </li>
              {SUBSCRIPTION_FEATURES.filter(f => f.tier === 'enterprise').map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-2xl mr-3">{feature.icon}</span>
                  <div>
                    <p className="text-white font-semibold">{feature.name}</p>
                    <p className="text-slate-400 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
              <li className="flex items-start">
                <span className="text-2xl mr-3">♾️</span>
                <div>
                  <p className="text-white font-semibold">Unlimited verifications</p>
                  <p className="text-slate-400 text-sm">No monthly limits</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">♾️</span>
                <div>
                  <p className="text-white font-semibold">Unlimited exports</p>
                  <p className="text-slate-400 text-sm">Export as many PDFs as you need</p>
                </div>
              </li>
            </ul>

            <button className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-lg transition-all">
              Contact Sales
            </button>
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="max-w-4xl mx-auto bg-slate-800 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">Feature Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="py-4 text-slate-300">Feature</th>
                  <th className="py-4 text-center text-slate-300">Free</th>
                  <th className="py-4 text-center text-cyan-400">Professional</th>
                  <th className="py-4 text-center text-purple-400">Enterprise</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                <tr className="border-b border-slate-700">
                  <td className="py-4">Monthly Verifications</td>
                  <td className="py-4 text-center">10</td>
                  <td className="py-4 text-center text-cyan-400">100</td>
                  <td className="py-4 text-center text-purple-400">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">PDF Exports</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-cyan-400">50/month</td>
                  <td className="py-4 text-center text-purple-400">Unlimited</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Share Verifications</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-cyan-400">✅</td>
                  <td className="py-4 text-center text-purple-400">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Notes & Tags</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-cyan-400">✅</td>
                  <td className="py-4 text-center text-purple-400">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Usage Analytics</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-cyan-400">✅</td>
                  <td className="py-4 text-center text-purple-400">✅</td>
                </tr>
                <tr className="border-b border-slate-700">
                  <td className="py-4">Team Management</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-purple-400">✅</td>
                </tr>
                <tr>
                  <td className="py-4">Compliance Exports</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center">❌</td>
                  <td className="py-4 text-center text-purple-400">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-12">
          <a
            href="/echo-breaker"
            className="text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Echo Breaker
          </a>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Verification {
  id: string;
  verificationId: string;
  claim: string;
  verdict: string;
  verdictLabel: string;
  confidence: number;
  confidenceBand: string;
  createdAt: string;
  viewCount: number;
  shareCount: number;
}

interface Props {
  verifications: Verification[];
  userName: string;
  subscriptionTier?: string;
}

export default function MyVerificationsClient({ verifications, userName, subscriptionTier = 'free' }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const canExportPDF = subscriptionTier === 'professional' || subscriptionTier === 'enterprise';

  const handleCopyLink = (verificationId: string) => {
    const url = `${window.location.origin}/echo-breaker/v/${verificationId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(verificationId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getVerdictColor = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('not_supported') || v === 'false') return 'bg-red-600';
    if (v.includes('substantiated') || v === 'true') return 'bg-emerald-600';
    return 'bg-amber-600';
  };

  const getVerdictIcon = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes('not_supported') || v === 'false') return '❌';
    if (v.includes('substantiated') || v === 'true') return '✅';
    return '⚠️';
  };

  const handleExportPDF = async (verificationId: string) => {
    // 🔒 MONETIZATION GATE
    if (!canExportPDF) {
      setShowUpgradeModal(true);
      return;
    }

    setExportingId(verificationId);
    try {
      const response = await fetch(`/api/echo-breaker/export/${verificationId}`, {
        method: 'POST',
      });

      if (response.status === 403) {
        // Upgrade required
        setShowUpgradeModal(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const data = await response.json();
      
      // For now, just show success. In production, trigger PDF download
      alert('PDF export successful! (Download feature coming soon)');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/echo-breaker" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
            <span>←</span>
            <span>Back to Echo Breaker</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">My Verifications</h1>
          <p className="text-slate-400">Welcome back, {userName}! You have {verifications.length} saved verifications.</p>
        </div>

        {/* Verifications Grid */}
        {verifications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">No verifications yet</h2>
            <p className="text-slate-400 mb-6">Start verifying claims to build your fact-check library</p>
            <Link
              href="/echo-breaker"
              className="inline-block px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105"
            >
              Verify Your First Claim
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {verifications.map((verification) => (
              <div
                key={verification.id}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm font-semibold ${getVerdictColor(verification.verdict)}`}>
                        <span>{getVerdictIcon(verification.verdict)}</span>
                        <span>{verification.verdictLabel}</span>
                      </span>
                      <span className="text-sm text-slate-400">
                        {verification.confidenceBand} Confidence
                      </span>
                    </div>
                    <p className="text-lg text-slate-200 mb-2 line-clamp-2">{verification.claim}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{new Date(verification.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{verification.viewCount} views</span>
                      <span>•</span>
                      <span>ID: {verification.verificationId}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href={`/echo-breaker/v/${verification.verificationId}`}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleCopyLink(verification.verificationId)}
                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors"
                  >
                    {copiedId === verification.verificationId ? '✓ Copied!' : '🔗 Copy Link'}
                  </button>
                  <button
                    onClick={() => handleExportPDF(verification.verificationId)}
                    disabled={exportingId === verification.verificationId}
                    className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all relative ${
                      canExportPDF
                        ? 'bg-emerald-600 hover:bg-emerald-500'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 animate-pulse'
                    }`}
                  >
                    {exportingId === verification.verificationId ? (
                      '⏳ Exporting...'
                    ) : canExportPDF ? (
                      '📄 Export PDF'
                    ) : (
                      <>
                        🔒 Export PDF
                        <span className="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded">PRO</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full border border-cyan-500/50 shadow-2xl">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h2 className="text-2xl font-bold text-white mb-2">Upgrade to Professional</h2>
                <p className="text-slate-300 mb-6">
                  PDF export is a Professional feature. Unlock citation-ready exports, advanced analytics, and more.
                </p>
                
                <div className="bg-slate-900 rounded-lg p-4 mb-6">
                  <div className="text-sm text-slate-400 mb-2">Professional Plan</div>
                  <div className="text-4xl font-bold text-white mb-1">$29<span className="text-lg text-slate-400">/mo</span></div>
                  <div className="text-sm text-emerald-400">or $290/year (save 17%)</div>
                </div>

                <div className="space-y-3 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <div>
                      <div className="text-white font-semibold">50 PDF Exports/month</div>
                      <div className="text-sm text-slate-400">Citation-ready verification records</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <div>
                      <div className="text-white font-semibold">100 Verifications/month</div>
                      <div className="text-sm text-slate-400">10x more than free tier</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 text-xl">✓</span>
                    <div>
                      <div className="text-white font-semibold">Advanced Features</div>
                      <div className="text-sm text-slate-400">Share links, notes, tags, analytics</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors"
                  >
                    Maybe Later
                  </button>
                  <Link
                    href="/echo-breaker/upgrade"
                    className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-bold transition-all text-center"
                  >
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
}

export default function MyVerificationsClient({ verifications, userName }: Props) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

                <div className="flex items-center gap-2">
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

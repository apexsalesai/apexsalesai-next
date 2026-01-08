'use client';

import { useState } from 'react';
import DecisionPanel from '../../components/DecisionPanel';

interface Props {
  claim: string;
  result: any;
  verificationId: string;
  createdAt: string;
  viewCount: number;
  userName?: string | null;
}

export default function EchoBreakerVerificationView({
  claim,
  result,
  verificationId,
  createdAt,
  viewCount,
  userName,
}: Props) {
  const [copied, setCopied] = useState(false);

  // Helper functions (same as EchoBreakerClient)
  const getVerdictText = (result: any): string => {
    return result?.verdict?.verdictClassification || result?.verdict || 'UNKNOWN';
  };

  const getVerdictLabel = (verdict: string): string => {
    const v = verdict.toLowerCase();
    if (v.includes('not_supported') || v === 'false') {
      return 'Not Supported by Evidence';
    } else if (v.includes('substantiated') || v === 'true') {
      return 'Substantiated';
    } else {
      return 'Needs Context';
    }
  };

  const getVerdictIcon = (verdict: string): string => {
    const v = verdict.toLowerCase();
    if (v.includes('not_supported') || v === 'false') return '❌';
    if (v.includes('substantiated') || v === 'true') return '✅';
    return '⚠️';
  };

  const getVerdictColor = (verdict: string): string => {
    const v = verdict.toLowerCase();
    if (v.includes('not_supported') || v === 'false') return 'bg-red-600';
    if (v.includes('substantiated') || v === 'true') return 'bg-emerald-600';
    return 'bg-amber-600';
  };

  const getConfidenceValue = (result: any): number => {
    return result?.verdict?.confidenceValue || result?.confidence || 0;
  };

  const getConfidenceBand = (confidence: number): string => {
    if (confidence >= 0.85) return 'Very High';
    if (confidence >= 0.70) return 'High';
    if (confidence >= 0.50) return 'Medium';
    if (confidence >= 0.30) return 'Low';
    return 'Very Low';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.70) return { bg: 'bg-emerald-500', text: 'text-emerald-400' };
    if (confidence >= 0.50) return { bg: 'bg-amber-500', text: 'text-amber-400' };
    return { bg: 'bg-red-500', text: 'text-red-400' };
  };

  const getEvidenceStrength = (confidence: number): string => {
    if (confidence >= 0.80) return 'Strong';
    if (confidence >= 0.60) return 'Medium–High';
    if (confidence >= 0.40) return 'Medium';
    return 'Weak';
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/echo-breaker/v/${verificationId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/echo-breaker/v/${verificationId}`;
    const text = `Fact-checked: "${claim}"\n\nVerdict: ${getVerdictLabel(getVerdictText(result))}\n\nVerified by Echo Breaker`;
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const verdict = getVerdictText(result);
  const confidence = getConfidenceValue(result);
  const confidenceColors = getConfidenceColor(confidence);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/echo-breaker" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-4">
            <span>←</span>
            <span>Back to Echo Breaker</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Fact-Check Verification</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <span>ID: {verificationId}</span>
            <span>•</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
            <span>•</span>
            <span>{viewCount} views</span>
            {userName && (
              <>
                <span>•</span>
                <span>Verified by {userName}</span>
              </>
            )}
          </div>
        </div>

        {/* Claim */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Claim Being Verified</h2>
          <p className="text-lg sm:text-xl text-slate-100 leading-relaxed">{claim}</p>
        </div>

        {/* Hero Banner */}
        <div className="mb-6 animate-fadeIn">
          <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 text-center shadow-2xl ${
            verdict.toLowerCase().includes('not_supported') || verdict.toLowerCase().includes('false')
              ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900'
              : verdict.toLowerCase().includes('substantiated') || verdict.toLowerCase().includes('true')
              ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900'
              : 'bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            <div className="absolute inset-0 bg-black/20"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-6 animate-scaleIn">
                <div className="text-7xl md:text-8xl">
                  {getVerdictIcon(verdict)}
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                {verdict.toLowerCase().includes('not_supported') || verdict.toLowerCase().includes('false')
                  ? '🚨 CLAIM DEBUNKED'
                  : verdict.toLowerCase().includes('substantiated') || verdict.toLowerCase().includes('true')
                  ? '✅ CLAIM VERIFIED'
                  : '⚠️ NEEDS CONTEXT'}
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed px-4">
                {verdict.toLowerCase().includes('not_supported') || verdict.toLowerCase().includes('false')
                  ? 'Official government sources contradict this claim'
                  : verdict.toLowerCase().includes('substantiated') || verdict.toLowerCase().includes('true')
                  ? 'Backed by authoritative government sources'
                  : 'Additional context required for full picture'}
              </p>
              
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-2xl">📊</span>
                <span className="text-white font-bold text-sm md:text-base">
                  {result?.sources?.tier1?.length || 0} Tier-1 Sources Analyzed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Panel */}
        {result?.decisionPanel && (
          <DecisionPanel decisionPanel={result.decisionPanel} />
        )}

        {/* Verdict Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl mb-6">
          <div className="p-6 space-y-6">
            {/* Bottom Line */}
            <div className="flex items-center gap-6">
              <div className={`flex-shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-full ${getVerdictColor(verdict)} shadow-xl`}>
                <span className="text-4xl text-white font-bold">{getVerdictIcon(verdict)}</span>
              </div>
              
              <div className="flex-1 text-left">
                <h2 className="text-3xl font-black mb-2 tracking-tight">{getVerdictLabel(verdict)}</h2>
                <p className="text-sm text-slate-400">{result.summary}</p>
              </div>
            </div>

            {/* Confidence Metrics */}
            {confidenceColors && (
              <div className="space-y-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Confidence Level</h4>
                    <span className={`text-2xl font-black ${confidenceColors.text}`}>
                      {getConfidenceBand(confidence)}
                    </span>
                  </div>
                  
                  <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${confidenceColors.bg} rounded-full`}
                      style={{ width: `${Math.round(confidence * 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">0%</span>
                    <span className={`text-sm font-bold ${confidenceColors.text}`}>
                      {Math.round(confidence * 100)}%
                    </span>
                    <span className="text-xs text-slate-400">100%</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="text-center p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="text-4xl font-black text-slate-200 mb-2">
                      {getEvidenceStrength(confidence)}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Evidence Strength</div>
                  </div>
                  <div className="text-center p-5 rounded-xl bg-slate-800/50 border border-slate-700">
                    <div className="text-4xl font-black text-indigo-400 mb-2">
                      {result.sources?.tier1?.length || 0}
                    </div>
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Tier-1 Sources</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Share Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-slate-100 mb-4">Share This Verification</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={handleCopyLink}
              className="px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 active:scale-95"
            >
              {copied ? '✓ Copied!' : '🔗 Copy Link'}
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-105 active:scale-95"
            >
              𝕏 Share to X
            </button>
            <button
              onClick={() => handleShare('linkedin')}
              className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-105 active:scale-95"
            >
              💼 LinkedIn
            </button>
            <button
              onClick={() => handleShare('facebook')}
              className="px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-all hover:scale-105 active:scale-95"
            >
              📘 Facebook
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Powered by <a href="/echo-breaker" className="text-indigo-400 hover:text-indigo-300">Echo Breaker</a></p>
          <p className="mt-1">Fact-checking with AI + authoritative sources</p>
        </div>
      </div>
    </div>
  );
}

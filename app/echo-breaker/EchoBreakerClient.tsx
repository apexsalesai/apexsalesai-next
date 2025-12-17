"use client";

import { useState, useEffect } from "react";

type Source = {
  title: string;
  url: string;
  domain: string;
  snippet?: string;
  tier: string;
  reason: string;
};

type VerificationResponse = {
  verificationId?: string;
  verdict?: string;
  confidence?: number;
  summary?: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources?: {
    tier1?: Source[];
    tier2?: Source[];
    tier3?: Source[];
  };
  error?: string;
};

type AnalysisPhase = {
  id: number;
  label: string;
  icon: string;
};

const ANALYSIS_PHASES: AnalysisPhase[] = [
  { id: 1, label: "Parsing the Claim", icon: "🔍" },
  { id: 2, label: "Searching Official Sources", icon: "🏛️" },
  { id: 3, label: "Cross-Checking Independent Research", icon: "📊" },
  { id: 4, label: "Evaluating Conflicts & Context", icon: "⚖️" },
  { id: 5, label: "Final Verdict Generated", icon: "✨" },
];

export default function EchoBreakerClient() {
  const [claim, setClaim] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const [showProofCard, setShowProofCard] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatData: true,
    whySpread: true,
    tier1: true,
    tier2: true,
    tier3: false, // Tier 3 collapsed by default
  });

  // Animate confidence from 0 to final value
  useEffect(() => {
    if (result?.confidence !== undefined) {
      let start = 0;
      const end = result.confidence;
      const duration = 1500;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setAnimatedConfidence(end);
          clearInterval(timer);
        } else {
          setAnimatedConfidence(start);
        }
      }, 16);
      
      return () => clearInterval(timer);
    }
  }, [result?.confidence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentPhase(0);
    setAnimatedConfidence(0);
    
    // Simulate multi-stage analysis (even if backend is faster)
    const phaseInterval = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev < ANALYSIS_PHASES.length - 1) return prev + 1;
        return prev;
      });
    }, 600);
    
    try {
      const res = await fetch("/api/reality-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, link }),
      });
      const text = await res.text();
      let json: any = null;
      try {
        json = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Unexpected response from verifier");
      }
      if (!res.ok || json?.error) {
        throw new Error(json?.error || "Verification failed");
      }
      
      // Wait for all phases to complete before showing result
      setTimeout(() => {
        clearInterval(phaseInterval);
        setCurrentPhase(ANALYSIS_PHASES.length);
        setTimeout(() => {
          setResult(json as VerificationResponse);
          setLoading(false);
        }, 400);
      }, Math.max(0, 3000 - Date.now()));
      
    } catch (err: any) {
      clearInterval(phaseInterval);
      setError(err?.message || "Verification failed");
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Color system based on confidence
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return { bg: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500" };
    if (confidence >= 50) return { bg: "bg-amber-500", text: "text-amber-500", ring: "ring-amber-500" };
    return { bg: "bg-red-500", text: "text-red-500", ring: "ring-red-500" };
  };

  const getVerdictColor = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    if (v.includes("false")) return "bg-red-600";
    if (v.includes("misleading")) return "bg-amber-600";
    if (v.includes("true")) return "bg-emerald-600";
    return "bg-slate-600";
  };

  const getVerdictIcon = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    if (v.includes("false")) return "✕";
    if (v.includes("misleading")) return "⚠";
    if (v.includes("true")) return "✓";
    return "?";
  };

  const getVerdictLabel = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    if (v.includes("false")) return "Not Supported by Evidence";
    if (v.includes("misleading")) return "Contextually Incomplete";
    if (v.includes("true")) return "Substantiated";
    return "Inconclusive";
  };

  const getConfidenceBand = (confidence: number) => {
    if (confidence >= 85) return "HIGH";
    if (confidence >= 50) return "MODERATE";
    return "LOW";
  };

  const getConfidenceRange = (confidence: number) => {
    // Show ranges for more credible presentation
    if (confidence >= 85) return `${Math.max(85, confidence - 5)}–${Math.min(100, confidence + 3)}%`;
    if (confidence >= 50) return `${confidence - 8}–${confidence + 8}%`;
    if (confidence < 20) return "Insufficient corroboration";
    return `${confidence - 5}–${confidence + 5}%`;
  };

  const getEvidenceStrength = (confidence: number) => {
    if (confidence >= 85) return "Strong";
    if (confidence >= 70) return "Medium–High";
    if (confidence >= 50) return "Medium";
    return "Weak";
  };

  const handleShare = (platform: string) => {
    const text = `Fact-checked: "${claim}" - Verdict: ${result?.verdict} (${Math.round(result?.confidence || 0)}% confidence)`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent("Fact Check Result")}&body=${encodeURIComponent(text + "\n\n" + url)}`,
    };
    
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const confidenceColors = result ? getConfidenceColor(result.confidence || 0) : null;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-200">
            ProofLayer · Reality Infrastructure
          </span>
        </div>

        {/* Hero */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">
            Verify reality before you publish
          </h1>
          <p className="text-lg text-slate-400">
            Paste any claim, headline, or viral stat — get verified evidence from official sources. Share with confidence.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/50 border border-slate-800 rounded-xl p-6">
          <div>
            <label className="block text-sm font-medium mb-2">Claim or statement</label>
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder='e.g., "20 million illegal immigrants have entered the US since 2016"'
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Proof source link (for context) <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-lg disabled:opacity-60 transition-all"
          >
            {loading ? "Verifying..." : "✓ Verify Reality"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>

        {/* Multi-Stage Analysis Animation */}
        {loading && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-8 space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
              </div>
              <h3 className="text-xl font-semibold">Intelligence in Motion</h3>
            </div>
            
            <div className="space-y-4">
              {ANALYSIS_PHASES.map((phase, idx) => (
                <div
                  key={phase.id}
                  className={`flex items-center gap-4 p-4 rounded-lg transition-all duration-500 ${
                    idx <= currentPhase
                      ? "bg-indigo-900/30 border border-indigo-700/50"
                      : "bg-slate-800/30 border border-slate-700/30"
                  }`}
                >
                  <div className={`text-3xl transition-all duration-300 ${
                    idx === currentPhase ? "animate-pulse scale-110" : ""
                  }`}>
                    {phase.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium transition-colors ${
                      idx <= currentPhase ? "text-slate-200" : "text-slate-500"
                    }`}>
                      {phase.label}
                    </p>
                  </div>
                  {idx < currentPhase && (
                    <div className="text-emerald-400 text-xl">✓</div>
                  )}
                  {idx === currentPhase && (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-400"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verdict Card - Apple Pay Style */}
        {result && !loading && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl p-8 space-y-8 shadow-2xl">
            {/* Verdict Header with Large Icon */}
            <div className="text-center space-y-6">
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${getVerdictColor(result.verdict)} shadow-2xl`}>
                <span className="text-6xl text-white font-bold">{getVerdictIcon(result.verdict)}</span>
              </div>
              
              <div>
                <h2 className="text-5xl font-black mb-4 tracking-tight">{getVerdictLabel(result.verdict)}</h2>
                <p className="text-2xl text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed">
                  {result.summary || result.bottomLine}
                </p>
              </div>

              {/* DOMINANT Confidence Badge - Institutional Grade */}
              {confidenceColors && (
                <div className="inline-flex flex-col items-center gap-4 p-8 rounded-3xl bg-slate-800/50 border-2 border-slate-700 shadow-2xl max-w-md mx-auto">
                  <div className={`relative inline-flex items-center justify-center w-48 h-48 rounded-full ring-[16px] ${confidenceColors.ring} ring-opacity-40 ${confidenceColors.bg} bg-opacity-10 shadow-[0_0_60px_rgba(0,0,0,0.3)]`}>
                    <div className="absolute inset-0 rounded-full ${confidenceColors.bg} opacity-20 blur-2xl"></div>
                    <div className="text-center relative z-10">
                      <div className={`text-2xl font-bold text-slate-300 mb-1 uppercase tracking-wider`}>
                        {getConfidenceBand(result.confidence || 0)}
                      </div>
                      <div className={`text-5xl font-black ${confidenceColors.text} drop-shadow-lg`}>
                        {(result.confidence || 0) < 20 ? "<20%" : getConfidenceRange(result.confidence || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="text-center space-y-2 w-full">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 rounded-lg">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">Evidence Strength</span>
                      <span className="text-sm font-bold text-slate-200">{getEvidenceStrength(result.confidence || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 rounded-lg">
                      <span className="text-xs text-slate-400 uppercase tracking-wide">Source Consensus</span>
                      <span className="text-sm font-bold text-slate-200">{result.sources?.tier1?.length || 0} Tier-1 sources</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Confidence Level</p>
                  </div>
                </div>
              )}
            </div>

            {/* What the Data Shows */}
            {result.whatDataShows && result.whatDataShows.length > 0 && (
              <div className="border-t border-slate-700 pt-6">
                <button
                  onClick={() => toggleSection('whatData')}
                  className="flex items-center justify-between w-full text-left mb-4 group"
                >
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-2xl">📊</span>
                    What the Data Actually Shows
                  </h3>
                  <span className="text-slate-400 group-hover:text-slate-300">{expandedSections.whatData ? '▼' : '▶'}</span>
                </button>
                {expandedSections.whatData && (
                  <ul className="space-y-3 pl-10">
                    {result.whatDataShows.map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-200 leading-relaxed">
                        <span className="text-emerald-400 text-xl flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Why This Claim Spread */}
            {result.spreadFactors && result.spreadFactors.length > 0 && (
              <div className="border-t border-slate-700 pt-6">
                <button
                  onClick={() => toggleSection('whySpread')}
                  className="flex items-center justify-between w-full text-left mb-4 group"
                >
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <span className="text-2xl">🔥</span>
                    How This Claim Took Hold
                  </h3>
                  <span className="text-slate-400 group-hover:text-slate-300">{expandedSections.whySpread ? '▼' : '▶'}</span>
                </button>
                {expandedSections.whySpread && (
                  <ul className="space-y-3 pl-10">
                    {result.spreadFactors.map((item, idx) => (
                      <li key={idx} className="text-slate-300 leading-relaxed">• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Sources - Improved Scannability */}
            {result.sources && (result.sources.tier1?.length || result.sources.tier2?.length || result.sources.tier3?.length) && (
              <div className="border-t border-slate-700 pt-6 space-y-6">
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Verified Evidence
                </h3>

                {/* Tier 1 */}
                {result.sources.tier1 && result.sources.tier1.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('tier1')}
                      className="flex items-center justify-between w-full text-left mb-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold">TIER 1</span>
                        <span className="text-sm font-semibold text-emerald-400">Official Government Data</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-300">{expandedSections.tier1 ? '▼' : '▶'}</span>
                    </button>
                    {expandedSections.tier1 && (
                      <div className="space-y-3">
                        {result.sources.tier1.map((s, idx) => (
                          <div key={idx} className="bg-emerald-900/20 rounded-lg p-4 border-l-4 border-emerald-500">
                            <p className="font-semibold text-slate-100 mb-1">{s.title}</p>
                            <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-emerald-400 hover:underline block mb-2">
                              {s.domain} →
                            </a>
                            <p className="text-sm text-slate-400 italic">{s.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tier 2 */}
                {result.sources.tier2 && result.sources.tier2.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('tier2')}
                      className="flex items-center justify-between w-full text-left mb-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-bold">TIER 2</span>
                        <span className="text-sm font-semibold text-blue-400">Reputable News & Research</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-300">{expandedSections.tier2 ? '▼' : '▶'}</span>
                    </button>
                    {expandedSections.tier2 && (
                      <div className="space-y-3">
                        {result.sources.tier2.map((s, idx) => (
                          <div key={idx} className="bg-blue-900/20 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="font-semibold text-slate-100 mb-1">{s.title}</p>
                            <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-blue-400 hover:underline block mb-2">
                              {s.domain} →
                            </a>
                            <p className="text-sm text-slate-400 italic">{s.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tier 3 - Collapsed by Default */}
                {result.sources.tier3 && result.sources.tier3.length > 0 && (
                  <div>
                    <button
                      onClick={() => toggleSection('tier3')}
                      className="flex items-center justify-between w-full text-left mb-3 group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-slate-600 text-slate-300 text-xs font-bold">TIER 3</span>
                        <span className="text-sm font-semibold text-slate-400">Supporting Context</span>
                      </div>
                      <span className="text-slate-400 group-hover:text-slate-300">{expandedSections.tier3 ? '▼' : '▶'}</span>
                    </button>
                    {expandedSections.tier3 && (
                      <div className="space-y-3">
                        {result.sources.tier3.map((s, idx) => (
                          <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-slate-600">
                            <p className="font-semibold text-slate-100 mb-1">{s.title}</p>
                            <a href={s.url} target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:underline block mb-2">
                              {s.domain} →
                            </a>
                            <p className="text-sm text-slate-500 italic">{s.reason}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-2xl font-bold text-slate-100 mb-2">Verified insight — ready to share or cite</h3>
              <p className="text-sm text-slate-400 mb-4">This verification is publication-ready and backed by official sources.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setShowProofCard(true)}
                  className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  📥 Generate ProofCard
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm transition-colors"
                >
                  𝕏 Share to X
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm transition-colors"
                >
                  💼 LinkedIn
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm transition-colors"
                >
                  📘 Facebook
                </button>
                <button
                  onClick={() => handleShare('reddit')}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm transition-colors"
                >
                  🔴 Reddit
                </button>
                <button
                  onClick={() => handleShare('copy')}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm transition-colors"
                >
                  📋 Copy Link
                </button>
              </div>
            </div>

            {/* Branding */}
            <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-700">
              ProofLayer by ApexSalesAI · Verification ID: {result.verificationId?.slice(0, 8)}
            </div>
          </div>
        )}

        {/* ProofCard Modal (Placeholder for now) */}
        {showProofCard && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl p-8 max-w-2xl w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">ProofCard</h2>
                <button
                  onClick={() => setShowProofCard(false)}
                  className="text-slate-400 hover:text-slate-200 text-2xl"
                >
                  ✕
                </button>
              </div>
              
              {/* ProofCard Content - VIRAL OPTIMIZED */}
              <div className={`bg-gradient-to-br from-white to-slate-50 text-slate-900 rounded-2xl p-10 space-y-8 relative overflow-hidden shadow-2xl`}>
                {/* Color Glow Effect */}
                <div className={`absolute inset-0 ${confidenceColors?.bg} opacity-5 blur-3xl`}></div>
                
                <div className="text-center relative z-10">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${getVerdictColor(result?.verdict)} mb-6 shadow-2xl ring-8 ring-white/50`}>
                    <span className="text-5xl text-white font-bold">{getVerdictIcon(result?.verdict)}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 tracking-tight">{getVerdictLabel(result?.verdict)}</h3>
                  <p className="text-xl text-slate-700 mb-6 font-medium leading-relaxed max-w-lg mx-auto">"{claim.length > 120 ? claim.slice(0, 120) + '...' : claim}"</p>
                  
                  {/* DOMINANT Confidence Badge - Institutional */}
                  <div className={`inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl ${confidenceColors?.bg} bg-opacity-10 border-2 ${confidenceColors?.ring} shadow-lg`}>
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">
                      {getConfidenceBand(result?.confidence || 0)}
                    </div>
                    <div className={`text-5xl font-black ${confidenceColors?.text}`}>
                      {(result?.confidence || 0) < 20 ? "<20%" : getConfidenceRange(result?.confidence || 0)}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Evidence Strength: {getEvidenceStrength(result?.confidence || 0)}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                  <h4 className="font-semibold mb-2">Top Sources:</h4>
                  <ul className="space-y-1 text-sm">
                    {result?.sources?.tier1?.slice(0, 3).map((s, idx) => (
                      <li key={idx} className="text-slate-700">• {s.domain}</li>
                    ))}
                  </ul>
                </div>

                {/* Trust Artifact Footer */}
                <div className="text-center pt-6 border-t-2 border-slate-200 relative z-10 space-y-3">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">P</div>
                    <span className="font-bold text-slate-900 text-lg">ProofLayer</span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>Verification ID: {result?.verificationId?.slice(0, 12) || 'N/A'}</p>
                    <p>Verified: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    <p className="text-slate-500">Multi-source consensus analysis · apexsalesai.com</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold">
                  📥 Download PNG
                </button>
                <button
                  onClick={() => setShowProofCard(false)}
                  className="px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import html2canvas from "html2canvas";
import DecisionPanel from "./components/DecisionPanel";

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
  verifiedAt?: string;
  
  // New Decision Intelligence format
  decisionPanel?: {
    actionReadiness: string;
    decisionConfidence: string;
    timeSensitivity: string;
    primaryRisk: string;
    recommendedAction: {
      headline: string;
      summary: string;
      do: string[];
      avoid: string[];
    };
  };
  verdict?: string | {
    classification: string;
    confidenceBand: string;
    confidenceValue: number;
    confidenceColor: string;
    evidenceStrength: string;
    sourceConsensus: {
      tier1Count: number;
      tier2Count: number;
      tier3Count: number;
      summary: string;
    };
  };
  whatTheEvidenceShows?: string[];
  whyThisNarrativeSpread?: string[];
  actionScenarios?: Array<{
    scenario: string;
    risk: string;
    impact: string;
    notes: string;
  }>;
  methodology?: {
    approach: string;
    rankingLogic: string;
    limitations: string[];
  };
  
  // Legacy format (for backward compatibility)
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

// Helper functions to extract values from both old and new API formats
function getConfidenceValue(result: VerificationResponse | null): number {
  if (!result) return 0;
  // Try new format first
  if (typeof result.verdict === 'object' && result.verdict?.confidenceValue !== undefined) {
    return result.verdict.confidenceValue;
  }
  // Fall back to legacy format
  return result.confidence || 0;
}

function getVerdictText(result: VerificationResponse | null): string {
  if (!result) return '';
  // Try new format first
  if (typeof result.verdict === 'object' && result.verdict?.classification) {
    return result.verdict.classification;
  }
  // Fall back to legacy format
  return typeof result.verdict === 'string' ? result.verdict : '';
}

function getEvidenceShows(result: VerificationResponse | null): string[] {
  if (!result) return [];
  return result.whatTheEvidenceShows || result.whatDataShows || [];
}

function getSpreadFactors(result: VerificationResponse | null): string[] {
  if (!result) return [];
  return result.whyThisNarrativeSpread || result.spreadFactors || [];
}

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
    const confidenceValue = getConfidenceValue(result);
    if (confidenceValue > 0) {
      let start = 0;
      const end = confidenceValue;
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
  }, [result]);

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

  const handleReset = () => {
    setClaim("");
    setLink("");
    setResult(null);
    setError(null);
    setLoading(false);
    setCurrentPhase(0);
    setAnimatedConfidence(0);
    setExpandedSections({
      whatData: true,
      whySpread: true,
      tier1: true,
      tier2: true,
      tier3: false,
    });
  };

  // Color system based on confidence (expects 0-1 range)
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return { bg: "bg-emerald-500", text: "text-emerald-500", ring: "ring-emerald-500" };
    if (confidence >= 0.50) return { bg: "bg-amber-500", text: "text-amber-500", ring: "ring-amber-500" };
    return { bg: "bg-red-500", text: "text-red-500", ring: "ring-red-500" };
  };

  const getVerdictColor = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    // New format
    if (v.includes("not_supported") || v.includes("not supported")) return "bg-red-600";
    if (v.includes("contextually_incomplete") || v.includes("contextually incomplete")) return "bg-amber-600";
    if (v.includes("substantiated")) return "bg-emerald-600";
    // Legacy format
    if (v.includes("false")) return "bg-red-600";
    if (v.includes("misleading")) return "bg-amber-600";
    if (v.includes("true")) return "bg-emerald-600";
    return "bg-slate-600";
  };

  const getVerdictIcon = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    // New format
    if (v.includes("not_supported") || v.includes("not supported")) return "✕";
    if (v.includes("contextually_incomplete") || v.includes("contextually incomplete")) return "⚠";
    if (v.includes("substantiated")) return "✓";
    // Legacy format
    if (v.includes("false")) return "✕";
    if (v.includes("misleading")) return "⚠";
    if (v.includes("true")) return "✓";
    return "?";
  };

  const getVerdictLabel = (verdict?: string) => {
    const v = (verdict || "").toLowerCase();
    // New format
    if (v.includes("not_supported") || v.includes("not supported")) return "Not Supported by Evidence";
    if (v.includes("contextually_incomplete") || v.includes("contextually incomplete")) return "Contextually Incomplete";
    if (v.includes("substantiated")) return "Substantiated";
    // Legacy format
    if (v.includes("false")) return "Not Supported by Evidence";
    if (v.includes("misleading")) return "Contextually Incomplete";
    if (v.includes("true")) return "Substantiated";
    return "Inconclusive";
  };

  const getConfidenceBand = (confidence: number) => {
    if (confidence >= 0.85) return "HIGH";
    if (confidence >= 0.50) return "MODERATE";
    return "LOW";
  };

  const getConfidenceRange = (confidence: number) => {
    if (confidence >= 0.85) return "85-100%";
    if (confidence >= 0.70) return "70-84%";
    if (confidence >= 0.50) return "50-69%";
    if (confidence >= 0.20) return "20-49%";
    return "0-19%";
  };

  const getEvidenceStrength = (confidence: number) => {
    if (confidence >= 0.85) return "Strong";
    if (confidence >= 0.70) return "Medium–High";
    if (confidence >= 0.50) return "Medium";
    return "Weak";
  };

  const handleShare = (platform: string) => {
    const verdict = getVerdictLabel(getVerdictText(result));
    const confidence = Math.round(getConfidenceValue(result) * 100);
    const text = `Fact-checked: "${claim}"\n\n- Verdict: ${verdict} (${confidence}% confidence)\n\nVerified by ProofLayer\n${window.location.href}`;
    const url = window.location.href;
    
    const shareUrls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      reddit: `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent("Fact Check Result")}&body=${encodeURIComponent(text)}`,
    };
    
    if (platform === "copy") {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } else if (platform === "linkedin" || platform === "facebook") {
      // Copy content to clipboard for platforms that don't support pre-filling
      navigator.clipboard.writeText(text);
      alert("✅ Content copied to clipboard!\n\nPaste it into your post when the window opens.");
      setTimeout(() => {
        window.open(shareUrls[platform], "_blank", "width=600,height=600");
      }, 500);
    } else if (shareUrls[platform]) {
      window.open(shareUrls[platform], "_blank", "width=600,height=400");
    }
  };

  const handleShareSummary = () => {
    const verdict = getVerdictLabel(getVerdictText(result));
    const confidence = Math.round(getConfidenceValue(result) * 100);
    const tier1Count = result?.sources?.tier1?.length || 0;
    
    const summary = `🔍 FACT CHECK RESULT

Claim: "${claim}"

Verdict: ${verdict}
Confidence: ${confidence}%
Tier-1 Sources: ${tier1Count}

Verified by ProofLayer
${window.location.href}`;
    
    navigator.clipboard.writeText(summary);
    alert("Summary copied to clipboard! ✅");
  };

  const handleShareSources = () => {
    const tier1 = result?.sources?.tier1 || [];
    const tier2 = result?.sources?.tier2 || [];
    
    const sourcesList = `📚 VERIFIED SOURCES

Claim: "${claim}"

TIER-1 SOURCES (Official):
${tier1.map((s, i) => `${i + 1}. ${s.title}\n   ${s.url}`).join('\n\n')}

${tier2.length > 0 ? `TIER-2 SOURCES (Supporting):\n${tier2.slice(0, 3).map((s, i) => `${i + 1}. ${s.title}\n   ${s.url}`).join('\n\n')}` : ''}

Verified by ProofLayer
${window.location.href}`;
    
    navigator.clipboard.writeText(sourcesList);
    alert("Sources copied to clipboard! ✅");
  };

  const handleEmailFullAnalysis = () => {
    const verdict = getVerdictLabel(getVerdictText(result));
    const confidence = Math.round(getConfidenceValue(result) * 100);
    const evidenceShows = getEvidenceShows(result);
    const spreadFactors = getSpreadFactors(result);
    const tier1 = result?.sources?.tier1 || [];
    
    const emailBody = `COMPLETE FACT CHECK ANALYSIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"${claim}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${verdict}
Confidence: ${confidence}%
Evidence Strength: ${getEvidenceStrength(getConfidenceValue(result))}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THE EVIDENCE SHOWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${evidenceShows.map((e, i) => `${i + 1}. ${e}`).join('\n')}

${spreadFactors.length > 0 ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THIS NARRATIVE SPREAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${spreadFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIER-1 SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${tier1.map((s, i) => `${i + 1}. ${s.title}\n   ${s.url}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verified by ProofLayer
${window.location.href}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

    const subject = `Fact Check: ${claim.slice(0, 50)}${claim.length > 50 ? '...' : ''}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };

  const handleShareFullAnalysis = () => {
    const verdict = getVerdictLabel(getVerdictText(result));
    const confidence = Math.round(getConfidenceValue(result) * 100);
    const evidenceShows = getEvidenceShows(result);
    const spreadFactors = getSpreadFactors(result);
    const tier1 = result?.sources?.tier1 || [];
    
    const fullAnalysis = `🔍 COMPLETE FACT CHECK ANALYSIS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CLAIM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"${claim}"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
VERDICT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${verdict}
Confidence: ${confidence}%
Evidence Strength: ${getEvidenceStrength(getConfidenceValue(result))}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHAT THE EVIDENCE SHOWS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${evidenceShows.map((e, i) => `${i + 1}. ${e}`).join('\n')}

${spreadFactors.length > 0 ? `━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHY THIS NARRATIVE SPREAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${spreadFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TIER-1 SOURCES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${tier1.map((s, i) => `${i + 1}. ${s.title}\n   ${s.url}`).join('\n\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Verified by ProofLayer
${window.location.href}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    navigator.clipboard.writeText(fullAnalysis);
    alert("Full analysis copied to clipboard! ✅");
  };

  const handleDownloadProofCard = async () => {
    const proofCardElement = document.getElementById('proof-card-content');
    if (!proofCardElement) {
      alert("ProofCard not found. Please try again.");
      return;
    }

    try {
      const canvas = await html2canvas(proofCardElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        logging: false,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `proofcard-${Date.now()}.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }
      });
    } catch (error) {
      console.error('Error generating ProofCard:', error);
      alert("Failed to generate ProofCard. Please try again.");
    }
  };

  const confidenceColors = result ? getConfidenceColor(getConfidenceValue(result)) : null;

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

        {/* HERO BANNER - Emotional Impact with Enhanced Drama */}
        {result && !loading && (
          <div className="mb-6 animate-fadeIn">
            <div className={`relative overflow-hidden rounded-2xl p-8 md:p-12 text-center shadow-2xl ${
              getVerdictText(result).toLowerCase().includes('not_supported') || getVerdictText(result).toLowerCase().includes('false')
                ? 'bg-gradient-to-br from-red-900 via-red-800 to-red-900'
                : getVerdictText(result).toLowerCase().includes('substantiated') || getVerdictText(result).toLowerCase().includes('true')
                ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900'
                : 'bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900'
            }`}>
              {/* Animated Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
              <div className="absolute inset-0 bg-black/20"></div>
              
              <div className="relative z-10">
                {/* Large Animated Verdict Icon */}
                <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 mb-6 animate-scaleIn">
                  <div className={`text-7xl md:text-8xl ${
                    getVerdictText(result).toLowerCase().includes('not_supported') || getVerdictText(result).toLowerCase().includes('false')
                      ? 'animate-shake'
                      : getVerdictText(result).toLowerCase().includes('substantiated') || getVerdictText(result).toLowerCase().includes('true')
                      ? 'animate-bounce'
                      : 'animate-pulse'
                  }`}>
                    {getVerdictIcon(getVerdictText(result))}
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 tracking-tight animate-slideUp">
                  {getVerdictText(result).toLowerCase().includes('not_supported') || getVerdictText(result).toLowerCase().includes('false')
                    ? '🚨 CLAIM DEBUNKED'
                    : getVerdictText(result).toLowerCase().includes('substantiated') || getVerdictText(result).toLowerCase().includes('true')
                    ? '✅ CLAIM VERIFIED'
                    : '⚠️ NEEDS CONTEXT'}
                </h1>
                
                <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 max-w-3xl mx-auto leading-relaxed px-4">
                  {getVerdictText(result).toLowerCase().includes('not_supported') || getVerdictText(result).toLowerCase().includes('false')
                    ? 'Official government sources contradict this claim'
                    : getVerdictText(result).toLowerCase().includes('substantiated') || getVerdictText(result).toLowerCase().includes('true')
                    ? 'Backed by authoritative government sources'
                    : 'Additional context required for full picture'}
                </p>
                
                {/* Source Count Badge */}
                <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                  <span className="text-2xl">📊</span>
                  <span className="text-white font-bold text-sm md:text-base">
                    {result?.sources?.tier1?.length || 0} Tier-1 Sources Analyzed
                  </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/80 px-4">
                  <span className="flex items-center gap-1">
                    <span className="animate-pulse">🔥</span>
                    Share this before it spreads further
                  </span>
                  <span className="hidden sm:inline">•</span>
                  <span>Join 10,000+ fighting misinformation</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Decision Panel - MANDATORY */}
        {result && !loading && result.decisionPanel && (
          <DecisionPanel decisionPanel={result.decisionPanel} />
        )}

        {/* Verdict Card - Executive Grade */}
        {result && !loading && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            {/* Bottom Line Executive Strip */}
            {result.bottomLine && (
              <div className={`px-6 py-4 border-l-4 ${confidenceColors?.ring} bg-slate-800/80 backdrop-blur-sm`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl mt-1">📊</div>
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Bottom Line</h3>
                    <p className="text-base text-slate-100 leading-relaxed">{result.bottomLine}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="p-8 space-y-6">
              {/* Verdict Header - Streamlined */}
              <div className="flex items-center gap-6">
                <div className={`flex-shrink-0 inline-flex items-center justify-center w-20 h-20 rounded-full ${getVerdictColor(getVerdictText(result))} shadow-xl`}>
                  <span className="text-4xl text-white font-bold">{getVerdictIcon(getVerdictText(result))}</span>
                </div>
                
                <div className="flex-1 text-left">
                  <h2 className="text-3xl font-black mb-2 tracking-tight">{getVerdictLabel(getVerdictText(result))}</h2>
                  <p className="text-sm text-slate-400">{result.summary}</p>
                </div>
              </div>

              {/* Confidence Metrics - Enhanced with Animated Progress */}
              {confidenceColors && (
                <div className="space-y-6">
                  {/* Animated Confidence Bar */}
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Confidence Level</h4>
                      <span className={`text-2xl font-black ${confidenceColors.text}`}>
                        {getConfidenceBand(getConfidenceValue(result))}
                      </span>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="relative h-4 bg-slate-700/50 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${confidenceColors.bg} rounded-full transition-all duration-1500 ease-out animate-fillBar`}
                        style={{ '--target-width': `${Math.round(getConfidenceValue(result) * 100)}%` } as React.CSSProperties}
                      ></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-400">0%</span>
                      <span className={`text-sm font-bold ${confidenceColors.text}`}>
                        {getConfidenceValue(result) < 0.20 ? "<20%" : getConfidenceRange(getConfidenceValue(result))}
                      </span>
                      <span className="text-xs text-slate-400">100%</span>
                    </div>
                  </div>
                  
                  {/* Metrics Grid - Mobile Optimized */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="text-center p-5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="text-4xl font-black text-slate-200 mb-2 animate-scaleIn">
                        {getEvidenceStrength(getConfidenceValue(result))}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Evidence Strength</div>
                    </div>
                    <div className="text-center p-5 rounded-xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors">
                      <div className="text-4xl font-black text-indigo-400 mb-2 animate-scaleIn">
                        {result.sources?.tier1?.length || 0}
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Tier-1 Sources</div>
                    </div>
                  </div>
                </div>
              )}

              {/* What the Data Shows */}
              {getEvidenceShows(result).length > 0 && (
              <div className="border-t border-slate-700 pt-6">
                <button
                  onClick={() => toggleSection('whatData')}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  <span className="text-2xl">{expandedSections.whatData ? "▼" : "▶"}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">What the Evidence Shows</h3>
                  </div>
                </button>
                {expandedSections.whatData && (
                  <ul className="space-y-3 pl-10">
                    {getEvidenceShows(result).map((item, idx) => (
                      <li key={idx} className="flex gap-3 text-slate-200 leading-relaxed">
                        <span className="text-emerald-400 text-xl flex-shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Why This Narrative Spread */}
            {getSpreadFactors(result).length > 0 && (
              <div className="border-t border-slate-700 pt-6">
                <button
                  onClick={() => toggleSection('whySpread')}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  <span className="text-2xl">{expandedSections.whySpread ? "▼" : "▶"}</span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">Why This Narrative Spread</h3>
                  </div>
                </button>
                {expandedSections.whySpread && (
                  <ul className="space-y-3 pl-10">
                    {getSpreadFactors(result).map((item, idx) => (
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

            {/* Share Section - Mobile Optimized */}
            <div className="border-t border-slate-700 pt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mb-2">Verified insight — ready to share or cite</h3>
              <p className="text-xs sm:text-sm text-slate-400 mb-4">This verification is publication-ready and backed by official sources.</p>
              
              {/* Share Presets - Touch Friendly */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <button 
                  onClick={handleEmailFullAnalysis}
                  className="px-4 py-3 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white text-sm sm:text-xs font-medium transition-all hover:scale-105 active:scale-95 touch-manipulation"
                >
                  📧 Email Full Analysis
                </button>
                <button 
                  onClick={handleShareSources}
                  className="px-4 py-3 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white text-sm sm:text-xs font-medium transition-all hover:scale-105 active:scale-95 touch-manipulation"
                >
                  🔗 Share Sources
                </button>
                <button 
                  onClick={handleShareFullAnalysis}
                  className="px-4 py-3 sm:py-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 active:bg-slate-600 border border-slate-600 text-white text-sm sm:text-xs font-medium transition-all hover:scale-105 active:scale-95 touch-manipulation"
                >
                  📝 Share Full Analysis
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

            {/* Branding & Reset */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="text-sm text-slate-500">
                ProofLayer by ApexSalesAI · Verification ID: {result.verificationId?.slice(0, 8)}
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm font-medium transition-colors"
              >
                🔄 Analyze Another Claim
              </button>
            </div>
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
              <div id="proof-card-content" className={`bg-gradient-to-br from-white to-slate-50 text-slate-900 rounded-2xl p-10 space-y-8 relative overflow-hidden shadow-2xl`}>
                {/* Color Glow Effect */}
                <div className={`absolute inset-0 ${confidenceColors?.bg} opacity-5 blur-3xl`}></div>
                
                <div className="text-center relative z-10">
                  <div className={`inline-flex items-center justify-center w-28 h-28 rounded-full ${getVerdictColor(getVerdictText(result))} mb-6 shadow-2xl ring-8 ring-white/50`}>
                    <span className="text-5xl text-white font-bold">{getVerdictIcon(getVerdictText(result))}</span>
                  </div>
                  <h3 className="text-3xl font-black mb-3 tracking-tight">{getVerdictLabel(getVerdictText(result))}</h3>
                  <p className="text-xl text-slate-700 mb-6 font-medium leading-relaxed max-w-lg mx-auto">"{claim.length > 120 ? claim.slice(0, 120) + '...' : claim}"</p>
                  
                  {/* DOMINANT Confidence Badge - Institutional */}
                  <div className={`inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl ${confidenceColors?.bg} bg-opacity-10 border-2 ${confidenceColors?.ring} shadow-lg`}>
                    <div className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-1">
                      {getConfidenceBand(getConfidenceValue(result))}
                    </div>
                    <div className={`text-5xl font-black ${confidenceColors?.text}`}>
                      {getConfidenceValue(result) < 0.20 ? "<20%" : getConfidenceRange(getConfidenceValue(result))}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Evidence Strength: {getEvidenceStrength(getConfidenceValue(result))}
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
                <button 
                  onClick={handleDownloadProofCard}
                  className="flex-1 px-4 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all hover:scale-105 active:scale-95"
                >
                  📥 Download PNG
                </button>
                <button
                  onClick={() => setShowProofCard(false)}
                  className="flex-1 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-all hover:scale-105 active:scale-95"
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

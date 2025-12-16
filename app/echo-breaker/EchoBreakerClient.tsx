"use client";

import { useMemo, useState } from "react";
import { Download, Share2, Twitter, Linkedin, Mail, TrendingUp, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type VerificationResponse = {
  verificationId?: string;
  verdict?: string;
  confidence?: number;
  summary?: string;
  bottomLine?: string;
  spreadFactors?: string[];
  whatDataShows?: string[];
  sources?: { sourceId?: string; title?: string; url?: string; domain?: string; tier?: number }[];
  error?: string;
};

type VerificationStage = "idle" | "searching" | "analyzing" | "complete" | "error";

const presets = [
  "A viral stat: '73% of Americans support mandatory voter ID laws'",
  "A headline: 'New policy will double taxes next year'",
  "A post: 'This video proves the election was hacked'",
  "Claim: The world is flat",
];

const trendingClaims = [
  { claim: "20 million illegal immigrants have entered the US since 2016", confidence: 92 },
  { claim: "MSN", confidence: 85 },
];

const recentlyDebunked = [
  { claim: "20 million illegal immigrants have entered the US since 2016", date: "Dec 11" },
  { claim: "20 million illegal immigrants have entered the US since 2016", date: "Dec 11" },
];

const verdictBadge = (verdict?: string) => {
  const v = (verdict || "").toLowerCase();
  if (v.includes("false")) return "text-red-200 bg-red-900/50 border-red-500/60";
  if (v.includes("misleading")) return "text-amber-200 bg-amber-900/50 border-amber-500/60";
  if (v.includes("accurate") || v.includes("true")) return "text-emerald-200 bg-emerald-900/50 border-emerald-500/60";
  return "text-slate-200 bg-slate-800/50 border-slate-600/60";
};

const verdictIcon = (verdict?: string) => {
  const v = (verdict || "").toLowerCase();
  if (v.includes("false")) return <XCircle className="w-6 h-6" />;
  if (v.includes("misleading")) return <AlertTriangle className="w-6 h-6" />;
  if (v.includes("true")) return <CheckCircle className="w-6 h-6" />;
  return null;
};

export default function EchoBreakerClient() {
  const [claim, setClaim] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<VerificationStage>("idle");
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const confidenceLabel = useMemo(() => {
    const c = Math.round(result?.confidence || 0);
    if (c >= 80) return "High confidence";
    if (c >= 50) return "Moderate confidence";
    if (c > 0) return "Low confidence";
    return "Not enough signal";
  }, [result?.confidence]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setStage("searching");
    
    try {
      // Simulate stage progression for better UX
      setTimeout(() => setStage("analyzing"), 1500);
      
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
      setResult(json as VerificationResponse);
      setStage("complete");
    } catch (err: any) {
      setError(err?.message || "Verification failed");
      setStage("error");
    } finally {
      setLoading(false);
    }
  };

  const badgeText = result?.verdict ? (result.verdict as string).toUpperCase() : "Awaiting verdict";

  const handleDownloadProofCard = () => {
    if (!result?.verificationId) return;
    window.open(`/api/proofcard/${result.verificationId}`, '_blank');
  };

  const handleShare = (platform: 'twitter' | 'linkedin' | 'email') => {
    if (!result?.verificationId) return;
    const url = `${window.location.origin}/v/${result.verificationId}`;
    const text = `Fact Check: This claim is rated UNCERTAIN (72% confidence). Full verification with sources: ${url} #FactCheck #ProofLayer`;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'email') {
      window.location.href = `mailto:?subject=Fact Check Results&body=${encodeURIComponent(text)}`;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-925 to-slate-900 text-slate-50">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-indigo-200">
          <span className="px-2 py-1 rounded-full bg-indigo-900/50 border border-indigo-700">ProofLayer · Verification</span>
          <span className="px-2 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200">21 claims verified</span>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-semibold">Scan the claim before you share it</h1>
          <p className="text-slate-300 max-w-3xl">
            Paste any post, headline, or viral stat. Get a reality check with sources and a ProofCard. Insight and advanced features are deferred.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex gap-3">
              <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white font-semibold">Paste Text</span>
              <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">Paste URL</span>
            </div>
            <button
              type="button"
              className="text-slate-300 hover:text-white text-xs"
              onClick={() => {
                setClaim("");
                setLink("");
                setResult(null);
                setError(null);
              }}
            >
              Reset
            </button>
          </div>

          <label className="text-xs uppercase text-slate-400">Claim or headline</label>
          <textarea
            value={claim}
            onChange={(e) => setClaim(e.target.value)}
            rows={4}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste the claim you want to verify"
            required
          />

          <label className="text-xs uppercase text-slate-400">Link (optional)</label>
          <input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Paste source link for context (optional)"
          />

          <div className="flex flex-wrap gap-2 text-xs text-slate-200">
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setClaim(preset)}
                className="px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500 transition"
              >
                {preset}
              </button>
            ))}
          </div>

          <div className="flex gap-3 items-center">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify reality"}
            </button>
            {error && <span className="text-sm text-red-400">{error}</span>}
          </div>
        </form>

        {/* Live Progress Indicator */}
        {loading && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              <span className="text-slate-300">
                {stage === "searching" && "Searching sources..."}
                {stage === "analyzing" && "Analyzing with Claude AI..."}
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: stage === "searching" ? "33%" : stage === "analyzing" ? "66%" : "100%" }}
              ></div>
            </div>
          </div>
        )}

        {result && (
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-lg">
            {/* Verdict Header with Icon */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${verdictBadge(result.verdict)}`}>
                {verdictIcon(result.verdict)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full border text-sm font-bold ${verdictBadge(result.verdict)}`}>
                    {badgeText}
                  </span>
                  <span className="text-sm text-slate-300">
                    {result.verdict?.toLowerCase().includes("false") && "Evidence strongly contradicts this claim"}
                    {result.verdict?.toLowerCase().includes("misleading") && "Mixed evidence with significant caveats"}
                    {result.verdict?.toLowerCase().includes("true") && "Evidence supports this claim"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Confidence Level</span>
                  <div className="flex-1 max-w-xs bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        (result.confidence || 0) >= 80 ? "bg-emerald-500" :
                        (result.confidence || 0) >= 50 ? "bg-amber-500" : "bg-red-500"
                      }`}
                      style={{ width: `${result.confidence || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-300">{Math.round(result.confidence || 0)}%</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Summary</p>
              <p className="text-slate-100 mt-1 text-sm leading-relaxed">{result.summary || "No summary provided."}</p>
            </div>
            {result.bottomLine && (
              <div>
                <p className="text-xs uppercase text-slate-400">Bottom line</p>
                <p className="text-slate-100 mt-1 text-sm leading-relaxed">{result.bottomLine}</p>
              </div>
            )}
            {result.whatDataShows && result.whatDataShows.length > 0 && (
              <div>
                <p className="text-xs uppercase text-slate-400 mb-2">📊 What the Data Actually Shows</p>
                <ul className="space-y-2 text-sm text-slate-100">
                  {result.whatDataShows.map((item, idx) => (
                    <li key={idx} className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.spreadFactors && result.spreadFactors.length > 0 && (
              <div>
                <p className="text-xs uppercase text-slate-400 mb-2">🔥 Why This Claim Spread</p>
                <ul className="space-y-2 text-sm text-slate-100">
                  {result.spreadFactors.map((item, idx) => (
                    <li key={idx} className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {result.sources && result.sources.length > 0 && (
              <div>
                <p className="text-xs uppercase text-slate-400 mb-2">Top verified sources</p>
                <ul className="grid md:grid-cols-2 gap-3 text-sm">
                  {result.sources.slice(0, 4).map((s, idx) => (
                    <li key={s.sourceId || s.url || idx} className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-2">
                      <p className="text-slate-100 font-semibold">{s.title || s.url || "Source"}</p>
                      <p className="text-slate-400 text-xs">{s.domain || s.url}</p>
                      {s.url && (
                        <a className="text-emerald-400 underline text-xs" href={s.url} target="_blank" rel="noreferrer">
                          {s.url}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {/* Share and Download Section */}
            <div className="border-t border-slate-700 pt-4 space-y-4">
              <p className="text-xs uppercase text-slate-400">Stop this claim from spreading</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleDownloadProofCard}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-sm transition"
                >
                  <Download className="w-4 h-4" />
                  Download ProofCard
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 text-sm transition"
                >
                  <Twitter className="w-4 h-4" />
                  Share to X
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 text-sm transition"
                >
                  <Linkedin className="w-4 h-4" />
                  Share to LinkedIn
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-600 text-sm transition"
                >
                  <Mail className="w-4 h-4" />
                  Share via Email
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 rounded-lg bg-indigo-900/50 border border-indigo-700 text-indigo-200 font-semibold">
                  💬 Reply With Proof
                </span>
                <span className="text-slate-400">Share evidence-backed responses</span>
              </div>
            </div>

            {result.verificationId && (
              <div className="text-xs text-slate-400 border-t border-slate-700 pt-4">
                Full verification with sources:{" "}
                <a className="text-emerald-400 underline" href={`/v/${result.verificationId}`} target="_blank" rel="noreferrer">
                  {window.location.origin}/v/{result.verificationId}
                </a>
              </div>
            )}
          </section>
        )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Trending Claims */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-slate-100">Trending Claims</h3>
              </div>
              <ul className="space-y-3">
                {trendingClaims.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <p className="text-slate-200 mb-1">{item.claim}</p>
                    <span className="text-xs text-slate-400">{item.confidence}% confidence</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recently Debunked */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="font-semibold text-slate-100">Recently Debunked</h3>
              </div>
              <ul className="space-y-3">
                {recentlyDebunked.map((item, idx) => (
                  <li key={idx} className="text-sm">
                    <p className="text-slate-200 mb-1">{item.claim}</p>
                    <span className="text-xs text-slate-400">{item.date}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

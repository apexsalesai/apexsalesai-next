"use client";

import { useState } from "react";

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

export default function EchoBreakerClient() {
  const [claim, setClaim] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    whatData: true,
    whySpread: true,
    sources: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
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
      setResult(json as VerificationResponse);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center gap-2 text-sm">
          <span className="px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-700 text-indigo-200">
            ProofLayer · Verification
          </span>
          <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            21 claims verified
          </span>
        </div>

        <header>
          <h1 className="text-3xl font-bold mb-2">Scan the claim before you share it</h1>
          <p className="text-slate-400">
            Paste any post, headline, or viral stat. Get a reality check with sources and a ProofCard. Insight and advanced features are deferred.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex gap-3 text-sm">
            <button type="button" className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold">
              Paste Text
            </button>
            <button type="button" className="px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
              Paste URL
            </button>
            <button
              type="button"
              onClick={() => { setClaim(""); setLink(""); setResult(null); setError(null); }}
              className="ml-auto text-slate-400 hover:text-white text-sm"
            >
              Reset
            </button>
          </div>

          <div>
            <label className="text-xs uppercase text-slate-500 mb-2 block">Claim or headline</label>
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              rows={3}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="20 million illegal immigrants have entered the US since 2016"
              required
            />
          </div>

          <div>
            <label className="text-xs uppercase text-slate-500 mb-2 block">Link (optional)</label>
            <input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full rounded-lg bg-slate-800 border border-slate-700 px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste source link for context (optional)"
            />
          </div>

          <div className="flex gap-3 text-sm flex-wrap">
            <span className="text-slate-500">Quick presets:</span>
            <button type="button" className="text-indigo-400 hover:text-indigo-300">
              A viral stat: "73% of Americans support mandatory voter ID laws"
            </button>
            <button type="button" className="text-indigo-400 hover:text-indigo-300">
              A headline: "New policy will double taxes next year"
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold disabled:opacity-60"
          >
            {loading ? "Verifying..." : "✓ Verify reality"}
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </form>

        {loading && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-500"></div>
              <span className="text-slate-300">Analyzing claim...</span>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 space-y-6">
            {/* Verdict Header */}
            <div className="flex items-start gap-4">
              <div className={`${getVerdictColor(result.verdict)} p-6 rounded-2xl text-white text-5xl font-bold flex items-center justify-center w-24 h-24 shadow-lg`}>
                {getVerdictIcon(result.verdict)}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {result.verdict?.charAt(0).toUpperCase() + (result.verdict?.slice(1) || "")} Claim
                </h2>
                <p className="text-slate-400 mb-3">{result.summary}</p>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">Confidence Level</span>
                  <div className="flex-1 max-w-xs bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getVerdictColor(result.verdict)}`}
                      style={{ width: `${result.confidence || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold">{Math.round(result.confidence || 0)}%</span>
                </div>
              </div>
            </div>

            {/* Bottom Line */}
            {result.bottomLine && (
              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-xs uppercase text-slate-500 mb-2">Bottom Line</h3>
                <p className="text-slate-200">{result.bottomLine}</p>
              </div>
            )}

            {/* What the Data Actually Shows */}
            {result.whatDataShows && result.whatDataShows.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection('whatData')}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="text-sm font-semibold text-slate-200">📊 What the Data Actually Shows</h3>
                  <span className="text-slate-500">{expandedSections.whatData ? '▼' : '▶'}</span>
                </button>
                {expandedSections.whatData && (
                  <ul className="space-y-2">
                    {result.whatDataShows.map((item, idx) => (
                      <li key={idx} className="flex gap-2 text-sm text-slate-300">
                        <span className="text-emerald-400">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Why This Claim Spread */}
            {result.spreadFactors && result.spreadFactors.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection('whySpread')}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="text-sm font-semibold text-slate-200">🔥 Why This Claim Spread</h3>
                  <span className="text-slate-500">{expandedSections.whySpread ? '▼' : '▶'}</span>
                </button>
                {expandedSections.whySpread && (
                  <ul className="space-y-2">
                    {result.spreadFactors.map((item, idx) => (
                      <li key={idx} className="text-sm text-slate-300">• {item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Top Verified Sources */}
            {result.sources && result.sources.length > 0 && (
              <div className="border-t border-slate-700 pt-4">
                <button
                  onClick={() => toggleSection('sources')}
                  className="flex items-center justify-between w-full text-left mb-3"
                >
                  <h3 className="text-sm font-semibold text-slate-200">🔗 Top Verified Sources</h3>
                  <span className="text-slate-500">{expandedSections.sources ? '▼' : '▶'}</span>
                </button>
                {expandedSections.sources && (
                  <div className="space-y-2">
                    {result.sources.slice(0, 8).map((s, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-3 flex items-start gap-3">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          s.tier === 1 ? 'bg-emerald-600 text-white' :
                          s.tier === 2 ? 'bg-blue-600 text-white' :
                          'bg-slate-600 text-slate-300'
                        }`}>
                          Tier {s.tier || 3}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-200">{s.title}</p>
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-xs text-emerald-400 hover:underline">
                            {s.domain}
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Share Section */}
            <div className="border-t border-slate-700 pt-4">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">Stop this claim from spreading</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm">
                  📥 Generate ProofCard
                </button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm">
                  🔗 Share to X
                </button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm">
                  💼 Share to LinkedIn
                </button>
                <button className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-sm">
                  📋 Copy public link
                </button>
              </div>
            </div>

            {result.verificationId && (
              <div className="text-xs text-slate-500">
                ProofLayer by ApexSalesAI
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useMemo, useState } from "react";

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

const presets = [
  "A viral stat: '73% of Americans support mandatory voter ID laws'",
  "A headline: 'New policy will double taxes next year'",
  "A post: 'This video proves the election was hacked'",
  "Claim: The world is flat",
];

const verdictBadge = (verdict?: string) => {
  const v = (verdict || "").toLowerCase();
  if (v.includes("false") || v.includes("misleading")) return "text-red-200 bg-red-900/50 border-red-500/60";
  if (v.includes("accurate") || v.includes("true")) return "text-emerald-200 bg-emerald-900/50 border-emerald-500/60";
  return "text-amber-200 bg-amber-900/50 border-amber-500/60";
};

export default function EchoBreakerClient() {
  const [claim, setClaim] = useState("");
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
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
    try {
      const res = await fetch("/api/reality-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim, link }),
      });
      const text = await res.text();
      if (!text) {
        throw new Error(res.ok ? "Empty response from verifier" : `Verifier error (${res.status})`);
      }
      let json: any = null;
      try {
        json = JSON.parse(text);
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

  const badgeText = result?.verdict ? (result.verdict as string).toUpperCase() : "Awaiting verdict";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-925 to-slate-900 text-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
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

        {result && (
          <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-3 py-1 rounded-full border text-xs font-semibold ${verdictBadge(result.verdict)}`}>
                {badgeText}
              </span>
              <span className="text-sm text-slate-300">Confidence: {Math.round(result.confidence || 0)}% · {confidenceLabel}</span>
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
                <p className="text-xs uppercase text-slate-400 mb-2">What data shows</p>
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
                <p className="text-xs uppercase text-slate-400 mb-2">Why this spreads</p>
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
            {result.verificationId && (
              <div className="text-sm text-slate-300">
                View record:{" "}
                <a className="text-emerald-400 underline" href={`/v/${result.verificationId}`}>
                  /v/{result.verificationId}
                </a>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}

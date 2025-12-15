"use client";

import { useState } from "react";

type VerificationResponse = {
  verificationId?: string;
  verdict?: string;
  confidence?: number;
  summary?: string;
  sources?: { sourceId?: string; title?: string; url?: string }[];
  error?: string;
};

export default function ReplyWithProof() {
  const [claim, setClaim] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/reality-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claim }),
      });
      const json = (await res.json()) as VerificationResponse;
      if (!res.ok || json.error) {
        throw new Error(json.error || "Verification failed");
      }
      setResult(json);
    } catch (err: any) {
      setError(err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
      <header className="space-y-2">
        <p className="text-sm text-slate-300 uppercase tracking-wide">ProofLayer</p>
        <h1 className="text-3xl font-semibold">Echo Breaker</h1>
        <p className="text-slate-300">
          Verify claims, break misinformation loops, and generate shareable ProofCards with sources and confidence.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
        <label className="block text-sm text-slate-300 mb-1">Claim</label>
        <textarea
          value={claim}
          onChange={(e) => setClaim(e.target.value)}
          rows={4}
          className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring focus:ring-emerald-500/60"
          placeholder="Paste the claim you want to verify"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 transition"
        >
          {loading ? "Verifying..." : "Verify claim"}
        </button>
      </form>

      {error && <div className="text-sm text-red-400">{error}</div>}

      {result && (
        <div className="space-y-4 bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase text-slate-400">Verdict</p>
              <p className="text-xl font-semibold">{result.verdict || "Unknown"}</p>
            </div>
            <div className="text-sm text-slate-300">Confidence: {Math.round(result.confidence || 0)}%</div>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Summary</p>
            <p className="text-slate-200 text-sm mt-1">{result.summary || "No summary provided."}</p>
          </div>
          {result.sources && result.sources.length > 0 && (
            <div>
              <p className="text-xs uppercase text-slate-400 mb-2">Sources</p>
              <ul className="space-y-2 text-sm">
                {result.sources.map((s, idx) => (
                  <li key={s.sourceId || s.url || idx} className="bg-slate-800/60 rounded-lg px-3 py-2 border border-slate-700">
                    <p className="font-medium text-slate-100">{s.title || s.url || "Source"}</p>
                    {s.url && (
                      <a className="text-emerald-400 underline" href={s.url} target="_blank" rel="noreferrer">
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
              View record: <a className="text-emerald-400 underline" href={`/v/${result.verificationId}`}>/v/{result.verificationId}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function GenerateContentPage() {
  const [formData, setFormData] = useState({
    contentType: 'blog',
    topic: '',
    targetAudience: '',
    tone: 'professional',
    length: 'medium',
    platform: 'LinkedIn',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!result) return;

    setLoading(true);
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          content: result.content,
          excerpt: result.excerpt,
          type: formData.contentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Publishing failed');
      }

      alert('Content published successfully!');
      setResult(null);
      setFormData({ ...formData, topic: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🤖 AI Content Generator
          </h1>
          <p className="text-slate-400">
            Generate high-quality content with ApexSalesAI's content agents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generation Form */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Generate Content</h2>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Content Type
                </label>
                <select
                  value={formData.contentType}
                  onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="blog">Blog Post</option>
                  <option value="email">Email</option>
                  <option value="social">Social Media</option>
                  <option value="video">Video Script</option>
                  <option value="jobboard">Job Posting</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Topic / Subject
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="e.g., How AI is transforming sales"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Target Audience
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., B2B sales leaders"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tone
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="technical">Technical</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Length
                </label>
                <select
                  value={formData.length}
                  onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="short">Short (300-500 words)</option>
                  <option value="medium">Medium (800-1200 words)</option>
                  <option value="long">Long (1500-2500 words)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Generating...' : '✨ Generate Content'}
              </button>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Result Preview */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Preview</h2>

            {!result && (
              <div className="flex items-center justify-center h-64 text-slate-500">
                <div className="text-center">
                  <div className="text-6xl mb-4">📝</div>
                  <p>Generated content will appear here</p>
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{result.title}</h3>
                  {result.excerpt && (
                    <p className="text-slate-400 text-sm italic mb-4">{result.excerpt}</p>
                  )}
                </div>

                <div className="max-h-96 overflow-y-auto bg-slate-900/50 p-4 rounded-lg">
                  <div className="text-slate-300 whitespace-pre-wrap text-sm">
                    {result.content}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                  >
                    ✅ Publish
                  </button>
                  <button
                    onClick={() => setResult(null)}
                    className="flex-1 py-3 px-6 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
                  >
                    🔄 Generate New
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
            <div className="text-cyan-400 text-sm font-medium">Total Generated</div>
            <div className="text-white text-2xl font-bold mt-1">127</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-green-400 text-sm font-medium">Published</div>
            <div className="text-white text-2xl font-bold mt-1">89</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
            <div className="text-purple-400 text-sm font-medium">Avg. Quality Score</div>
            <div className="text-white text-2xl font-bold mt-1">8.7/10</div>
          </div>
        </div>
      </div>
    </div>
  );
}

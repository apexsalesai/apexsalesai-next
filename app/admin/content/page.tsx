'use client';

import { useState } from 'react';

export default function ContentAdminPage() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Failed to generate');
      }
      
      setResult(json.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!result) return;
    
    setPublishing(true);
    setError(null);
    
    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: result.title,
          excerpt: result.excerpt,
          content: result.content,
          tags: result.tags || [],
          slug: result.slug,
        }),
      });
      
      const json = await res.json();
      
      if (!res.ok) {
        throw new Error(json.error || 'Publish failed');
      }
      
      alert(`✅ Published successfully!\n\nFile: ${json.published.filename}\nBranch: ${json.published.branch}\n\nVercel will rebuild the site automatically.`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setPublishing(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-900">Max Content Agent</h1>
        <p className="text-gray-600 mt-2">Generate AI-powered blog posts for ApexSalesAI</p>
      </div>

      <form onSubmit={handleGenerate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Blog Post Topic
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 'How AI Agents Transform Revenue Operations'"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !topic.trim()}
          className="px-6 py-3 rounded-lg bg-black text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {loading ? 'Generating...' : 'Generate Blog Post'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-medium disabled:opacity-50 hover:bg-emerald-700 transition-colors"
            >
              {publishing ? 'Publishing...' : '📝 Save to Blog'}
            </button>
          </div>

          <div className="border rounded-lg p-6 bg-white shadow-sm space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{result.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Slug: {result.slug}</p>
            </div>

            {result.excerpt && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                <p className="text-sm font-medium text-blue-900">Excerpt</p>
                <p className="text-blue-800 mt-1">{result.excerpt}</p>
              </div>
            )}

            {result.tags && result.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.tags.map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <hr className="my-4" />

            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: result.content || '' }} />
            </div>

            {result.seoMetadata && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-gray-900 mb-3">SEO Metadata</h4>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-medium text-gray-700">Meta Title:</dt>
                    <dd className="text-gray-600">{result.seoMetadata.metaTitle}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Meta Description:</dt>
                    <dd className="text-gray-600">{result.seoMetadata.metaDescription}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-gray-700">Keywords:</dt>
                    <dd className="text-gray-600">{result.seoMetadata.keywords?.join(', ')}</dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';

interface ContentRequest {
  topic: string;
  prompt?: string;
  tone?: string;
  length?: string;
  keywords?: string[];
  targetAudience?: string;
  vertical?: string;
  contentType?: string;
}

export default function ContentAdminPage() {
  const [formData, setFormData] = useState<ContentRequest>({
    topic: '',
    prompt: '',
    tone: 'professional',
    length: 'medium',
    keywords: [],
    targetAudience: 'Revenue leaders and sales professionals',
    vertical: 'general',
    contentType: 'blog',
  });
  const [keywordInput, setKeywordInput] = useState('');
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
        body: JSON.stringify(formData),
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

  function addKeyword() {
    if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...(formData.keywords || []), keywordInput.trim()],
      });
      setKeywordInput('');
    }
  }

  function removeKeyword(keyword: string) {
    setFormData({
      ...formData,
      keywords: formData.keywords?.filter(k => k !== keyword),
    });
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

      <form onSubmit={handleGenerate} className="space-y-6">
        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Blog Post Topic *
          </label>
          <input
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 'How AI Agents Transform Revenue Operations'"
            value={formData.topic}
            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
            disabled={loading}
            required
          />
        </div>

        {/* Custom Prompt */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Additional Context (Optional)
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Provide specific details, angles, or key points you want covered..."
            rows={4}
            value={formData.prompt}
            onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: "Focus on ROI metrics, include case studies, target CFOs and revenue leaders"
          </p>
        </div>

        {/* Two-column layout for controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Tone & Voice
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.tone}
              onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
              disabled={loading}
            >
              <option value="professional">Professional</option>
              <option value="authoritative">Authoritative (Thought Leader)</option>
              <option value="conversational">Conversational</option>
              <option value="technical">Technical (Deep Dive)</option>
              <option value="executive">Executive Summary</option>
            </select>
          </div>

          {/* Length */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Content Length
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.length}
              onChange={(e) => setFormData({ ...formData, length: e.target.value })}
              disabled={loading}
            >
              <option value="short">Short (800-1000 words)</option>
              <option value="medium">Medium (1500-2000 words)</option>
              <option value="long">Long (2500-3500 words)</option>
            </select>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Target Audience
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.targetAudience}
              onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
              disabled={loading}
            >
              <option value="Revenue leaders and sales professionals">Revenue Leaders & Sales Professionals</option>
              <option value="C-level executives and decision makers">C-Level Executives</option>
              <option value="Sales operations managers">Sales Operations Managers</option>
              <option value="Revenue operations teams">RevOps Teams</option>
              <option value="Sales development representatives">SDRs & BDRs</option>
              <option value="Marketing and demand generation">Marketing & Demand Gen</option>
            </select>
          </div>

          {/* Industry Vertical */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Industry Focus
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.vertical}
              onChange={(e) => setFormData({ ...formData, vertical: e.target.value })}
              disabled={loading}
            >
              <option value="general">General / Cross-Industry</option>
              <option value="saas">SaaS & Technology</option>
              <option value="enterprise">Enterprise B2B</option>
              <option value="financial">Financial Services</option>
              <option value="healthcare">Healthcare</option>
              <option value="manufacturing">Manufacturing</option>
              <option value="retail">Retail & E-commerce</option>
            </select>
          </div>
        </div>

        {/* Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            SEO Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add keyword (e.g., 'AI sales automation')"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              disabled={loading}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Add
            </button>
          </div>
          {formData.keywords && formData.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeKeyword(keyword)}
                    className="hover:text-blue-900"
                    disabled={loading}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading || !formData.topic.trim()}
          className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Generating Premium Content...
            </span>
          ) : (
            '🚀 Generate Blog Post'
          )}
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

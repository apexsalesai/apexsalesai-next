'use client';

import { useState } from 'react';
import Link from 'next/link';

type MarketMode = 'B2B' | 'B2C';
type ContentChannel = string;

export default function CreateContentPage() {
  const [mode, setMode] = useState<MarketMode>('B2B');
  const [channel, setChannel] = useState<ContentChannel>('linkedin-post');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [targetAudience, setTargetAudience] = useState('');
  const [keywords, setKeywords] = useState('');
  
  // B2C specific
  const [jobTitle, setJobTitle] = useState('');
  const [industry, setIndustry] = useState('');
  const [experience, setExperience] = useState('');
  
  // B2B specific
  const [companyName, setCompanyName] = useState('');
  const [productName, setProductName] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const b2bChannels = [
    { value: 'email-campaign', label: '📧 Email Campaign', desc: 'High-converting B2B emails' },
    { value: 'linkedin-post', label: '💼 LinkedIn Post', desc: 'Thought leadership content' },
    { value: 'blog-article', label: '📝 Blog Article', desc: 'SEO-optimized articles' },
    { value: 'case-study', label: '📊 Case Study', desc: 'ROI-focused success stories' },
    { value: 'whitepaper', label: '📄 Whitepaper', desc: 'In-depth industry insights' },
    { value: 'sales-deck', label: '📊 Sales Deck', desc: 'Persuasive presentations' },
  ];

  const b2cChannels = [
    { value: 'resume', label: '📋 Resume', desc: 'ATS-optimized resumes' },
    { value: 'cover-letter', label: '✉️ Cover Letter', desc: 'Compelling applications' },
    { value: 'linkedin-profile', label: '👤 LinkedIn Profile', desc: 'Professional optimization' },
    { value: 'personal-brand-post', label: '✨ Personal Brand Post', desc: 'Authentic storytelling' },
    { value: 'job-application', label: '🎯 Job Application', desc: 'Tailored applications' },
    { value: 'portfolio-description', label: '🎨 Portfolio Description', desc: 'Showcase your work' },
  ];

  const universalChannels = [
    { value: 'twitter-thread', label: '🐦 Twitter Thread', desc: 'Engaging threads' },
    { value: 'video-script', label: '🎬 Video Script', desc: 'Professional scripts' },
    { value: 'instagram-caption', label: '📸 Instagram Caption', desc: 'Visual storytelling' },
    { value: 'tiktok-script', label: '🎵 TikTok Script', desc: 'Short-form video' },
  ];

  const channels = mode === 'B2B' ? b2bChannels : b2cChannels;

  async function handleGenerate() {
    if (!goal.trim()) {
      setError('Please enter a goal');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/studio/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel,
          goal,
          tone,
          length,
          targetAudience: targetAudience || undefined,
          keywords: keywords ? keywords.split(',').map(k => k.trim()) : undefined,
          mode,
          // B2C
          jobTitle: jobTitle || undefined,
          industry: industry || undefined,
          experience: experience || undefined,
          // B2B
          companyName: companyName || undefined,
          productName: productName || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error?.includes('OpenAI API key')) {
          throw new Error('⚠️ OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.');
        }
        throw new Error(data.error || 'Generation failed');
      }

      const content = data.content || data.output || '';
      setResult(content);
      
      // Calculate stats
      const words = content.trim().split(/\s+/).length;
      const chars = content.length;
      setWordCount(words);
      setCharCount(chars);
    } catch (err: any) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate content. Check console for details.');
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (result) {
      navigator.clipboard.writeText(result);
      alert('Copied to clipboard!');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/studio" className="text-cyan-400 hover:text-cyan-300 mb-2 inline-block">
              ← Back to Studio
            </Link>
            <h1 className="text-4xl font-bold mb-2">✨ AI Content Generator</h1>
            <p className="text-slate-400 text-lg">Create professional content in seconds</p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="mb-8 flex gap-4">
          <button
            onClick={() => {
              setMode('B2B');
              setChannel('linkedin-post');
            }}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              mode === 'B2B'
                ? 'border-cyan-500 bg-cyan-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">🏢</div>
            <h3 className="text-xl font-bold mb-1">B2B Enterprise</h3>
            <p className="text-sm text-slate-400">Marketing, sales, thought leadership</p>
          </button>

          <button
            onClick={() => {
              setMode('B2C');
              setChannel('resume');
            }}
            className={`flex-1 p-6 rounded-xl border-2 transition-all ${
              mode === 'B2C'
                ? 'border-purple-500 bg-purple-500/10'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
            }`}
          >
            <div className="text-3xl mb-2">👤</div>
            <h3 className="text-xl font-bold mb-1">B2C Personal</h3>
            <p className="text-sm text-slate-400">Career, branding, job hunting</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">Content Settings</h2>

            {/* Channel Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Content Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {channels.map((ch) => (
                  <button
                    key={ch.value}
                    onClick={() => setChannel(ch.value)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      channel === ch.value
                        ? mode === 'B2B'
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold">{ch.label}</div>
                    <div className="text-xs text-slate-400">{ch.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Goal / Topic *
              </label>
              <textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder={
                  mode === 'B2B'
                    ? 'e.g., Announce our new AI sales platform launch'
                    : 'e.g., Apply for Senior Product Manager at tech startup'
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                rows={3}
              />
            </div>

            {/* Target Audience */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder={
                  mode === 'B2B'
                    ? 'e.g., VP Sales at mid-market B2B SaaS companies'
                    : 'e.g., Hiring managers in tech industry'
                }
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* Tone */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
                <option value="authoritative">Authoritative</option>
                <option value="friendly">Friendly</option>
                <option value="persuasive">Persuasive</option>
              </select>
            </div>

            {/* Length */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="short">Short (200-400 words)</option>
                <option value="medium">Medium (500-800 words)</option>
                <option value="long">Long (1000-1500 words)</option>
              </select>
            </div>

            {/* Keywords */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g., AI, sales automation, ROI"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            {/* B2C Specific Fields */}
            {mode === 'B2C' && (
              <div className="space-y-4 mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h3 className="font-semibold text-purple-300">Career Details</h3>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="Job Title (e.g., Senior Product Manager)"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="Industry (e.g., SaaS, Healthcare)"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Experience (e.g., 5+ years)"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>
            )}

            {/* B2B Specific Fields */}
            {mode === 'B2B' && (
              <div className="space-y-4 mb-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <h3 className="font-semibold text-cyan-300">Business Details</h3>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company Name"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Product/Service Name"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !goal.trim()}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                loading || !goal.trim()
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : mode === 'B2B'
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              }`}
            >
              {loading ? '⏳ Generating...' : '✨ Generate Content'}
            </button>
          </div>

          {/* Output */}
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Generated Content</h2>
                {result && (
                  <div className="flex gap-4 mt-2 text-sm text-slate-400">
                    <span>📝 {wordCount} words</span>
                    <span>🔤 {charCount} characters</span>
                    {channel.includes('video') && (
                      <span>🎬 ~{Math.ceil(wordCount / 150)} min video</span>
                    )}
                  </div>
                )}
              </div>
              {result && (
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-semibold"
                >
                  📋 Copy
                </button>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 mb-4">
                {error}
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-slate-400">AI is crafting your content...</p>
              </div>
            )}

            {!loading && !result && !error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✨</div>
                <p className="text-slate-400">Your generated content will appear here</p>
              </div>
            )}

            {result && (
              <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                <pre className="whitespace-pre-wrap text-slate-200 font-sans leading-relaxed">
                  {result}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

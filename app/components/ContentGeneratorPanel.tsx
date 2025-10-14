'use client';

import React, { useState } from 'react';

interface ContentGeneratorPanelProps {
  onContentGenerated?: (content: any) => void;
}

export function ContentGeneratorPanel({ onContentGenerated }: ContentGeneratorPanelProps) {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<'blog' | 'social' | 'email'>('blog');
  const [tone, setTone] = useState<'professional' | 'casual' | 'technical' | 'executive'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [keywords, setKeywords] = useState('');
  const [vertical, setVertical] = useState('');
  const [autoPublish, setAutoPublish] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/agent/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topic.trim(),
          contentType,
          tone,
          length,
          keywords: keywords.split(',').map(k => k.trim()).filter(Boolean),
          vertical: vertical.trim() || undefined,
          autoPublish,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setResult(data);
      if (onContentGenerated) {
        onContentGenerated(data);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const suggestedTopics = [
    'How AI Agents Transform Revenue Operations',
    'The ROI of Autonomous Sales Execution',
    'Predictive Analytics for Sales Leaders',
    'Enterprise AI: Security and Compliance',
    'Multi-Agent Orchestration in Sales',
    'The Future of Revenue Intelligence'
  ];

  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px', color: '#1a202c' }}>
          🤖 AI Content Generator
        </h2>
        <p style={{ fontSize: '14px', color: '#718096' }}>
          Generate high-quality marketing content using ApexSalesAI's autonomous agents
        </p>
      </div>

      {/* Topic Input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
          Topic *
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., How AI Agents Transform Revenue Operations"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#4299e1'}
          onBlur={(e) => e.target.style.borderColor = '#cbd5e0'}
        />
        
        {/* Suggested Topics */}
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {suggestedTopics.slice(0, 3).map((suggested, idx) => (
            <button
              key={idx}
              onClick={() => setTopic(suggested)}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: '#edf2f7',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#4a5568'
              }}
            >
              {suggested}
            </button>
          ))}
        </div>
      </div>

      {/* Content Type */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
          Content Type
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['blog', 'social', 'email'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              style={{
                flex: 1,
                padding: '8px 16px',
                fontSize: '14px',
                backgroundColor: contentType === type ? '#4299e1' : '#f7fafc',
                color: contentType === type ? '#ffffff' : '#4a5568',
                border: `1px solid ${contentType === type ? '#4299e1' : '#e2e8f0'}`,
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: contentType === type ? 600 : 400
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tone & Length (for blog posts) */}
      {contentType === 'blog' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="technical">Technical</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
              Length
            </label>
            <select
              value={length}
              onChange={(e) => setLength(e.target.value as any)}
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #cbd5e0',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="short">Short (800-1000 words)</option>
              <option value="medium">Medium (1500-2000 words)</option>
              <option value="long">Long (2500-3000 words)</option>
            </select>
          </div>
        </div>
      )}

      {/* Keywords */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
          Keywords (comma-separated)
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="AI, revenue operations, automation"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Vertical */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '8px', color: '#2d3748' }}>
          Industry Vertical (optional)
        </label>
        <input
          type="text"
          value={vertical}
          onChange={(e) => setVertical(e.target.value)}
          placeholder="e.g., SaaS, Healthcare, Financial Services"
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Auto-publish checkbox */}
      {contentType === 'blog' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoPublish}
              onChange={(e) => setAutoPublish(e.target.checked)}
              style={{ marginRight: '8px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px', color: '#4a5568' }}>
              Auto-publish to blog
            </span>
          </label>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !topic.trim()}
        style={{
          width: '100%',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: 600,
          backgroundColor: loading || !topic.trim() ? '#cbd5e0' : '#4299e1',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => {
          if (!loading && topic.trim()) {
            e.currentTarget.style.backgroundColor = '#3182ce';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && topic.trim()) {
            e.currentTarget.style.backgroundColor = '#4299e1';
          }
        }}
      >
        {loading ? '🤖 Generating...' : '✨ Generate Content'}
      </button>

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#fed7d7',
          border: '1px solid #fc8181',
          borderRadius: '6px',
          color: '#c53030',
          fontSize: '14px'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Success Display */}
      {result && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#c6f6d5',
          border: '1px solid #68d391',
          borderRadius: '6px'
        }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#22543d', marginBottom: '8px' }}>
            ✅ {result.message}
          </div>
          
          {result.contentType === 'blog' && result.data && (
            <div style={{ fontSize: '13px', color: '#2f855a' }}>
              <div><strong>Title:</strong> {result.data.title}</div>
              <div><strong>Slug:</strong> {result.data.slug}</div>
              {result.published && (
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={`/blog/${result.data.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#2b6cb0', textDecoration: 'underline' }}
                  >
                    View Published Post →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

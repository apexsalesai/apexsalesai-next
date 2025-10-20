'use client';

import React, { useState } from 'react';
import { X, Loader2, Copy, Check } from 'lucide-react';

interface SocialPostGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SocialPostGenerator({ isOpen, onClose }: SocialPostGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [platforms, setPlatforms] = useState<string[]>(['LinkedIn', 'Twitter']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPosts, setGeneratedPosts] = useState<any>(null);
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    setGeneratedPosts(null);

    try {
      const response = await fetch('/api/agent/generate-social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platforms }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedPosts(data.posts);
      } else {
        alert('Failed to generate posts: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate social posts');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (platform: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedPlatform(platform);
    setTimeout(() => setCopiedPlatform(null), 2000);
  };

  const togglePlatform = (platform: string) => {
    setPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a202c] rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">📱 Social Media Generator</h2>
            <p className="text-sm text-gray-400 mt-1">Create engaging posts for multiple platforms</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!generatedPosts ? (
            <div className="space-y-6">
              {/* Topic Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What's your topic?
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., How AI Agents Transform Sales Operations"
                  className="w-full px-4 py-3 bg-[#0d1321] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2cb] transition-colors"
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Platforms
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((platform) => (
                    <button
                      key={platform}
                      onClick={() => togglePlatform(platform)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        platforms.includes(platform)
                          ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]'
                          : 'border-gray-700 bg-[#0d1321] text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <div className="font-semibold">{platform}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !topic.trim() || platforms.length === 0}
                className="w-full py-4 bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Posts...
                  </>
                ) : (
                  <>
                    ✨ Generate Social Posts
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <p className="text-green-400 font-semibold">✅ Posts generated successfully!</p>
                <p className="text-sm text-gray-400 mt-1">Copy and paste to your platforms</p>
              </div>

              {/* Generated Posts */}
              {Object.entries(generatedPosts).map(([platform, data]: [string, any]) => (
                <div key={platform} className="bg-[#0d1321] border border-gray-700 rounded-lg p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#00c2cb]">{platform}</h3>
                      <span className="text-xs text-gray-400">
                        {data.characterCount} characters
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(platform, data.content)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-300"
                    >
                      {copiedPlatform === platform ? (
                        <>
                          <Check className="w-4 h-4 text-green-400" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-[#1a202c] rounded-lg p-4 text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {data.content}
                  </div>
                </div>
              ))}

              {/* Generate Another */}
              <button
                onClick={() => {
                  setGeneratedPosts(null);
                  setTopic('');
                }}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Generate Another Set
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

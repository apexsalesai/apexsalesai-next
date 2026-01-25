'use client';

import React, { useState } from 'react';
import { X, Loader2, Copy, Check, Linkedin } from 'lucide-react';

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

  const shareToLinkedIn = (content: string) => {
    // Copy to clipboard first
    navigator.clipboard.writeText(content);
    // Open LinkedIn share page
    window.open('https://www.linkedin.com/feed/', '_blank');
    alert('Content copied! Paste it into your LinkedIn post.');
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

              {/* Platform Selection - Premium UI */}
              <div>
                <label className="block text-base font-semibold text-white mb-2">
                  Select Target Platforms
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Choose which social media platforms you want to create posts for
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'LinkedIn', icon: '💼', color: '#0077b5', desc: 'Professional network' },
                    { name: 'Twitter', icon: '🐦', color: '#1DA1F2', desc: 'Short-form updates' },
                    { name: 'Facebook', icon: '👥', color: '#1877F2', desc: 'Social engagement' },
                    { name: 'Instagram', icon: '📸', color: '#E4405F', desc: 'Visual storytelling' }
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => togglePlatform(platform.name)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 text-left group ${
                        platforms.includes(platform.name)
                          ? 'border-[#00c2cb] bg-gradient-to-br from-[#00c2cb]/20 to-[#00c2cb]/5 shadow-lg shadow-[#00c2cb]/20'
                          : 'border-gray-700 bg-[#0d1321] hover:border-gray-600 hover:bg-[#1a202c]'
                      }`}
                    >
                      {/* Checkmark indicator */}
                      {platforms.includes(platform.name) && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#00c2cb] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{platform.icon}</div>
                        <div className="flex-1">
                          <div className={`font-bold text-base mb-1 ${
                            platforms.includes(platform.name) ? 'text-[#00c2cb]' : 'text-white'
                          }`}>
                            {platform.name}
                          </div>
                          <div className="text-xs text-gray-400">{platform.desc}</div>
                        </div>
                      </div>
                      
                      {/* Hover effect */}
                      <div className={`absolute inset-0 rounded-xl transition-opacity ${
                        platforms.includes(platform.name) 
                          ? 'opacity-0' 
                          : 'opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#00c2cb]/5 to-transparent'
                      }`} />
                    </button>
                  ))}
                </div>
                
                {/* Selection summary */}
                <div className="mt-4 p-3 bg-[#0d1321] rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {platforms.length === 0 ? (
                        'No platforms selected'
                      ) : (
                        <>
                          <span className="text-[#00c2cb] font-semibold">{platforms.length}</span> platform{platforms.length !== 1 ? 's' : ''} selected
                        </>
                      )}
                    </span>
                    {platforms.length > 0 && (
                      <button
                        onClick={() => setPlatforms([])}
                        className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                      >
                        Clear all
                      </button>
                    )}
                  </div>
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
                    <div className="flex gap-2">
                      {platform === 'LinkedIn' && (
                        <button
                          onClick={() => shareToLinkedIn(data.content)}
                          className="flex items-center gap-2 px-3 py-1.5 bg-[#0077b5] hover:bg-[#006399] rounded-lg transition-colors text-sm text-white"
                        >
                          <Linkedin className="w-4 h-4" />
                          Share
                        </button>
                      )}
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

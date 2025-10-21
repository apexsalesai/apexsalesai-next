'use client';

import React, { useState } from 'react';
import { X, Loader2, Video, Download, Youtube, Zap } from 'lucide-react';

interface VideoGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoGenerator({ isOpen, onClose }: VideoGeneratorProps) {
  const [prompt, setPrompt] = useState('');
  const [videoType, setVideoType] = useState<'youtube-short' | 'tiktok' | 'instagram-reel'>('youtube-short');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<any>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a video description');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);

    try {
      // TODO: Integrate with Sora API or other video generation service
      const response = await fetch('/api/agent/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, videoType }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedVideo(data.video);
      } else {
        alert('Failed to generate video: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate video. Feature coming soon!');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a202c] rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#00c2cb] to-[#00a8b3] rounded-lg">
                <Video className="w-6 h-6 text-white" />
              </div>
              AI Video Generator
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-semibold rounded-full">
                Powered by Sora
              </span>
            </h2>
            <p className="text-sm text-gray-400 mt-2">Transform ideas into professional short-form videos instantly</p>
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
          {!generatedVideo ? (
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your video
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., A professional explaining AI sales automation in a modern office, with animated graphics showing data flowing between systems"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#0d1321] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00c2cb] transition-colors resize-none"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Be specific about visuals, style, and key message
                </p>
              </div>

              {/* Video Type Selection - Premium UI */}
              <div>
                <label className="block text-base font-semibold text-white mb-2">
                  Choose Video Format
                </label>
                <p className="text-xs text-gray-400 mb-4">
                  Select the platform and format for your video
                </p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { 
                      value: 'youtube-short', 
                      label: 'YouTube Short', 
                      icon: Youtube, 
                      duration: '60s',
                      specs: '9:16 • 1080x1920',
                      color: '#FF0000'
                    },
                    { 
                      value: 'tiktok', 
                      label: 'TikTok', 
                      icon: Video, 
                      duration: '60s',
                      specs: '9:16 • 1080x1920',
                      color: '#00F2EA'
                    },
                    { 
                      value: 'instagram-reel', 
                      label: 'Instagram Reel', 
                      icon: Video, 
                      duration: '90s',
                      specs: '9:16 • 1080x1920',
                      color: '#E4405F'
                    }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setVideoType(type.value as any)}
                      className={`relative p-5 rounded-xl border-2 transition-all duration-200 group ${
                        videoType === type.value
                          ? 'border-[#00c2cb] bg-gradient-to-br from-[#00c2cb]/20 to-[#00c2cb]/5 shadow-lg shadow-[#00c2cb]/20'
                          : 'border-gray-700 bg-[#0d1321] hover:border-gray-600 hover:bg-[#1a202c]'
                      }`}
                    >
                      {/* Selected indicator */}
                      {videoType === type.value && (
                        <div className="absolute top-3 right-3 w-6 h-6 bg-[#00c2cb] rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                      
                      <type.icon className={`w-8 h-8 mx-auto mb-3 ${
                        videoType === type.value ? 'text-[#00c2cb]' : 'text-gray-400'
                      }`} />
                      <div className={`font-bold text-sm mb-1 ${
                        videoType === type.value ? 'text-[#00c2cb]' : 'text-white'
                      }`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-500 mb-1">{type.duration}</div>
                      <div className="text-xs text-gray-600">{type.specs}</div>
                      
                      {/* Hover effect */}
                      <div className={`absolute inset-0 rounded-xl transition-opacity ${
                        videoType === type.value 
                          ? 'opacity-0' 
                          : 'opacity-0 group-hover:opacity-100 bg-gradient-to-br from-[#00c2cb]/5 to-transparent'
                      }`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Features Showcase - Premium */}
              <div className="bg-gradient-to-br from-purple-500/10 to-[#00c2cb]/10 border border-purple-500/30 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-[#00c2cb] rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-base font-bold text-white">OpenAI Sora Technology</h4>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Harness the power of OpenAI's cutting-edge video generation AI
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: '🎬', label: 'Cinematic Quality', desc: 'Professional-grade output' },
                    { icon: '⚡', label: 'Lightning Fast', desc: '2-3 minutes generation' },
                    { icon: '🎯', label: 'Platform Optimized', desc: 'Perfect specs every time' },
                    { icon: '✨', label: 'Auto-Enhanced', desc: 'Captions & transitions' }
                  ].map((feature, i) => (
                    <div key={i} className="bg-[#0d1321]/50 rounded-lg p-3 border border-gray-800">
                      <div className="text-2xl mb-1">{feature.icon}</div>
                      <div className="text-xs font-semibold text-white mb-0.5">{feature.label}</div>
                      <div className="text-xs text-gray-500">{feature.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 bg-gradient-to-r from-[#00c2cb] to-[#00a8b3] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Video... (This may take 2-3 minutes)
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Generate Video
                  </>
                )}
              </button>

              {/* Coming Soon Notice */}
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>🔧 Video generation is in beta. Full Sora integration coming soon!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Video Preview */}
              <div className="bg-[#0d1321] rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Your Video is Ready!</h3>
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                  <Video className="w-16 h-16 text-gray-600" />
                  {/* Video player would go here */}
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#00c2cb] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className="flex-1 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                    <Youtube className="w-4 h-4" />
                    Upload to YouTube
                  </button>
                </div>
              </div>

              {/* Generate Another */}
              <button
                onClick={() => {
                  setGeneratedVideo(null);
                  setPrompt('');
                }}
                className="w-full py-3 border border-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Generate Another Video
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

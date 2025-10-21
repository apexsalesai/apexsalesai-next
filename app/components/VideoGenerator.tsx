'use client';

import React, { useState } from 'react';
import { X, Loader2, Video, Download, Youtube } from 'lucide-react';

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
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-[#00c2cb]" />
              AI Video Generator
            </h2>
            <p className="text-sm text-gray-400 mt-1">Create engaging short-form videos with AI</p>
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

              {/* Video Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Video Format
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'youtube-short', label: 'YouTube Short', icon: Youtube, duration: '60s' },
                    { value: 'tiktok', label: 'TikTok', icon: Video, duration: '60s' },
                    { value: 'instagram-reel', label: 'Instagram Reel', icon: Video, duration: '90s' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setVideoType(type.value as any)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        videoType === type.value
                          ? 'border-[#00c2cb] bg-[#00c2cb]/10 text-[#00c2cb]'
                          : 'border-gray-700 bg-[#0d1321] text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <type.icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="font-semibold text-sm">{type.label}</div>
                      <div className="text-xs opacity-70 mt-1">{type.duration}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features Notice */}
              <div className="bg-[#00c2cb]/10 border border-[#00c2cb]/30 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-[#00c2cb] mb-2">🚀 Powered by AI</h4>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• Sora-powered video generation</li>
                  <li>• Optimized for each platform's specs</li>
                  <li>• Auto-captions and text overlays</li>
                  <li>• Professional transitions and effects</li>
                </ul>
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

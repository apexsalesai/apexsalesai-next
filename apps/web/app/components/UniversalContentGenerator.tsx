'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Mail, Briefcase, TrendingUp, Users, FileText, MessageSquare, Check, Loader2, Copy, Download, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ContentMode = 'marketing' | 'social' | 'job-seeker' | 'sales' | 'blog';
type OutputFormat = 'email' | 'social-post' | 'cover-letter' | 'proposal' | 'blog-post' | 'interview-response';

interface GeneratorProps {
  onContentGenerated?: (content: any) => void;
}

export function UniversalContentGenerator({ onContentGenerated }: GeneratorProps) {
  const [mode, setMode] = useState<ContentMode>('marketing');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('email');
  const [prompt, setPrompt] = useState('');
  const [targetLength, setTargetLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [tone, setTone] = useState<'professional' | 'casual' | 'persuasive' | 'friendly'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // CRM Integration
  const [crmConnected, setCrmConnected] = useState(false);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);

  // Real-time character/word count
  useEffect(() => {
    if (generatedContent) {
      setWordCount(generatedContent.trim().split(/\s+/).length);
      setCharCount(generatedContent.length);
    }
  }, [generatedContent]);

  const modes = [
    { 
      id: 'marketing' as ContentMode, 
      icon: TrendingUp, 
      label: 'Marketing', 
      color: 'from-purple-500 to-pink-500',
      desc: 'Email campaigns & CRM'
    },
    { 
      id: 'social' as ContentMode, 
      icon: Users, 
      label: 'Social Media', 
      color: 'from-blue-500 to-cyan-500',
      desc: 'Multi-platform posts'
    },
    { 
      id: 'job-seeker' as ContentMode, 
      icon: Briefcase, 
      label: 'Job Seeker', 
      color: 'from-green-500 to-emerald-500',
      desc: 'Applications & interviews'
    },
    { 
      id: 'sales' as ContentMode, 
      icon: Zap, 
      label: 'Sales', 
      color: 'from-orange-500 to-red-500',
      desc: 'Proposals & follow-ups'
    },
    { 
      id: 'blog' as ContentMode, 
      icon: FileText, 
      label: 'Content', 
      color: 'from-indigo-500 to-purple-500',
      desc: 'Blogs & articles'
    },
  ];

  const lengthOptions = {
    short: { words: '50-200', chars: '250-1000', label: 'Short' },
    medium: { words: '200-500', chars: '1000-2500', label: 'Medium' },
    long: { words: '500-2000', chars: '2500-10000', label: 'Long' },
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGeneratedContent('');

    try {
      const response = await fetch('/api/agent/generate-universal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          outputFormat,
          prompt,
          targetLength,
          tone,
          crmContacts: selectedContacts,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedContent(data.content);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        onContentGenerated?.(data);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0d1321] via-[#1a202c] to-[#0d1321] p-6">
      {/* Hero Section with Animated Background */}
      <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 p-8 border border-purple-500/30">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Universal Content Generator</h1>
              <p className="text-gray-300 mt-1">AI-powered content for every use case</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mode Selection - Premium Cards */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Choose Your Use Case</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {modes.map((m) => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMode(m.id)}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                mode === m.id
                  ? 'border-transparent shadow-2xl'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
              style={{
                background: mode === m.id 
                  ? `linear-gradient(135deg, ${m.color.split(' ')[0].replace('from-', '')}, ${m.color.split(' ')[1].replace('to-', '')})`
                  : '#1a202c'
              }}
            >
              {mode === m.id && (
                <motion.div
                  layoutId="activeMode"
                  className="absolute inset-0 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${m.color.split(' ')[0].replace('from-', '')}33, ${m.color.split(' ')[1].replace('to-', '')}33)`
                  }}
                />
              )}
              <div className="relative z-10">
                <m.icon className={`w-8 h-8 mx-auto mb-2 ${mode === m.id ? 'text-white' : 'text-gray-400'}`} />
                <div className={`font-bold text-sm mb-1 ${mode === m.id ? 'text-white' : 'text-gray-300'}`}>
                  {m.label}
                </div>
                <div className={`text-xs ${mode === m.id ? 'text-white/80' : 'text-gray-500'}`}>
                  {m.desc}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Input */}
        <div className="space-y-6">
          {/* Prompt Input */}
          <div className="bg-[#1a202c] rounded-xl p-6 border border-gray-800">
            <label className="block text-white font-semibold mb-3">
              What do you need to create?
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                mode === 'job-seeker' 
                  ? 'e.g., Cover letter for Senior Sales Manager position at Microsoft'
                  : mode === 'marketing'
                  ? 'e.g., Email campaign for new product launch to enterprise customers'
                  : 'Describe what you need...'
              }
              rows={4}
              className="w-full px-4 py-3 bg-[#0d1321] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          {/* Length & Character Count */}
          <div className="bg-[#1a202c] rounded-xl p-6 border border-gray-800">
            <label className="block text-white font-semibold mb-3">
              Target Length
            </label>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {(Object.keys(lengthOptions) as Array<keyof typeof lengthOptions>).map((len) => (
                <button
                  key={len}
                  onClick={() => setTargetLength(len)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    targetLength === len
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`font-bold mb-1 ${targetLength === len ? 'text-cyan-400' : 'text-white'}`}>
                    {lengthOptions[len].label}
                  </div>
                  <div className="text-xs text-gray-400">{lengthOptions[len].words} words</div>
                  <div className="text-xs text-gray-500">{lengthOptions[len].chars} chars</div>
                </button>
              ))}
            </div>

            {/* Real-time Counter */}
            {generatedContent && (
              <div className="flex gap-4 p-4 bg-[#0d1321] rounded-lg border border-gray-800">
                <div className="flex-1">
                  <div className="text-2xl font-bold text-cyan-400">{wordCount}</div>
                  <div className="text-xs text-gray-400">Words</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-400">{charCount}</div>
                  <div className="text-xs text-gray-400">Characters</div>
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.ceil(wordCount / 200)}
                  </div>
                  <div className="text-xs text-gray-400">Min read</div>
                </div>
              </div>
            )}
          </div>

          {/* Tone Selection */}
          <div className="bg-[#1a202c] rounded-xl p-6 border border-gray-800">
            <label className="block text-white font-semibold mb-3">
              Tone & Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['professional', 'casual', 'persuasive', 'friendly'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tone === t
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* CRM Integration (for marketing mode) */}
          {mode === 'marketing' && (
            <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white font-semibold">CRM Integration</label>
                <button
                  onClick={() => setCrmConnected(!crmConnected)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    crmConnected
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {crmConnected ? '✓ Connected' : 'Connect Salesforce'}
                </button>
              </div>
              {crmConnected && (
                <div className="text-sm text-gray-300">
                  <p className="mb-2">📊 2,547 contacts available</p>
                  <button className="text-cyan-400 hover:underline">
                    Select target audience →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-5 bg-gradient-to-r from-purple-600 via-cyan-600 to-blue-600 text-white font-bold rounded-xl shadow-2xl hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Generate Content
              </>
            )}
          </motion.button>
        </div>

        {/* Right Column - Output */}
        <div className="space-y-6">
          <div className="bg-[#1a202c] rounded-xl p-6 border border-gray-800 min-h-[600px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Generated Content</h3>
              {generatedContent && (
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-gray-300" />
                  </button>
                  <button
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-300" />
                  </button>
                  {mode === 'marketing' && crmConnected && (
                    <button
                      className="p-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
                      title="Send to CRM"
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  )}
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
                  <p className="text-gray-400">Creating your content...</p>
                </motion.div>
              ) : generatedContent ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {generatedContent}
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p>Your generated content will appear here</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <Check className="w-6 h-6" />
            <span className="font-semibold">Content generated successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

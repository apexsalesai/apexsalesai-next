'use client';

import { useState, useEffect, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { count, LIMITS, enforceLimit } from '@lib/socialLimits';
import { saveAsset } from '../hooks/useAssetSave';
import { usePublish } from '../hooks/usePublish';
import { Save, FileText, Send, Mail, Linkedin, Twitter } from 'lucide-react';

interface RichEditorProps {
  assetId: string;
  initialTitle: string;
  initialBody: string;
  assetType: string;
  onSaved?: () => void;
}

const WORD_PRESETS = {
  short: 300,
  medium: 800,
  long: 1500,
};

export function RichEditor({ assetId, initialTitle, initialBody, assetType, onSaved }: RichEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetWords, setTargetWords] = useState<number | null>(null);
  const { publish, publishing, error: publishError, success: publishSuccess } = usePublish();

  const stats = count(body);
  const isSocial = assetType === 'social';
  const platform = title.toLowerCase().includes('linkedin') ? 'linkedin' : 
                   title.toLowerCase().includes('x') || title.toLowerCase().includes('twitter') ? 'x' : null;
  const charLimit = platform ? LIMITS[platform] : null;
  const exceeded = charLimit ? stats.chars > charLimit : false;

  // Autosave with debounce
  const debouncedSave = useMemo(
    () =>
      debounce(async (newBody: string) => {
        if (newBody === initialBody) return;
        
        setSaving(true);
        setError(null);
        try {
          await saveAsset(assetId, { body: newBody });
          setLastSaved(new Date());
        } catch (err: any) {
          setError(err.message || 'Failed to save');
        } finally {
          setSaving(false);
        }
      }, 1500),
    [assetId, initialBody]
  );

  useEffect(() => {
    if (body !== initialBody) {
      debouncedSave(body);
    }
  }, [body, debouncedSave, initialBody]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveAsset(assetId, { title, body });
      setLastSaved(new Date());
      onSaved?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNewVersion = async () => {
    setSaving(true);
    setError(null);
    try {
      await saveAsset(assetId, { title, body }, true);
      setLastSaved(new Date());
      onSaved?.();
    } catch (err: any) {
      setError(err.message || 'Failed to save new version');
    } finally {
      setSaving(false);
    }
  };

  const handleTrimToLimit = () => {
    if (charLimit) {
      setBody(enforceLimit(body, charLimit));
    }
  };

  const handlePublish = async (channel: 'blog' | 'email' | 'linkedin' | 'x') => {
    // Save first
    await handleSave();
    
    // Then publish
    const options: any = { assetId, channel };
    
    if (channel === 'blog') {
      options.title = title;
    } else if (channel === 'email') {
      // TODO: Get recipient from user input
      options.to = 'test@example.com';
      options.subject = title;
    } else if (channel === 'linkedin' || channel === 'x') {
      options.text = body;
    }
    
    await publish(options);
  };

  return (
    <div className="space-y-4" data-testid="editor">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
        />
      </div>

      {/* Target Controls (non-social only) */}
      {!isSocial && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Target:</span>
          <div className="flex gap-2">
            {Object.entries(WORD_PRESETS).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setTargetWords(value)}
                className={`px-3 py-1 text-sm rounded border transition-colors ${
                  targetWords === value
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600'
                }`}
              >
                {key} ({value}w)
              </button>
            ))}
          </div>
          <input
            type="number"
            placeholder="Custom"
            value={targetWords || ''}
            onChange={(e) => setTargetWords(Number(e.target.value) || null)}
            className="w-24 px-3 py-1 text-sm bg-slate-900 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
          />
        </div>
      )}

      {/* Editor */}
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="w-full h-96 px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-cyan-500 resize-none"
          placeholder="Start writing..."
        />
      </div>

      {/* Stats & Warnings */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <span className="text-slate-400" data-testid="word-count">
            <FileText className="w-4 h-4 inline mr-1" />
            {stats.words} words
          </span>
          <span className={exceeded ? 'text-red-400 font-medium' : 'text-slate-400'} data-testid="char-count">
            {stats.chars} chars
            {charLimit && ` / ${charLimit}`}
          </span>
          <span className="text-slate-400">
            {stats.readingMin} min read
          </span>
          {targetWords && (
            <span className={stats.words >= targetWords ? 'text-green-400' : 'text-yellow-400'}>
              {Math.round((stats.words / targetWords) * 100)}% of target
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {saving && <span className="text-sm text-slate-400">Saving...</span>}
          {lastSaved && !saving && (
            <span className="text-sm text-slate-400">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
          {error && <span className="text-sm text-red-400" data-testid="toast-error">{error}</span>}
        </div>
      </div>

      {/* Character Limit Warning */}
      {exceeded && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4" data-testid="char-warning">
          <p className="text-red-400 text-sm font-medium">
            Content exceeds {platform} character limit ({charLimit} chars)
          </p>
          <button
            onClick={handleTrimToLimit}
            className="mt-2 px-3 py-1 text-sm bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors"
          >
            Trim to limit
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || exceeded}
          className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleSaveNewVersion}
          disabled={saving || exceeded}
          data-testid="save-new-version"
          className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save as New Version
        </button>
      </div>

      {/* Publish Buttons */}
      <div className="border-t border-slate-700 pt-4">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Publish to Channels</h3>
        <div className="flex items-center gap-3 flex-wrap">
          {assetType === 'blog' && (
            <button
              onClick={() => handlePublish('blog')}
              disabled={publishing || saving || exceeded}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Publish Blog
            </button>
          )}
          
          {assetType === 'email' && (
            <button
              onClick={() => handlePublish('email')}
              disabled={publishing || saving || exceeded}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Email
            </button>
          )}
          
          {assetType === 'social' && (
            <>
              <button
                onClick={() => handlePublish('linkedin')}
                disabled={publishing || saving || exceeded}
                className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4" />
                Post to LinkedIn
              </button>
              <button
                onClick={() => handlePublish('x')}
                disabled={publishing || saving || exceeded}
                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                <Twitter className="w-4 h-4" />
                Post to X
              </button>
            </>
          )}
        </div>
        
        {/* Publish Status Messages */}
        {publishing && (
          <div className="mt-3 text-sm text-cyan-400">Publishing...</div>
        )}
        {publishSuccess && (
          <div className="mt-3 text-sm text-green-400" data-testid="publish-success">
            ✓ {publishSuccess}
          </div>
        )}
        {publishError && (
          <div className="mt-3 text-sm text-red-400" data-testid="publish-error">
            ✗ {publishError}
          </div>
        )}
      </div>
    </div>
  );
}

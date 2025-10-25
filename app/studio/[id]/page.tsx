'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Play, Download, Loader2, History } from 'lucide-react';
import { useCampaign } from '../hooks/useCampaign';
import { AgentTimeline } from '../components/AgentTimeline';
import { AssetTabs } from '../components/AssetTabs';
import { RichEditor } from '../components/RichEditor';
import { VersionHistory } from '../components/VersionHistory';
import { postJSON, getJSON } from '@/lib/http';

interface ContentAsset {
  id: string;
  type: string;
  title: string;
  body: string;
  version: number;
  metadata: any;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Version {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}

export default function WorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const { campaign, error, isLoading, mutate } = useCampaign(campaignId);
  
  const [selectedAsset, setSelectedAsset] = useState<ContentAsset | null>(null);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [versions, setVersions] = useState<Version[]>([]);
  const [running, setRunning] = useState(false);

  // Auto-select first asset when campaign loads
  useEffect(() => {
    if (campaign?.assets && campaign.assets.length > 0 && !selectedAsset) {
      setSelectedAsset(campaign.assets[0]);
    }
  }, [campaign, selectedAsset]);

  // Load versions when asset is selected
  useEffect(() => {
    if (selectedAsset) {
      loadVersions(selectedAsset.id);
    }
  }, [selectedAsset?.id]);

  async function loadVersions(assetId: string) {
    try {
      const data = await getJSON<{ data: ContentAsset; versions: Version[] }>(
        `/api/studio/assets/${assetId}`
      );
      setVersions(data.versions || []);
    } catch (err) {
      console.error('Error loading versions:', err);
    }
  }

  async function runAgents() {
    setRunning(true);
    try {
      await postJSON('/api/studio/agents/run', { campaignId });
      mutate(); // Refresh campaign data
    } catch (err: any) {
      console.error('Error running agents:', err);
      alert('Failed to run agents: ' + err.message);
    } finally {
      setRunning(false);
    }
  }

  function handleSelectAsset(asset: ContentAsset) {
    setSelectedAsset(asset);
    setShowVersionHistory(false);
  }

  function handleSelectVersion(versionId: string) {
    const version = versions.find(v => v.id === versionId);
    if (version && campaign) {
      const versionAsset = campaign.assets.find(a => a.id === versionId);
      if (versionAsset) {
        setSelectedAsset(versionAsset);
      }
    }
    setShowVersionHistory(false);
  }

  function handleSaved() {
    mutate(); // Refresh campaign data
    if (selectedAsset) {
      loadVersions(selectedAsset.id);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-slate-400">Loading workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-semibold mb-2">Campaign not found</h2>
          <p className="text-slate-400 mb-6">The campaign you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/studio')}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors"
          >
            Back to Studio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/studio')}
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Studio
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{campaign.title}</h1>
              <p className="text-slate-400">{campaign.objective}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-lg text-sm font-medium">
                {campaign.status}
              </span>
              <button
                onClick={runAgents}
                disabled={running}
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Run Agents
                  </>
                )}
              </button>
              <button
                disabled
                className="px-4 py-2 bg-slate-700 text-slate-500 rounded-lg font-semibold cursor-not-allowed flex items-center gap-2"
                title="Available in Item C"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Agent Timeline */}
        <div className="mb-8">
          <AgentTimeline tasks={campaign.tasks || []} />
        </div>

        {/* Content Editor */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Asset Tabs - Left Sidebar */}
          <div className="lg:col-span-1">
            <AssetTabs
              assets={campaign.assets || []}
              onSelectAsset={handleSelectAsset}
              selectedAssetId={selectedAsset?.id}
            />
          </div>

          {/* Editor - Main Content */}
          <div className="lg:col-span-2">
            {selectedAsset ? (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold">Editor</h3>
                  <button
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    data-testid="version-history-btn"
                    className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <History className="w-4 h-4" />
                    Version History ({versions.length})
                  </button>
                </div>

                <RichEditor
                  assetId={selectedAsset.id}
                  initialTitle={selectedAsset.title}
                  initialBody={selectedAsset.body}
                  assetType={selectedAsset.type}
                  onSaved={handleSaved}
                />
              </div>
            ) : (
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-2">No asset selected</h3>
                <p className="text-slate-400">Select an asset from the left to start editing</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Version History Drawer */}
      {showVersionHistory && selectedAsset && (
        <VersionHistory
          versions={versions}
          currentVersionId={selectedAsset.id}
          onSelectVersion={handleSelectVersion}
          onClose={() => setShowVersionHistory(false)}
        />
      )}
    </div>
  );
}

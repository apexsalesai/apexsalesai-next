'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Loader2 } from 'lucide-react';
import { CampaignList } from './components/CampaignList';
import { getJSON, postJSON } from '@lib/http';

interface Campaign {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  _count: {
    assets: number;
    tasks: number;
  };
}

interface CampaignsResponse {
  campaigns: Campaign[];
  count: number;
}

export default function StudioPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, []);

  async function loadCampaigns() {
    setLoading(true);
    try {
      const data = await getJSON<CampaignsResponse>('/api/studio/campaigns');
      setCampaigns(data.campaigns || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign() {
    if (!newCampaignTitle.trim()) return;

    setCreating(true);
    try {
      const result = await postJSON<{ id: string }>('/api/studio/campaigns', {
        title: newCampaignTitle,
        objective: 'New campaign objective',
        audience: 'Target audience',
        brandVoice: 'professional',
        channels: ['blog', 'email', 'social'],
      });

      setNewCampaignTitle('');
      setShowNewCampaign(false);
      router.push(`/studio/${result.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎬 Campaign Studio</h1>
          <p className="text-slate-400 text-lg">Multi-agent content orchestration workspace</p>
        </div>

        {/* New Campaign Button */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-slate-400">
            {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={() => setShowNewCampaign(!showNewCampaign)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </button>
        </div>

        {/* New Campaign Form */}
        {showNewCampaign && (
          <div className="mb-6 p-6 bg-slate-800/50 border border-cyan-500/30 rounded-lg">
            <h3 className="font-semibold mb-4 text-lg">Create New Campaign</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCampaignTitle}
                onChange={(e) => setNewCampaignTitle(e.target.value)}
                placeholder="Campaign title..."
                className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                onKeyPress={(e) => e.key === 'Enter' && !creating && createCampaign()}
                autoFocus
              />
              <button
                onClick={createCampaign}
                disabled={creating || !newCampaignTitle.trim()}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
              <button
                onClick={() => {
                  setShowNewCampaign(false);
                  setNewCampaignTitle('');
                }}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
            <p className="text-slate-400">Loading campaigns...</p>
          </div>
        ) : campaigns.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-slate-800/30 border border-slate-700 rounded-lg">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold mb-2">No campaigns yet</h3>
            <p className="text-slate-400 mb-6">Create your first campaign to get started</p>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          /* Campaign List */
          <CampaignList campaigns={campaigns} />
        )}
      </div>
    </div>
  );
}

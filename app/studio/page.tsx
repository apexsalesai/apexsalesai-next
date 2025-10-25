'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Campaign {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

interface AgentTask {
  id: number;
  agentType: string;
  status: string;
  campaignId: number;
}

interface ContentAsset {
  id: number;
  type: string;
  title: string;
  status: string;
}

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState<'campaigns' | 'tasks' | 'assets'>('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [assets, setAssets] = useState<ContentAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [campaignsRes, tasksRes, assetsRes] = await Promise.all([
        fetch('/api/studio/campaigns'),
        fetch('/api/studio/agents/tasks'),
        fetch('/api/studio/assets'),
      ]);

      if (campaignsRes.ok) {
        const data = await campaignsRes.json();
        setCampaigns(data.campaigns || []);
      }

      if (tasksRes.ok) {
        const data = await tasksRes.json();
        setTasks(data.tasks || []);
      }

      if (assetsRes.ok) {
        const data = await assetsRes.json();
        setAssets(data.assets || []);
      }
    } catch (error) {
      console.error('Error loading studio data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createCampaign() {
    if (!newCampaignName.trim()) return;

    try {
      const res = await fetch('/api/studio/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCampaignName }),
      });

      if (res.ok) {
        setNewCampaignName('');
        setShowNewCampaign(false);
        loadData();
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getAgentIcon = (agentType: string) => {
    const icons: Record<string, string> = {
      strategy: '🎯',
      copywriter: '✍️',
      visual: '🎨',
      video: '🎬',
      personalization: '🎭',
    };
    return icons[agentType.toLowerCase()] || '🤖';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎬 Campaign Studio</h1>
          <p className="text-slate-400 text-lg">Multi-agent content orchestration workspace</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-lg border border-cyan-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 text-sm font-medium">Active Campaigns</p>
                <p className="text-3xl font-bold mt-1">{campaigns.filter(c => c.status === 'ACTIVE').length}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Completed Tasks</p>
                <p className="text-3xl font-bold mt-1">{tasks.filter(t => t.status === 'COMPLETED').length}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-lg border border-purple-500/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Content Assets</p>
                <p className="text-3xl font-bold mt-1">{assets.length}</p>
              </div>
              <div className="text-4xl">📦</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/10">
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'campaigns'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Campaigns ({campaigns.length})
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Agent Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'assets'
                ? 'text-cyan-400 border-b-2 border-cyan-400'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Assets ({assets.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⏳</div>
              <p className="text-slate-400">Loading studio data...</p>
            </div>
          ) : (
            <>
              {/* Campaigns Tab */}
              {activeTab === 'campaigns' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Campaigns</h2>
                    <button
                      onClick={() => setShowNewCampaign(true)}
                      className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition-all"
                    >
                      + New Campaign
                    </button>
                  </div>

                  {showNewCampaign && (
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-lg border border-cyan-500/30">
                      <h3 className="font-semibold mb-3">Create New Campaign</h3>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newCampaignName}
                          onChange={(e) => setNewCampaignName(e.target.value)}
                          placeholder="Campaign name..."
                          className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && createCampaign()}
                        />
                        <button
                          onClick={createCampaign}
                          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => {
                            setShowNewCampaign(false);
                            setNewCampaignName('');
                          }}
                          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {campaigns.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📋</div>
                      <p className="text-slate-400 mb-4">No campaigns yet</p>
                      <button
                        onClick={() => setShowNewCampaign(true)}
                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold"
                      >
                        Create Your First Campaign
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {campaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{campaign.name}</h3>
                              <p className="text-sm text-slate-400">
                                Created: {new Date(campaign.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                  campaign.status
                                )}`}
                              >
                                {campaign.status}
                              </span>
                              <Link
                                href={`/studio/campaigns/${campaign.id}`}
                                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm font-semibold"
                              >
                                View →
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tasks Tab */}
              {activeTab === 'tasks' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Agent Tasks</h2>
                  {tasks.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🤖</div>
                      <p className="text-slate-400">No agent tasks yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-white/10"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="text-3xl">{getAgentIcon(task.agentType)}</div>
                              <div>
                                <h3 className="font-semibold capitalize">{task.agentType} Agent</h3>
                                <p className="text-sm text-slate-400">Campaign ID: {task.campaignId}</p>
                              </div>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                task.status
                              )}`}
                            >
                              {task.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Assets Tab */}
              {activeTab === 'assets' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Content Assets</h2>
                  {assets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-slate-400">No assets yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="p-4 bg-slate-800/50 rounded-lg border border-white/10 hover:border-cyan-500/50 transition-all"
                        >
                          <div className="text-3xl mb-3">
                            {asset.type === 'IMAGE' ? '🖼️' : asset.type === 'VIDEO' ? '🎬' : '📄'}
                          </div>
                          <h3 className="font-semibold mb-2">{asset.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-400">{asset.type}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(
                                asset.status
                              )}`}
                            >
                              {asset.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/studio/create"
            className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl hover:border-cyan-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">✨</div>
              <div>
                <h3 className="font-semibold text-lg">Generate Content</h3>
                <p className="text-sm text-slate-400">B2B & B2C content in seconds</p>
              </div>
            </div>
          </Link>

          <Link
            href="/studio/publishing"
            className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📅</div>
              <div>
                <h3 className="font-semibold text-lg">Publishing Calendar</h3>
                <p className="text-sm text-slate-400">Schedule & manage posts</p>
              </div>
            </div>
          </Link>

          <Link
            href="/studio/analytics"
            className="p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl hover:border-purple-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">📊</div>
              <div>
                <h3 className="font-semibold text-lg">Analytics</h3>
                <p className="text-sm text-slate-400">Performance insights</p>
              </div>
            </div>
          </Link>

          <Link
            href="/studio/settings/connections"
            className="p-6 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl hover:border-orange-500/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">🔗</div>
              <div>
                <h3 className="font-semibold text-lg">Connections</h3>
                <p className="text-sm text-slate-400">OAuth integrations</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Career Companion Link */}
        <div className="mt-8">
          <Link
            href="/career"
            className="block p-6 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-xl hover:border-pink-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💼</div>
                <div>
                  <h3 className="font-semibold text-lg">Career Companion</h3>
                  <p className="text-sm text-slate-400">Personal branding & portfolio management</p>
                </div>
              </div>
              <div className="text-cyan-400 font-semibold">View →</div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

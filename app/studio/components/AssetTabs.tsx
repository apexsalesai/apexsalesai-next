'use client';

import { useState } from 'react';
import { FileText, Mail, Share2, Video, Image } from 'lucide-react';

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

interface AssetTabsProps {
  assets: ContentAsset[];
  onSelectAsset: (asset: ContentAsset) => void;
  selectedAssetId?: string;
}

const TABS = [
  { id: 'blog', label: 'Blog', icon: FileText, types: ['blog'] },
  { id: 'email', label: 'Email', icon: Mail, types: ['email'] },
  { id: 'social', label: 'Social', icon: Share2, types: ['social'] },
  { id: 'video', label: 'Video', icon: Video, types: ['videoScript'] },
  { id: 'prompts', label: 'Prompts', icon: Image, types: ['imagePrompt'] },
];

export function AssetTabs({ assets, onSelectAsset, selectedAssetId }: AssetTabsProps) {
  const [activeTab, setActiveTab] = useState('blog');

  const activeTabConfig = TABS.find(t => t.id === activeTab);
  const filteredAssets = assets.filter(a => activeTabConfig?.types.includes(a.type));

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-700">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const count = assets.filter(a => tab.types.includes(a.type)).length;
          
          return (
            <button
              key={tab.id}
              data-testid={`tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
              <span className="text-xs bg-slate-700 px-2 py-0.5 rounded">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Asset List */}
      <div className="space-y-2">
        {filteredAssets.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No {activeTabConfig?.label.toLowerCase()} assets yet.
          </div>
        ) : (
          filteredAssets.map((asset) => (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedAssetId === asset.id
                  ? 'bg-cyan-500/10 border-cyan-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{asset.title}</h4>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">
                    {asset.body.substring(0, 150)}...
                  </p>
                </div>
                <span className="text-xs text-slate-500 ml-4">v{asset.version}</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

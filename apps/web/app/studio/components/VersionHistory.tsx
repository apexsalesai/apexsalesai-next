'use client';

import { formatDistanceToNow } from 'date-fns';
import { X, Clock } from 'lucide-react';

interface Version {
  id: string;
  version: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  metadata: any;
}

interface VersionHistoryProps {
  versions: Version[];
  currentVersionId: string;
  onSelectVersion: (versionId: string) => void;
  onClose: () => void;
}

export function VersionHistory({ versions, currentVersionId, onSelectVersion, onClose }: VersionHistoryProps) {
  const sortedVersions = [...versions].sort((a, b) => b.version - a.version);

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-slate-900 border-l border-slate-700 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div>
          <h3 className="text-lg font-semibold text-white">Version History</h3>
          <p className="text-sm text-slate-400 mt-1">{versions.length} versions</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>
      </div>

      {/* Version List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedVersions.map((version) => {
          const isCurrent = version.id === currentVersionId;
          
          return (
            <button
              key={version.id}
              data-testid="version-item"
              onClick={() => onSelectVersion(version.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                isCurrent
                  ? 'bg-cyan-500/10 border-cyan-500/50'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-white font-medium">v{version.version}</span>
                {isCurrent && (
                  <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">
                    Current
                  </span>
                )}
              </div>
              
              <p className="text-sm text-slate-400 line-clamp-2 mb-2">{version.title}</p>
              
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(version.updatedAt), { addSuffix: true })}
                </span>
              </div>

              {version.metadata?.wordCount && (
                <div className="mt-2 text-xs text-slate-500">
                  {version.metadata.wordCount} words • {version.metadata.charCount} chars
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

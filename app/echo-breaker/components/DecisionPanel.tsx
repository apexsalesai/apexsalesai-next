"use client";

interface DecisionPanelProps {
  decisionPanel?: {
    actionReadiness: string;
    decisionConfidence: string;
    timeSensitivity: string;
    primaryRisk: string;
    recommendedAction: {
      headline: string;
      summary: string;
      do: string[];
      avoid: string[];
    };
  };
}

export default function DecisionPanel({ decisionPanel }: DecisionPanelProps) {
  if (!decisionPanel) return null;

  const getReadinessConfig = (readiness: string) => {
    const configs = {
      READY: {
        icon: '🟢',
        label: 'SAFE TO PUBLISH',
        color: 'emerald',
        bgClass: 'bg-emerald-500/10',
        borderClass: 'border-emerald-500',
        textClass: 'text-emerald-400',
      },
      LIMITED: {
        icon: '🟡',
        label: 'PUBLISH WITH CONTEXT',
        color: 'amber',
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500',
        textClass: 'text-amber-400',
      },
      NOT_RECOMMENDED: {
        icon: '🔴',
        label: 'DO NOT PUBLISH',
        color: 'red',
        bgClass: 'bg-red-500/10',
        borderClass: 'border-red-500',
        textClass: 'text-red-400',
      },
    };
    return configs[readiness as keyof typeof configs] || configs.LIMITED;
  };

  const getConfidenceColor = (confidence: string) => {
    if (confidence === 'HIGH') return 'text-emerald-400';
    if (confidence === 'MODERATE') return 'text-amber-400';
    return 'text-red-400';
  };

  const getSensitivityColor = (sensitivity: string) => {
    if (sensitivity === 'HIGH') return 'text-red-400';
    if (sensitivity === 'MEDIUM') return 'text-amber-400';
    return 'text-emerald-400';
  };

  const readinessConfig = getReadinessConfig(decisionPanel.actionReadiness);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎯</div>
          <div>
            <h2 className="text-xl font-black text-slate-100">Decision Panel</h2>
            <p className="text-xs text-slate-400">Actionable intelligence for decision-makers</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Action Readiness - DOMINANT */}
        <div className={`${readinessConfig.bgClass} border-2 ${readinessConfig.borderClass} rounded-xl p-6`}>
          <div className="flex items-center gap-4 mb-3">
            <div className="text-4xl">{readinessConfig.icon}</div>
            <div className="flex-1">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Decision Readiness
              </div>
              <div className={`text-2xl font-black ${readinessConfig.textClass}`}>
                {readinessConfig.label}
              </div>
            </div>
          </div>
          
          {/* Decision Rationale */}
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-bold text-slate-300 mb-2">Decision Rationale</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {decisionPanel.recommendedAction.summary}
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Decision Confidence */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Confidence
            </div>
            <div className={`text-2xl font-black ${getConfidenceColor(decisionPanel.decisionConfidence)}`}>
              {decisionPanel.decisionConfidence}
            </div>
          </div>

          {/* Time Sensitivity */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Time Sensitivity
            </div>
            <div className={`text-2xl font-black ${getSensitivityColor(decisionPanel.timeSensitivity)}`}>
              {decisionPanel.timeSensitivity}
            </div>
          </div>

          {/* Primary Risk */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-center">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Primary Risk
            </div>
            <div className="text-xl font-black text-slate-200">
              {decisionPanel.primaryRisk}
            </div>
          </div>
        </div>

        {/* Recommended Action */}
        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-slate-100 mb-3 flex items-center gap-2">
            <span>💡</span>
            Recommended Action
          </h3>
          <p className="text-base font-semibold text-slate-200 mb-4">
            {decisionPanel.recommendedAction.headline}
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {/* DO */}
            {decisionPanel.recommendedAction.do.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <span>✓</span> DO
                </h4>
                <ul className="space-y-2">
                  {decisionPanel.recommendedAction.do.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-emerald-400 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* AVOID */}
            {decisionPanel.recommendedAction.avoid.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-red-400 mb-2 flex items-center gap-2">
                  <span>✕</span> AVOID
                </h4>
                <ul className="space-y-2">
                  {decisionPanel.recommendedAction.avoid.map((item, idx) => (
                    <li key={idx} className="text-sm text-slate-300 flex gap-2">
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

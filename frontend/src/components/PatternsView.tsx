'use client';

import React from 'react';
import { 
  AlertTriangle, 
  RefreshCw, 
  PhoneCall, 
  Smartphone, 
  GitBranch, 
  Eye, 
  FileText, 
  ShieldAlert, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Pattern, PatternType, Entity, Evidence } from '../types/intelligence';
import { IndiaMapBackdrop } from './dashboard/IndiaMapBackdrop';

interface PatternsViewProps {
  patterns: Pattern[];
  entities: Entity[];
  evidenceCatalog: Evidence[];
  onViewPatternInNetwork: (entityIds: string[]) => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  patterns,
  entities,
  evidenceCatalog,
  onViewPatternInNetwork,
}) => {
  const getPatternIcon = (type: PatternType) => {
    switch (type) {
      case 'CIRCULAR_TRANSACTION': return RefreshCw;
      case 'COMMUNICATION_BURST': return PhoneCall;
      case 'SIM_DEVICE_SWAP': return Smartphone;
      case 'CROSS_COMMUNITY_BRIDGE': return GitBranch;
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* 1. Tactical India Map Background Wireframe (z-0) */}
      <IndiaMapBackdrop />

      {/* 2. Main Content Layer (relative z-10) */}
      <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
        {/* Header */}
        <div className="h-14 px-6 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-800/60 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold font-mono text-slate-100 tracking-wider">Explainable Pattern Detection</h1>
              <p className="text-xs text-slate-400 font-mono">
                Heuristic and algorithmic anomalies flagged across transactions, communications, and graph topology
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded font-semibold text-xs font-mono">
            {patterns.length} Anomalies Flagged
          </span>
        </div>

        {/* Pattern Cards Grid */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {patterns.map(pat => {
            const Icon = getPatternIcon(pat.type);
            const involvedEntities = entities.filter(e => pat.entityIds.includes(e.id));
            const supportingEvidence = evidenceCatalog.filter(ev => pat.evidenceIds.includes(ev.id));

            return (
              <div
                key={pat.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xs hover:border-slate-700 transition-all space-y-4 backdrop-blur-xs"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-lg bg-rose-950/80 border border-rose-800/70 text-rose-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h2 className="text-base font-bold text-slate-100">{pat.title}</h2>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 uppercase">
                          {pat.severity} SEVERITY
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{pat.explanation}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-base font-bold font-mono text-slate-100">{pat.confidence}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold font-mono">Confidence</div>
                    </div>
                    <button
                      onClick={() => onViewPatternInNetwork(pat.entityIds)}
                      className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View in Network</span>
                    </button>
                  </div>
                </div>

                {/* 3-Column Explanatory Breakdown: WHY, ENTITIES, EVIDENCE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {/* 1. WHY FLAGGED? */}
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                      WHY WAS THIS FLAGGED?
                    </span>
                    <ul className="space-y-1.5">
                      {pat.whyFlagged.map((reason, idx) => (
                        <li key={idx} className="text-xs text-slate-300 flex items-start space-x-1.5">
                          <span className="text-blue-400 font-bold leading-none mt-0.5">•</span>
                          <span className="leading-tight">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. ENTITIES INVOLVED */}
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                      ENTITIES INVOLVED ({involvedEntities.length})
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {involvedEntities.map(ent => (
                        <div key={ent.id} className="text-xs text-slate-200 flex items-center justify-between">
                          <span className="font-medium truncate max-w-[160px]">{ent.name}</span>
                          <span className="text-[10px] font-mono uppercase text-slate-400 px-1.5 py-0.2 bg-slate-900 rounded border border-slate-700">
                            {ent.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. SUPPORTING EVIDENCE & ACTION */}
                  <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                        SUPPORTING EVIDENCE ({supportingEvidence.length})
                      </span>
                      <div className="space-y-1">
                        {supportingEvidence.map(ev => (
                          <div key={ev.id} className="text-xs text-blue-400 font-mono flex items-center space-x-1 truncate">
                            <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{ev.recordId} ({ev.sourceType})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                      <strong className="text-slate-300">Action:</strong> {pat.actionRecommendation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

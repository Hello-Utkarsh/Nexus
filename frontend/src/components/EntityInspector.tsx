'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Users, 
  Phone, 
  CreditCard, 
  Building2, 
  MapPin, 
  Car, 
  FileText, 
  Copy, 
  Check, 
  ArrowRight,
  TrendingUp,
  Share2,
  Eye
} from 'lucide-react';
import { Entity, Evidence, Relationship } from '../types/intelligence';

interface EntityInspectorProps {
  entity: Entity | null;
  evidenceCatalog: Evidence[];
  relationships: Relationship[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onTracePathToEntity?: (targetId: string) => void;
}

export const EntityInspector: React.FC<EntityInspectorProps> = ({
  entity,
  evidenceCatalog,
  relationships,
  isCollapsed,
  onToggleCollapse,
  onTracePathToEntity,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  if (isCollapsed) {
    return (
      <aside className="w-10 flex-shrink-0 border-l border-slate-200 bg-white flex flex-col items-center py-3 select-none z-20">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 mb-4 transition-colors"
          title="Expand Entity Inspector"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="writing-mode-vertical text-[10px] font-mono tracking-widest text-slate-400 rotate-180 uppercase font-semibold">
          ENTITY INSPECTOR
        </div>
      </aside>
    );
  }

  if (!entity) {
    return (
      <aside className="w-[360px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col items-center justify-center p-6 text-center select-none z-20 text-slate-400">
        <Users className="w-10 h-10 text-slate-300 mb-2" />
        <h3 className="text-xs font-bold text-slate-700">No Entity Selected</h3>
        <p className="text-[11px] text-slate-500 mt-1 max-w-[220px]">
          Click any node or relationship in the network to inspect its verified intelligence trail.
        </p>
      </aside>
    );
  }

  const linkedEvidence = evidenceCatalog.filter(ev => entity.sourceIds.includes(ev.id));
  const directRelationships = relationships.filter(
    r => r.sourceId === entity.id || r.targetId === entity.id
  );

  return (
    <aside className="w-[360px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full overflow-y-auto select-none z-20 shadow-xs">
      {/* Top Header */}
      <div className="h-12 px-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-500 transition-colors"
            title="Collapse Inspector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            ENTITY PROFILE
          </span>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
          {entity.type}
        </span>
      </div>

      {/* Main Inspector Body */}
      <div className="p-4 space-y-5">
        {/* Name & Role */}
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">{entity.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{entity.role}</p>

          {entity.flaggedSignal && (
            <div className="mt-2.5 px-2.5 py-1.5 bg-rose-50 border border-rose-200 rounded-md text-[11px] text-rose-800 font-medium">
              ⚠️ {entity.flaggedSignal}
            </div>
          )}
        </div>

        {/* Aliases */}
        {entity.aliases.length > 0 && (
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              KNOWN ALIASES
            </span>
            <div className="flex flex-wrap gap-1">
              {entity.aliases.map((alias, idx) => (
                <span key={idx} className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-mono">
                  {alias}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Graph Metrics (Section 19: Real Centrality Signals) */}
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              NETWORK ROLE METRICS
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="bg-white p-2 rounded border border-slate-200/80">
              <div className="text-xs font-bold font-mono text-slate-900">{entity.metrics.degree}</div>
              <div className="text-[10px] text-slate-400">Connections</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200/80">
              <div className="text-xs font-bold font-mono text-blue-600">{entity.metrics.betweenness.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">Betweenness</div>
            </div>
            <div className="bg-white p-2 rounded border border-slate-200/80">
              <div className="text-xs font-bold font-mono text-slate-900">{entity.metrics.pageRank.toFixed(2)}</div>
              <div className="text-[10px] text-slate-400">PageRank</div>
            </div>
          </div>
        </div>

        {/* Cross-Source Correlation Signals (Section 21) */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            CROSS-SOURCE CORRELATION
          </span>
          <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2 text-xs text-slate-700">
            {entity.telecom && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>Telecom CDRs:</span>
                </span>
                <span className="font-mono font-semibold">{entity.telecom.callCount || 14} calls logged</span>
              </div>
            )}
            {entity.financial && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500 flex items-center space-x-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Financial Volume:</span>
                </span>
                <span className="font-mono font-semibold text-emerald-700">
                  ₹{(entity.financial.inflow || 1850000).toLocaleString('en-IN')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>Community Cluster:</span>
              </span>
              <span className="font-medium">{entity.communityName}</span>
            </div>
          </div>
        </div>

        {/* Supporting Evidence Traceability (Section 20 & 37) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              PRIMARY EVIDENCE RECORDS ({linkedEvidence.length})
            </span>
          </div>

          <div className="space-y-2">
            {linkedEvidence.map(ev => (
              <div
                key={ev.id}
                className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-slate-900">{ev.recordId}</span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">{ev.sourceType}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug line-clamp-2">
                  "{ev.content}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct Actions */}
        {onTracePathToEntity && entity.id !== 'ent-vicky' && (
          <div className="pt-2">
            <button
              onClick={() => onTracePathToEntity(entity.id)}
              className="w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-semibold text-blue-700 transition-colors flex items-center justify-center space-x-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Trace Shortest Path from Coordinator</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

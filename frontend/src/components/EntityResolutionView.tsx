'use client';

import React, { useState } from 'react';
import { 
  GitMerge, 
  Check, 
  X, 
  AlertCircle, 
  Eye, 
  Shield, 
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { EntityMatch, Entity } from '../types/intelligence';

interface EntityResolutionViewProps {
  matches: EntityMatch[];
  entities: Entity[];
  onLinkEntities: (matchId: string, primaryId: string, candidateId: string) => void;
  onIgnoreMatch: (matchId: string) => void;
  onViewEntityInNetwork: (entityId: string) => void;
}

export const EntityResolutionView: React.FC<EntityResolutionViewProps> = ({
  matches,
  entities,
  onLinkEntities,
  onIgnoreMatch,
  onViewEntityInNetwork,
}) => {
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(matches[0]?.id || null);

  const activeMatches = matches.filter(m => m.status === 'pending');
  const linkedMatches = matches.filter(m => m.status === 'linked');

  const selectedMatch = matches.find(m => m.id === selectedMatchId) || matches[0];
  const primaryEntity = entities.find(e => e.id === selectedMatch?.primaryEntityId);
  const candidateEntity = entities.find(e => e.id === selectedMatch?.candidateEntityId);

  return (
    <div className="h-full w-full flex flex-col bg-[#F8FAFC] overflow-hidden select-none">
      {/* View Header */}
      <div className="h-14 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <GitMerge className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Entity Resolution & Identity Matching</h1>
            <p className="text-xs text-slate-500">Compare potential entity aliases and merge verified duplicate records</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-md font-semibold">
            {activeMatches.length} Pending Review
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md font-semibold">
            {linkedMatches.length} Linked
          </span>
        </div>
      </div>

      {/* Main Content: Split Master-Detail */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* Left Column: Match Candidates List */}
        <div className="w-96 border-r border-slate-200 bg-white flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              POTENTIAL ENTITY MATCHES ({activeMatches.length})
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {matches.map(m => {
              const p = entities.find(e => e.id === m.primaryEntityId);
              const c = entities.find(e => e.id === m.candidateEntityId);
              const isSelected = m.id === selectedMatch?.id;

              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMatchId(m.id)}
                  className={`p-3.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/70 border-l-4 border-blue-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold font-mono px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                      {m.status === 'linked' ? 'LINKED' : m.status === 'ignored' ? 'IGNORED' : 'PENDING'}
                    </span>
                    <span className="text-xs font-bold text-blue-600 font-mono">
                      {m.overallConfidence}% Match
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 truncate">
                    {p?.name || 'Primary Entity'}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center space-x-1 mt-0.5">
                    <span>vs.</span>
                    <span className="font-medium text-slate-700 truncate">{c?.name || 'Candidate Entity'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: In-Depth Comparison & Resolution Controls */}
        {selectedMatch && primaryEntity && candidateEntity ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Resolution Header Notice */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100/70 text-blue-600 flex items-center justify-center font-bold text-base">
                  {selectedMatch.overallConfidence}%
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Potential Match Identified</h3>
                  <p className="text-xs text-slate-500">
                    High cross-dataset similarity detected across communication, location, and registration records.
                  </p>
                </div>
              </div>

              {selectedMatch.status === 'pending' ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onIgnoreMatch(selectedMatch.id)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    <span>Ignore</span>
                  </button>
                  <button
                    onClick={() => onLinkEntities(selectedMatch.id, selectedMatch.primaryEntityId, selectedMatch.candidateEntityId)}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Link Entities</span>
                  </button>
                </div>
              ) : (
                <span className="px-3 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedMatch.status === 'linked' ? '✓ Entities Merged' : 'Ignored by Investigator'}
                </span>
              )}
            </div>

            {/* Side-by-Side Entity Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Primary Card */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                    PRIMARY ENTITY
                  </span>
                  <button
                    onClick={() => onViewEntityInNetwork(primaryEntity.id)}
                    className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in Network</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{primaryEntity.name}</h4>
                    <span className="text-xs text-slate-500 capitalize">{primaryEntity.type} • {primaryEntity.role}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div><strong>Aliases:</strong> {primaryEntity.aliases.join(', ') || 'None'}</div>
                    <div><strong>Community:</strong> {primaryEntity.communityName}</div>
                    <div><strong>First Observed:</strong> {primaryEntity.firstSeen}</div>
                  </div>
                </div>
              </div>

              {/* Candidate Card */}
              <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                    CANDIDATE ALIAS
                  </span>
                  <button
                    onClick={() => onViewEntityInNetwork(candidateEntity.id)}
                    className="text-xs text-blue-600 hover:underline flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in Network</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{candidateEntity.name}</h4>
                    <span className="text-xs text-slate-500 capitalize">{candidateEntity.type} • {candidateEntity.role}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div><strong>Aliases:</strong> {candidateEntity.aliases.join(', ') || 'None'}</div>
                    <div><strong>Community:</strong> {candidateEntity.communityName}</div>
                    <div><strong>First Observed:</strong> {candidateEntity.firstSeen}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similarity Signal Breakdown (Section 15 Specification) */}
            <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                SIMILARITY SIGNAL BREAKDOWN
              </h4>

              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Name Similarity', value: selectedMatch.nameSimilarity },
                  { label: 'Phone Association', value: selectedMatch.phoneAssociation },
                  { label: 'Location Overlap', value: selectedMatch.locationOverlap },
                  { label: 'Context Similarity', value: selectedMatch.contextSimilarity },
                ].map((sig, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-slate-600">{sig.label}</span>
                      <span className="text-xs font-bold font-mono text-slate-900">{sig.value}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${sig.value}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Shared Corroborating Signals */}
              <div className="pt-3 border-t border-slate-100">
                <h5 className="text-xs font-semibold text-slate-700 mb-2">Corroborating Evidence Signals:</h5>
                <ul className="space-y-1.5">
                  {selectedMatch.sharedSignals.map((signal, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
            No match selected
          </div>
        )}
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  PhoneCall, 
  Landmark, 
  ShieldCheck, 
  MapPin,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Evidence, EvidenceSourceType, Entity } from '../types/intelligence';

interface EvidenceViewProps {
  evidenceCatalog: Evidence[];
  entities: Entity[];
  onViewInNetwork: (entityIds: string[]) => void;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidenceCatalog,
  entities,
  onViewInNetwork,
}) => {
  const [selectedSourceType, setSelectedSourceType] = useState<EvidenceSourceType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvidence = evidenceCatalog.filter(ev => {
    if (selectedSourceType !== 'ALL' && ev.sourceType !== selectedSourceType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.recordId.toLowerCase().includes(q) ||
      ev.sourceName.toLowerCase().includes(q) ||
      ev.content.toLowerCase().includes(q) ||
      (ev.location && ev.location.toLowerCase().includes(q))
    );
  });

  const getSourceIcon = (type: EvidenceSourceType) => {
    switch (type) {
      case 'FIR': return FileText;
      case 'CDR': return PhoneCall;
      case 'FINANCIAL': return Landmark;
      case 'INTEL': return ShieldCheck;
      case 'LOCATION': return MapPin;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#F8FAFC] overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Evidence & Source Records Vault</h1>
            <p className="text-xs text-slate-500">Trace analytical findings back to primary CDR intercepts, bank statements, and case diaries</p>
          </div>
        </div>

        {/* Source Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          {(['ALL', 'FIR', 'CDR', 'FINANCIAL', 'INTEL'] as const).map(t => (
            <button
              key={t}
              onClick={() => setSelectedSourceType(t)}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                selectedSourceType === t
                  ? 'bg-white text-blue-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t === 'ALL' ? 'All Sources' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar */}
      <div className="px-6 py-3 border-b border-slate-200 bg-white/60 flex items-center justify-between">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Record ID, keywords, location..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredEvidence.length} of {evidenceCatalog.length} records
        </span>
      </div>

      {/* Evidence List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredEvidence.map(ev => {
          const Icon = getSourceIcon(ev.sourceType);
          const linkedEntities = entities.filter(e => ev.entities.includes(e.id));

          return (
            <div
              key={ev.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all space-y-3"
            >
              {/* Record Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{ev.recordId}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold uppercase">
                        {ev.sourceType}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{ev.sourceName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{ev.timestamp}</span>
                  </div>
                  <span className="text-xs font-semibold font-mono text-emerald-600 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{Math.round(ev.confidence * 100)}%</span>
                  </span>
                  <button
                    onClick={() => onViewInNetwork(ev.entities)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in Network</span>
                  </button>
                </div>
              </div>

              {/* Record Text Content Snippet */}
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-700 leading-relaxed">
                "{ev.content}"
              </div>

              {/* Linked Entities Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  CORRELATED ENTITIES:
                </span>
                {linkedEntities.map(ent => (
                  <span
                    key={ent.id}
                    className="px-2 py-0.5 text-xs bg-white border border-slate-200 rounded-md text-slate-700 font-medium shadow-2xs"
                  >
                    {ent.name} <span className="text-[10px] text-slate-400 uppercase">({ent.type})</span>
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

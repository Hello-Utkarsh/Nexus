'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  PhoneCall, 
  Landmark, 
  Share2, 
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { Relationship, Entity, Evidence } from '../types/intelligence';

interface EdgeEvidencePopoverProps {
  relationship: Relationship | null;
  entities: Entity[];
  evidenceCatalog: Evidence[];
  onClose: () => void;
}

export const EdgeEvidencePopover: React.FC<EdgeEvidencePopoverProps> = ({
  relationship,
  entities,
  evidenceCatalog,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!relationship) return null;

  const sourceEntity = entities.find(e => e.id === relationship.sourceId);
  const targetEntity = entities.find(e => e.id === relationship.targetId);
  const linkedEvidence = evidenceCatalog.filter(ev => relationship.sourceIds.includes(ev.id));

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const getRelIcon = () => {
    switch (relationship.type) {
      case 'financial': return Landmark;
      case 'communication': return PhoneCall;
      default: return Share2;
    }
  };

  const RelIcon = getRelIcon();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="h-11 px-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <RelIcon className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              RELATIONSHIP FORENSICS
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Source ➔ Target Card */}
          <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-slate-900 font-bold">
              <span className="truncate max-w-[170px]">{sourceEntity?.name || 'Source'}</span>
              <span className="text-blue-500 font-normal px-2">➔</span>
              <span className="truncate max-w-[170px] text-right">{targetEntity?.name || 'Target'}</span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
              <span className="capitalize">{relationship.type} Link</span>
              <span className="font-semibold text-slate-700">{relationship.label}</span>
            </div>
          </div>

          {/* Relationship Metrics */}
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                CONFIDENCE SCORE
              </span>
              <span className="text-sm font-bold font-mono text-emerald-600">
                {Math.round(relationship.confidence * 100)}%
              </span>
            </div>
            <div className="p-2.5 bg-white border border-slate-200 rounded-lg">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                DATE OBSERVED
              </span>
              <span className="text-sm font-bold font-mono text-slate-800">
                {relationship.timestamp}
              </span>
            </div>
          </div>

          {/* Detailed Metadata (Financial UTR or CDR Call Count) */}
          {relationship.metadata && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5 text-slate-600">
              {relationship.metadata.amount && (
                <div className="flex items-center justify-between">
                  <span>Transaction Volume:</span>
                  <strong className="text-emerald-700 font-mono">
                    ₹{relationship.metadata.amount.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
              {relationship.metadata.utrNumber && (
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span>UTR Reference:</span>
                  <div className="flex items-center space-x-1 font-bold text-slate-800">
                    <span>{relationship.metadata.utrNumber}</span>
                    <button
                      onClick={() => copyToClipboard(relationship.metadata!.utrNumber!, 'utr')}
                      className="p-1 hover:bg-slate-200 rounded"
                      title="Copy UTR"
                    >
                      {copiedKey === 'utr' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                    </button>
                  </div>
                </div>
              )}
              {relationship.metadata.callCount && (
                <div className="flex items-center justify-between">
                  <span>Logged Intercepts:</span>
                  <strong className="text-blue-600 font-mono">{relationship.metadata.callCount} calls</strong>
                </div>
              )}
              {relationship.metadata.notes && (
                <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/80">
                  {relationship.metadata.notes}
                </div>
              )}
            </div>
          )}

          {/* Supporting Evidence Records (Section 20) */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              SUPPORTING EVIDENCE ({linkedEvidence.length})
            </span>
            <div className="space-y-1.5">
              {linkedEvidence.map(ev => (
                <div
                  key={ev.id}
                  className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between shadow-2xs"
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                    <span className="font-mono text-xs font-semibold text-slate-800 truncate">
                      {ev.recordId}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {ev.sourceType}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  FileText, 
  Landmark, 
  PhoneCall, 
  Radio, 
  ShieldAlert, 
  Lock,
  ExternalLink
} from 'lucide-react';
import { SyndicateEdge, SyndicateNode } from '../types/syndicate';

interface EdgeEvidencePopoverProps {
  edge: SyndicateEdge | null;
  nodes: SyndicateNode[];
  onClose: () => void;
}

export const EdgeEvidencePopover: React.FC<EdgeEvidencePopoverProps> = ({
  edge,
  nodes,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!edge) return null;

  const sourceNode = nodes.find(n => n.id === edge.source);
  const targetNode = nodes.find(n => n.id === edge.target);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isFinancial = edge.type === 'financial';
  const isTelecom = edge.type === 'telecom';
  const isTelemetry = edge.type === 'telemetry';
  const isConspiracy = edge.type === 'conspiracy';

  const utrNumber = `AXIS${edge.timestamp.replace(/-/g, '')}${Math.abs(parseInt(edge.id.slice(-3), 10) || 8812)}`;
  const interceptLogId = edge.interceptEvidenceId || `WT-LOG-${Math.abs(parseInt(edge.id.slice(-2), 10) || 402)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs p-4 select-none font-mono">
      <div className="relative w-full max-w-md bg-white dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden text-xs">
        {/* Header */}
        <div className="h-10 px-3 bg-slate-50 dark:bg-[#0F1626] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isFinancial ? (
              <Landmark className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            ) : isTelecom ? (
              <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : isTelemetry ? (
              <Radio className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            )}
            <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
              {isFinancial ? 'TRANSACTION AUDIT' : isTelecom ? 'INTERCEPT LOG AUDIT' : isTelemetry ? 'CELL LATCH TELEMETRY' : 'CRIMINAL CONSPIRACY AUDIT'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3 bg-white dark:bg-[#0A0F1D]">
          {/* Edge Connection Summary */}
          <div className="bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
            <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Relational Vector:</div>
            <div className="flex items-center justify-between text-[11px] text-slate-800 dark:text-slate-200">
              <span className="text-blue-700 dark:text-blue-400 font-bold truncate max-w-[180px]">{sourceNode?.name || edge.source}</span>
              <span className="text-slate-400 font-mono">&rarr;</span>
              <span className="text-amber-800 dark:text-amber-400 font-bold truncate max-w-[180px]">{targetNode?.name || edge.target}</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
              Type: <span className="uppercase text-slate-800 dark:text-slate-200 font-bold">{edge.type}</span> | Corroboration: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{Math.round(edge.confidence * 100)}%</span>
            </div>
          </div>

          {/* Specific Forensic Artifacts */}
          {isFinancial && (
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 font-bold">UTR / TRANSACTION AUDIT</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 rounded font-bold">
                  FLAGGED PMLA / BNS 111
                </span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">UTR Reference:</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-slate-900 dark:text-slate-100 font-bold">{utrNumber}</span>
                    <button onClick={() => copyToClipboard(utrNumber)} className="hover:text-blue-600 text-slate-400">
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Transfer Amount:</span>
                  <span className="text-emerald-800 dark:text-emerald-400 font-bold text-xs">
                    {edge.amount ? `₹${(edge.amount / 100000).toFixed(1)} Lakhs (${edge.amount.toLocaleString('en-IN')})` : '₹8,50,000'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Remitter &rarr; Beneficiary:</span>
                  <span className="text-slate-800 dark:text-slate-200">{sourceNode?.name?.slice(0, 15)} &rarr; {targetNode?.name?.slice(0, 15)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Timestamp:</span>
                  <span className="text-slate-800 dark:text-slate-200">{edge.timestamp} 14:18:22 IST</span>
                </div>
              </div>
            </div>
          )}

          {isTelecom && (
            <div className="bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/60 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-sky-800 dark:text-sky-300 font-bold">CDR INTERCEPT LOG</span>
                <span className="text-[10px] text-slate-600 dark:text-slate-400">{interceptLogId}</span>
              </div>
              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Call Count / Frequency:</span>
                  <span className="text-sky-800 dark:text-sky-300 font-bold">{edge.callCount || 42} Intercepted Calls</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Duration / BTS Tower:</span>
                  <span className="text-slate-800 dark:text-slate-200">184s | UP-EAST-VNS-71</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Intercept Date:</span>
                  <span className="text-slate-800 dark:text-slate-200">{edge.timestamp} 02:14 AM</span>
                </div>
              </div>
              <div className="bg-white dark:bg-[#0F1626] p-2 rounded border border-slate-200 dark:border-slate-800 text-[10px] italic text-slate-700 dark:text-slate-300 border-l-2 border-sky-500 shadow-2xs">
                &ldquo;Kashi delivery confirmed. Route courier through Cantt station bypass. 50 peti payment ready.&rdquo;
              </div>
            </div>
          )}

          {isTelemetry && (
            <div className="bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-800 dark:text-purple-300 font-bold">TELEMETRY CELL LATCH #TEL-881</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold">AZIMUTH 142° SE</span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-800 dark:text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Device Hardware:</span>
                  <span className="text-purple-800 dark:text-purple-300 font-bold">{sourceNode?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Serving Cell Tower:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{targetNode?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Latching Window:</span>
                  <span className="text-rose-700 dark:text-rose-400 font-bold">01:45 AM - 03:30 AM (Midnight Burst)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Signal Strength:</span>
                  <span className="text-slate-800 dark:text-slate-200">-74 dBm (High Confidence Latch)</span>
                </div>
              </div>
            </div>
          )}

          {isConspiracy && (
            <div className="bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-rose-800 dark:text-rose-300 font-bold">CONSPIRACY DIRECTIVE #CON-902</span>
                <span className="text-[10px] px-1.5 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-900/60 rounded font-bold">
                  BNS SEC 111 & 61(2)
                </span>
              </div>
              <div className="space-y-1 text-[11px] text-slate-800 dark:text-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Directive Source:</span>
                  <span className="text-rose-800 dark:text-rose-300 font-bold">{sourceNode?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Target Assignee:</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">{targetNode?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Summary:</span>
                  <span className="text-slate-700 dark:text-slate-300">{edge.label}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end space-x-2 pt-1">
            <button
              onClick={() => copyToClipboard(isFinancial ? utrNumber : interceptLogId)}
              className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md flex items-center space-x-1 transition-colors text-[11px] shadow-2xs"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Evidence ID'}</span>
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-md font-semibold text-[11px] shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

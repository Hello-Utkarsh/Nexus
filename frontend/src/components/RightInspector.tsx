'use client';

import React, { useState } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ShieldAlert, 
  PhoneCall, 
  Landmark, 
  FileCheck2, 
  Copy, 
  Check, 
  UserCheck, 
  PlaneTakeoff, 
  Compass
} from 'lucide-react';
import { SyndicateNode } from '../types/syndicate';
import { BtsTowerRadar } from './BtsTowerRadar';

interface RightInspectorProps {
  node: SyndicateNode | null;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onMarkPrimeAccused: (nodeId: string) => void;
  onToggleLOC: (nodeId: string) => void;
  onTraceHawala: (nodeId: string) => void;
}

export const RightInspector: React.FC<RightInspectorProps> = ({
  node,
  isCollapsed,
  onToggleCollapse,
  onMarkPrimeAccused,
  onToggleLOC,
  onTraceHawala,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'telecom' | 'financial' | 'evidence'>('telecom');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  if (isCollapsed) {
    return (
      <aside className="w-10 flex-shrink-0 border-l border-slate-200 dark:border-slate-800/80 overflow-y-auto bg-white dark:bg-[#0A0F1D] flex flex-col items-center py-3 select-none z-20 transition-colors duration-100 ease-linear">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-[#0F1626] dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-800 rounded-md text-slate-700 dark:text-slate-300 mb-4 transition-colors duration-100 ease-linear"
          title="Expand Suspect Dossier"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="writing-mode-vertical text-[11px] font-mono tracking-widest text-slate-500 dark:text-slate-400 rotate-180 uppercase flex items-center space-x-2">
          <span>SUSPECT DOSSIER // FORENSICS</span>
        </div>
      </aside>
    );
  }

  if (!node) {
    return (
      <aside className="w-[380px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800/80 overflow-y-auto bg-white dark:bg-[#0A0F1D] flex flex-col p-6 items-center justify-center text-center select-none z-20 text-slate-500 dark:text-slate-400 font-mono transition-colors duration-100 ease-linear">
        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 flex items-center justify-center mb-3">
          <ShieldAlert className="w-6 h-6 text-slate-400" />
        </div>
        <div className="text-sm text-slate-800 dark:text-slate-200 font-bold mb-1">NO TARGET SELECTED</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Select any entity node from the canvas or search palette to inspect full telecom CDR, financial trails, and BNS charge audits.
        </div>
      </aside>
    );
  }

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <aside className="w-[380px] flex-shrink-0 border-l border-slate-200 dark:border-slate-800/80 overflow-y-auto bg-white dark:bg-[#0A0F1D] flex flex-col select-none z-20 transition-colors duration-100 ease-linear">
      {/* Top Header: Collapse Toggle & Dossier Reference */}
      <div className="h-10 px-3 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1626] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleCollapse}
            className="p-1 hover:bg-slate-100 dark:hover:bg-[#141D30] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition-colors duration-100 ease-linear"
            title="Collapse Inspector"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="text-slate-600 dark:text-slate-400 font-semibold tracking-wider">DOSSIER REF:</span>
          <span className="text-blue-700 dark:text-cyan-400 font-bold">{node.evidence.evidenceTag}</span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
          node.status === 'WANTED' ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300' :
          node.status === 'DETAINED' ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300' :
          'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
        }`}>
          {node.status}
        </span>
      </div>

      {/* Main Suspect Card Header */}
      <div className="p-3.5 bg-slate-50/50 dark:bg-[#0F1626]/80 border-b border-slate-200 dark:border-slate-800/80 space-y-3">
        <div className="flex items-start space-x-3">
          {/* Biometric High-Contrast Silhouette */}
          <div className="relative w-14 h-14 rounded-lg bg-white dark:bg-[#0A0F1D] border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
            <div className="text-2xl">
              {node.role === 'kingpin' ? '👤' :
               node.role === 'mule' ? '💼' :
               node.role === 'telecom' ? '📡' :
               node.role === 'shell' ? '🏢' :
               node.role === 'enforcer' ? '🎯' : '🛡'}
            </div>
            {node.isPrimeAccused && (
              <span className="absolute bottom-0 inset-x-0 bg-rose-600 text-[8px] font-mono text-white text-center font-bold">
                PRIME
              </span>
            )}
          </div>

          {/* Name & Street Aliases */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 font-mono truncate leading-snug">
                {node.name}
              </h2>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
              Aliases: <span className="text-slate-800 dark:text-slate-200">{node.aliases.join(', ')}</span>
            </div>
            <div className="text-[11px] text-amber-800 dark:text-amber-400 font-mono truncate mt-0.5 font-medium">
              {node.rank}
            </div>

            {/* Badges: LOC Flagged, Prime Accused */}
            <div className="flex items-center space-x-1.5 mt-2">
              {node.flaggedForLoc && (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold">
                  <PlaneTakeoff className="w-2.5 h-2.5 text-rose-600 dark:text-rose-400" />
                  <span>LOC ACTIVE</span>
                </span>
              )}
              {node.isPrimeAccused && (
                <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 font-bold">
                  <ShieldAlert className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400" />
                  <span>SEC 111 BNS</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Threat Metrics Radar Cards */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center font-mono">
          <div className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-800 p-1.5 rounded-md shadow-2xs">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">RISK</span>
            <span className={`text-xs font-bold ${node.riskScore > 85 ? 'text-rose-600 dark:text-rose-400' : 'text-amber-700 dark:text-amber-400'}`}>
              {node.riskScore}/100
            </span>
          </div>
          <div className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-800 p-1.5 rounded-md shadow-2xs">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">BETWEEN</span>
            <span className="text-xs font-bold text-blue-700 dark:text-cyan-400">
              {node.betweennessCentrality.toFixed(2)}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-800 p-1.5 rounded-md shadow-2xs">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">IN/OUT</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {node.inDegree}/{node.outDegree}
            </span>
          </div>
          <div className="bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-800 p-1.5 rounded-md shadow-2xs">
            <span className="text-[9px] text-slate-400 dark:text-slate-500 block">PAGERANK</span>
            <span className="text-xs font-bold text-indigo-700 dark:text-purple-400">
              {node.pageRank.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Forensic Evidence Sub-tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1626] font-mono text-xs">
        <button
          onClick={() => setActiveSubTab('telecom')}
          className={`flex-1 py-2 px-2 flex items-center justify-center space-x-1 transition-colors duration-100 ease-linear ${
            activeSubTab === 'telecom'
              ? 'bg-white dark:bg-[#0A0F1D] text-blue-700 dark:text-cyan-400 border-b-2 border-blue-600 dark:border-cyan-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Telecom</span>
        </button>
        <button
          onClick={() => setActiveSubTab('financial')}
          className={`flex-1 py-2 px-2 flex items-center justify-center space-x-1 transition-colors duration-100 ease-linear ${
            activeSubTab === 'financial'
              ? 'bg-white dark:bg-[#0A0F1D] text-amber-700 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Landmark className="w-3.5 h-3.5" />
          <span>Financial</span>
        </button>
        <button
          onClick={() => setActiveSubTab('evidence')}
          className={`flex-1 py-2 px-2 flex items-center justify-center space-x-1 transition-colors duration-100 ease-linear ${
            activeSubTab === 'evidence'
              ? 'bg-white dark:bg-[#0A0F1D] text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Legal/BNS</span>
        </button>
      </div>

      {/* Sub-tab Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs font-mono">
        {activeSubTab === 'telecom' && (
          <div className="space-y-2.5">
            {/* Primary IMEI */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[10px]">
                <span>PRIMARY IMEI / MEID:</span>
                <button
                  onClick={() => copyToClipboard(node.telecom.primaryImei, 'imei')}
                  className="hover:text-blue-600 dark:hover:text-cyan-400 text-slate-400"
                >
                  {copiedKey === 'imei' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-slate-900 dark:text-slate-100 font-mono text-xs font-bold tracking-wide">
                {node.telecom.primaryImei}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                IMSI: <span className="text-slate-800 dark:text-slate-200">{node.telecom.imsi}</span> | Carrier: <span className="text-blue-700 dark:text-cyan-400 font-medium">{node.telecom.carrier}</span>
              </div>
            </div>

            {/* Mini Geospatial BTS Tower Radar Component */}
            <BtsTowerRadar
              towerId={node.telecom.activeTowerId}
              towerName={node.telecom.towerLocation}
              coordinates={node.telecom.coordinates || { lat: 25.2985, lng: 82.9975 }}
              cellId={node.telecom.cellId || '404-45-71'}
              azimuth={node.telecom.azimuth || '142° SE'}
              burstWindow="01:45 AM - 03:30 AM"
            />

            {/* Linked Burner MSISDNs */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1.5">
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[10px]">
                <span>LINKED BURNER MSISDNs ({node.telecom.linkedMsisdns.length}):</span>
                <span className="text-amber-700 dark:text-amber-400 font-semibold">CDR Count: {node.telecom.cdrInterceptCount}</span>
              </div>
              <div className="space-y-1">
                {node.telecom.linkedMsisdns.map((num, i) => (
                  <div key={i} className="flex justify-between items-center bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 p-1.5 rounded-md text-[11px] text-slate-800 dark:text-slate-200 shadow-2xs">
                    <span>{num}</span>
                    <button
                      onClick={() => copyToClipboard(num, `sim-${i}`)}
                      className="hover:text-blue-600 dark:hover:text-cyan-400 text-slate-400"
                    >
                      {copiedKey === `sim-${i}` ? <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Intercept Audio Transcript Snippet */}
            {node.telecom.interceptSnippet && (
              <div className="bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-2.5 rounded-lg space-y-1">
                <div className="flex items-center justify-between text-[10px] text-rose-700 dark:text-rose-400 font-bold">
                  <span>LAST CDR AUDIO INTERCEPT:</span>
                  <span>{node.telecom.lastInterceptTimestamp}</span>
                </div>
                <div className="text-[11px] text-slate-800 dark:text-slate-200 italic font-sans border-l-2 border-rose-500 pl-2 mt-1">
                  &quot;{node.telecom.interceptSnippet}&quot;
                </div>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'financial' && (
          <div className="space-y-2.5">
            {/* Primary Mule Account */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-[10px]">
                <span>BANK ACCOUNT / CONDUIT:</span>
                <button
                  onClick={() => copyToClipboard(node.financial.accountNumber, 'acct')}
                  className="hover:text-amber-600 dark:hover:text-amber-400 text-slate-400"
                >
                  {copiedKey === 'acct' ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-amber-800 dark:text-amber-400 font-bold text-xs">
                A/C #{node.financial.accountNumber}
              </div>
              <div className="text-[11px] text-slate-800 dark:text-slate-200">
                {node.financial.bankName}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                IFSC: <span className="text-slate-800 dark:text-slate-200 font-medium">{node.financial.ifsc}</span> | Holder: <span className="text-slate-800 dark:text-slate-200">{node.financial.accountHolder}</span>
              </div>
            </div>

            {/* Inflow & Outflow Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 p-2 rounded-md">
                <span className="text-[9px] text-emerald-700 dark:text-emerald-400 block font-semibold">TOTAL INFLOW:</span>
                <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  {formatINR(node.financial.totalInflow)}
                </span>
              </div>
              <div className="bg-rose-50/60 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 p-2 rounded-md">
                <span className="text-[9px] text-rose-700 dark:text-rose-400 block font-semibold">TOTAL OUTFLOW:</span>
                <span className="text-xs font-bold text-rose-900 dark:text-rose-200">
                  {formatINR(node.financial.totalOutflow)}
                </span>
              </div>
            </div>

            {/* Hawala Source / Clearing */}
            {node.financial.hawalaSource && (
              <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">HAWALA CLEARING DESK:</div>
                <div className="text-xs text-amber-800 dark:text-amber-400 font-semibold">
                  {node.financial.hawalaSource}
                </div>
              </div>
            )}

            {/* UPI Identifier */}
            {node.financial.upiId && (
              <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2 rounded-lg flex justify-between items-center text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">VPA / UPI ID:</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold">{node.financial.upiId}</span>
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'evidence' && (
          <div className="space-y-2.5">
            {/* FIR Reference & Evidence Tag */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">CASE RECORD:</div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {node.evidence.firReference}
              </div>
              <div className="text-[10px] text-blue-700 dark:text-cyan-400">
                Tag: {node.evidence.evidenceTag} | Wiretap: {node.evidence.wiretapLogId}
              </div>
            </div>

            {/* Recommended BNS (Bharatiya Nyaya Sanhita) Sections */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1.5">
              <div className="text-[10px] text-slate-700 dark:text-slate-300 font-bold">APPLICABLE BNS SECTIONS:</div>
              <div className="space-y-1">
                {node.evidence.bnsSections.map((sec, i) => (
                  <div key={i} className="px-2 py-1 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 rounded-md text-[11px] font-bold">
                    {sec}
                  </div>
                ))}
              </div>
            </div>

            {/* IPC Equivalent (Legacy Mapping) */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2 rounded-lg space-y-1">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">LEGACY IPC CONCORDANCE:</div>
              <div className="text-[10px] text-slate-700 dark:text-slate-300">
                {node.evidence.ipcEquivalent.join(' | ')}
              </div>
            </div>

            {/* Confession statement excerpt */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 dark:text-slate-400">CORROBORATED DISCLOSURE:</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold">{node.evidence.confidenceScore}% Validated</span>
              </div>
              <div className="text-[11px] text-slate-700 dark:text-slate-300 font-sans leading-relaxed pt-1">
                {node.evidence.confessionExcerpt}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Operational Action Toolbar at bottom */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1626] space-y-2">
        <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-1">
          Tactical Command Actions
        </div>
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          <button
            onClick={() => onMarkPrimeAccused(node.id)}
            className={`py-1.5 px-2 rounded-md font-semibold transition-colors duration-100 ease-linear flex items-center justify-center space-x-1 shadow-2xs ${
              node.isPrimeAccused
                ? 'bg-amber-600 text-white'
                : 'bg-white dark:bg-[#0A0F1D] hover:bg-slate-100 dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-700 text-amber-800 dark:text-amber-400'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span className="truncate">{node.isPrimeAccused ? 'Prime Accused ✓' : 'Mark Prime'}</span>
          </button>

          <button
            onClick={() => onToggleLOC(node.id)}
            className={`py-1.5 px-2 rounded-md font-semibold transition-colors duration-100 ease-linear flex items-center justify-center space-x-1 shadow-2xs ${
              node.flaggedForLoc
                ? 'bg-rose-600 text-white'
                : 'bg-white dark:bg-[#0A0F1D] hover:bg-slate-100 dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-700 text-rose-800 dark:text-rose-400'
            }`}
          >
            <PlaneTakeoff className="w-3.5 h-3.5" />
            <span className="truncate">{node.flaggedForLoc ? 'LOC Flagged ✓' : 'Flag for LOC'}</span>
          </button>
        </div>

        <button
          onClick={() => onTraceHawala(node.id)}
          className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-mono font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-colors duration-100 ease-linear shadow-2xs"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Trace Hawala Settlement Flow</span>
        </button>
      </div>
    </aside>
  );
};

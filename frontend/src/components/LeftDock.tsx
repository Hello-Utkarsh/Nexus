'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Filter, 
  Sparkles, 
  Shield, 
  Sliders, 
  Waypoints, 
  Target, 
  CheckSquare, 
  Square, 
  PlusCircle, 
  Layers,
  Crosshair
} from 'lucide-react';
import { EntityRole, SyndicateNode, SyndicateEdge, ExtractedEntity } from '../types/syndicate';

interface LeftDockProps {
  nodes: SyndicateNode[];
  edges: SyndicateEdge[];
  selectedRoles: Set<EntityRole>;
  onToggleRole: (role: EntityRole) => void;
  betweennessThreshold: number;
  onChangeBetweenness: (val: number) => void;
  confidenceThreshold: number;
  onChangeConfidence: (val: number) => void;
  isKingpinIsolated: boolean;
  onToggleIsolateKingpin: () => void;
  onCalculateShortestPath: (sourceId: string, targetId: string) => void;
  shortestPathResult: {
    pathNodeIds: string[];
    totalAmount: number;
    hopCount: number;
  } | null;
  onResetShortestPath: () => void;
  onInjectExtractedEntity: (entity: ExtractedEntity) => void;
  activeTab: 'filters' | 'ingestion';
  onChangeTab: (tab: 'filters' | 'ingestion') => void;
  showLouvainCommunities: boolean;
  onToggleLouvainCommunities: () => void;
  onSyncNlpEntities?: (nodeIds: string[], focusNodeId: string) => void;
}

const DEFAULT_NLP_INTERCEPT =
  "CONFIDENTIAL INTERCEPT / FIR #382/2026: Source confirms Vikramaditya @ Vicky Kashi coordinated hawala payout of ₹18,50,000 to Axis Bank A/C 9182 held by Rahul Sharma. Multiple burner calls logged via BTS-UP-VNS-71 (Assi Ghat) to Dubai desk.";

export const LeftDock: React.FC<LeftDockProps> = ({
  nodes,
  edges,
  selectedRoles,
  onToggleRole,
  betweennessThreshold,
  onChangeBetweenness,
  confidenceThreshold,
  onChangeConfidence,
  isKingpinIsolated,
  onToggleIsolateKingpin,
  onCalculateShortestPath,
  shortestPathResult,
  onResetShortestPath,
  onInjectExtractedEntity,
  activeTab,
  onChangeTab,
  showLouvainCommunities,
  onToggleLouvainCommunities,
  onSyncNlpEntities,
}) => {
  // Ingestion tab state
  const [evidenceText, setEvidenceText] = useState(DEFAULT_NLP_INTERCEPT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasExtractedPills, setHasExtractedPills] = useState(true);
  const [isSyncedWithCanvas, setIsSyncedWithCanvas] = useState(false);
  const [extractedEntities, setExtractedEntities] = useState<ExtractedEntity[]>([
    { id: 'ext-1', type: 'PERSON', value: 'Vikramaditya @ Vicky Kashi', confidence: 0.98, context: 'Remote Syndicate Controller (Dubai/Nepal)' },
    { id: 'ext-2', type: 'BANK', value: 'Axis Bank A/C #91828400192', confidence: 0.96, context: 'Purvanchal Traders Layering Account' },
    { id: 'ext-3', type: 'SIM', value: '+91-98110-23910 (Fake Assam KYC)', confidence: 0.94, context: 'Cantt Station pre-activated burner' },
    { id: 'ext-4', type: 'LOCATION', value: 'Lanka Crossing & Godowlia, Varanasi', confidence: 0.99, context: 'Extortion and Arms Handover Zone' },
    { id: 'ext-5', type: 'COMPANY', value: 'M/s Purvanchal Agro Commodities Pvt Ltd', confidence: 0.92, context: 'Burrabazar Kolkata Shell Corp' },
  ]);

  // Shortest Path state
  const [pathSource, setPathSource] = useState('node-tariq'); // Tariq Dubai Desk
  const [pathTarget, setPathTarget] = useState('node-rahul-mule'); // Rahul Mule Sharma

  // Role counters
  const roleCounts: Record<EntityRole, number> = {
    kingpin: nodes.filter(n => n.role === 'kingpin').length,
    mule: nodes.filter(n => n.role === 'mule').length,
    telecom: nodes.filter(n => n.role === 'telecom').length,
    shell: nodes.filter(n => n.role === 'shell').length,
    enforcer: nodes.filter(n => n.role === 'enforcer').length,
    victim: nodes.filter(n => n.role === 'victim').length,
  };

  const handleRunNER = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setHasExtractedPills(true);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleSyncEntities = () => {
    setIsSyncedWithCanvas(true);
    if (onSyncNlpEntities) {
      onSyncNlpEntities(['node-vicky', 'node-rahul-mule', 'node-bts-1'], 'node-vicky');
    }
  };

  return (
    <aside className="w-[320px] flex-shrink-0 border-r border-slate-200 dark:border-slate-800/80 overflow-y-auto bg-white dark:bg-[#0A0F1D] flex flex-col select-none z-20 transition-colors duration-100 ease-linear">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#0F1626] text-xs font-mono">
        <button
          onClick={() => onChangeTab('filters')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors duration-100 ease-linear ${
            activeTab === 'filters'
              ? 'bg-white dark:bg-[#0A0F1D] text-slate-900 dark:text-cyan-400 border-b-2 border-slate-900 dark:border-cyan-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Graph Filters</span>
        </button>
        <button
          onClick={() => onChangeTab('ingestion')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center space-x-1.5 transition-colors duration-100 ease-linear ${
            activeTab === 'ingestion'
              ? 'bg-white dark:bg-[#0A0F1D] text-slate-900 dark:text-cyan-400 border-b-2 border-slate-900 dark:border-cyan-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>NLP Ingestion</span>
        </button>
      </div>

      {/* Dock Content Body */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs font-sans">
        {activeTab === 'filters' ? (
          <>
            {/* 1. Algorithmic Mastermind Isolation */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-rose-700 dark:text-rose-400">
                  <Target className="w-3.5 h-3.5" />
                  <span>Structural Analysis</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">PageRank v4</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Dim peripheral leaf nodes and prioritize network hubs with highest eigenvector influence.
              </p>
              <button
                onClick={onToggleIsolateKingpin}
                className={`w-full py-1.5 px-2.5 rounded-md font-mono text-xs flex items-center justify-center space-x-2 transition-all duration-100 ease-linear ${
                  isKingpinIsolated
                    ? 'bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-xs'
                    : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 font-medium'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{isKingpinIsolated ? 'Reset Isolation Filter' : 'Isolate Kingpin (PageRank)'}</span>
              </button>
            </div>

            {/* 2. Syndicate Role Filters */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Entity Role Classes</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{nodes.length} entities</span>
              </div>

              <div className="space-y-1 pt-1">
                {/* Kingpin */}
                <div
                  onClick={() => onToggleRole('kingpin')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('kingpin') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Kingpin / Mastermind</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 rounded">
                    {roleCounts.kingpin}
                  </span>
                </div>

                {/* Mule */}
                <div
                  onClick={() => onToggleRole('mule')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('mule') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Financial Mule Conduit</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 rounded">
                    {roleCounts.mule}
                  </span>
                </div>

                {/* Burner Telecom */}
                <div
                  onClick={() => onToggleRole('telecom')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('telecom') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Burner Telecom / Towers</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-sky-50 dark:bg-cyan-950/50 border border-sky-200 dark:border-cyan-900/60 text-sky-700 dark:text-cyan-300 rounded">
                    {roleCounts.telecom}
                  </span>
                </div>

                {/* Shell Company */}
                <div
                  onClick={() => onToggleRole('shell')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('shell') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Shell Company Entity</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-900/60 text-purple-700 dark:text-purple-300 rounded">
                    {roleCounts.shell}
                  </span>
                </div>

                {/* Enforcer */}
                <div
                  onClick={() => onToggleRole('enforcer')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('enforcer') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500 dark:bg-orange-400"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Enforcer / Shooter</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 text-orange-700 dark:text-orange-300 rounded">
                    {roleCounts.enforcer}
                  </span>
                </div>

                {/* Victim / Complainant */}
                <div
                  onClick={() => onToggleRole('victim')}
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#141D30] cursor-pointer transition-colors duration-100 ease-linear"
                >
                  <div className="flex items-center space-x-2">
                    {selectedRoles.has('victim') ? (
                      <CheckSquare className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                      <span className="text-slate-800 dark:text-slate-200 text-xs font-medium">Victim / Complainant</span>
                    </span>
                  </div>
                  <span className="font-mono text-[11px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded">
                    {roleCounts.victim}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Algorithmic Graph Sliders */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-3">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
                  <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
                  <span>Forensic Graph Metrics</span>
                </span>
              </div>

              {/* Betweenness Centrality */}
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300">Betweenness Cut-Off:</span>
                  <span className="text-blue-700 dark:text-cyan-400 font-bold">{betweennessThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="0.9"
                  step="0.05"
                  value={betweennessThreshold}
                  onChange={(e) => onChangeBetweenness(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 dark:accent-cyan-400 h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Isolates critical broker nodes bridging disparate clusters
                </span>
              </div>

              {/* Minimum Evidence Confidence */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-slate-700 dark:text-slate-300">Min Confidence Level:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">{Math.round(confidenceThreshold * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={confidenceThreshold}
                  onChange={(e) => onChangeConfidence(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 dark:accent-emerald-400 h-1 bg-slate-200 dark:bg-slate-700 rounded appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                  Filters corroborated wiretaps & bank statement links
                </span>
              </div>

              {/* Louvain Communities Toggle */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
                  <span className="text-[11px] text-slate-800 dark:text-slate-200 font-mono">Show Gang Communities (Louvain)</span>
                </div>
                <button
                  type="button"
                  onClick={onToggleLouvainCommunities}
                  className={`w-8 h-4 flex items-center rounded-full p-0.5 transition-colors duration-100 ease-linear ${
                    showLouvainCommunities ? 'bg-indigo-600 dark:bg-cyan-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-3 h-3 rounded-full bg-white shadow-2xs block"></span>
                </button>
              </div>
            </div>

            {/* 4. Shortest Money Path Calculation */}
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2.5">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400">
                  <Waypoints className="w-3.5 h-3.5" />
                  <span>Shortest Money Path</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">DIJKSTRA SHORTEST PATH</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Source Entity (Offshore / Origin):</label>
                  <select
                    value={pathSource}
                    onChange={(e) => setPathSource(e.target.value)}
                    className="w-full bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-500 dark:text-slate-400 block mb-1">Target Entity (Laundering Destination):</label>
                  <select
                    value={pathTarget}
                    onChange={(e) => setPathTarget(e.target.value)}
                    className="w-full bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {nodes.map(n => (
                      <option key={n.id} value={n.id}>{n.name} ({n.role})</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 pt-1">
                  <button
                    onClick={() => onCalculateShortestPath(pathSource, pathTarget)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-md flex items-center justify-center space-x-1.5 transition-colors duration-100 ease-linear shadow-2xs"
                  >
                    <Waypoints className="w-3.5 h-3.5" />
                    <span>Trace Flow</span>
                  </button>
                  {shortestPathResult && (
                    <button
                      onClick={onResetShortestPath}
                      className="px-2.5 py-1.5 bg-white hover:bg-slate-100 dark:bg-[#0A0F1D] dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors duration-100 ease-linear"
                      title="Clear path highlight"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {shortestPathResult && (
                  <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-md space-y-1 mt-2">
                    <div className="flex justify-between text-[11px] text-emerald-800 dark:text-emerald-300 font-semibold">
                      <span>Routing Found:</span>
                      <span>{shortestPathResult.hopCount} Intermediary Hops</span>
                    </div>
                    <div className="text-[11px] text-slate-700 dark:text-slate-300">
                      Total Laundering Volume: <strong className="text-emerald-900 dark:text-emerald-200 font-bold">₹{(shortestPathResult.totalAmount / 100000).toFixed(1)} Lakhs</strong>
                    </div>
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">
                      ● Active on central canvas
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Tab 2: Evidence Ingestion & NLP NER Simulator */
          <div className="space-y-3">
            <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                <span className="flex items-center space-x-1.5 text-blue-700 dark:text-cyan-400">
                  <FileText className="w-3.5 h-3.5" />
                  <span>FIR & Interrogation Ingestion</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Case Diary #14</span>
              </div>
              <textarea
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                rows={6}
                className="w-full bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 rounded-md p-2.5 text-[11px] font-mono text-slate-800 dark:text-slate-200 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Paste raw interrogation note, CDR dump or FIR text here..."
              />
              <button
                onClick={handleRunNER}
                disabled={isAnalyzing}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white font-mono font-semibold rounded-md flex items-center justify-center space-x-2 transition-all duration-100 ease-linear shadow-2xs"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-amber-300' : 'text-amber-300'}`} />
                <span>{isAnalyzing ? 'Extracting Forensic Entities (NLP)...' : 'Extract Forensic Entities (NLP)'}</span>
              </button>
            </div>

            {/* Core Tactical Tagged Pills with Confidences & Canvas Sync Button */}
            {hasExtractedPills && (
              <div className="bg-slate-50/70 dark:bg-[#0F1626]/80 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-2.5">
                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200 font-mono text-[11px] font-semibold uppercase tracking-wider">
                  <span className="flex items-center space-x-1.5 text-blue-700 dark:text-cyan-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Corroborated NLP Entities</span>
                  </span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-medium">4 IDENTIFIED</span>
                </div>

                {/* 4 Tagged Pills with High Contrast Semantic Colors */}
                <div className="space-y-1.5 font-mono text-[11px]">
                  {/* Pill 1: Person (Crimson) */}
                  <div className="px-2.5 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold truncate">[PERSON: Vikramaditya @ Vicky Kashi | Conf: 99.4%]</span>
                  </div>

                  {/* Pill 2: Account (Amber) */}
                  <div className="px-2.5 py-1.5 rounded-md bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold truncate">[ACCOUNT: Axis Bank #9182 | Conf: 98.1%]</span>
                  </div>

                  {/* Pill 3: Tower (Cyan) */}
                  <div className="px-2.5 py-1.5 rounded-md bg-sky-50 dark:bg-cyan-950/40 border border-sky-200 dark:border-cyan-900/60 text-sky-800 dark:text-cyan-300 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold truncate">[TOWER: BTS-UP-VNS-71 | Conf: 96.5%]</span>
                  </div>

                  {/* Pill 4: Money (Emerald) */}
                  <div className="px-2.5 py-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-2xs">
                    <span className="font-semibold truncate">[MONEY: ₹18,50,000 | Conf: 99.0%]</span>
                  </div>
                </div>

                {/* Active Sync Entities with Canvas Graph Button */}
                <button
                  onClick={handleSyncEntities}
                  className="w-full py-2 px-3 rounded-md font-mono text-xs font-semibold flex items-center justify-center space-x-2 transition-all duration-100 ease-linear shadow-xs bg-blue-600 hover:bg-blue-700 dark:bg-cyan-700 dark:hover:bg-cyan-600 text-white"
                >
                  <Crosshair className={`w-3.5 h-3.5 ${isSyncedWithCanvas ? 'animate-spin' : ''}`} />
                  <span>Sync Entities with Canvas Graph</span>
                </button>
              </div>
            )}

            {/* Extracted Entities List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 font-mono text-[11px] font-semibold uppercase tracking-wider px-1">
                <span>Detailed Case Entities ({extractedEntities.length})</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">NER Verified</span>
              </div>

              <div className="space-y-2">
                {extractedEntities.map((ent) => (
                  <div
                    key={ent.id}
                    className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-2.5 rounded-lg text-xs space-y-1.5 transition-colors duration-100 ease-linear shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.5 text-[10px] font-mono font-bold rounded ${
                        ent.type === 'PERSON' ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60' :
                        ent.type === 'BANK' ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60' :
                        ent.type === 'SIM' ? 'bg-sky-50 dark:bg-cyan-950/50 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-900/60' :
                        ent.type === 'COMPANY' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                      }`}>
                        {ent.type}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
                        Conf: {(ent.confidence * 100).toFixed(0)}%
                      </span>
                    </div>

                    <div className="font-mono text-slate-900 dark:text-slate-100 text-xs font-semibold">
                      {ent.value}
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
                      {ent.context}
                    </div>

                    <button
                      onClick={() => onInjectExtractedEntity(ent)}
                      className="w-full mt-1 py-1 bg-slate-50 hover:bg-slate-100 dark:bg-[#0A0F1D] dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-mono text-[10px] rounded flex items-center justify-center space-x-1 transition-colors duration-100 ease-linear"
                    >
                      <PlusCircle className="w-3 h-3 text-blue-600 dark:text-cyan-400" />
                      <span>Pin to Active Case Graph</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

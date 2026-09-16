'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Waypoints, 
  Sparkles, 
  ExternalLink, 
  AlertTriangle, 
  PhoneCall, 
  Landmark, 
  Radio, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Filter
} from 'lucide-react';

interface InteractiveShowcaseProps {
  onLaunchFullConsole: () => void;
}

interface CaseEntry {
  id: string;
  firNumber: string;
  policeStation: string;
  title: string;
  timeAgo: string;
  type: 'EXTORTION' | 'HAWALA' | 'TELECOM' | 'ARMS';
  typeBadgeClass: string;
  highlightedNodeIds: string[];
  summary: string;
  bnsSection: string;
  amount?: string;
}

const CASE_FEED: CaseEntry[] = [
  {
    id: 'case-1',
    firNumber: 'FIR #382/2026',
    policeStation: 'PS Lanka (Varanasi)',
    title: 'Extortion Call & Hawala Payout Intercept',
    timeAgo: '8 min ago',
    type: 'EXTORTION',
    typeBadgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    highlightedNodeIds: ['node-vicky', 'node-rahul-mule', 'node-tariq'],
    summary: 'Mastermind Vicky Kashi issued extortion demand of ₹50L to builder. ₹18.5L directed to Axis Bank A/C 9182.',
    bnsSection: 'Sec 111(2) & 308(4) BNS',
    amount: '₹18,50,000',
  },
  {
    id: 'case-2',
    firNumber: 'STR #094/2026',
    policeStation: 'FIU-IND / ED Lucknow',
    title: 'Rapid Layering Loop (Axis Bank #9182)',
    timeAgo: '24 min ago',
    type: 'HAWALA',
    typeBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    highlightedNodeIds: ['node-rahul-mule', 'node-kashi-bullion', 'node-purvanchal-agro'],
    summary: 'Smurfing detected: ₹42.5L credited via RTGS from Al-Nahda Exchange, dispersed to 7 mules in under 3 hours.',
    bnsSection: 'PMLA Sec 3 & 4',
    amount: '₹42,50,000',
  },
  {
    id: 'case-3',
    firNumber: 'CDR-DUMP-71',
    policeStation: 'UP STF Cyber Wing',
    title: 'Midnight Burner Burst Intercept',
    timeAgo: '1 hour ago',
    type: 'TELECOM',
    typeBadgeClass: 'bg-teal-50 text-teal-700 border-teal-200',
    highlightedNodeIds: ['node-sim-1', 'node-sim-2', 'node-bts-1'],
    summary: 'Concurrent night bursts logged between 01:00-03:30 AM on Assi Ghat Tower 71 using fake Assam KYC SIMs.',
    bnsSection: 'IT Act 66D & Sec 61(2) BNS',
  },
  {
    id: 'case-4',
    firNumber: 'GD #41/2026',
    policeStation: 'Cantt Rly Outpost',
    title: 'Illegal SIM Dispenser Seizure',
    timeAgo: '3 hours ago',
    type: 'ARMS',
    typeBadgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
    highlightedNodeIds: ['node-sim-1', 'node-sim-2', 'node-vicky'],
    summary: 'POS vendor Deepak Yadav intercepted with 24 pre-activated Airtel/Jio SIMs registered under fake Aadhaar clones.',
    bnsSection: 'Sec 336(3) & 340(2) BNS',
  },
];

interface WorkbenchNode {
  id: string;
  name: string;
  role: 'kingpin' | 'mule' | 'telecom' | 'tower';
  roleLabel: string;
  x: number;
  y: number;
  color: string;
  stroke: string;
  badgeBg: string;
  badgeText: string;
  meta: string;
}

const WORKBENCH_NODES: WorkbenchNode[] = [
  {
    id: 'node-vicky',
    name: 'Vikramaditya @ Vicky Kashi',
    role: 'kingpin',
    roleLabel: 'Syndicate Kingpin',
    x: 260,
    y: 65,
    color: '#FEE2E2',
    stroke: '#DC2626',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    badgeText: '👑 KINGPIN [0.942]',
    meta: 'Risk Score: 96/100 | BNS Sec 111',
  },
  {
    id: 'node-tariq',
    name: 'Tariq Bhai @ Dubai Desk',
    role: 'kingpin',
    roleLabel: 'Offshore Handler',
    x: 90,
    y: 75,
    color: '#FEE2E2',
    stroke: '#DC2626',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    badgeText: 'OFFSHORE [0.912]',
    meta: 'Al-Nahda Exchange, Deira',
  },
  {
    id: 'node-rahul-mule',
    name: "Rahul 'Mule' Sharma",
    role: 'mule',
    roleLabel: 'Primary Layering Mule',
    x: 240,
    y: 190,
    color: '#FEF3C7',
    stroke: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: '₹ MULE [0.818]',
    meta: 'Axis Bank A/C #9182 | Sigra',
  },
  {
    id: 'node-kashi-bullion',
    name: 'M/s Kashi Bullion Traders',
    role: 'mule',
    roleLabel: 'Front Entity',
    x: 100,
    y: 270,
    color: '#FEF3C7',
    stroke: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: '₹ FRONT CORP',
    meta: 'Chowk Sarafa | GST Flagged',
  },
  {
    id: 'node-purvanchal-agro',
    name: 'Purvanchal Agro Commodities',
    role: 'mule',
    roleLabel: 'Shell Company',
    x: 390,
    y: 170,
    color: '#FEF3C7',
    stroke: '#D97706',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: '₹ SHELL CO',
    meta: 'Burrabazar Kolkata Shell',
  },
  {
    id: 'node-sim-1',
    name: 'Burner SIM #98110-23910',
    role: 'telecom',
    roleLabel: 'VoIP Burner Terminal',
    x: 380,
    y: 80,
    color: '#E0F2FE',
    stroke: '#0284C7',
    badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    badgeText: '📱 BURNER SIM',
    meta: 'Assam KYC Clone | IMEI: 864291',
  },
  {
    id: 'node-sim-2',
    name: 'Burner SIM #98110-23911',
    role: 'telecom',
    roleLabel: 'Courier Transit SIM',
    x: 420,
    y: 280,
    color: '#E0F2FE',
    stroke: '#0284C7',
    badgeBg: 'bg-teal-50 border-teal-200 text-teal-700',
    badgeText: '📱 FIELD SIM',
    meta: 'Bihar KYC Clone | Recovered',
  },
  {
    id: 'node-bts-1',
    name: 'BTS-UP-VNS-71 (Assi Ghat)',
    role: 'tower',
    roleLabel: 'Cell Site Tower',
    x: 260,
    y: 310,
    color: '#EDE9FE',
    stroke: '#7C3AED',
    badgeBg: 'bg-purple-50 border-purple-200 text-purple-700',
    badgeText: '🗼 BTS CELL 71',
    meta: 'Cell-ID 404-45-71 | 142 CDRs',
  },
];

interface WorkbenchEdge {
  from: string;
  to: string;
  label: string;
  isMoneyFlow?: boolean;
}

const WORKBENCH_EDGES: WorkbenchEdge[] = [
  { from: 'node-tariq', to: 'node-vicky', label: 'Conspiracy Relays' },
  { from: 'node-tariq', to: 'node-rahul-mule', label: '₹18.5L Hawala Hop', isMoneyFlow: true },
  { from: 'node-vicky', to: 'node-rahul-mule', label: 'Withdrawal Orders' },
  { from: 'node-vicky', to: 'node-sim-1', label: 'Assigned VoIP' },
  { from: 'node-rahul-mule', to: 'node-kashi-bullion', label: '₹12.0L Cash Gold', isMoneyFlow: true },
  { from: 'node-rahul-mule', to: 'node-purvanchal-agro', label: '₹24.0L RTGS Layer', isMoneyFlow: true },
  { from: 'node-sim-1', to: 'node-bts-1', label: 'Tower Dump Ping' },
  { from: 'node-rahul-mule', to: 'node-sim-2', label: 'SMS OTP Trigger' },
  { from: 'node-sim-2', to: 'node-bts-1', label: 'Tower Dump Ping' },
];

export const InteractiveShowcase: React.FC<InteractiveShowcaseProps> = ({
  onLaunchFullConsole,
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>('case-1');
  const [isDijkstraActive, setIsDijkstraActive] = useState<boolean>(true);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-vicky');

  const activeCase = CASE_FEED.find((c) => c.id === selectedCaseId) || CASE_FEED[0];
  const selectedNode = WORKBENCH_NODES.find((n) => n.id === selectedNodeId) || WORKBENCH_NODES[0];

  const shortestMoneyPathNodes = new Set(['node-tariq', 'node-rahul-mule', 'node-kashi-bullion']);

  return (
    <section id="showcase" className="py-16 md:py-20 bg-slate-50 dark:bg-[#07090E] border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-1.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-blue-500"></span>
              <span>LIVE EVIDENCE CORRELATION WORKBENCH</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Interactive Criminal Network Analysis
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
              Inspect correlated case intercepts on the left, observe automated node clustering on the right, and trace multi-hop Hawala laundering channels.
            </p>
          </div>

          <button
            onClick={onLaunchFullConsole}
            className="mt-4 md:mt-0 inline-flex items-center space-x-1.5 px-4 py-2 rounded bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-mono text-xs font-medium transition-all shadow-xs"
          >
            <span>Launch Full 42-Node Console</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
          </button>
        </div>

        {/* Dual-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Case Intelligence Feed (5 Cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-white dark:bg-[#0A0F1D] p-3.5 rounded border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
              <div className="flex items-center space-x-2 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span>ACTIVE INTELLIGENCE LOGS</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium">
                4 Incident Feeds
              </span>
            </div>

            <div className="space-y-2.5">
              {CASE_FEED.map((entry) => {
                const isSelected = entry.id === selectedCaseId;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setSelectedCaseId(entry.id)}
                    className={`p-4 rounded border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-[#0F1626] border-slate-900 dark:border-blue-500 shadow-sm ring-1 ring-slate-900 dark:ring-blue-500/40'
                        : 'bg-white/80 dark:bg-[#0A0F1D]/80 hover:bg-white dark:hover:bg-[#0A0F1D] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${entry.typeBadgeClass}`}>
                          {entry.type}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                          {entry.firNumber}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
                        {entry.timeAgo}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {entry.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
                      {entry.summary}
                    </p>

                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span>{entry.policeStation}</span>
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">{entry.bnsSection}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Compact Forensic Graph Workbench (7 Cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0A0F1D] rounded border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
            {/* Workbench Top Bar */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0F1626] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 uppercase">
                  FORENSIC TOPOLOGY VIEWER
                </span>
                <span className="text-slate-300 dark:text-slate-700 font-mono text-xs">|</span>
                <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                  {WORKBENCH_NODES.length} Nodes • 9 Correlations
                </span>
              </div>

              {/* Dijkstra Money Trail Toggle */}
              <button
                onClick={() => setIsDijkstraActive(!isDijkstraActive)}
                className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-mono font-medium transition-all ${
                  isDijkstraActive
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-bold shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Waypoints className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>{isDijkstraActive ? 'Dijkstra Flow Active (₹18.5L)' : 'Trace Dijkstra Flow'}</span>
              </button>
            </div>

            {/* SVG Interactive Graph Canvas */}
            <div className="relative w-full h-[380px] bg-[#F8FAFC] dark:bg-[#050711] border-b border-slate-200 dark:border-slate-800 select-none overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 520 380">
                {/* Subtle Grid Background */}
                <defs>
                  <pattern id="showcase-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" className="fill-slate-300 dark:fill-slate-700" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#showcase-grid)" />

                {/* Edges */}
                {WORKBENCH_EDGES.map((edge, i) => {
                  const src = WORKBENCH_NODES.find((n) => n.id === edge.from)!;
                  const dst = WORKBENCH_NODES.find((n) => n.id === edge.to)!;
                  const isHighlightedMoneyPath =
                    isDijkstraActive &&
                    shortestMoneyPathNodes.has(edge.from) &&
                    shortestMoneyPathNodes.has(edge.to);

                  return (
                    <g key={i}>
                      <line
                        x1={src.x}
                        y1={src.y}
                        x2={dst.x}
                        y2={dst.y}
                        stroke={isHighlightedMoneyPath ? '#10B981' : '#64748B'}
                        strokeWidth={isHighlightedMoneyPath ? 3 : 1.5}
                        strokeDasharray={edge.isMoneyFlow && !isHighlightedMoneyPath ? '4 2' : 'none'}
                        opacity={isHighlightedMoneyPath ? 1 : 0.6}
                      />
                      {/* Edge Label for Money Hop */}
                      {isHighlightedMoneyPath && (
                        <text
                          x={(src.x + dst.x) / 2}
                          y={(src.y + dst.y) / 2 - 6}
                          fill="#10B981"
                          fontSize="10"
                          fontFamily="monospace"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {edge.label}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* Nodes */}
                {WORKBENCH_NODES.map((node) => {
                  const isNodeSelected = node.id === selectedNodeId;
                  const isHighlightedByCase = activeCase.highlightedNodeIds.includes(node.id);
                  const isMoneyPathNode = isDijkstraActive && shortestMoneyPathNodes.has(node.id);

                  return (
                    <g
                      key={node.id}
                      onClick={() => setSelectedNodeId(node.id)}
                      className="cursor-pointer transition-transform"
                    >
                      {/* Outer Focus Ring */}
                      {(isNodeSelected || isHighlightedByCase || isMoneyPathNode) && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.role === 'kingpin' ? 24 : 18}
                          fill="none"
                          stroke={isMoneyPathNode ? '#10B981' : isNodeSelected ? '#38BDF8' : '#3B82F6'}
                          strokeWidth="2"
                          strokeDasharray={isHighlightedByCase ? '3 3' : 'none'}
                          opacity={0.9}
                        />
                      )}

                      {/* Main Node Circle */}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.role === 'kingpin' ? 18 : 14}
                        fill={node.color}
                        stroke={node.stroke}
                        strokeWidth={isNodeSelected ? 2.5 : 1.8}
                      />

                      {/* Role Glyph */}
                      <text
                        x={node.x}
                        y={node.y + 4}
                        fontSize={node.role === 'kingpin' ? '12' : '10'}
                        fontWeight="bold"
                        fill={node.stroke}
                        textAnchor="middle"
                        pointerEvents="none"
                      >
                        {node.role === 'kingpin' ? '👑' : node.role === 'mule' ? '₹' : node.role === 'tower' ? '🗼' : '📱'}
                      </text>

                      {/* Node Label Card */}
                      <g transform={`translate(${node.x}, ${node.y + (node.role === 'kingpin' ? 28 : 22)})`}>
                        <rect
                          x="-60"
                          y="0"
                          width="120"
                          height="16"
                          rx="3"
                          className="fill-white dark:fill-[#0F1626] stroke-slate-300 dark:stroke-slate-700"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="11"
                          fontSize="9"
                          fontFamily="monospace"
                          fontWeight="bold"
                          className="fill-slate-900 dark:fill-slate-100"
                          textAnchor="middle"
                        >
                          {node.name.length > 18 ? node.name.slice(0, 16) + '…' : node.name}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Dynamic Overlay HUD Pill */}
              <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0F1626]/90 border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-xs backdrop-blur-xs flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Active Intercept: <strong className="text-slate-900 dark:text-slate-100">{activeCase.firNumber}</strong></span>
              </div>
            </div>

            {/* Bottom Entity Inspector Bar */}
            <div className="p-4 bg-white dark:bg-[#0A0F1D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${selectedNode.badgeBg}`}>
                    {selectedNode.badgeText}
                  </span>
                  <h5 className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                    {selectedNode.name}
                  </h5>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  {selectedNode.meta} • Role: <strong className="text-slate-700 dark:text-slate-300">{selectedNode.roleLabel}</strong>
                </div>
              </div>

              <button
                onClick={onLaunchFullConsole}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-xs font-mono text-slate-700 dark:text-slate-200 transition-colors"
              >
                <span>Inspect in Full Workbench</span>
                <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState, useMemo } from 'react';
import { 
  FolderOpen, 
  Search, 
  Filter, 
  ShieldAlert, 
  PlusCircle, 
  FileSpreadsheet, 
  ArrowRight, 
  LayoutGrid, 
  Table as TableIcon, 
  CheckCircle2, 
  Clock, 
  Users, 
  Network, 
  AlertTriangle, 
  FileText, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export type CaseStatus = 'CRITICAL ACTIVE' | 'UNDER SURVEILLANCE' | 'CLOSED/ARCHIVED';

export interface AssignedCase {
  id: string;
  caseNumber: string;
  title: string;
  directive: string;
  leadInvestigator: string;
  unit: string;
  status: CaseStatus;
  entitiesCount: number;
  nodesCount: number;
  threatLevel: string;
  lastUpdated: string;
  summary: string;
  primaryTarget: string;
  bnsSections: string[];
}

interface MyInvestigationsViewProps {
  onSelectCase: (caseId: string) => void;
  onOpenNewInvestigation: () => void;
  onOpenExportReport: () => void;
  onOpenDossier?: (caseId: string) => void;
}

export const INITIAL_ASSIGNED_CASES: AssignedCase[] = [
  {
    id: 'case-382',
    caseNumber: 'Case #382/2026',
    title: 'Purvanchal Syndicate Extortion & Hawala Ring',
    directive: 'OP: Operation Syndicate-Viper // FIR #382/2026',
    leadInvestigator: 'Inspector R. K. Singh (Analyst/IO)',
    unit: 'UP-STF Special Cell (Varanasi / Lucknow Range)',
    status: 'CRITICAL ACTIVE',
    entitiesCount: 42,
    nodesCount: 87,
    threatLevel: 'CRITICAL (Score: 96)',
    lastUpdated: '2026-09-18 18:40 IST',
    primaryTarget: 'Vikramaditya @ Vicky Kashi (Kingpin)',
    summary: 'Inter-state organized syndicate operating extortion rings targeting real-estate developers in Varanasi, layered via Dubai Hawala accounts through Purvanchal Traders.',
    bnsSections: ['Sec 111 (Organized Crime)', 'Sec 308(4) (Extortion)', 'PMLA Sec 3 & 4'],
  },
  {
    id: 'case-104',
    caseNumber: 'Case #104/2026',
    title: 'Cantt Railway Station Pre-activated SIM Racket',
    directive: 'OP: Operation Signal-Ghost // FIR #104/2026',
    leadInvestigator: 'Inspector Amit Verma (Cyber Cell)',
    unit: 'Cyber Crime PS Lucknow Range',
    status: 'UNDER SURVEILLANCE',
    entitiesCount: 16,
    nodesCount: 28,
    threatLevel: 'HIGH (Score: 78)',
    lastUpdated: '2026-09-17 14:15 IST',
    primaryTarget: 'Burner SIM Farm Facilitator (Sigra Cell)',
    summary: 'Black-market distribution of forged Aadhaar pre-activated SIMs utilized for extortion VoIP calls across eastern UP corridors.',
    bnsSections: ['Sec 318(4) (Cheating)', 'Sec 66 IT Act', 'Sec 4 Telegraph Act'],
  },
  {
    id: 'case-042',
    caseNumber: 'Case #042/2025',
    title: 'Assi Ghat Midnight Telecom Burst',
    directive: 'OP: Operation Silent-Tower // FIR #042/2025',
    leadInvestigator: 'DySP Rajeshwar Mishra (Special Cell)',
    unit: 'Varanasi Commissionerate Special Operations',
    status: 'CLOSED/ARCHIVED',
    entitiesCount: 19,
    nodesCount: 31,
    threatLevel: 'RESOLVED (Score: 45)',
    lastUpdated: '2025-11-20 11:30 IST',
    primaryTarget: 'Sub-ordinate Cash Courier (Lanka Cell)',
    summary: 'Concluded investigation into nighttime BTS tower-dump bursts and localized extortion courier drops; accused charge-sheeted under Sec 308.',
    bnsSections: ['Sec 308(2) (Extortion)', 'Sec 61 (Conspiracy)'],
  },
];

export const MyInvestigationsView: React.FC<MyInvestigationsViewProps> = ({
  onSelectCase,
  onOpenNewInvestigation,
  onOpenExportReport,
  onOpenDossier,
}) => {
  const [cases] = useState<AssignedCase[]>(INITIAL_ASSIGNED_CASES);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'CRITICAL ACTIVE' | 'UNDER SURVEILLANCE' | 'CLOSED/ARCHIVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (statusFilter !== 'ALL' && c.status !== statusFilter) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        c.caseNumber.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.leadInvestigator.toLowerCase().includes(q) ||
        c.unit.toLowerCase().includes(q) ||
        c.primaryTarget.toLowerCase().includes(q)
      );
    });
  }, [cases, statusFilter, searchQuery]);

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-mono text-white tracking-wider">
                MY INVESTIGATIONS & ASSIGNED DIRECTIVES
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded font-semibold">
                {filteredCases.length} OF {cases.length} CASES
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              State Police & STF Case Dossier Repository // Section 63 BSA Compliant
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenExportReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-mono transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>Case Export</span>
          </button>

          <button
            onClick={onOpenNewInvestigation}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-mono font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Ingest New Case</span>
          </button>
        </div>
      </div>

      {/* Control & Filter Strip */}
      <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px] uppercase mr-1">Status:</span>
          {[
            { id: 'ALL', label: 'All Cases' },
            { id: 'CRITICAL ACTIVE', label: 'Critical Active' },
            { id: 'UNDER SURVEILLANCE', label: 'Under Surveillance' },
            { id: 'CLOSED/ARCHIVED', label: 'Archived' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
                  isActive
                    ? tab.id === 'CRITICAL ACTIVE'
                      ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                      : tab.id === 'UNDER SURVEILLANCE'
                      ? 'bg-amber-950 text-amber-300 border border-amber-700 font-bold'
                      : 'bg-sky-950 text-sky-300 border border-sky-700 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by FIR, title, officer..."
            className="w-72 bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
          />
        </div>
      </div>

      {/* Main Content: Grid or Table */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* GRID VIEW */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {filteredCases.map((c) => {
              const isCritical = c.status === 'CRITICAL ACTIVE';
              const isSurveillance = c.status === 'UNDER SURVEILLANCE';

              return (
                <div
                  key={c.id}
                  className={`bg-slate-950 border rounded-xl p-5 flex flex-col justify-between space-y-4 transition-all shadow-md ${
                    isCritical
                      ? 'border-rose-900/60 hover:border-rose-600'
                      : isSurveillance
                      ? 'border-amber-900/60 hover:border-amber-600'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/90 px-2 py-0.5 rounded border border-sky-800">
                        {c.caseNumber}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          isCritical
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : isSurveillance
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug">
                      {c.title}
                    </h3>

                    <div className="text-[11px] font-mono text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800">
                      <div className="text-slate-300 font-semibold">{c.unit}</div>
                      <div className="text-slate-400 mt-0.5">Lead: {c.leadInvestigator}</div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-3">
                      {c.summary}
                    </p>

                    {/* Stats pills */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center space-x-1.5">
                        <Users className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-slate-300 font-bold">{c.entitiesCount} Entities</span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded border border-slate-800 flex items-center space-x-1.5">
                        <Network className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="text-slate-300 font-bold">{c.nodesCount} Nodes</span>
                      </div>
                    </div>

                    {/* Statutes */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {c.bnsSections.map((sec) => (
                        <span
                          key={sec}
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {onOpenDossier && (
                      <button
                        onClick={() => onOpenDossier(c.id)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded text-xs font-mono flex items-center space-x-1 transition-colors"
                        title="Open Official Case Diary Dossier"
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span>Dossier</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-bold flex items-center space-x-1.5 shadow-sm transition-all ml-auto"
                    >
                      <span>Launch Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TABLE VIEW */}
        {viewMode === 'table' && (
          <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950 shadow-md">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                <tr>
                  <th className="p-3.5">Case & Title</th>
                  <th className="p-3.5">Unit & Lead IO</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Intelligence Metrics</th>
                  <th className="p-3.5">Threat Level</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredCases.map((c) => {
                  const isCritical = c.status === 'CRITICAL ACTIVE';
                  const isSurveillance = c.status === 'UNDER SURVEILLANCE';

                  return (
                    <tr key={c.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white text-xs">{c.caseNumber}</div>
                        <div className="text-slate-300 font-sans mt-0.5">{c.title}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{c.primaryTarget}</div>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-200 font-semibold">{c.unit}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{c.leadInvestigator}</div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isCritical
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : isSurveillance
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="text-slate-300">{c.entitiesCount} Entities / {c.nodesCount} Nodes</div>
                        <div className="text-[10px] text-emerald-400">BSA Sec 63 Verified</div>
                      </td>
                      <td className="p-3.5">
                        <span className="text-rose-400 font-bold">{c.threatLevel}</span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        {onOpenDossier && (
                          <button
                            onClick={() => onOpenDossier(c.id)}
                            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded text-xs transition-colors"
                          >
                            Dossier
                          </button>
                        )}
                        <button
                          onClick={() => onSelectCase(c.id)}
                          className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold transition-colors"
                        >
                          Launch
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

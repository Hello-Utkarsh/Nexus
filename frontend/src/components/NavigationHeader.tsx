'use client';

import React from 'react';
import { 
  Network, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Bot, 
  Search, 
  PlusCircle, 
  FileSpreadsheet, 
  FolderOpen,
  LayoutDashboard,
  Shield,
  Key,
  Globe,
  Radio
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TelemetryBadge } from './layout/TelemetryBadge';

export type NavigationTab = 
  | 'overview' 
  | 'investigations' 
  | 'network' 
  | 'patterns' 
  | 'timeline' 
  | 'evidence' 
  | 'socmint'
  | 'copilot';

interface NavigationHeaderProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  caseNumber: string;
  entitiesCount: number;
  relationshipsCount: number;
  patternsCount: number;
  onOpenNewInvestigation: () => void;
  onOpenExportReport: () => void;
  onOpenSearch: () => void;
  onOpenAuditDock?: () => void;
  onOpenCopilot?: () => void;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  activeTab,
  onSelectTab,
  caseNumber,
  entitiesCount,
  relationshipsCount,
  patternsCount,
  onOpenNewInvestigation,
  onOpenExportReport,
  onOpenSearch,
  onOpenAuditDock,
  onOpenCopilot,
}) => {
  const { user, isSuperAdmin } = useAuth();

  return (
    <header className="h-11 flex items-center justify-between w-full overflow-hidden px-4 border-b border-slate-800 bg-slate-900 text-slate-100 select-none z-30 shadow-xs shrink-0">
      {/* Brand & Active Case (Essential Indicators Compact: CASE #382/2026, SEC 63 BSA) */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Case Badge & Metadata */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-950 px-2.5 py-1 rounded-[2px] text-xs font-mono text-slate-300 border border-slate-800 shadow-2xs shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />
            <span className="font-bold text-slate-100">CASE #382/2026</span>
          </div>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="text-slate-400 font-semibold hidden md:inline">{entitiesCount} Nodes / {relationshipsCount} Edges</span>
          <span className="text-slate-700">•</span>
          <span className="text-slate-300 font-bold text-[10.5px] bg-slate-900 border border-slate-700 px-1.5 py-0.2 rounded-[2px]">
            SEC 63 BSA
          </span>
        </div>

        {/* Secondary Verbose Chip (Hidden on standard desktop to prevent right-edge overflow) */}
        <div className="hidden xl:inline-flex items-center space-x-1.5 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-[2px] border border-amber-900/60 text-amber-300 shrink-0">
          <span className="font-bold">MHA DIRECTIVE PS 13</span>
          <span className="text-slate-600">/</span>
          <span className="truncate max-w-[170px] text-slate-400">PURVANCHAL-NET</span>
        </div>
      </div>

      {/* Middle Status Chips Container: Compact INTEL CACHE */}
      <div className="hidden md:flex items-center shrink-0">
        <TelemetryBadge />
      </div>

      {/* Right Action Buttons Cluster: Guaranteed 100% Visibility (flex-shrink-0 flex items-center gap-2) */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Super Admin Audit Dock Trigger (Strictly visible ONLY when user role is 'Super Admin') */}
        {isSuperAdmin && onOpenAuditDock && (
          <button
            onClick={onOpenAuditDock}
            className="flex-shrink-0 flex items-center space-x-1 px-2 py-1 h-7 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/70 text-amber-300 rounded-[2px] text-xs font-mono font-bold transition-colors shadow-2xs group"
            title="Open Super Admin Telemetry Audit Dock"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-xs">AUDIT DOCK</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-amber-400 ml-0.5" />
          </button>
        )}

        {/* Search Input: w-28 lg:w-32 text-xs h-7 */}
        <button
          onClick={onOpenSearch}
          className="flex-shrink-0 flex items-center justify-between w-28 lg:w-32 h-7 px-2 text-xs text-slate-300 bg-slate-950 hover:bg-slate-850 border border-slate-700 rounded-[2px] transition-colors font-mono"
          title="Search Intelligence (Ctrl+K)"
        >
          <div className="flex items-center space-x-1 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs truncate text-slate-400">Search...</span>
          </div>
          <kbd className="hidden sm:inline px-1 py-0.2 text-[8.5px] font-mono bg-slate-900 border border-slate-700 rounded-[2px] text-slate-400 shrink-0">
            Ctrl+K
          </kbd>
        </button>

        {/* AI Copilot Trigger: px-2 py-1 text-xs h-7 */}
        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="flex-shrink-0 hidden sm:flex items-center space-x-1 px-2 py-1 h-7 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-[2px] text-xs font-mono font-medium transition-colors"
            title="Open AI Copilot Analyst Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs">Copilot</span>
          </button>
        )}

        {/* Start New Investigation: px-2 py-1 text-xs h-7 */}
        <button
          onClick={onOpenNewInvestigation}
          className="flex-shrink-0 flex items-center space-x-1 px-2 py-1 h-7 bg-blue-700 hover:bg-blue-600 text-white rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">New Case</span>
        </button>

        {/* Export Case Report: flex-shrink-0 text-xs px-2.5 py-1 h-7 font-medium */}
        <button
          onClick={onOpenExportReport}
          className="flex-shrink-0 flex items-center space-x-1 px-2.5 py-1 h-7 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-[2px] text-xs font-mono font-medium transition-colors"
          title="Export Investigation Analysis Report"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-medium">Report</span>
        </button>

        {/* Active Officer Profile Badge: STF-VNS-4491 / ANALYST/IO (Guaranteed Visible) */}
        {user && (
          <div 
            className="flex-shrink-0 flex items-center gap-1.5 bg-slate-950 border border-slate-700 px-2.5 py-1 rounded-[2px] text-xs shadow-2xs font-mono"
            title={`Active Officer: ${user.name} (${user.badgeNumber}) - ${user.role}`}
          >
            <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1 leading-none">
              <span className="font-bold text-slate-200 text-[11px] whitespace-nowrap">
                {user.badgeNumber}
              </span>
              <span className="text-slate-600 text-[10px]">/</span>
              <span className="text-slate-400 text-[10px] font-semibold uppercase whitespace-nowrap">
                {user.role}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

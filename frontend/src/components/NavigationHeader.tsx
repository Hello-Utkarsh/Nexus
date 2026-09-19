'use client';

import { 
  Bot, 
  Search, 
  FileSpreadsheet, 
  Shield,
  Key,
  UploadCloud,
  FolderPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
  onOpenNewInvestigation?: () => void;
  onOpenIngestEvidence?: () => void;
  onOpenRegisterCase?: () => void;
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
  onOpenIngestEvidence,
  onOpenRegisterCase,
  onOpenExportReport,
  onOpenSearch,
  onOpenAuditDock,
  onOpenCopilot,
}) => {
  const { user, isSuperAdmin } = useAuth();

  return (
    <header className="h-11 flex justify-between items-center w-full max-w-full overflow-hidden px-3 py-1.5 border-b border-slate-800 bg-slate-900 text-slate-100 select-none z-30 shadow-xs shrink-0">
      {/* Left: Case indicator & compact node counter */}
      <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 overflow-hidden">
        {/* Case Badge & Metadata */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-950 px-2 py-0.5 rounded-[2px] text-[11px] font-mono text-slate-300 border border-slate-800 shadow-2xs shrink-0">
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />
            <span className="font-bold text-slate-100">#CASE #382/2026</span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-slate-400 font-semibold hidden sm:inline shrink-0">{entitiesCount}N / {relationshipsCount}E</span>
        </div>

        {/* Secondary Compact Chip */}
        <div className="hidden 2xl:inline-flex items-center space-x-1 text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-[2px] border border-amber-900/60 text-amber-300 shrink-0">
          <span className="font-bold">MHA PS 13 // PURVANCHAL</span>
        </div>
      </div>

      {/* Middle: Compact Search bar */}
      <div className="flex items-center justify-center shrink-0">
        <button
          onClick={onOpenSearch}
          className="shrink-0 flex items-center justify-between w-28 xl:w-36 h-7 px-2 text-xs text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-[2px] transition-colors font-mono"
          title="Search Intelligence (/)"
        >
          <div className="flex items-center space-x-1 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-xs truncate text-slate-400">Search...</span>
          </div>
          <kbd className="hidden sm:inline px-1 py-0.2 text-[8.5px] font-mono bg-slate-900 border border-slate-700 rounded-[2px] text-slate-400 shrink-0">
            /
          </kbd>
        </button>
      </div>

      {/* Right Action Buttons Cluster: Guaranteed 100% Visibility (flex items-center gap-1.5 shrink-0) */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Super Admin Audit Dock Trigger (Strictly visible ONLY when user role is 'Super Admin') */}
        {isSuperAdmin && onOpenAuditDock && (
          <button
            onClick={onOpenAuditDock}
            className="shrink-0 flex items-center space-x-1 px-2 py-1 h-7 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-800/70 text-amber-300 rounded-[2px] text-xs font-mono font-bold transition-colors shadow-2xs group"
            title="Open Super Admin Telemetry Audit Dock"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xl:inline text-xs">AUDIT DOCK</span>
            <span className="w-1.5 h-1.5 rounded-[1px] bg-amber-400 ml-0.5" />
          </button>
        )}

        {/* AI Copilot Trigger: px-2 py-1 text-xs h-7 */}
        {onOpenCopilot && (
          <button
            onClick={onOpenCopilot}
            className="shrink-0 flex items-center space-x-1 px-2 py-1 h-7 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-[2px] text-xs font-mono font-medium transition-colors"
            title="Open AI Copilot Analyst Assistant (Ctrl+K)"
          >
            <Bot className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs">Copilot</span>
            <kbd className="hidden xl:inline px-1 py-0.2 text-[8.5px] font-mono bg-slate-900 border border-slate-700 rounded-[2px] text-slate-400 ml-1">
              Ctrl+K
            </kbd>
          </button>
        )}

        {/* Ingest Evidence to Active Case: px-2.5 py-1 text-xs h-7 shrink-0 */}
        <button
          onClick={onOpenIngestEvidence || onOpenNewInvestigation}
          className="shrink-0 flex items-center space-x-1 px-2.5 py-1 h-7 bg-blue-700 hover:bg-blue-600 text-white rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider shadow-xs transition-colors"
          title="Ingest multi-format evidence into active case graph"
        >
          <UploadCloud className="w-3.5 h-3.5 shrink-0" />
          <span className="text-xs">+ INGEST EVIDENCE</span>
        </button>

        {/* Register Brand New Investigation Docket: px-2.5 py-1 text-xs h-7 shrink-0 */}
        {onOpenRegisterCase && (
          <button
            onClick={onOpenRegisterCase}
            className="shrink-0 flex items-center space-x-1 px-2.5 py-1 h-7 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-[2px] text-xs font-mono font-medium transition-colors"
            title="Register Brand New STF Investigation Docket"
          >
            <FolderPlus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="text-xs">+ New Docket</span>
          </button>
        )}

        {/* Export Case Report: px-2 py-1 text-xs h-7 shrink-0 */}
        <button
          onClick={onOpenExportReport}
          className="shrink-0 flex items-center space-x-1 px-2 py-1 h-7 bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 rounded-[2px] text-xs font-mono font-medium transition-colors"
          title="Export Investigation Analysis Report"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-medium">Report</span>
        </button>

        {/* Active Officer Profile Badge: STF-VNS-4491 / ANALYST/IO (Guaranteed Visible) */}
        {user && (
          <div 
            className="shrink-0 flex items-center gap-1.5 bg-slate-950 border border-slate-700 px-2 py-1 h-7 rounded-[2px] text-xs shadow-2xs font-mono"
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

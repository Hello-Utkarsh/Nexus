'use client';

import React from 'react';
import { 
  Network, 
  Users, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Bot, 
  Search, 
  PlusCircle, 
  FileSpreadsheet, 
  FolderOpen,
  LayoutDashboard,
  Shield
} from 'lucide-react';

export type NavigationTab = 
  | 'overview' 
  | 'investigations' 
  | 'network' 
  | 'entities' 
  | 'patterns' 
  | 'timeline' 
  | 'evidence' 
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
}) => {
  const tabs: Array<{ id: NavigationTab; label: string; icon: any; badge?: number }> = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'network', label: 'Network', icon: Network },
    { id: 'entities', label: 'Entities', icon: Users },
    { id: 'patterns', label: 'Patterns', icon: AlertTriangle, badge: patternsCount },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'evidence', label: 'Evidence', icon: FileText },
    { id: 'copilot', label: 'AI Copilot', icon: Bot },
  ];

  return (
    <header className="h-14 w-full border-b border-slate-200 bg-white px-4 flex items-center justify-between select-none z-30 shadow-xs flex-shrink-0">
      {/* Brand & Active Case */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => onSelectTab('overview')}
          className="flex items-center space-x-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition-colors">
              CHAKRAVYUH
            </div>
            <div className="text-[10px] text-slate-500 font-medium tracking-normal leading-none mt-0.5">
              AI-Powered Criminal Network Intelligence
            </div>
          </div>
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* Case Badge */}
        <div className="flex items-center space-x-2 bg-slate-100/80 px-2.5 py-1 rounded-md text-xs font-mono text-slate-700 border border-slate-200">
          <span className="font-bold text-blue-600">{caseNumber}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600 hidden md:inline">{entitiesCount} Entities</span>
          <span className="text-slate-300 hidden md:inline">•</span>
          <span className="text-slate-600 hidden md:inline">{relationshipsCount} Links</span>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <nav className="hidden lg:flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
        {tabs.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all ${
                isActive
                  ? 'bg-white text-blue-600 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {Boolean(item.badge) && (
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Actions: Search + Start Investigation + Export Report */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSearch}
          className="flex items-center space-x-2 px-2.5 py-1.5 text-xs text-slate-500 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition-colors"
          title="Search Intelligence (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden xl:inline">Search...</span>
          <kbd className="hidden sm:inline px-1 py-0.5 text-[9px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            Ctrl+K
          </kbd>
        </button>

        <button
          onClick={onOpenNewInvestigation}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold shadow-xs transition-colors"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>New Investigation</span>
        </button>

        <button
          onClick={onOpenExportReport}
          className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-md text-xs font-medium transition-colors"
          title="Export Investigation Analysis Report"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
          <span>Report</span>
        </button>
      </div>
    </header>
  );
};

'use client';

import React from 'react';
import { 
  ShieldAlert, 
  Search, 
  FileSpreadsheet, 
  Layers, 
  Database,
  ArrowLeft,
  ChevronDown,
  Building2,
  Lock,
  Crosshair,
  Sun
} from 'lucide-react';

interface TopCommandBarProps {
  onOpenCommandPalette: () => void;
  onOpenIngestDrawer: () => void;
  onOpenExportDossier: () => void;
  topologyMode: '2D-FORCE' | '3D-HIVE';
  onToggleTopology: () => void;
  selectedOperation: string;
  onSelectOperation: (op: string) => void;
  onBackToOverview?: () => void;
  networkStats: {
    density: number;
    riskScore: number;
    activeNodes: number;
    activeEdges: number;
  };
  themeMode?: 'oled' | 'judicial';
  onToggleTheme?: (mode: 'oled' | 'judicial') => void;
}

export const TopCommandBar: React.FC<TopCommandBarProps> = ({
  onOpenCommandPalette,
  onOpenIngestDrawer,
  onOpenExportDossier,
  topologyMode,
  onToggleTopology,
  selectedOperation,
  onBackToOverview,
  networkStats,
  themeMode = 'judicial',
  onToggleTheme,
}) => {
  return (
    <header className="h-14 w-full flex-shrink-0 border-b border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between bg-white dark:bg-[#0A0F1D] select-none z-30 shadow-2xs transition-colors duration-100 ease-linear">
      {/* Left: Back to Directive & Station Badge */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {onBackToOverview && (
          <button
            onClick={onBackToOverview}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#0F1626] dark:hover:bg-[#141D30] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium transition-colors duration-100 ease-linear"
            title="Return to Directive Overview"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span className="hidden sm:inline">Directive Overview</span>
          </button>
        )}

        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 px-2.5 py-1 rounded-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400"></span>
          </span>
          <div className="flex items-center space-x-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
            <Building2 className="w-3 h-3 text-slate-500 dark:text-slate-400" />
            <span>UP-STF-VNS</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-blue-700 dark:text-cyan-400">SECURE CONSOLE</span>
          </div>
        </div>

        {/* Active Operation Selector */}
        <div className="relative group hidden lg:flex items-center">
          <div className="flex items-center space-x-2 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 px-2.5 py-1 rounded-md text-xs font-mono cursor-pointer transition-colors duration-100 ease-linear text-slate-700 dark:text-slate-200">
            <span className="text-amber-700 dark:text-amber-400 font-bold">OP:</span>
            <span className="text-slate-900 dark:text-slate-100 font-medium truncate max-w-[260px]">{selectedOperation}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>

        {/* Threat Index Badge */}
        <div className="hidden xl:flex items-center space-x-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 px-2.5 py-1 rounded-md text-xs font-mono text-rose-900 dark:text-rose-300">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          <span className="text-rose-700 dark:text-rose-400 font-bold tracking-wide">THREAT: CRITICAL</span>
          <span className="text-rose-200 dark:text-rose-800">|</span>
          <span className="text-slate-700 dark:text-slate-300">Density: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{networkStats.density.toFixed(2)}</strong></span>
          <span className="text-rose-200 dark:text-rose-800">|</span>
          <span className="text-slate-700 dark:text-slate-300">Risk: <strong className="text-rose-700 dark:text-rose-400 font-bold">{networkStats.riskScore}/100</strong></span>
        </div>
      </div>

      {/* Center: Global Search Bar with [Ctrl+K] trigger */}
      <div className="flex-1 max-w-md mx-3">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-8 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-md px-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 group transition-all duration-100 ease-linear"
        >
          <div className="flex items-center space-x-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors" />
            <span className="group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors truncate">
              Search Suspect, Alias, IMEI, UPI ID, Bank A/C...
            </span>
          </div>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-[#0A0F1D] border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 rounded shadow-2xs">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right: Action Toolbar */}
      <div className="flex items-center space-x-2 flex-shrink-0">
        {/* Tactical Environmental Lighting Switch (OLED Tactical vs Judicial Light) */}
        {onToggleTheme && (
          <div className="border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900/80 p-0.5 rounded flex items-center gap-0.5 font-mono text-[11px] select-none transition-colors duration-100 ease-linear">
            <button
              type="button"
              onClick={() => onToggleTheme('oled')}
              className={`px-2 py-1 rounded flex items-center space-x-1.5 transition-colors duration-100 ease-linear ${
                themeMode === 'oled'
                  ? 'bg-slate-900 dark:bg-slate-800 text-cyan-400 font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Switch to Tactical Dark OLED Mode"
            >
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span className="hidden sm:inline">OLED TACTICAL</span>
            </button>
            <button
              type="button"
              onClick={() => onToggleTheme('judicial')}
              className={`px-2 py-1 rounded flex items-center space-x-1.5 transition-colors duration-100 ease-linear ${
                themeMode === 'judicial'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Switch to Judicial Light Paper Mode"
            >
              <Sun className="w-3 h-3 text-amber-500" />
              <span className="hidden sm:inline">JUDICIAL LIGHT</span>
            </button>
          </div>
        )}

        {/* Ingest Raw Evidence */}
        <button
          onClick={onOpenIngestDrawer}
          className="h-8 px-2.5 bg-white dark:bg-[#0F1626] hover:bg-slate-50 dark:hover:bg-[#141D30] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-md flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-200 font-medium transition-colors duration-100 ease-linear shadow-2xs"
          title="Ingest raw FIR or interrogation diary"
        >
          <Database className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span className="hidden md:inline font-mono">Ingest Evidence</span>
        </button>

        {/* Topology Mode Switcher */}
        <button
          onClick={onToggleTopology}
          className={`h-8 px-2.5 rounded-md border flex items-center space-x-1.5 text-xs font-mono transition-colors duration-100 ease-linear shadow-2xs ${
            topologyMode === '2D-FORCE'
              ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-800 dark:text-cyan-400'
              : 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900 text-purple-800 dark:text-purple-300'
          }`}
          title="Switch Graph Topology View"
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            Topology: <span className="font-bold">{topologyMode === '2D-FORCE' ? '2D Force' : '3D Hive'}</span>
          </span>
        </button>

        {/* Export BNSS Charge-Sheet Dossier */}
        <button
          onClick={onOpenExportDossier}
          className="h-8 px-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 text-white rounded-md flex items-center space-x-1.5 text-xs font-mono font-medium shadow-xs transition-all duration-100 ease-linear whitespace-nowrap flex-shrink-0"
          title="Generate court-ready BNSS Charge-Sheet Dossier"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-300" />
          <span className="whitespace-nowrap">Export BNSS Dossier</span>
        </button>
      </div>
    </header>
  );
};

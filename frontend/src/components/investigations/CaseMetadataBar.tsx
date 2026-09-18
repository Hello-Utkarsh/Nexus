'use client';

import React from 'react';
import { 
  ShieldAlert, 
  FileText, 
  Download, 
  CheckCircle2, 
  Activity, 
  Radio, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';

interface CaseMetadataBarProps {
  caseDirective?: string;
  unitName?: string;
  onExportExhibit?: () => void;
}

export const CaseMetadataBar: React.FC<CaseMetadataBarProps> = ({
  caseDirective = 'OP: Operation Syndicate-Viper // FIR #382/2026',
  unitName = 'UP-STF Special Cell (Varanasi / Lucknow Range)',
  onExportExhibit,
}) => {
  return (
    <div className="h-8.5 flex items-center justify-between w-full overflow-hidden px-4 bg-slate-950 border-b border-slate-800/90 select-none font-sans text-xs shrink-0 z-20 shadow-2xs">
      {/* Left: Case Directive & Unit */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden min-w-0 shrink">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-rose-500" />
          <span className="font-mono font-bold text-slate-100 tracking-tight text-[11px] sm:text-[11.5px] truncate">
            {caseDirective}
          </span>
        </div>

        <span className="text-slate-700 hidden md:inline">|</span>

        <span className="text-slate-400 font-mono text-[11px] truncate hidden md:inline">
          Unit: <span className="text-slate-300 font-semibold">{unitName}</span>
        </span>
      </div>

      {/* Right: Tactical Badges & Quick Action */}
      <div className="flex-shrink-0 flex items-center gap-2">
        {/* Badges Strip */}
        <div className="hidden sm:flex items-center space-x-1.5 font-mono text-[10px]">
          <span className="px-2 py-0.5 rounded-[2px] bg-rose-950/60 text-rose-300 border border-rose-800/60 font-bold">
            THREAT: CRITICAL
          </span>

          <span className="px-2 py-0.5 rounded-[2px] bg-emerald-950/60 text-emerald-300 border border-emerald-800/60 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400 inline" />
            <span>BSA SEC 63 CERTIFIED</span>
          </span>

          <span className="px-2 py-0.5 rounded-[2px] bg-slate-900 text-slate-300 border border-slate-700 hidden lg:inline">
            DENSITY: 0.05
          </span>

          <span className="px-2 py-0.5 rounded-[2px] bg-amber-950/60 text-amber-300 border border-amber-800/60 font-bold hidden lg:inline">
            RISK: 96/100
          </span>
        </div>

        {/* Quick Action Button: Export BNSS Charge-Sheet Exhibit */}
        {onExportExhibit && (
          <button
            onClick={onExportExhibit}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white font-mono text-[11px] font-bold rounded-[2px] border border-blue-600 transition-colors uppercase tracking-wider"
            title="Export official BNSS Charge-Sheet Exhibit & Section 63 BSA Dossier"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export BNSS Charge-Sheet Exhibit</span>
            <span className="sm:hidden">BNSS Exhibit</span>
          </button>
        )}
      </div>
    </div>
  );
};

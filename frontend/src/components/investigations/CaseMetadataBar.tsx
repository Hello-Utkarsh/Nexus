'use client';

import React from 'react';
import { FileCheck } from 'lucide-react';

interface CaseMetadataBarProps {
  caseDirective?: string;
  unitName?: string;
  onExportExhibit?: () => void;
  onOpenCopilot?: () => void;
  onStartTour?: () => void;
}

export const CaseMetadataBar: React.FC<CaseMetadataBarProps> = ({
  caseDirective = 'OP: Operation Syndicate-Viper // FIR #382/2026',
  unitName = 'UP-STF (Varanasi/Lucknow)',
  onExportExhibit,
  onOpenCopilot,
  onStartTour,
}) => {
  const displayUnit = unitName.includes('UP-STF Special Cell') ? 'UP-STF (Varanasi/Lucknow)' : unitName;

  return (
    <div className="h-7.5 flex items-center justify-between w-full max-w-full overflow-hidden px-3 py-1.5 bg-slate-950/90 border-b border-slate-800/80 select-none font-sans text-xs shrink-0 z-20">
      {/* Left: Operation Directive & Unit Information */}
      <div className="flex items-center space-x-2 sm:space-x-3 overflow-hidden min-w-0 shrink">
        <div className="flex items-center space-x-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-[1px] bg-rose-500 animate-pulse" />
          <span className="font-mono font-bold text-slate-200 tracking-tight text-[11px] truncate">
            {caseDirective}
          </span>
        </div>

        <span className="text-slate-700 hidden md:inline">|</span>

        <span className="text-slate-400 font-mono text-[10.5px] truncate hidden lg:inline">
          Unit: <span className="text-slate-300 font-medium">{displayUnit}</span>
        </span>
      </div>

      {/* Right: Risk Metric & Action Buttons */}
      <div className="shrink-0 flex items-center gap-1.5">
        <span className="px-2 py-0.5 rounded-[2px] bg-amber-950/80 text-amber-300 border border-amber-800/60 font-bold font-mono text-[10px] shrink-0">
          RISK: 96/100
        </span>

        {/* Quick Action Button: Export BNSS Charge-Sheet Exhibit */}
        {onExportExhibit && (
          <button
            onClick={onExportExhibit}
            className="flex items-center space-x-1 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-mono text-[10.5px] font-medium rounded-[2px] border border-slate-700 transition-colors uppercase tracking-wider shrink-0"
            title="Export official BNSS Charge-Sheet Exhibit & Section 63 BSA Dossier"
          >
            <FileCheck className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">BNSS EXHIBIT</span>
          </button>
        )}

        {/* On-Demand Spotlight Walkthrough Tour Guide Trigger */}
        {onStartTour && (
          <button
            onClick={onStartTour}
            className="text-[11px] px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-700/40 rounded flex items-center gap-1 font-mono shrink-0 cursor-pointer transition-colors"
            title="Launch Interactive Guided Tour"
          >
            <span>? Tour Guide</span>
          </button>
        )}
      </div>
    </div>
  );
};

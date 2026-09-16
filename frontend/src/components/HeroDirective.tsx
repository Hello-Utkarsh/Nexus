'use client';

import React from 'react';
import { ArrowRight, Terminal, FileText, ShieldAlert, Cpu } from 'lucide-react';

interface HeroDirectiveProps {
  onLaunchConsole: () => void;
  onViewCaseFile: () => void;
}

export const HeroDirective: React.FC<HeroDirectiveProps> = ({
  onLaunchConsole,
  onViewCaseFile,
}) => {
  return (
    <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 border-b border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#050711] overflow-hidden">
      {/* Subtle off-white dot grid */}
      <div className="absolute inset-0 bg-govtech-grid opacity-60 dark:opacity-20 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Pre-headline Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          <span className="font-mono text-[11px] font-semibold tracking-wider uppercase text-slate-700 dark:text-slate-300">
            CRIME BRANCH & STF INTELLIGENCE DIRECTIVE — PS 13 COMPLIANT
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-[1.12]">
          De-anonymize Complex Crime Syndicates from Fragmented Intelligence.
        </h1>

        {/* Subheadline */}
        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
          Ingest unstructured FIR narratives, CDR cell tower dumps, and banking trails into an evidentiary graph network to isolate hidden cut-outs, money mules, and syndicate kingpins.
        </p>

        {/* Dual Actions */}
        <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onLaunchConsole}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-mono text-sm font-semibold transition-all shadow-sm hover:shadow active:scale-[0.98]"
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span>Launch Investigation Console</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={onViewCaseFile}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 rounded border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-white dark:bg-[#0A0F1D] hover:bg-slate-50 dark:hover:bg-[#0F1626] text-slate-700 dark:text-slate-200 font-mono text-sm font-medium transition-colors shadow-xs"
          >
            <FileText className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>View Sample Syndicate Case File →</span>
          </button>
        </div>

        {/* Operational Context Subtext */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-center gap-6 font-mono text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
            <span>Targeting Purvanchal Syndicate // FIR #382/2026 (PS Lanka)</span>
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
          <span className="flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Admissible under Sec 63 Bharatiya Sakshya Adhiniyam, 2023</span>
          </span>
        </div>
      </div>
    </section>
  );
};

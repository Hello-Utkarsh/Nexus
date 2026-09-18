'use client';

import React from 'react';
import { 
  Database, 
  GitMerge, 
  Network, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface WorkflowStep {
  step: string;
  title: string;
  subtitle: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export const WorkflowStepper: React.FC = () => {
  const steps: WorkflowStep[] = [
    {
      step: '01',
      title: 'INGEST',
      subtitle: 'Multi-Source Evidence',
      desc: 'Raw intake of bilingual FIR case diaries, telecommunications CDR dumps, BTS tower logs, and Axis/HDFC Hawala ledger statements.',
      icon: Database,
      tags: ['FIR Extraction', 'CDR Dumps', 'Bank Ledgers'],
    },
    {
      step: '02',
      title: 'CORRELATE',
      subtitle: 'NLP & Entity Resolution',
      desc: 'Bilingual NLP resolves aliases (e.g. "Pandit Ji" → "Vicky Kashi"), links burner phone IMEI churn, and clusters shared physical addresses.',
      icon: GitMerge,
      tags: ['Alias Merge', 'IMEI Correlation', 'Confidence Scores'],
    },
    {
      step: '03',
      title: 'ISOLATE',
      subtitle: 'Algorithmic Graph Proof',
      desc: 'De-anonymizes zero-call masterminds using Betweenness Centrality (≥ 0.85), Louvain community detection, and multi-hop Hawala path solvers.',
      icon: Network,
      tags: ['Betweenness Centrality', 'Zero-Call Heuristic', 'BFS Solvers'],
    },
    {
      step: '04',
      title: 'PROSECUTE',
      subtitle: 'Section 63 BSA Legal Exhibit',
      desc: 'Generates court-admissible Form 49-B case diaries and SHA-256 cryptographically sealed charge-sheet exhibits under BNS Section 111.',
      icon: Scale,
      tags: ['BNS Sec 111', 'Sec 63 BSA Hash', 'Court Exhibits'],
    },
  ];

  return (
    <div className="w-full p-3.5 rounded-[3px] border border-slate-800 bg-slate-900 font-sans shadow-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-[9.5px] font-mono font-bold text-slate-300 uppercase tracking-wider bg-slate-950 px-1.5 py-0.5 rounded-[2px] border border-slate-700">
            WORKFLOW
          </span>
          <h2 className="text-xs font-bold text-slate-200 tracking-tight font-sans">
            How CHAKRAVYUH De-Anonymizes Organized Crime
          </h2>
        </div>

        <div className="text-[10px] font-mono font-semibold text-slate-400">
          SEC 63 BSA // BNS 111
        </div>
      </div>

      {/* 4 Step Cards (INGEST, CORRELATE, ISOLATE, PROSECUTE) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-2.5">
        {steps.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.step}
              className="p-3 rounded-[2px] border border-slate-800 bg-slate-950 flex flex-col justify-between min-h-[120px] hover:border-slate-750 transition-colors group shadow-2xs"
            >
              <div className="space-y-1.5">
                {/* Step number and icon */}
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded-[2px] border border-slate-800">
                    STEP {item.step}
                  </span>

                  <div className="w-5 h-5 rounded-[2px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-slate-200 transition-colors">
                    <Icon className="w-3 h-3" />
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors font-sans">
                  {item.title}
                </h3>

                <p className="text-[10.5px] leading-snug text-slate-400 font-sans">
                  {item.desc}
                </p>
              </div>

              {/* Tags */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] py-0.5 px-1.5 rounded-[2px] bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

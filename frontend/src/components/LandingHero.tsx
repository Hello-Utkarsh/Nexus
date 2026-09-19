'use client';

import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  Sparkles, 
  Database, 
  FileSearch, 
  GitMerge, 
  Network, 
  AlertTriangle, 
  CheckCircle2, 
  Bot, 
  TrendingUp, 
  Layers,
  ChevronRight
} from 'lucide-react';
import { WorkflowStepper } from './home/WorkflowStepper';

interface LandingHeroProps {
  onStartInvestigation: () => void;
  onExploreDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartInvestigation,
  onExploreDemo,
}) => {
  const capabilities = [
    {
      icon: Database,
      title: 'Multi-Source Intelligence',
      desc: 'Correlate unstructured case diaries, structured CDR logs, and financial ledgers into one schema.'
    },
    {
      icon: FileSearch,
      title: 'AI Entity Extraction',
      desc: 'Named Entity Recognition tailored for bilingual investigative reports, identifying key nodes with confidence.'
    },
    {
      icon: GitMerge,
      title: 'Entity Resolution',
      desc: 'Candidate alias matching with multi-signal similarity breakdown (phone, location, and context overlap).'
    },
    {
      icon: Network,
      title: 'Relationship Discovery',
      desc: 'Uncover hidden links between communications, ownership, financial flows, and shared geography.'
    },
    {
      icon: TrendingUp,
      title: 'Network Analytics',
      desc: 'Real graph centrality metrics (Betweenness, PageRank, Degree) to identify structural communication bridges.'
    },
    {
      icon: AlertTriangle,
      title: 'Pattern Detection',
      desc: 'Explainable heuristic and algorithmic detectors for circular hawala loops and burner phone bursts.'
    },
    {
      icon: CheckCircle2,
      title: 'Evidence Traceability',
      desc: 'Every link, entity, and pattern is traceable directly to verifiable source records and UTR/CDR citations.'
    },
    {
      icon: Bot,
      title: 'Investigation Copilot',
      desc: 'Evidence-grounded assistant for interactive path queries, community analysis, and investigation summaries.'
    }
  ];

  return (
    <div className="relative w-full flex flex-col bg-transparent text-slate-100 select-none pb-16">
      {/* 1. OPERATIONS BRIEFING & COMMAND CONSOLE */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="bg-slate-900/80 backdrop-blur-xs border border-slate-800/80 rounded-[3px] p-5 sm:p-6 shadow-xs">
          {/* Main Console Grid: Operational Entry & Immediate Case/Session Context */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols): System Entry & Actions */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-[1.7rem] font-bold tracking-tight text-slate-100 leading-snug font-sans">
                  Turn fragmented intelligence into explainable networks of people, communications, money and locations.
                </h1>

                <p className="mt-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans max-w-2xl">
                  CHAKRAVYUH connects structured and unstructured intelligence to de-anonymize organized crime syndicates with cryptographically verifiable evidence.
                </p>
              </div>

              {/* Tactical Action Buttons (Solid, Single-Tone, Zero Gradients) */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onStartInvestigation}
                  className="h-8 px-4 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] border border-blue-600/40 shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Start Investigation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onExploreDemo}
                  className="h-8 px-4 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-mono font-semibold uppercase tracking-wider rounded-[2px] border border-slate-700 shadow-xs transition-colors flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                  <span>Explore Demo Investigation</span>
                </button>
              </div>

              {/* Dataset Disclaimer Badge */}
              <div className="text-[10.5px] text-slate-500 font-mono pt-1">
                Demonstration prototype utilizing sanitized Synthetic Dataset (Case #382/2026).
              </div>
            </div>

            {/* Right Column (5 cols): Immediate Operational Case / Session Context */}
            <div className="lg:col-span-5 bg-slate-950/80 backdrop-blur-xs border border-slate-800/80 rounded-[2px] p-3.5 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-[11px] font-bold text-slate-200 uppercase">
                  ACTIVE CASE DIRECTIVE
                </span>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.2 rounded-[2px]">
                  THREAT: CRITICAL (96/100)
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Operation:</span>
                  <span className="text-slate-200 font-semibold text-right">OP: Operation Syndicate-Viper // FIR #382/2026</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Unit:</span>
                  <span className="text-slate-300 text-right">UP-STF Special Cell (Varanasi / Lucknow Range)</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Prime Target:</span>
                  <span className="text-blue-300 font-bold text-right">Vikramaditya @ Vicky Kashi (VK-7)</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Statutory Mandate:</span>
                  <span className="text-emerald-400 text-right">Sec 63 BSA Certified // BNS Sec 111</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500">Telemetry:</span>
                  <span className="text-slate-300 text-right">42 Entities • 87 Relationships • 4 Patterns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL WORKFLOW PIPELINE */}
      <section className="w-full max-w-7xl mx-auto px-4 my-3">
        <WorkflowStepper />
      </section>

      {/* 3. CORE ANALYTICAL CAPABILITIES (SPEC-SHEET / CAPABILITY-MANIFEST TREATMENT) */}
      <section className="w-full max-w-7xl mx-auto px-4 my-4">
        <div className="mb-3 flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-800 pb-2.5 gap-1">
          <h2 className="text-sm sm:text-base font-bold text-slate-100 font-sans tracking-tight">
            Core Analytical Capabilities
          </h2>
          <p className="text-xs text-slate-400 font-sans">
            Analytical tools engineered specifically for investigative correlation without black-box conclusions.
          </p>
        </div>

        {/* Capability Manifest Spec-Sheet Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {capabilities.map((cap, idx) => {
            const specId = `CAP-0${idx + 1}`;
            return (
              <div
                key={idx}
                className="p-3 bg-slate-900/80 backdrop-blur-xs border border-slate-800/80 hover:border-slate-700 rounded-[2px] shadow-2xs transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5 mb-2">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {specId}
                    </span>
                    <span className="text-[9.5px] font-mono uppercase text-slate-500">
                      SPECIFICATION
                    </span>
                  </div>
                  <h3 className="text-xs font-bold font-mono text-slate-100 tracking-tight">
                    {cap.title}
                  </h3>
                  <p className="text-[11.5px] text-slate-400 mt-1.5 leading-relaxed font-sans">
                    {cap.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

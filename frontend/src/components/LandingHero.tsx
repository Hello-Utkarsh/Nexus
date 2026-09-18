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
    <div className="w-full flex flex-col bg-slate-950 text-slate-100 select-none pb-16">
      {/* 1. OPERATIONS BRIEFING & COMMAND CONSOLE */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-4 pb-2">
        <div className="bg-slate-900 border border-slate-800 rounded-[3px] p-5 sm:p-6 shadow-xs">
          {/* Status & Classification Marker Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
            <div className="inline-flex items-center space-x-2 px-2 py-0.5 rounded-[2px] bg-slate-950 border border-slate-700 text-slate-300 text-[10px] font-mono font-bold tracking-wider">
              <Shield className="w-3 h-3 text-slate-400" />
              <span>AI-POWERED CRIMINAL NETWORK INTELLIGENCE</span>
            </div>

            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
              <span>SECURE OPERATIONS WORKSPACE</span>
            </div>
          </div>

          {/* Authoritative Operational Headline & Overview */}
          <div className="mt-4 max-w-4xl">
            <h1 className="text-xl sm:text-2xl lg:text-[1.75rem] font-semibold tracking-tight text-slate-100 leading-snug font-sans">
              Turn fragmented intelligence into explainable networks of people, communications, money and locations.
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-sans max-w-3xl">
              CHAKRAVYUH connects structured and unstructured intelligence to de-anonymize organized crime syndicates with cryptographically verifiable evidence.
            </p>
          </div>

          {/* Tactical Action Buttons (Solid, Single-Tone, Zero Gradients) */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <button
                onClick={onStartInvestigation}
                className="h-8 px-4 bg-[#1e3a8a] hover:bg-[#1d4ed8] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-[2px] border border-blue-600/40 shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <span>Start Investigation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onExploreDemo}
                className="h-8 px-4 bg-slate-950 hover:bg-slate-850 text-slate-200 text-xs font-mono font-semibold uppercase tracking-wider rounded-[2px] border border-slate-700 shadow-xs transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                <span>Explore Demo Investigation</span>
              </button>
            </div>

            {/* Dataset Disclaimer Badge */}
            <div className="text-[10.5px] text-slate-500 font-mono">
              Demonstration prototype utilizing sanitized Synthetic Dataset (Case #382/2026).
            </div>
          </div>
        </div>
      </section>

      {/* 2. OPERATIONAL WORKFLOW PIPELINE */}
      <section className="w-full max-w-7xl mx-auto px-4 my-3">
        <WorkflowStepper />
      </section>

      {/* 3. CORE ANALYTICAL CAPABILITIES */}
      <section className="w-full max-w-7xl mx-auto px-4 my-4">
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <div>
            <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-wider">
              ENGINEERED FOR EXPLAINABILITY
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-100 mt-0.5 font-sans">
              Core Analytical Capabilities
            </h2>
          </div>
          <p className="text-xs text-slate-500 hidden md:block max-w-md text-right font-sans">
            Analytical tools engineered specifically for investigative correlation without black-box conclusions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-3.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-[2px] shadow-2xs transition-colors space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-7 h-7 rounded-[2px] bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 mb-2">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-200 tracking-tight font-sans">{cap.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed font-sans">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLEAN FOOTER */}
      <footer className="w-full max-w-7xl mx-auto px-4 pt-6 pb-4 border-t border-slate-800/80 text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-400 font-mono">CHAKRAVYUH</span>
            <span>— Criminal Network Intelligence Platform</span>
          </div>
          <div className="text-[10.5px] font-mono text-slate-500">
            Prototype demonstration using synthetic intelligence records.
          </div>
        </div>
      </footer>
    </div>
  );
};

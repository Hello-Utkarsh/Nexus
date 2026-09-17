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

interface LandingHeroProps {
  onStartInvestigation: () => void;
  onExploreDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onStartInvestigation,
  onExploreDemo,
}) => {
  const steps = [
    { num: '01', title: 'INGEST', desc: 'Collect fragmented intelligence from FIRs, CDRs, and banking ledgers.' },
    { num: '02', title: 'EXTRACT', desc: 'AI identifies important entities across people, phones, accounts, and locations.' },
    { num: '03', title: 'RESOLVE', desc: 'Connect aliases, misspelled names, and duplicate identities with confidence metrics.' },
    { num: '04', title: 'CONNECT', desc: 'Build an explainable multi-modal knowledge graph with verifiable links.' },
    { num: '05', title: 'DETECT', desc: 'Find unusual patterns like circular transactions, midnight bursts, and device churn.' },
    { num: '06', title: 'INVESTIGATE', desc: 'Explore evidence-backed insights with AI Copilot decision support.' },
  ];

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
    <div className="w-full flex flex-col bg-[#F8FAFC] text-slate-900 select-none">
      {/* 1. HERO SECTION */}
      <section className="pt-20 pb-16 px-4 max-w-5xl mx-auto text-center">
        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6 shadow-2xs">
          <Shield className="w-3.5 h-3.5" />
          <span>AI-POWERED CRIMINAL NETWORK INTELLIGENCE</span>
        </div>

        {/* Headline (Section 5 & 10) */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
          Turn fragmented intelligence into explainable networks of people, communications, money and locations.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          CHAKRAVYUH helps investigators connect structured and unstructured intelligence, discover hidden relationships, identify unusual patterns and trace every analytical finding back to its supporting evidence.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={onStartInvestigation}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
          >
            <span>Start Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Explore Demo Investigation</span>
          </button>
        </div>

        {/* Dataset Disclaimer Badge */}
        <div className="mt-8 text-xs text-slate-400 font-mono">
          Demonstration prototype utilizing sanitized Synthetic Dataset (Case #382/2026).
        </div>
      </section>

      {/* 2. PIPELINE: HOW CHAKRAVYUH WORKS (Section 10) */}
      <section className="py-16 bg-white border-y border-slate-200 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-widest">
              INVESTIGATION WORKFLOW
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              How CHAKRAVYUH Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
              From raw case files to evidence-backed decision support through an explainable AI pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {steps.map((st, i) => (
              <div 
                key={i}
                className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex flex-col justify-between hover:border-slate-300 transition-colors"
              >
                <div>
                  <span className="text-xs font-bold font-mono text-blue-600">{st.num}</span>
                  <h3 className="text-xs font-bold text-slate-900 mt-1 mb-1.5 uppercase">{st.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE CAPABILITIES (Section 10) */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-bold font-mono text-blue-600 uppercase tracking-widest">
            ENGINEERED FOR EXPLAINABILITY
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Core Analytical Capabilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl mx-auto">
            Analytical tools engineered specifically for investigative correlation without black-box conclusions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-5 bg-white border border-slate-200 hover:border-slate-300 rounded-xl shadow-xs transition-all space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{cap.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. CLEAN FOOTER */}
      <footer className="py-8 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800">CHAKRAVYUH</span>
            <span>— Criminal Network Intelligence Platform</span>
          </div>
          <div className="text-[11px] font-mono text-slate-400">
            Prototype demonstration using synthetic intelligence records.
          </div>
        </div>
      </footer>
    </div>
  );
};

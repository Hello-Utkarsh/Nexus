'use client';

import React from 'react';
import { 
  FileSearch, 
  Target, 
  Activity, 
  FileCheck, 
  Cpu, 
  ArrowRight,
  ShieldAlert,
  Hash,
  Share2,
  Lock
} from 'lucide-react';

interface CapabilitiesGridProps {
  onExploreCapability: (id: string) => void;
}

export const CapabilitiesGrid: React.FC<CapabilitiesGridProps> = ({
  onExploreCapability,
}) => {
  return (
    <section id="capabilities" className="py-16 md:py-20 bg-white dark:bg-[#050711] border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center space-x-1.5 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-blue-500"></span>
            <span>CORE ARCHITECTURAL MODULES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Engineered specifically for complex syndicate prosecution.
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            Built to eliminate analytical bottlenecks across fragmented multi-agency intelligence dumps: from raw case diaries to courtroom charge-sheet exhibits.
          </p>
        </div>

        {/* Asymmetric 2x2 Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Panel 1: Multi-Source Unstructured Entity Extraction */}
          <div className="bg-slate-50/70 dark:bg-[#0A0F1D] rounded border border-slate-200 dark:border-slate-800 p-6 md:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="w-9 h-9 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center mb-4 shadow-xs">
                <FileSearch className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="font-mono text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Module 01 // NLP Intelligence Ingestor
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 mb-3">
                Multi-Source Unstructured Entity Extraction
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Named Entity Recognition models trained on bilingual Hindi/English FIR text, case diaries, and interrogation confessions. Extracts suspects, dummy bank accounts, and IMEI numbers with verified confidence metrics.
              </p>

              {/* Concrete Micro-UI Preview */}
              <div className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded p-3 font-mono text-xs space-y-1.5 shadow-xs">
                <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 pb-1 flex justify-between">
                  <span>NER Tagging Output</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">99.4% Corroborated</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-[11px]">
                    PERSON: Vikramaditya @ Vicky Kashi
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-700 dark:text-amber-300 text-[11px]">
                    ACCOUNT: Axis Bank #9182
                  </span>
                  <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-700 dark:text-teal-300 text-[11px]">
                    TOWER: BTS-UP-VNS-71
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-[11px]">
                    MONEY: ₹18,50,000
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between font-mono text-xs text-slate-600 dark:text-slate-400">
              <span>Bi-lingual Hindi/English NLP</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Live in Left Dock →</span>
            </div>
          </div>

          {/* Panel 2: Algorithmic Kingpin & Cut-Out Isolation */}
          <div className="bg-slate-50/70 dark:bg-[#0A0F1D] rounded border border-slate-200 dark:border-slate-800 p-6 md:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="w-9 h-9 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center mb-4 shadow-xs">
                <Target className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="font-mono text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Module 02 // Graph Topology Engine
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 mb-3">
                Algorithmic Kingpin & Cut-Out Isolation
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                High-level masterminds maintain zero direct calls to victims or shooters. CHAKRAVYUH leverages PageRank and Betweenness Centrality thresholds to isolate strategic bridge nodes connecting disparate operational clusters.
              </p>

              {/* Concrete Micro-UI Preview */}
              <div className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded p-3 font-mono text-xs space-y-2 shadow-xs">
                <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span>Betweenness Cut-Off Threshold</span>
                  <span className="text-slate-900 dark:text-slate-100 font-bold">β ≥ 0.85</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>1. Vikramaditya @ Vicky Kashi (Kingpin)</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">0.942</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>2. Tariq Bhai @ Dubai Desk (Handler)</span>
                    <strong className="text-rose-600 dark:text-rose-400 font-mono">0.912</strong>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>3. Rahul 'Mule' Sharma (Layering Broker)</span>
                    <strong className="text-amber-600 dark:text-amber-400 font-mono">0.818</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between font-mono text-xs text-slate-600 dark:text-slate-400">
              <span>NetworkX Eigenvector & Betweenness</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Tunable in Filter Dock →</span>
            </div>
          </div>

          {/* Panel 3: Automated Pattern & Circular Flow Radar */}
          <div className="bg-slate-50/70 dark:bg-[#0A0F1D] rounded border border-slate-200 dark:border-slate-800 p-6 md:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="w-9 h-9 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center mb-4 shadow-xs">
                <Activity className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="font-mono text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Module 03 // Heuristic Pattern Heuristics
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 mb-3">
                Automated Pattern & Circular Flow Radar
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Real-time cyclic graph traversal flags Hawala layering smurfing rings, midnight burner bursts between 01:00-04:00 AM, and rapid IMEI-to-IMSI swapping on pre-activated Cantt Station SIM cards.
              </p>

              {/* Concrete Micro-UI Preview */}
              <div className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded p-3 font-mono text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span>Suspicious Pattern Detections</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">3 Active Alerts</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[11px] text-center">
                  <div className="p-1.5 rounded bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300">
                    <span className="block font-bold">Hawala Loop</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">4 Cycle Hops</span>
                  </div>
                  <div className="p-1.5 rounded bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-900/60 text-teal-800 dark:text-teal-300">
                    <span className="block font-bold">Midnight Burst</span>
                    <span className="text-[10px] text-teal-600 dark:text-teal-400">BTS Tower 71</span>
                  </div>
                  <div className="p-1.5 rounded bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-900/60 text-purple-800 dark:text-purple-300">
                    <span className="block font-bold">SIM Swap</span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400">6 MSISDNs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between font-mono text-xs text-slate-600 dark:text-slate-400">
              <span>Autonomous Pattern Scanner</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">1-Click Radar Filter →</span>
            </div>
          </div>

          {/* Panel 4: Court-Ready Chain of Custody */}
          <div className="bg-slate-50/70 dark:bg-[#0A0F1D] rounded border border-slate-200 dark:border-slate-800 p-6 md:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-xs">
            <div>
              <div className="w-9 h-9 rounded bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 flex items-center justify-center mb-4 shadow-xs">
                <FileCheck className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </div>
              <span className="font-mono text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                Module 04 // Statutory Court Admissibility
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1 mb-3">
                Court-Ready Chain of Custody & BSA Sec 63
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">
                Generates high-contrast judicial dossiers admissible under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (erstwhile Sec 65B IEA), accompanied by SHA-256 digital evidence hashes and formal police officer certifications.
              </p>

              {/* Concrete Micro-UI Preview */}
              <div className="bg-white dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded p-3 font-mono text-xs space-y-1.5 shadow-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100 dark:border-slate-800 pb-1">
                  <span>Cryptographic Evidence Manifest</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">SHA-256 Locked</span>
                </div>
                <div className="text-[10px] text-slate-700 dark:text-slate-300 break-all bg-slate-50 dark:bg-[#0A0F1D] p-1.5 rounded border border-slate-200 dark:border-slate-800">
                  9f8a3c2e1b4d5a6f7e8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c8b9a0
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Certificate: A. K. Singh, PPS (DSP STF)</span>
                  <span className="text-slate-900 dark:text-slate-200 font-semibold">FIR #382/2026 Exhibit</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between font-mono text-xs text-slate-600 dark:text-slate-400">
              <span>Section 193 BNSS Charge-Sheet Ready</span>
              <span className="text-slate-900 dark:text-slate-200 font-semibold">Export PDF Dossier →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

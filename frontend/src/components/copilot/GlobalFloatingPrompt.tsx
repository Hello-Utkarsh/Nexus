'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  X, 
  ChevronUp, 
  ChevronDown, 
  Radio, 
  Terminal, 
  ShieldAlert, 
  AlertTriangle, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  Network, 
  FileText, 
  Copy, 
  Check,
  Minimize2,
  Maximize2
} from 'lucide-react';

interface GlobalFloatingPromptProps {
  onHighlightInGraph?: (entityIds: string[], focusId?: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export type QueryPresetType = 'interpol' | 'hawala' | 'mastermind' | 'custom';

interface WantedCriminal {
  id: string;
  name: string;
  alias: string;
  redNoticeRef: string;
  issuingAgency: string;
  threatLevel: 'TIER-1 CRITICAL' | 'HIGH' | 'MEDIUM-HIGH';
  score: number;
  wantedFor: string;
  status: 'ACTIVE FUGITIVE' | 'LOC ISSUED' | 'RED CORNER DISPATCHED';
}

const TOP_WANTED_CRIMINALS: WantedCriminal[] = [
  {
    id: 'ent-vicky',
    name: 'Vikramaditya @ Vicky Kashi',
    alias: 'VK-7 / Pandit Ji',
    redNoticeRef: 'INTERPOL-RN-2026/IN-0941',
    issuingAgency: 'CBI (NCB New Delhi) / UP STF',
    threatLevel: 'TIER-1 CRITICAL',
    score: 96,
    wantedFor: 'BNS 111 (Organized Crime Syndicate), Sec 308(4) Extortion, Arms Act',
    status: 'RED CORNER DISPATCHED',
  },
  {
    id: 'ent-tariq',
    name: 'Tariq @ Al-Nahda Handler',
    alias: 'Tariq Dubai / Abu Zar',
    redNoticeRef: 'INTERPOL-RN-2025/AE-4412',
    issuingAgency: 'CBI / Enforcement Directorate (ED)',
    threatLevel: 'TIER-1 CRITICAL',
    score: 92,
    wantedFor: 'PMLA (Money Laundering), Cross-Border Hawala Layering, BNS 111',
    status: 'ACTIVE FUGITIVE',
  },
  {
    id: 'ent-sharad',
    name: 'Sharad "Shooter" Tiwari',
    alias: 'ST-Varanasi / Chhota Pandit',
    redNoticeRef: 'INTERPOL-RN-2026/IN-1108',
    issuingAgency: 'UP Police STF / NCB',
    threatLevel: 'HIGH',
    score: 88,
    wantedFor: 'Contract Extortion, BNS 103 (Attempted Homicide), Sec 25 Arms Act',
    status: 'LOC ISSUED',
  },
  {
    id: 'ent-imran',
    name: 'Imran @ SIM Box Operator',
    alias: 'Bhaijan / VoIP Ghost',
    redNoticeRef: 'INTERPOL-RN-2026/NP-0329',
    issuingAgency: 'Special Cell / Nepal Police Bureau',
    threatLevel: 'MEDIUM-HIGH',
    score: 81,
    wantedFor: 'Illegal GSM/VoIP Gateway, Sec 4 Indian Telegraph Act, Forgery',
    status: 'ACTIVE FUGITIVE',
  },
  {
    id: 'ent-rahul',
    name: 'Munim @ Rahul Sharma',
    alias: 'Rahul Purvanchal / Hawala Munim',
    redNoticeRef: 'INTERPOL-RN-2026/IN-0824',
    issuingAgency: 'Economic Offences Wing (EOW) / STF',
    threatLevel: 'HIGH',
    score: 85,
    wantedFor: 'BNS 318(4) Cheating, Hawala Cash Courier Coordination, PMLA',
    status: 'LOC ISSUED',
  },
];

export const GlobalFloatingPrompt: React.FC<GlobalFloatingPromptProps> = ({
  onHighlightInGraph,
  onNavigateTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeAnalysisStage, setActiveAnalysisStage] = useState('');
  const [activeResultModal, setActiveResultModal] = useState<QueryPresetType | null>(null);
  const [customResponseText, setCustomResponseText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut: Ctrl+K or / to focus input; Esc to dismiss modal or minimize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => {
          const next = !prev;
          if (next) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
          return next;
        });
      } else if (e.key === 'Escape') {
        if (activeResultModal) {
          setActiveResultModal(null);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeResultModal, isOpen]);

  // Trigger 1-second animated intelligence synthesis
  const executeQuery = (preset: QueryPresetType, customText?: string) => {
    setIsAnalyzing(true);
    setActiveResultModal(null);

    const stages = [
      'Scanning 42-Node Knowledge Graph & Telecom Tower-71 Intercepts...',
      'Cross-referencing Interpol Red Notice & STF Central Dossiers...',
      'Computing Section 63 BSA Evidentiary Weight & Multi-Hop Path...',
      'Synthesizing Structured Judicial Finding...',
    ];

    let step = 0;
    setActiveAnalysisStage(stages[0]);
    const stepInterval = setInterval(() => {
      step++;
      if (step < stages.length) {
        setActiveAnalysisStage(stages[step]);
      }
    }, 240);

    setTimeout(() => {
      clearInterval(stepInterval);
      setIsAnalyzing(false);
      setActiveResultModal(preset);
      if (preset === 'custom' && customText) {
        setCustomResponseText(
          `Copilot synthesized analysis for "${customText}": Evidence correlations indicate active tactical coordination via Assi Ghat corridor BTS-UP-VNS-71. Primary financial layering leads through Purvanchal Traders (Axis Bank #91828400192) to Al-Nahda Exchange Dubai. Evidentiary integrity verified under Section 63 BSA.`
        );
      }
    }, 1000);
  };

  const handleHighlightInGraph = (entityIds: string[], focusId?: string) => {
    setActiveResultModal(null);
    if (onNavigateTab) {
      onNavigateTab('network');
    }
    if (onHighlightInGraph) {
      onHighlightInGraph(entityIds, focusId);
    }
  };

  const copyResultText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 1. Persistent Docked Query Terminal / Slide-Up Console (Bottom-Right, z-50) */}
      <div className="fixed bottom-3 right-3 z-50 select-none font-mono pointer-events-auto">
        {!isOpen ? (
          /* Sleek, Compact Docked Terminal Tab (~140px width, ~28px height) */
          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 80);
            }}
            className="flex items-center justify-between space-x-2 px-2.5 h-7 w-[140px] bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 rounded-[2px] shadow-xs text-slate-200 transition-colors font-mono text-[11px] group"
            title="Open CHAKRAVYUH AI Query Terminal (Ctrl + K)"
          >
            <div className="flex items-center space-x-1.5 shrink-0">
              <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
              <span className="w-1.5 h-1.5 rounded-[1px] bg-emerald-500" />
            </div>
            <span className="text-[11px] font-bold text-slate-200 tracking-wider uppercase">
              Copilot
            </span>
            <kbd className="px-1 py-0.2 text-[8.5px] font-mono bg-slate-950 border border-slate-700 text-slate-400 rounded-[2px] group-hover:text-slate-200 shrink-0">
              Ctrl+K
            </kbd>
          </button>
        ) : (
          /* Expanded Docked Query Terminal Console (~440px x ~520px) */
          <div className="w-[440px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-4rem)] bg-slate-950 border border-slate-700 rounded-[3px] shadow-xl flex flex-col overflow-hidden text-slate-100">
            {/* Terminal Header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-[2px] bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-mono font-bold text-white tracking-wider">
                      CHAKRAVYUH AI COPILOT
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-slate-950 text-slate-300 border border-slate-700 rounded-[2px] font-semibold">
                      OS
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    STF Directive PS 13 • Decision Support
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[2px] transition-colors"
                  title="Minimize (Esc)"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[2px] transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Quick Presets & Guidance Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
              {/* Guidance Notice */}
              <div className="p-2.5 bg-slate-900/80 rounded-xl border border-slate-800/90 text-xs font-mono text-slate-300 space-y-1">
                <div className="text-[10px] uppercase text-sky-400 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Real-Time Intelligence Presets</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Select a forensic query preset or enter custom keywords to traverse graph topology, trace money laundering, and cross-reference Red Notices.
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">
                  Tactical Query Presets
                </div>

                {/* Preset 1 */}
                <button
                  type="button"
                  onClick={() => executeQuery('interpol')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-slate-900/90 hover:bg-slate-850 hover:border-sky-500/80 border border-slate-800 rounded-xl transition-all group flex items-start space-x-2.5 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-sky-950 border border-sky-800/80 text-sky-400 group-hover:text-white shrink-0 mt-0.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white group-hover:text-sky-300 transition-colors">
                      🚨 Top 5 Wanted Criminals
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                      Cross-reference Interpol Red Notices & STF active fugitives.
                    </div>
                  </div>
                </button>

                {/* Preset 2 */}
                <button
                  type="button"
                  onClick={() => executeQuery('hawala')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-slate-900/90 hover:bg-slate-850 hover:border-amber-500/80 border border-slate-800 rounded-xl transition-all group flex items-start space-x-2.5 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-amber-950 border border-amber-800/80 text-amber-400 group-hover:text-white shrink-0 mt-0.5">
                    <Network className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white group-hover:text-amber-300 transition-colors">
                      💸 Trace Hawala Layering Loop
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                      Assi Ghat Tower 71 corridor & Axis Bank #9182 smurfing trail.
                    </div>
                  </div>
                </button>

                {/* Preset 3 */}
                <button
                  type="button"
                  onClick={() => executeQuery('mastermind')}
                  disabled={isAnalyzing}
                  className="w-full text-left p-3 bg-slate-900/90 hover:bg-slate-850 hover:border-emerald-500/80 border border-slate-800 rounded-xl transition-all group flex items-start space-x-2.5 shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-950 border border-emerald-800/80 text-emerald-400 group-hover:text-white shrink-0 mt-0.5">
                    <Terminal className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-mono font-bold text-white group-hover:text-emerald-300 transition-colors">
                      👑 Isolate Zero-Call Mastermind
                    </div>
                    <div className="text-[11px] text-slate-400 font-sans mt-0.5 leading-snug">
                      Prove Vicky Kashi central controller via Betweenness Centrality (0.942).
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Bottom Input Command Bar */}
            <div className="p-3 bg-slate-900/95 border-t border-slate-800 space-y-1.5 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (inputQuery.trim()) {
                    executeQuery('custom', inputQuery.trim());
                    setInputQuery('');
                  }
                }}
                className="flex items-center space-x-2 relative"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Query case telemetry or warrants... (Ctrl+K)"
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all shadow-inner"
                />
                {inputQuery && (
                  <button
                    type="button"
                    onClick={() => setInputQuery('')}
                    className="absolute right-12 text-slate-500 hover:text-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isAnalyzing || !inputQuery.trim()}
                  className="p-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl shadow-sm transition-all shrink-0 flex items-center justify-center group"
                  title="Execute Copilot Query"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>Esc to minimize</span>
                <span>Enter to execute</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 1-Second Animated Intelligence Scanning Progress Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs font-mono">
          <div className="bg-slate-900 border border-slate-700 rounded-[3px] p-6 shadow-xl max-w-md w-full mx-4 space-y-4 text-center relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600" />
            
            <div className="w-10 h-10 mx-auto rounded-[2px] bg-slate-950 border border-slate-700 flex items-center justify-center text-slate-300">
              <Cpu className="w-5 h-5 animate-spin" />
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-200 tracking-wider uppercase flex items-center justify-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                <span>CHAKRAVYUH SYNTHESIS ENGINE</span>
              </div>
              <p className="text-xs text-slate-300 h-8 flex items-center justify-center transition-all">
                {activeAnalysisStage}
              </p>
            </div>

            <div className="w-full bg-slate-950 rounded-[1px] h-1.5 overflow-hidden border border-slate-800">
              <div className="h-full bg-blue-600 rounded-[1px] animate-progress" style={{ width: '100%' }} />
            </div>
            <div className="text-[10px] text-slate-500">
              CRIME BRANCH & STF DIRECTIVE PS 13 SECURE TELEMETRY
            </div>
          </div>
        </div>
      )}

      {/* 3. Dedicated High-Contrast Intelligence Result Overlay Modal / Card */}
      {activeResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto font-sans">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-[3px] shadow-xl overflow-hidden my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="text-sm font-bold font-mono text-white tracking-wider uppercase">
                      {activeResultModal === 'interpol' && 'Interpol Red Notice Intelligence Bulletin'}
                      {activeResultModal === 'hawala' && 'Hawala Layering Loop Multi-Hop Deduction'}
                      {activeResultModal === 'mastermind' && 'Zero-Call Kingpin Centrality Proof'}
                      {activeResultModal === 'custom' && 'Ad-Hoc Knowledge Graph Telemetry Finding'}
                    </h2>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                      SEC 63 BSA VERIFIED
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Cryptographically bound finding • Central Police STF Repository
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => setActiveResultModal(null)}
                  className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Dismiss (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[75vh] overflow-y-auto space-y-4">
              {/* CASE 1: TOP 5 WANTED CRIMINALS (INTERPOL RED NOTICE) */}
              {activeResultModal === 'interpol' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-rose-900/50 rounded-lg p-3 flex items-start space-x-3 text-xs">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold text-rose-300 uppercase">
                        INTERPOL RED CORNER NOTICE & CBI LOOK-OUT CIRCULAR (LOC) ACTIVE:
                      </span>{' '}
                      <span className="text-slate-300">
                        5 key syndicates nodes flagged with Tier-1 warrant status across Varanasi, Deira (Dubai), and Nepal transit points.
                      </span>
                    </div>
                  </div>

                  {/* 5-Row Structured Table */}
                  <div className="border border-slate-800 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                          <tr>
                            <th className="p-3">Target Name & Alias</th>
                            <th className="p-3">Red Notice Ref</th>
                            <th className="p-3">Issuing Agency</th>
                            <th className="p-3">Threat Level</th>
                            <th className="p-3">Wanted For (Statutes)</th>
                            <th className="p-3 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                          {TOP_WANTED_CRIMINALS.map((crim) => (
                            <tr key={crim.id} className="hover:bg-slate-800/40 transition-colors">
                              <td className="p-3">
                                <div className="font-bold text-white text-xs">{crim.name}</div>
                                <div className="text-[10px] text-sky-400">{crim.alias}</div>
                              </td>
                              <td className="p-3 text-slate-300 font-mono text-[11px]">
                                {crim.redNoticeRef}
                              </td>
                              <td className="p-3 text-slate-300 text-[11px]">
                                {crim.issuingAgency}
                              </td>
                              <td className="p-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    crim.threatLevel === 'TIER-1 CRITICAL'
                                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                                  }`}
                                >
                                  {crim.threatLevel} ({crim.score})
                                </span>
                              </td>
                              <td className="p-3 text-slate-300 text-[11px] max-w-[220px]">
                                {crim.wantedFor}
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleHighlightInGraph([crim.id], crim.id)}
                                  className="px-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-[10px] font-mono font-semibold transition-colors shrink-0"
                                >
                                  Isolate
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Synchronized with NCBs New Delhi & Abu Dhabi</span>
                    </span>
                    <button
                      onClick={() => handleHighlightInGraph(TOP_WANTED_CRIMINALS.map(c => c.id))}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors"
                    >
                      <Network className="w-3.5 h-3.5 text-sky-400" />
                      <span>Highlight All 5 in Graph Canvas</span>
                    </button>
                  </div>
                </div>
              )}

              {/* CASE 2: TRACE HAWALA LOOP */}
              {activeResultModal === 'hawala' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-amber-700/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-300 uppercase">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Deduction: Hawala Layering Loop (Assi Ghat ↔ Dubai Conduit)</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      Telecom tower telemetry from <span className="text-sky-300 font-mono font-semibold">BTS-UP-VNS-71 (Assi Ghat)</span> is synchronized with transaction pulses on Axis Bank Account <span className="text-sky-300 font-mono font-semibold">#91828400192 (Purvanchal Traders)</span>. Over <span className="text-emerald-400 font-mono font-bold">₹42,50,000 INR</span> was routed from <span className="text-white font-mono font-semibold">Al-Nahda Exchange (Deira, Dubai via Tariq)</span> into three local mule conduits for bullion conversion.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Tower Intercept</div>
                      <div className="text-white font-bold mt-1">BTS-UP-VNS-71</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Assi Ghat / Bhelupur</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Primary Bank Node</div>
                      <div className="text-white font-bold mt-1">Axis #91828400192</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Purvanchal Traders (UTIB0000214)</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Cross-Border Handler</div>
                      <div className="text-white font-bold mt-1">Al-Nahda Exchange</div>
                      <div className="text-slate-400 text-[10px] mt-0.5">Deira, Dubai (UAE)</div>
                    </div>
                  </div>

                  {/* Evidentiary Hash Reference */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-slate-500 uppercase">Evidentiary Chain-of-Custody</div>
                      <div className="text-slate-300 text-[11px]">
                        WT-LOG-902-TAP // TXN-RTGS-AXIS-9812 // SEC 63 BSA HASH: <span className="text-sky-400">c61a...99e4</span>
                      </div>
                    </div>
                    <button
                      onClick={() => copyResultText('WT-LOG-902-TAP | TXN-RTGS-AXIS-9812 | c61a7a28e3b441f99e4d01b')}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center space-x-1"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Highlight in Graph Canvas Button */}
                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleHighlightInGraph(['ent-vicky', 'ent-axis', 'ent-al-nahda', 'ent-rahul'], 'ent-axis')}
                      className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-2 shadow-md transition-all"
                    >
                      <Network className="w-4 h-4" />
                      <span>Highlight in Graph Canvas</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* CASE 3: ISOLATE ZERO-CALL MASTERMIND */}
              {activeResultModal === 'mastermind' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-emerald-700/60 rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Centrality Heuristic: Zero-Call Kingpin De-Anonymization</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      Target <span className="text-sky-300 font-mono font-semibold">Vikramaditya @ Vicky Kashi</span> exhibits a Betweenness Centrality of <span className="text-emerald-400 font-mono font-bold">0.942</span> (highest in the 42-node network). Crucially, the target makes <span className="text-rose-400 font-bold">0 direct cellular calls</span> to lower-tier operational hitmen or mules. Communication is exclusively channeled through SIP VOIP burner relays and encrypted messenger handles.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Betweenness Centrality</div>
                      <div className="text-emerald-400 font-bold text-base mt-0.5">0.942</div>
                      <div className="text-slate-400 text-[10px]">Threshold: ≥ 0.85 (Critical)</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Direct Voice Calls</div>
                      <div className="text-rose-400 font-bold text-base mt-0.5">0 Calls</div>
                      <div className="text-slate-400 text-[10px]">Zero-Direct-Contact Ring</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase">Prime Accused Rank</div>
                      <div className="text-white font-bold text-base mt-0.5">Tier-1 Mastermind</div>
                      <div className="text-slate-400 text-[10px]">FIR #382/2026 Assi Ghat</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-end space-x-3">
                    <button
                      onClick={() => handleHighlightInGraph(['ent-vicky', 'ent-rahul', 'ent-sharad'], 'ent-vicky')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-2 shadow-md transition-all"
                    >
                      <Network className="w-4 h-4" />
                      <span>Isolate on Graph Workbench</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* CASE 4: AD-HOC CUSTOM QUERY RESPONSE */}
              {activeResultModal === 'custom' && (
                <div className="space-y-4">
                  <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-4 space-y-3">
                    <div className="flex items-center space-x-2 text-xs font-mono font-bold text-sky-400">
                      <Terminal className="w-4 h-4" />
                      <span>Copilot Synthesized Analysis</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-900 p-3 rounded border border-slate-800">
                      {customResponseText}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs font-mono">
                    <button
                      onClick={() => copyResultText(customResponseText)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded flex items-center space-x-1.5 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      <span>{copied ? 'Copied to Clipboard' : 'Copy Analysis'}</span>
                    </button>

                    <button
                      onClick={() => handleHighlightInGraph(['ent-vicky', 'ent-axis', 'ent-al-nahda'], 'ent-vicky')}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
                    >
                      <Network className="w-3.5 h-3.5" />
                      <span>Highlight in Graph Canvas</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>SECTION 111 BNS (ORGANIZED CRIME) INVESTIGATIVE AID</span>
              </span>
              <span className="text-slate-500">
                Press ESC to close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

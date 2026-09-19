'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle2, 
  PhoneCall, 
  Landmark, 
  ShieldCheck, 
  MapPin,
  Calendar,
  ExternalLink,
  Play,
  Pause,
  Video,
  Mic,
  Maximize2,
  X,
  Lock,
  ArrowRight,
  UploadCloud
} from 'lucide-react';
import { Evidence, Entity } from '../../types/intelligence';
import { IndiaMapBackdrop } from '../dashboard/IndiaMapBackdrop';

export type EvidenceCategory = 'ALL' | 'FIR' | 'CDR' | 'CCTV' | 'HAWALA';

interface EvidenceVaultViewProps {
  evidenceCatalog: Evidence[];
  entities: Entity[];
  onViewInNetwork: (entityIds: string[]) => void;
  onSelectSourceTag?: (tag: string) => void;
  onOpenIngestEvidence?: () => void;
}

export const EvidenceVaultView: React.FC<EvidenceVaultViewProps> = ({
  evidenceCatalog,
  entities,
  onViewInNetwork,
  onSelectSourceTag,
  onOpenIngestEvidence,
}) => {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Waveform Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(28); // percentage

  // CCTV Modal State
  const [isCctvModalOpen, setIsCctvModalOpen] = useState(false);

  // Audio Playback simulation
  useEffect(() => {
    if (!isPlayingAudio) return;
    const interval = setInterval(() => {
      setAudioProgress((prev) => (prev >= 100 ? 0 : prev + 4));
    }, 400);
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const categories = [
    { id: 'ALL', label: 'All Records' },
    { id: 'FIR', label: 'FIR Statements' },
    { id: 'CDR', label: 'CDR Wiretaps' },
    { id: 'CCTV', label: 'CCTV Video Feeds' },
    { id: 'HAWALA', label: 'Hawala Vouchers' },
  ];

  const handleOpenSourceTag = (tag: string) => {
    if (onSelectSourceTag) {
      onSelectSourceTag(tag);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Tactical India Map Background Wireframe (z-0) */}
      <IndiaMapBackdrop />

      {/* 2. Foreground Content (relative z-10) */}
      <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
        {/* Top Header */}
        <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-mono text-white tracking-wider">
                MULTIMEDIA EVIDENCE VAULT
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                SEC 63 BSA REPOSITORY
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Forensic Wiretaps, CCTV Feeds, and Financial Ledgers // STF Directive PS 13
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search evidence ID, transcript, hash..."
              className="w-64 bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Filter Pills Bar & Upload Evidence Action */}
      <div className="px-6 py-3 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <span className="text-slate-500 text-xs font-mono uppercase mr-1">Filter:</span>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as EvidenceCategory)}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {onOpenIngestEvidence && (
          <button
            onClick={onOpenIngestEvidence}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white rounded-[2px] text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-xs shrink-0"
            title="Upload audio, video, or document evidence into active case vault"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>+ Upload Case Evidence</span>
          </button>
        )}
      </div>

      {/* Main Evidence Grid */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* MULTIMEDIA CARD 1: WIRETAP AUDIO INTERCEPT */}
          {(activeCategory === 'ALL' || activeCategory === 'CDR') && (
            <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenSourceTag('WT-LOG-902-TAP')}
                        className="text-xs font-mono font-bold text-amber-400 hover:underline"
                      >
                        WT-LOG-902-TAP
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        AUDIO .WAV
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Assi Ghat BTS-71 Intercept // 23:18 IST
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  100% Admissible
                </span>
              </div>

              {/* Interactive Audio Waveform Player */}
              <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105"
                      title={isPlayingAudio ? 'Pause' : 'Play'}
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                    </button>
                    <span className="text-white font-bold">Audio Intercept (Target: Vicky Kashi)</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">
                    00:{audioProgress < 10 ? `0${Math.floor(audioProgress * 0.6)}` : Math.floor(audioProgress * 0.6)} / 01:00
                  </span>
                </div>

                {/* Simulated Waveform Visualizer */}
                <div className="flex items-center space-x-1 h-8 px-1">
                  {[40, 65, 80, 45, 90, 75, 30, 85, 95, 60, 40, 70, 85, 90, 50, 60, 80, 45, 90, 65, 35, 75, 85, 40, 95, 60, 50, 75, 85, 40].map((ht, i) => {
                    const isPassed = (i / 30) * 100 <= audioProgress;
                    return (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all duration-150 ${
                          isPassed
                            ? 'bg-amber-400'
                            : 'bg-slate-800'
                        }`}
                        style={{ height: `${ht}%` }}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Synchronized Bilingual Transcript Snippet */}
              <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-800 text-xs space-y-1.5 font-sans">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Bilingual Forensic Transcript (Voice Confidence: 94.2%):
                </div>
                <div className="text-slate-200 italic">
                  Hindi: "Bhejo usko Lanka wale builder ke paas. 50 peti se ek rupya kam nahi. Tariq ko bol diya hai Deira me."
                </div>
                <div className="text-sky-300">
                  English Translation: "Send him to the builder in Lanka. Not a rupee less than 50 Lacs. Tariq has already been briefed in Deira."
                </div>
              </div>

              {/* Statutory Evidentiary Footer */}
              <div className="pt-3 border-t border-slate-800 text-xs font-mono flex items-center justify-between">
                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                  <span className="text-slate-500">SHA-256: </span>
                  <span className="text-emerald-400">f492...4012</span>
                </div>

                <button
                  onClick={() => onViewInNetwork(['ent-vicky', 'ent-tariq'])}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
                >
                  <span>Highlight on Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* MULTIMEDIA CARD 2: CCTV FORENSIC SNAPSHOT */}
          {(activeCategory === 'ALL' || activeCategory === 'CCTV') && (
            <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400">
                    <Video className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenSourceTag('CAM-ASSI-GHAT-04')}
                        className="text-xs font-mono font-bold text-indigo-400 hover:underline"
                      >
                        CAM-ASSI-GHAT-04
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        CCTV FEED .MP4
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Assi Ghat Transit Picket // 01:42 AM IST
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  100% Admissible
                </span>
              </div>

              {/* CCTV Snapshot Preview with Bounding Box */}
              <div 
                onClick={() => setIsCctvModalOpen(true)}
                className="relative bg-slate-900 rounded-xl border border-slate-800 h-44 overflow-hidden cursor-pointer group shadow-inner flex items-center justify-center"
              >
                {/* Surveillance Screen Grid Lines */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Camera HUD Overlays */}
                <div className="absolute top-2.5 left-3 font-mono text-[10px] text-emerald-400 bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-800/80 flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  <span>REC • CAM-ASSI-GHAT-04</span>
                </div>

                <div className="absolute top-2.5 right-3 font-mono text-[10px] text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded">
                  2026-09-14 01:42:18 IST
                </div>

                {/* Simulated Target Bounding Box */}
                <div className="relative border-2 border-dashed border-rose-500 bg-rose-500/10 rounded p-4 text-center">
                  <span className="absolute -top-3 left-2 bg-rose-600 text-white text-[9px] font-mono px-1.5 rounded font-bold uppercase">
                    SUSPECT VEHICLE MATCH (UP-65-AX-0091)
                  </span>
                  <div className="text-xs font-mono font-bold text-white mt-1">
                    BLACK MAHINDRA SCORPIO
                  </div>
                  <div className="text-[10px] font-mono text-slate-300">
                    Assi Ghat Ferry Ramp Transit
                  </div>
                </div>

                <div className="absolute bottom-2.5 right-3 bg-slate-950/90 text-sky-400 text-xs font-mono px-2 py-1 rounded flex items-center space-x-1 group-hover:text-white transition-colors">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Inspect CCTV Modal</span>
                </div>
              </div>

              {/* Card Description */}
              <div className="p-3 bg-slate-900/70 rounded-lg border border-slate-800 text-xs space-y-1 font-sans">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Automated ANPR & Face Recognition Match:
                </div>
                <p className="text-slate-300 text-[11.5px] leading-snug">
                  License plate <strong className="text-white">UP-65-AX-0091</strong> identified in transit 8 minutes following the decrypted VoIP call. Driver matches profile of Sharad "Shooter" Tiwari.
                </p>
              </div>

              {/* Statutory Evidentiary Footer */}
              <div className="pt-3 border-t border-slate-800 text-xs font-mono flex items-center justify-between">
                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                  <span className="text-slate-500">SHA-256: </span>
                  <span className="text-emerald-400">b102...89a1</span>
                </div>

                <button
                  onClick={() => onViewInNetwork(['ent-vicky', 'ent-sharad'])}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
                >
                  <span>Highlight on Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* DOCUMENT RECORD CARD 3: FIR STATEMENT */}
          {(activeCategory === 'ALL' || activeCategory === 'FIR') && (
            <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenSourceTag('GD-ENTRY-382-LANKA')}
                        className="text-xs font-mono font-bold text-rose-400 hover:underline"
                      >
                        GD-ENTRY-382-LANKA
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        OFFICIAL FIR .PDF
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      PS Lanka General Diary // FIR #382/2026
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  100% Admissible
                </span>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-300 font-sans">
                "Complainant deposition: Extortion calls demanding ₹50 Lacs delivered in cash. Caller identified himself as Vikramaditya @ Vicky Kashi and referenced previous land seizures in Bhelupur."
              </div>

              {/* Statutory Evidentiary Footer */}
              <div className="pt-3 border-t border-slate-800 text-xs font-mono flex items-center justify-between">
                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                  <span className="text-slate-500">SHA-256: </span>
                  <span className="text-emerald-400">a89f...0192</span>
                </div>

                <button
                  onClick={() => onViewInNetwork(['ent-vicky', 'ent-purvanchal'])}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
                >
                  <span>Highlight on Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* FINANCIAL RECORD CARD 4: HAWALA VOUCHER */}
          {(activeCategory === 'ALL' || activeCategory === 'HAWALA') && (
            <div className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 shadow-lg transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
                    <Landmark className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleOpenSourceTag('EVID-STF-2026-0941')}
                        className="text-xs font-mono font-bold text-emerald-400 hover:underline"
                      >
                        EVID-STF-2026-0941
                      </button>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        BANK LEDGER
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Axis Bank #91828400192 & Dubai Al-Nahda Remittance
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                  100% Admissible
                </span>
              </div>

              <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-300 font-sans">
                "Physical seizure memo: Inward remittance of ₹42,50,000 INR from Al-Nahda Exchange, Deira, Dubai cleared under token #TK-889. Converted to bullion at Godowlia Chowk."
              </div>

              {/* Statutory Evidentiary Footer */}
              <div className="pt-3 border-t border-slate-800 text-xs font-mono flex items-center justify-between">
                <div className="text-[11px] text-slate-400 truncate max-w-xs">
                  <span className="text-slate-500">SHA-256: </span>
                  <span className="text-emerald-400">c61a...99a4</span>
                </div>

                <button
                  onClick={() => onViewInNetwork(['ent-vicky', 'ent-al-nahda', 'ent-axis'])}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
                >
                  <span>Highlight on Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CCTV FORENSIC MODAL PREVIEW */}
      {isCctvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 sm:p-6 font-sans">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-[3px] shadow-2xl overflow-hidden my-auto">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-[1px] bg-rose-500" />
                <span className="font-bold text-white uppercase">
                  FORENSIC CCTV FEED ENHANCEMENT // CAM-ASSI-GHAT-04
                </span>
              </div>

              <button
                onClick={() => setIsCctvModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-[2px] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="relative bg-slate-950 rounded-xl border border-slate-800 h-72 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                
                {/* Visual Target Detection */}
                <div className="relative border-2 border-rose-500 bg-rose-500/10 p-6 rounded-lg text-center space-y-1">
                  <span className="bg-rose-600 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase">
                    CONFIRMED TARGET VEHICLE // ANPR MATCH: 98.4%
                  </span>
                  <div className="text-base font-mono font-bold text-white">
                    UP-65-AX-0091 (Black Scorpio)
                  </div>
                  <div className="text-xs font-mono text-slate-300">
                    Timestamp: 2026-09-14 01:42:18 IST • Sector 3 Assi Ramp
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <span>SECTION 63 BSA ADMISSIBLE HASH: b102849182a0192840192</span>
                <span className="text-emerald-400 font-bold">DIGITALLY SEALED</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
};

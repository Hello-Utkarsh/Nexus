'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Calendar, 
  ArrowRight, 
  TrendingUp, 
  Share2, 
  Users, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  FastForward,
  ShieldAlert,
  Layers,
  CheckCircle2
} from 'lucide-react';

export interface TimelineStage {
  step: number;
  date: string;
  title: string;
  subtitle: string;
  entitiesCount: number;
  linksCount: number;
  patternsCount: number;
  description: string;
  keyAction: string;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    step: 0,
    date: '2026-08-12',
    title: 'Initial Ingestion',
    subtitle: 'FIR #382/2026 Depositions & Lanka Complaint',
    entitiesCount: 12,
    linksCount: 18,
    patternsCount: 1,
    description: 'Complainant statement recorded at PS Lanka. Initial extraction yields 12 entities including prime complainant, builders, and initial extortion caller MSISDN.',
    keyAction: 'Ingestion of CDR dump for IMEI 864291040819284',
  },
  {
    step: 1,
    date: '2026-08-22',
    title: 'Financial Smurfing Burst',
    subtitle: 'Axis Bank Purvanchal Account Layering',
    entitiesCount: 21,
    linksCount: 42,
    patternsCount: 3,
    description: 'Rapid cash smurfing transactions detected: ₹42.5L inward remittance from Dubai Al-Nahda exchange dispersed into small tranches across 5 mule bank accounts.',
    keyAction: 'Flagged circular routing between Purvanchal Traders & Kashi Bullion',
  },
  {
    step: 2,
    date: '2026-09-02',
    title: 'Telecom Hot-Swap Active',
    subtitle: 'Tower-71 SIP VOIP Gateway Multi-SIM Churn',
    entitiesCount: 32,
    linksCount: 66,
    patternsCount: 6,
    description: 'Cellular intercept at BTS-UP-VNS-71 reveals 8 burner SIM cards swapped across two dual-SIM handsets within 4 hours. Voice morphing and SIP VOIP trunk detected.',
    keyAction: 'Correlated IMEI 864291040819284 with Assi Ghat tower coordinates',
  },
  {
    step: 3,
    date: '2026-09-14',
    title: 'Midnight Extortion Window',
    subtitle: 'Direct Kingpin Threat & Hawala Finalization',
    entitiesCount: 42,
    linksCount: 87,
    patternsCount: 9,
    description: 'Full syndicate topology synthesized. Intercepted call snippet from Vicky Kashi: "50 peti se ek rupya kam nahi". Hawala token #TK-889 cleared in Deira, Dubai.',
    keyAction: 'Section 111 BNS warrant dispatched; complete 42-node graph locked',
  },
];

interface TimelineViewProps {
  currentStageIndex?: number;
  onSelectStage?: (stageIndex: number, date: string) => void;
  onLaunchWorkbench?: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  currentStageIndex = 3,
  onSelectStage,
  onLaunchWorkbench,
}) => {
  const [activeStage, setActiveStage] = useState<number>(currentStageIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2>(1);

  // Sync prop changes
  useEffect(() => {
    setActiveStage(currentStageIndex);
  }, [currentStageIndex]);

  const handleStageChange = useCallback((newStage: number) => {
    const bounded = Math.max(0, Math.min(TIMELINE_STAGES.length - 1, newStage));
    setActiveStage(bounded);
    if (onSelectStage) {
      onSelectStage(bounded, TIMELINE_STAGES[bounded].date);
    }
  }, [onSelectStage]);

  // Automated 1.5s Interval Timer for "Play Replay"
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = playbackSpeed === 2 ? 750 : 1500;
    const timer = setInterval(() => {
      setActiveStage((prev) => {
        const next = prev >= TIMELINE_STAGES.length - 1 ? 0 : prev + 1;
        if (onSelectStage) {
          onSelectStage(next, TIMELINE_STAGES[next].date);
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, onSelectStage]);

  const currentStageData = TIMELINE_STAGES[activeStage];

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-mono text-white tracking-wider">
                TEMPORAL SYNDICATE EVOLUTION & REPLAY
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold">
                STAGE {activeStage + 1} OF {TIMELINE_STAGES.length}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Chronological Network Growth (2026-08-12 to 2026-09-14) // Directive PS 13
            </div>
          </div>
        </div>

        {/* Playback Controls Strip */}
        <div className="flex items-center space-x-2">
          {/* Speed Toggle */}
          <button
            onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 2 : 1)}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-mono border border-slate-700 transition-colors"
            title="Toggle playback speed"
          >
            {playbackSpeed}x
          </button>

          {/* Prev Step */}
          <button
            onClick={() => handleStageChange(activeStage - 1)}
            disabled={activeStage === 0}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded border border-slate-700 transition-colors"
            title="Previous Stage"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Play / Pause Replay Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold flex items-center space-x-2 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-sky-600 hover:bg-sky-500 text-white'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Replay</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Play Replay</span>
              </>
            )}
          </button>

          {/* Next Step */}
          <button
            onClick={() => handleStageChange(activeStage + 1)}
            disabled={activeStage === TIMELINE_STAGES.length - 1}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 rounded border border-slate-700 transition-colors"
            title="Next Stage"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Reset */}
          <button
            onClick={() => handleStageChange(0)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded border border-slate-700 transition-colors ml-1"
            title="Reset to Stage 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
        {/* Active Stage Spotlight Banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className="text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  STAGE {currentStageData.step + 1}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-300 font-bold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>{currentStageData.date}</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {currentStageData.title}: <span className="text-sky-300 font-normal">{currentStageData.subtitle}</span>
              </h2>
            </div>

            {/* Metrics Counters */}
            <div className="flex items-center space-x-3 font-mono text-xs">
              <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Entities</div>
                <div className="text-sky-400 font-bold text-base mt-0.5">{currentStageData.entitiesCount}</div>
              </div>
              <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Links</div>
                <div className="text-indigo-400 font-bold text-base mt-0.5">{currentStageData.linksCount}</div>
              </div>
              <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase">Patterns</div>
                <div className="text-amber-400 font-bold text-base mt-0.5">{currentStageData.patternsCount}</div>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans bg-slate-900/80 p-3.5 rounded-lg border border-slate-800">
            {currentStageData.description}
          </p>

          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
            <span className="flex items-center space-x-1.5 text-slate-300">
              <span className="text-slate-500 uppercase text-[10px]">Key Ingestion Event:</span>
              <span className="text-sky-400 font-semibold">{currentStageData.keyAction}</span>
            </span>

            {onLaunchWorkbench && (
              <button
                onClick={onLaunchWorkbench}
                className="text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1 group"
              >
                <span>View Graph at this Date</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Multi-Stage Chronological Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TIMELINE_STAGES.map((stg) => {
            const isActive = stg.step === activeStage;
            const isPassed = stg.step < activeStage;

            return (
              <div
                key={stg.step}
                onClick={() => handleStageChange(stg.step)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-sky-950/60 border-sky-500 shadow-lg shadow-sky-500/10 scale-[1.02]'
                    : isPassed
                    ? 'bg-slate-950/80 border-slate-700 hover:border-slate-500'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 opacity-70'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-sky-400 border border-slate-800">
                      STAGE {stg.step + 1}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{stg.date}</span>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-snug">
                    {stg.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-sans line-clamp-2">
                    {stg.subtitle}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-slate-400">
                    <strong className="text-sky-300">{stg.entitiesCount}</strong> Ent • <strong className="text-indigo-300">{stg.linksCount}</strong> Links
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-[1px] bg-blue-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Scrubbing Slider Bar */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>2026-08-12 (Initial Case Inception)</span>
            <span className="text-sky-400 font-bold">SCRUBBER: {currentStageData.date}</span>
            <span>2026-09-14 (Extortion Window)</span>
          </div>

          <div className="relative flex items-center">
            <input
              type="range"
              min={0}
              max={TIMELINE_STAGES.length - 1}
              step={1}
              value={activeStage}
              onChange={(e) => handleStageChange(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-between px-1 text-[10px] font-mono text-slate-500">
            {TIMELINE_STAGES.map((s) => (
              <span 
                key={s.step} 
                onClick={() => handleStageChange(s.step)}
                className={`cursor-pointer hover:text-slate-300 ${s.step === activeStage ? 'text-sky-400 font-bold' : ''}`}
              >
                ● Stage {s.step + 1}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';

interface TimelineEvolutionViewProps {
  dates: string[];
  currentDateIndex: number;
  onScrubDate: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  activeEntityCount: number;
  activeRelationshipCount: number;
  activePatternCount: number;
}

export const TimelineEvolutionView: React.FC<TimelineEvolutionViewProps> = ({
  dates,
  currentDateIndex,
  onScrubDate,
  isPlaying,
  onTogglePlay,
  activeEntityCount,
  activeRelationshipCount,
  activePatternCount,
}) => {
  const currentDate = dates[currentDateIndex] || dates[dates.length - 1] || '2026-09-15';

  // Evolution Milestones (Section 23)
  const milestones = [
    { date: '2026-08-12', label: 'Initial Ingestion', entities: 12, rels: 18 },
    { date: '2026-08-22', label: 'Financial Smurfing Burst', entities: 21, rels: 42 },
    { date: '2026-09-02', label: 'Telecom Hot-Swap Active', entities: 32, rels: 66 },
    { date: '2026-09-14', label: 'Midnight Extortion Window', entities: 42, rels: 87 },
  ];

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      onScrubDate(currentDateIndex >= dates.length - 1 ? 0 : currentDateIndex + 1);
    }, 1200);
    return () => clearInterval(timer);
  }, [isPlaying, currentDateIndex, dates.length, onScrubDate]);

  return (
    <div className="h-full w-full flex flex-col bg-[#F8FAFC] overflow-hidden select-none">
      {/* Header */}
      <div className="h-14 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Network Evolution & Temporal Analysis</h1>
            <p className="text-xs text-slate-500">Track how the syndicate network expanded and formed over time</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded-md">
            Active Date: <strong className="text-blue-600">{currentDate}</strong>
          </span>
        </div>
      </div>

      {/* Main Scrubber & Milestones */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Scrubber Console Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={onTogglePlay}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-colors shadow-xs ${
                  isPlaying ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Replay' : 'Play Replay'}</span>
              </button>

              <button
                onClick={() => onScrubDate(0)}
                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 border border-slate-200 transition-colors"
                title="Reset to Day 1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Current Metrics on Active Date */}
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div>
                <span className="text-slate-400">Entities: </span>
                <strong className="text-slate-900">{activeEntityCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Links: </span>
                <strong className="text-blue-600">{activeRelationshipCount}</strong>
              </div>
              <div>
                <span className="text-slate-400">Patterns: </span>
                <strong className="text-rose-600">{activePatternCount}</strong>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={Math.max(0, dates.length - 1)}
              value={currentDateIndex}
              onChange={e => onScrubDate(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-100 rounded-lg border border-slate-200"
            />
            <div className="flex justify-between text-xs font-mono text-slate-400">
              <span>{dates[0]}</span>
              <span className="text-blue-600 font-bold">{currentDate}</span>
              <span>{dates[dates.length - 1]}</span>
            </div>
          </div>
        </div>

        {/* Temporal Evolution Stages (Section 23) */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            CHRONOLOGICAL FORMATION MILESTONES
          </span>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {milestones.map((ms, idx) => {
              const isPassed = currentDate >= ms.date;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    const foundIndex = dates.indexOf(ms.date);
                    if (foundIndex !== -1) onScrubDate(foundIndex);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isPassed
                      ? 'bg-white border-blue-200 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                    <span className={`font-bold ${isPassed ? 'text-blue-600' : 'text-slate-500'}`}>{ms.date}</span>
                    <span className="text-[10px] uppercase text-slate-400 font-semibold">STAGE {idx + 1}</span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{ms.label}</h3>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>{ms.entities} Entities</span>
                    <span>{ms.rels} Links</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

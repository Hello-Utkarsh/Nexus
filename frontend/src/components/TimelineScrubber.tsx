'use client';

import React, { useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  SkipForward,
  SkipBack
} from 'lucide-react';

interface TimelineScrubberProps {
  currentDateIndex: number; // 0 to dates.length - 1
  dates: string[];
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onScrubDate: (index: number) => void;
  onReset: () => void;
  activeEntityCount: number;
  activeEdgeCount: number;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentDateIndex,
  dates,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  onScrubDate,
  onReset,
  activeEntityCount,
  activeEdgeCount,
}) => {
  // Activity density histogram per day (simulated event volume spikes: Hawala transactions, Extortion calls)
  const activityDensity = [
    3, 5, 8, 12, 16, 24, 38, 45, 62, 78, 92, 115, 140, 168, 192, 210, 245, 280, 310, 340, 365, 390, 420
  ];

  // Auto-play timer tick
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1200 / playbackSpeed;
    const timer = setInterval(() => {
      onScrubDate(currentDateIndex >= dates.length - 1 ? 0 : currentDateIndex + 1);
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentDateIndex, dates.length, playbackSpeed, onScrubDate]);

  const currentDate = dates[currentDateIndex] || dates[0];
  const startDate = dates[0] || '2026-08-12';
  const endDate = dates[dates.length - 1] || '2026-09-15';

  return (
    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-[92%] max-w-4xl bg-white/95 dark:bg-[#0A0F1D]/95 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl p-2.5 backdrop-blur-xs z-30 font-mono select-none">
      {/* Top row: DVR controls, current date display, active telemetry count */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        {/* Left: Playback controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => onScrubDate(Math.max(0, currentDateIndex - 1))}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition-colors"
            title="Step Back 1 Day"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-2.5 py-1 rounded-md font-mono font-semibold flex items-center space-x-1.5 transition-all shadow-2xs ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700 text-white'
                : 'bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? 'PAUSE DVR' : 'PLAY DVR'}</span>
          </button>

          <button
            onClick={() => onScrubDate(Math.min(dates.length - 1, currentDateIndex + 1))}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition-colors"
            title="Step Forward 1 Day"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onReset}
            className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition-colors"
            title="Rewind to Inception"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Speed Toggles (1x, 2x, 5x) */}
          <div className="flex items-center bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded-md p-0.5 ml-2">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                  playbackSpeed === spd
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold shadow-2xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Center: Real-time Date Badge */}
        <div className="flex items-center space-x-2 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 px-3 py-1 rounded-md shadow-2xs">
          <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="text-slate-500 dark:text-slate-400 text-[11px]">TIMELINE:</span>
          <span className="text-slate-900 dark:text-slate-100 font-bold text-xs tracking-wider">
            {currentDate}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px]">
            (Day {currentDateIndex + 1}/{dates.length})
          </span>
        </div>

        {/* Right: Active Intercept Snapshot */}
        <div className="hidden sm:flex items-center space-x-3 text-[11px]">
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400"></span>
            <span>Entities: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{activeEntityCount}</strong></span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700 dark:text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400"></span>
            <span>Intercepts: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{activeEdgeCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Activity Histogram Sparkline (Mini bars) */}
      <div className="flex items-end h-6 pt-1.5 px-1 space-x-1">
        {dates.map((d, i) => {
          const heightPct = Math.min(100, Math.max(15, ((activityDensity[i % activityDensity.length] || 10) / 420) * 100));
          const isPassed = i <= currentDateIndex;
          return (
            <div
              key={d}
              onClick={() => onScrubDate(i)}
              className="flex-1 flex flex-col justify-end h-full cursor-pointer group"
              title={`${d}: ${activityDensity[i % activityDensity.length]} intercepts`}
            >
              <div
                style={{ height: `${heightPct}%` }}
                className={`w-full rounded-t transition-all ${
                  i === currentDateIndex
                    ? 'bg-blue-600 dark:bg-blue-400 shadow-xs'
                    : isPassed
                    ? 'bg-blue-300 dark:bg-blue-600/60 group-hover:bg-blue-400 dark:group-hover:bg-blue-500'
                    : 'bg-slate-200 dark:bg-slate-800 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom row: Interactive Slider Scrubber */}
      <div className="pt-1">
        <input
          type="range"
          min="0"
          max={dates.length - 1}
          value={currentDateIndex}
          onChange={(e) => onScrubDate(parseInt(e.target.value, 10))}
          className="w-full accent-blue-600 dark:accent-blue-400 h-1.5 bg-slate-200 dark:bg-slate-800 rounded appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
          <span>{startDate} (Syndicate Inception)</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">Live Intercept Scrub</span>
          <span>{endDate} (Present STF Strike)</span>
        </div>
      </div>
    </div>
  );
};

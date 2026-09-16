'use client';

import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ChevronUp, 
  ChevronDown, 
  RefreshCw, 
  Clock, 
  Smartphone, 
  X
} from 'lucide-react';

export type AnomalyType = 'HAWALA_CYCLE' | 'MIDNIGHT_BURST' | 'SIM_SWAP' | null;

interface AnomalyRadarProps {
  activeAnomaly: AnomalyType;
  onSelectAnomaly: (type: AnomalyType) => void;
}

export const AnomalyRadar: React.FC<AnomalyRadarProps> = ({
  activeAnomaly,
  onSelectAnomaly,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  return (
    <div className="absolute bottom-[88px] left-1/2 transform -translate-x-1/2 w-[92%] max-w-4xl z-30 font-mono select-none">
      <div className="bg-white/95 dark:bg-[#0A0F1D]/95 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl backdrop-blur-xs overflow-hidden">
        {/* Header Bar */}
        <div className="h-8 px-3 bg-slate-50 dark:bg-[#0F1626] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span className="text-rose-700 dark:text-rose-400 font-bold tracking-wide flex items-center space-x-1.5 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>AUTOMATED PATTERN DETECTIONS (3 CRITICAL ANOMALIES)</span>
            </span>
            <span className="text-[10px] text-slate-600 dark:text-slate-400 px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
              PS 13 CORE ENGINE
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {activeAnomaly && (
              <button
                onClick={() => onSelectAnomaly(null)}
                className="text-[10px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 px-1.5 py-0.5 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800 transition-colors shadow-2xs"
                title="Clear active anomaly highlight"
              >
                <X className="w-3 h-3" />
                <span>Clear Highlight</span>
              </button>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded transition-colors"
              title={isExpanded ? "Collapse Anomaly Radar" : "Expand Anomaly Radar"}
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            </button>
          </div>
        </div>

        {/* Expandable Anomaly Pills Body */}
        {isExpanded && (
          <div className="p-2 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {/* Pill 1: Crimson Alert - Hawala Layering Cycle */}
            <div
              onClick={() => onSelectAnomaly(activeAnomaly === 'HAWALA_CYCLE' ? null : 'HAWALA_CYCLE')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                activeAnomaly === 'HAWALA_CYCLE'
                  ? 'bg-rose-100/80 dark:bg-rose-950/70 border-rose-400 dark:border-rose-500 shadow-sm text-rose-950 dark:text-rose-100 ring-1 ring-rose-300 dark:ring-rose-500/40'
                  : 'bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 dark:bg-rose-950 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center space-x-1">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin text-rose-700 dark:text-rose-400" />
                  <span>CRIMSON ALERT</span>
                </span>
                <span className="text-[10px] text-rose-800 dark:text-rose-400 font-bold">Circular ₹18.5L</span>
              </div>
              <div className="text-[11px] font-bold text-rose-900 dark:text-rose-200 mt-1 leading-tight">
                Hawala Layering Cycle Detected
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                [Purvanchal Agro] &rarr; [Mule A/C #4412] &rarr; [Kashi Bullion] &rarr; [Tariq Bhai]
              </div>
              <div className="text-[9px] text-rose-700 dark:text-rose-400 mt-1.5 font-semibold">
                {activeAnomaly === 'HAWALA_CYCLE' ? '● Active: Highlighting Circular Loop' : 'Click to Highlight Circular Flow'}
              </div>
            </div>

            {/* Pill 2: Amber Alert - Midnight Burst Telemetry */}
            <div
              onClick={() => onSelectAnomaly(activeAnomaly === 'MIDNIGHT_BURST' ? null : 'MIDNIGHT_BURST')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                activeAnomaly === 'MIDNIGHT_BURST'
                  ? 'bg-amber-100/80 dark:bg-amber-950/70 border-amber-400 dark:border-amber-500 shadow-sm text-amber-950 dark:text-amber-100 ring-1 ring-amber-300 dark:ring-amber-500/40'
                  : 'bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/80 dark:hover:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 dark:bg-amber-950 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center space-x-1">
                  <Clock className="w-2.5 h-2.5" />
                  <span>AMBER ALERT</span>
                </span>
                <span className="text-[10px] text-amber-900 dark:text-amber-400 font-bold">37 Calls Burst</span>
              </div>
              <div className="text-[11px] font-bold text-amber-900 dark:text-amber-200 mt-1 leading-tight">
                Midnight Burst Telemetry
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                37 calls between 01:30 AM - 03:45 AM across 4 Burner IMSIs before crime event
              </div>
              <div className="text-[9px] text-amber-800 dark:text-amber-400 mt-1.5 font-semibold">
                {activeAnomaly === 'MIDNIGHT_BURST' ? '● Active: Highlighting Burst Nodes' : 'Click to Isolate Midnight Intercepts'}
              </div>
            </div>

            {/* Pill 3: Cyan Alert - SIM Swap Anomaly */}
            <div
              onClick={() => onSelectAnomaly(activeAnomaly === 'SIM_SWAP' ? null : 'SIM_SWAP')}
              className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                activeAnomaly === 'SIM_SWAP'
                  ? 'bg-sky-100/80 dark:bg-sky-950/70 border-sky-400 dark:border-sky-500 shadow-sm text-sky-950 dark:text-sky-100 ring-1 ring-sky-300 dark:ring-sky-500/40'
                  : 'bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-50/80 dark:hover:bg-sky-950/40 border-sky-200 dark:border-sky-900/50 text-slate-800 dark:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800 text-sky-800 dark:text-sky-300 flex items-center space-x-1">
                  <Smartphone className="w-2.5 h-2.5" />
                  <span>SKY ALERT</span>
                </span>
                <span className="text-[10px] text-sky-900 dark:text-sky-400 font-bold">6 IMSIs / 72h</span>
              </div>
              <div className="text-[11px] font-bold text-sky-950 dark:text-sky-200 mt-1 leading-tight">
                SIM Swap Anomaly Detected
              </div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                Handset IMEI 864291040819284 bound to 6 different IMSIs within 72 hours
              </div>
              <div className="text-[9px] text-sky-800 dark:text-sky-400 mt-1.5 font-semibold">
                {activeAnomaly === 'SIM_SWAP' ? '● Active: Highlighting Handset & Bound SIMs' : 'Click to Isolate Cloned Terminal'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

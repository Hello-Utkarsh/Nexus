'use client';

import React, { useState, useEffect } from 'react';
import { Database, Radio, RefreshCw, Server, ShieldCheck, Wifi, WifiOff } from 'lucide-react';
import { 
  getTelemetryState, 
  subscribeTelemetry, 
  checkBackendHealth, 
  TelemetryConnectionState,
  BACKEND_URL 
} from '../../lib/api';

interface TelemetryBadgeProps {
  compact?: boolean;
  className?: string;
}

export const TelemetryBadge: React.FC<TelemetryBadgeProps> = ({ 
  compact = false, 
  className = '' 
}) => {
  const [telemetry, setTelemetry] = useState<TelemetryConnectionState>(getTelemetryState());
  const [isHovered, setIsHovered] = useState(false);
  const [isPinging, setIsPinging] = useState(false);

  useEffect(() => {
    // Subscribe to connection changes
    const unsubscribe = subscribeTelemetry((state) => {
      setTelemetry(state);
    });

    // Check health once on initial mount
    checkBackendHealth().catch(() => {});

    return () => unsubscribe();
  }, []);

  const handleManualPing = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPinging(true);
    await checkBackendHealth();
    setTimeout(() => setIsPinging(false), 500);
  };

  const isLive = telemetry.mode === 'LIVE' && telemetry.isOnline;

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        onClick={handleManualPing}
        className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] border text-[11px] font-mono select-none cursor-pointer transition-all duration-200 max-w-[190px] truncate shrink-0 ${
          isLive 
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300 hover:border-emerald-600' 
            : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
        }`}
        title="Click to test backend connection"
      >
        {/* Status Indicator */}
        <span className="relative flex h-2 w-2 shrink-0 items-center justify-center">
          <span className={`inline-flex rounded-[1px] h-1.5 w-1.5 ${
            isLive ? 'bg-emerald-500' : 'bg-blue-500'
          }`} />
        </span>

        {/* Status Text: Sleek Compact Badge (max-w-[190px] truncate) */}
        <span className="font-bold tracking-tight text-[11px] uppercase truncate">
          {isLive 
            ? (compact ? 'LIVE BACKEND' : '● LIVE BACKEND')
            : (compact ? 'AIRGAPPED' : '● INTEL CACHE (AIRGAPPED)')
          }
        </span>

        {/* Refresh Icon */}
        <RefreshCw className={`w-3 h-3 text-slate-400 hover:text-white transition-transform shrink-0 ${
          isPinging ? 'animate-spin text-blue-400' : ''
        }`} />
      </div>

      {/* Hover Telemetry Diagnostics Flyout */}
      {isHovered && (
        <div className="absolute top-full right-0 sm:left-0 sm:right-auto mt-2 w-72 p-3 bg-slate-950 rounded-[3px] border border-slate-700 shadow-xl z-50 text-[11px] font-mono text-slate-200 space-y-2 animate-in fade-in-50 zoom-in-95">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
              <Server className="w-3.5 h-3.5 text-blue-400 mr-1" />
              Backend Telemetry
            </span>
            <span className={`px-1.5 py-0.5 rounded-[2px] text-[9px] font-bold uppercase ${
              isLive ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-blue-950 text-blue-300 border border-blue-800'
            }`}>
              {isLive ? 'Online' : 'Airgapped'}
            </span>
          </div>

          <div className="space-y-1 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Target URL:</span>
              <span className="text-blue-300 truncate max-w-[170px]" title={BACKEND_URL}>{BACKEND_URL}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Telemetry Mode:</span>
              <span className={isLive ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                {isLive ? 'Direct API (FastAPI)' : 'Fail-Safe Local Dataset'}
              </span>
            </div>

            {telemetry.latencyMs !== undefined && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Roundtrip Latency:</span>
                <span className="text-slate-200 font-bold">{telemetry.latencyMs} ms</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/80">
              <span>Failover Timeout:</span>
              <span>2500 ms Safeguard</span>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 bg-slate-900 p-1.5 rounded-[2px] border border-slate-800 leading-tight">
            {isLive
              ? 'Direct socket streaming active. All node intelligence synced with MongoDB.'
              : 'Zero-crash mode active. Automatic seamless fallback with zero white screens.'}
          </div>
        </div>
      )}
    </div>
  );
};

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Filter, 
  Download, 
  Search, 
  Terminal, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  ShieldAlert, 
  RefreshCw,
  Copy,
  Check,
  Cpu,
  User
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchAuditLogs } from '../../lib/api';

export type LogSeverity = 'INFO' | 'SENSITIVE' | 'CRITICAL';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  officerId: string;
  officerName: string;
  action: string;
  status: '200 OK' | '200 LOGGED' | '201 CREATED' | '403 BLOCKED';
  severity: LogSeverity;
  module: string;
  details?: string;
}

interface AuditDockProps {
  isOpen: boolean;
  onClose: () => void;
}

export const INITIAL_TELEMETRY_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-09-18 18:48:12 IST',
    officerId: 'IPS-HQ-0102',
    officerName: 'DIG Vikramaditya Sen',
    action: 'Exported BNSS Dossier',
    status: '200 OK',
    severity: 'SENSITIVE',
    module: 'Case Directives / BNSS 173',
    details: 'Generated complete syndicate evidentiary dossier for Special Court Session',
  },
  {
    id: 'log-002',
    timestamp: '2026-09-18 18:44:05 IST',
    officerId: 'STF-VNS-4491',
    officerName: 'Insp. R. K. Singh',
    action: 'Queried Hawala Sub-graph',
    status: '200 OK',
    severity: 'INFO',
    module: 'Graph Engine / Hawala Layer',
    details: 'Traversed 3 hops from Purvanchal Traders to Al-Nahda Exchange (AED 42.5L)',
  },
  {
    id: 'log-003',
    timestamp: '2026-09-18 18:39:50 IST',
    officerId: 'STF-VNS-4491',
    officerName: 'Insp. R. K. Singh',
    action: 'Decrypted Tower-71 Intercept',
    status: '200 OK',
    severity: 'CRITICAL',
    module: 'Telecom SIGINT / BTS-71',
    details: 'Decrypted encrypted SIP call intercept audio from tower BTS-UP-VNS-71 (Assi Ghat)',
  },
  {
    id: 'log-004',
    timestamp: '2026-09-18 18:31:22 IST',
    officerId: 'SYS-MONITOR',
    officerName: 'Automated STF Grid',
    action: 'Executed Section 63 BSA Digital Fingerprint',
    status: '200 LOGGED',
    severity: 'INFO',
    module: 'Evidence Vault / Integrity',
    details: 'Computed SHA-256 hash for 14 physical evidence seizure items; stored in immutable ledger',
  },
  {
    id: 'log-005',
    timestamp: '2026-09-18 18:22:14 IST',
    officerId: 'EXT-AUDIT-9',
    officerName: 'Unknown Session',
    action: 'Attempted Raw CDR Exfiltration',
    status: '403 BLOCKED',
    severity: 'CRITICAL',
    module: 'Gateway Security Filter',
    details: 'Unauthenticated bulk query on IMEI 864291040819284 was intercepted and quarantined',
  },
  {
    id: 'log-006',
    timestamp: '2026-09-18 18:15:40 IST',
    officerId: 'IPS-HQ-0102',
    officerName: 'DIG Vikramaditya Sen',
    action: 'Merged Entity Alias: VK-7 to Vicky Kashi',
    status: '201 CREATED',
    severity: 'SENSITIVE',
    module: 'Entity Resolution Engine',
    details: 'Linked alias VK-7 to primary target node Vikramaditya @ Vicky Kashi (Confidence: 94%)',
  },
  {
    id: 'log-007',
    timestamp: '2026-09-18 18:02:08 IST',
    officerId: 'STF-VNS-4491',
    officerName: 'Insp. R. K. Singh',
    action: 'Queried Tower Dump Correlation',
    status: '200 OK',
    severity: 'INFO',
    module: 'Cellular Geo-Spatial Engine',
    details: 'Cross-referenced 4,200 IMSI hits during Bhelupur Corridor transit window',
  },
  {
    id: 'log-008',
    timestamp: '2026-09-18 17:49:15 IST',
    officerId: 'IPS-HQ-0102',
    officerName: 'DIG Vikramaditya Sen',
    action: 'Issued Inter-State Surveillance Directive',
    status: '200 OK',
    severity: 'CRITICAL',
    module: 'Executive Command Terminal',
    details: 'Dispatched electronic alert to Nepal Border Checkpost 04 regarding vehicle UP-65-AX-0091',
  },
];

export const AuditDock: React.FC<AuditDockProps> = ({ isOpen, onClose }) => {
  const { isSuperAdmin, user } = useAuth();
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_TELEMETRY_LOGS);
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [isAutoTelemetryActive, setIsAutoTelemetryActive] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load audit logs via resilient API client on dock open
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetchAuditLogs().then((res) => {
      if (isMounted && res && Array.isArray(res.logs)) {
        setLogs(res.logs);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetchAuditLogs();
      if (res && Array.isArray(res.logs)) {
        setLogs(res.logs);
      }
    } catch (e) {
      console.info('[Telemetry Client] Audit log sync fallback');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Strictly refuse to render if not Super Admin
  if (!isSuperAdmin) return null;

  // Real-time simulated telemetry pulse (appends an audit log periodically if enabled)
  useEffect(() => {
    if (!isAutoTelemetryActive || !isOpen) return;

    const interval = setInterval(() => {
      const liveEvents: Array<Omit<AuditLogEntry, 'id' | 'timestamp'>> = [
        {
          officerId: user?.badgeNumber || 'IPS-HQ-0102',
          officerName: user?.name || 'DIG Vikramaditya Sen',
          action: 'Sec 63 BSA Hash Verification Pulse',
          status: '200 OK',
          severity: 'INFO',
          module: 'Cryptographic Ledger',
          details: 'Live block hash synced with Central Forensic Laboratory Node',
        },
        {
          officerId: 'STF-VNS-4491',
          officerName: 'Insp. R. K. Singh',
          action: 'Queried Hawala Sub-graph',
          status: '200 OK',
          severity: 'SENSITIVE',
          module: 'Financial Graph Engine',
          details: 'Sub-graph edge query: PURVANCHAL_TRADERS -> DUBAI_CHANNEL',
        },
        {
          officerId: 'NET-HEURISTIC-01',
          officerName: 'STF Heuristic Scanner',
          action: 'Detected New SIM Swap on Node VK-7',
          status: '200 LOGGED',
          severity: 'CRITICAL',
          module: 'Telecom Real-time Intercept',
          details: 'MSISDN +91-98110-23910 IMSI mismatch detected at BTS Assi-71',
        },
      ];

      const picked = liveEvents[Math.floor(Math.random() * liveEvents.length)];
      const now = new Date();
      const timeStr = `${now.toISOString().replace('T', ' ').substring(0, 19)} IST`;

      const newEntry: AuditLogEntry = {
        ...picked,
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timestamp: timeStr,
      };

      setLogs((prev) => [newEntry, ...prev.slice(0, 49)]); // keep latest 50 logs
    }, 18000);

    return () => clearInterval(interval);
  }, [isAutoTelemetryActive, isOpen, user]);

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedSeverity !== 'ALL' && log.severity !== selectedSeverity) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.action.toLowerCase().includes(q) ||
        log.officerId.toLowerCase().includes(q) ||
        log.officerName.toLowerCase().includes(q) ||
        log.module.toLowerCase().includes(q) ||
        (log.details && log.details.toLowerCase().includes(q))
      );
    });
  }, [logs, selectedSeverity, searchQuery]);

  const severityCounts = useMemo(() => {
    return {
      ALL: logs.length,
      INFO: logs.filter((l) => l.severity === 'INFO').length,
      SENSITIVE: logs.filter((l) => l.severity === 'SENSITIVE').length,
      CRITICAL: logs.filter((l) => l.severity === 'CRITICAL').length,
    };
  }, [logs]);

  const exportLogsAsJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CHAKRAVYUH_AUDIT_LOGS_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyRecentHashes = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.severity}] [${l.officerId}] ${l.action} -> ${l.status}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderOfficerBadge = (officerId: string, officerName: string) => {
    if (officerId.includes('IPS') || officerName.includes('DIG')) {
      return (
        <div 
          className="w-7 h-7 rounded-full bg-amber-950/80 border border-amber-500/70 text-amber-300 flex items-center justify-center shrink-0 text-[9px] font-bold font-mono shadow-xs ring-1 ring-amber-500/20"
          title={`${officerName} (${officerId})`}
        >
          <span>IPS</span>
        </div>
      );
    }
    if (officerId.includes('STF') || officerName.includes('Insp')) {
      return (
        <div 
          className="w-7 h-7 rounded-full bg-blue-950/80 border border-blue-500/70 text-blue-300 flex items-center justify-center shrink-0 text-[9px] font-bold font-mono shadow-xs ring-1 ring-blue-500/20"
          title={`${officerName} (${officerId})`}
        >
          <span>STF</span>
        </div>
      );
    }
    if (officerId.includes('SYS') || officerName.includes('Grid') || officerName.includes('Automated')) {
      return (
        <div 
          className="w-7 h-7 rounded-full bg-emerald-950/80 border border-emerald-500/70 text-emerald-300 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-emerald-500/20"
          title={`${officerName} (${officerId})`}
        >
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      );
    }
    return (
      <div 
        className="w-7 h-7 rounded-full bg-rose-950/80 border border-rose-500/70 text-rose-300 flex items-center justify-center shrink-0 shadow-xs ring-1 ring-rose-500/20"
        title={`${officerName} (${officerId})`}
      >
        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Dim backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-slate-950 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold font-mono text-white tracking-wider">
                    SUPER ADMIN AUDIT DOCK
                  </h2>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded font-semibold uppercase">
                    CLASSIFIED
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center space-x-2">
                  <span>REAL-TIME SYSTEM TELEMETRY & AUDIT TRAIL</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>SEC 63 BSA IMMUTABLE</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsAutoTelemetryActive(!isAutoTelemetryActive)}
                title={isAutoTelemetryActive ? 'Pause live stream' : 'Resume live stream'}
                className={`p-1.5 rounded text-xs font-mono border transition-colors flex items-center space-x-1 ${
                  isAutoTelemetryActive
                    ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
              >
                <Radio className={`w-3.5 h-3.5 ${isAutoTelemetryActive ? 'animate-pulse text-emerald-400' : ''}`} />
                <span className="hidden sm:inline text-[10px]">
                  {isAutoTelemetryActive ? 'LIVE STREAM' : 'PAUSED'}
                </span>
              </button>

              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                title="Fetch latest audit logs from API"
                className="p-1.5 rounded text-xs font-mono border bg-slate-900 border-slate-700 text-sky-300 hover:text-white transition-colors flex items-center space-x-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-sky-400' : ''}`} />
                <span className="hidden sm:inline text-[10px]">SYNC</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats & Controls */}
          <div className="p-4 bg-slate-900/40 border-b border-slate-800/80 space-y-3">
            {/* Severity Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <span className="text-slate-500 text-[11px] uppercase mr-1">Severity:</span>
                {(['ALL', 'INFO', 'SENSITIVE', 'CRITICAL'] as const).map((sev) => {
                  const isActive = selectedSeverity === sev;
                  const count = severityCounts[sev];
                  return (
                    <button
                      key={sev}
                      onClick={() => setSelectedSeverity(sev)}
                      className={`px-2.5 py-1 rounded text-xs font-mono transition-all flex items-center space-x-1.5 ${
                        isActive
                          ? sev === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-300 border border-rose-700 font-bold'
                            : sev === 'SENSITIVE'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700 font-bold'
                            : sev === 'INFO'
                            ? 'bg-sky-950 text-sky-300 border border-sky-700 font-bold'
                            : 'bg-slate-800 text-white border border-slate-600 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <span>{sev}</span>
                      <span className="text-[10px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={copyRecentHashes}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 flex items-center space-x-1 transition-colors"
                  title="Copy log text"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>

                <button
                  onClick={exportLogsAsJson}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded border border-slate-700 flex items-center space-x-1 transition-colors"
                  title="Download JSON audit log"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px]">Export</span>
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter logs by officer ID, action, or module..."
                className="w-full bg-slate-950 border border-slate-800 rounded pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-hidden focus:border-amber-500/80 transition-colors"
              />
            </div>
          </div>

          {/* Telemetry Log List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs">
                No telemetry entries match the active filters.
              </div>
            ) : (
              filteredLogs.map((log) => {
                const isCritical = log.severity === 'CRITICAL';
                const isSensitive = log.severity === 'SENSITIVE';

                return (
                  <div
                    key={log.id}
                    className={`p-3 rounded-lg border transition-all text-xs font-mono ${
                      isCritical
                        ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700'
                        : isSensitive
                        ? 'bg-amber-950/20 border-amber-900/60 hover:border-amber-700'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Circular Officer / System Profile Badge Icon */}
                      {renderOfficerBadge(log.officerId, log.officerName)}

                      <div className="flex-1 min-w-0">
                        {/* Header Row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center space-x-2 min-w-0">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                                isCritical
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : isSensitive
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              }`}
                            >
                              {log.severity}
                            </span>

                            <span className="font-bold text-white tracking-wide truncate">
                              {log.action}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold shrink-0 ${
                              log.status.startsWith('200')
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                : 'bg-rose-950 text-rose-400 border border-rose-800/80'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>

                    {/* Metadata Sub-row */}
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      <span className="flex items-center space-x-1 text-slate-300">
                        <span className="text-slate-500">Officer:</span>
                        <span className="font-semibold text-sky-300">{log.officerId}</span>
                        <span className="text-slate-400">({log.officerName})</span>
                      </span>

                      <span className="text-slate-600">•</span>

                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </span>

                      <span className="text-slate-600">•</span>

                      <span className="text-slate-400">
                        {log.module}
                      </span>
                    </div>

                    {/* Details */}
                    {log.details && (
                      <div className="mt-2 text-[11.5px] text-slate-300/90 bg-slate-950/70 p-2 rounded border border-slate-800/60 font-sans leading-relaxed">
                        {log.details}
                      </div>
                    )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Directive Seal */}
          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CHAIN-OF-CUSTODY COMPLIANT // PS 13 DIRECTIVE</span>
            </div>
            <div className="text-slate-500">
              AUDIT LOG SHA-256 VERIFIED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

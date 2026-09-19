'use client';

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Search, 
  Radio, 
  ShieldAlert, 
  Terminal, 
  ExternalLink, 
  Smartphone, 
  Hash, 
  MessageSquare, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Send,
  Filter,
  Check,
  Share2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { fetchIntelligenceLogs } from '../../lib/api';
import { IndiaMapBackdrop } from '../dashboard/IndiaMapBackdrop';

interface SocmintViewProps {
  onViewEntityInNetwork?: (entityId: string) => void;
  onMapToGraph?: (entityIds: string[], focusId?: string) => void;
}

export interface SocmintFeedItem {
  id: string;
  platform: 'Telegram Channel' | 'X Burner Handle' | 'Encrypted Chat Intercept' | 'Darknet Onion Relay' | 'WhatsApp Forensic Extraction';
  channelName: string;
  handle: string;
  timestamp: string;
  rawExcerpt: string;
  highlightedEntities: string[];
  associatedNodeId: string;
  associatedNodeName: string;
  threatRating: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  riskScore: number;
  flaggedKeywords: string[];
  entityIdsToMap: string[];
  chainOfCustody?: string;
  hashStamp?: string;
}

export const SOCMINT_FEED_ITEMS: SocmintFeedItem[] = [
  {
    id: 'soc-00',
    platform: 'WhatsApp Forensic Extraction',
    channelName: 'WHATSAPP BUSINESS VAULT (UFED EXTRACTION)',
    handle: '+91-94520-11209 // Extracted via Cellebrite UFED Dump',
    timestamp: '8 mins ago (18:40 IST)',
    rawExcerpt: 'Bhejo token #TK-889 to Dubai clearing desk. Cash handover at Godowlia Chowk post-midnight.',
    highlightedEntities: ['Token #TK-889', 'Dubai clearing desk', 'Godowlia Chowk'],
    associatedNodeId: 'ent-al-nahda',
    associatedNodeName: 'Al-Nahda Exchange (Dubai)',
    threatRating: 'CRITICAL',
    riskScore: 96,
    flaggedKeywords: ['#UFEDExtraction', '#TokenTK889', '#DubaiClearing', '#GodowliaChowk', '#HawalaPostMidnight'],
    entityIdsToMap: ['ent-al-nahda', 'ent-vicky', 'ent-purvanchal'],
    chainOfCustody: 'SHA-256 Hash Locked // BSA Section 63 Admissible',
    hashStamp: 'SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1f',
  },
  {
    id: 'soc-01',
    platform: 'Telegram Channel',
    channelName: 'Purvanchal Logistics Ops (Encrypted)',
    handle: '@vicky_kashi_direct',
    timestamp: '14 mins ago (18:34 IST)',
    rawExcerpt: 'Consignment confirmed for 50L delivery at Assi Ghat transit depot. Handover to Tariq courier post-midnight. Route cleared via Cantonment. Payment via Axis Bank #9182 token.',
    highlightedEntities: ['50L delivery at Assi Ghat', 'Axis Bank #9182', 'Tariq courier', 'Cantonment route'],
    associatedNodeId: 'ent-vicky',
    associatedNodeName: 'Vikramaditya @ Vicky Kashi',
    threatRating: 'CRITICAL',
    riskScore: 94,
    flaggedKeywords: ['#AssiGhatDepot', '#Hawala50L', '#TariqCourier', '#CashHandover'],
    entityIdsToMap: ['ent-vicky', 'ent-purvanchal', 'ent-tariq'],
  },
  {
    id: 'soc-02',
    platform: 'Encrypted Chat Intercept',
    channelName: 'SIP Trunk Relay 404-45-71',
    handle: '+971-50-8192831 [VoIP Deira]',
    timestamp: '42 mins ago (18:06 IST)',
    rawExcerpt: 'Audio transcribed: "Dubai exchange clearing 42.5 Lacs INR against Token #TK-889 via Dubai. Verify Lanka builder signature before disbursement into Axis Bank #9182."',
    highlightedEntities: ['Dubai exchange clearing 42.5 Lacs', 'Token #TK-889 via Dubai', 'Lanka builder signature', 'Axis Bank #9182'],
    associatedNodeId: 'ent-al-nahda',
    associatedNodeName: 'Al-Nahda Exchange (Dubai)',
    threatRating: 'CRITICAL',
    riskScore: 98,
    flaggedKeywords: ['#Layering', '#TokenTK889', '#LankaExtortion', '#DubaiHawala'],
    entityIdsToMap: ['ent-al-nahda', 'ent-axis', 'ent-vicky'],
  },
  {
    id: 'soc-03',
    platform: 'X Burner Handle',
    channelName: 'Purvanchal Underground Feed',
    handle: '@purvanchal_ghost',
    timestamp: '2 hours ago (16:48 IST)',
    rawExcerpt: 'CCTV blindspot at Assi Ghat BTS Sector 3 verified for vehicle UP-65-AX-0091 (Black Scorpio) transit. Police picket leaves checkpoint at 01:30 AM.',
    highlightedEntities: ['Assi Ghat BTS Sector 3', 'UP-65-AX-0091 (Black Scorpio)', 'Police picket checkpoint'],
    associatedNodeId: 'ent-vicky',
    associatedNodeName: 'Surveillance Target: UP-65-AX-0091',
    threatRating: 'HIGH',
    riskScore: 88,
    flaggedKeywords: ['#CCTVBlindspot', '#ScorpioUP65', '#Sector3Tower', '#SurveillanceEvasion'],
    entityIdsToMap: ['ent-vicky', 'ent-sharad'],
  },
  {
    id: 'soc-04',
    platform: 'Darknet Onion Relay',
    channelName: 'Hydra Leaks Mirror / Onion Drop',
    handle: 'onion://vns-drop-zone.onion',
    timestamp: '3 hours ago (15:20 IST)',
    rawExcerpt: 'Dump of 120 burner SIM credentials matching IMEI 864291040819284 with active tower registration at BTS-UP-VNS-71 Assi Ghat corridor.',
    highlightedEntities: ['IMEI 864291040819284', 'BTS-UP-VNS-71 Assi Ghat', '120 burner SIMs'],
    associatedNodeId: 'ent-vicky',
    associatedNodeName: 'Burner SIM Farm (Sigra)',
    threatRating: 'HIGH',
    riskScore: 85,
    flaggedKeywords: ['#BurnerSIMDump', '#IMEI8642', '#Tower71', '#SigraCell'],
    entityIdsToMap: ['ent-vicky', 'ent-rahul'],
  },
];

export const SocmintView: React.FC<SocmintViewProps> = ({ 
  onViewEntityInNetwork,
  onMapToGraph 
}) => {
  const [items, setItems] = useState<SocmintFeedItem[]>(SOCMINT_FEED_ITEMS);
  const [selectedItemId, setSelectedItemId] = useState<string>(SOCMINT_FEED_ITEMS[0].id);
  const [platformFilter, setPlatformFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFetchingLogs, setIsFetchingLogs] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetchIntelligenceLogs().then((res) => {
      if (isMounted && res && Array.isArray(res.incidents)) {
        setItems(res.incidents);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleRefreshLogs = async () => {
    setIsFetchingLogs(true);
    try {
      const res = await fetchIntelligenceLogs();
      if (res && Array.isArray(res.incidents)) {
        setItems(res.incidents);
      }
    } catch (e) {
      console.info('[Telemetry Client] Incident logs sync fallback');
    } finally {
      setTimeout(() => setIsFetchingLogs(false), 500);
    }
  };

  const filteredItems = items.filter((it) => {
    if (platformFilter !== 'ALL' && it.platform !== platformFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      it.channelName.toLowerCase().includes(q) ||
      it.handle.toLowerCase().includes(q) ||
      it.rawExcerpt.toLowerCase().includes(q) ||
      it.flaggedKeywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const selectedItem = items.find((it) => it.id === selectedItemId) || items[0];

  const handleTriggerMap = (item: SocmintFeedItem) => {
    if (onMapToGraph) {
      onMapToGraph(item.entityIdsToMap, item.associatedNodeId);
    } else if (onViewEntityInNetwork) {
      onViewEntityInNetwork(item.associatedNodeId);
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. Tactical India Map Background Wireframe (z-0) */}
      <IndiaMapBackdrop />

      {/* 2. Foreground Content (relative z-10) */}
      <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
        {/* Top Header */}
        <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-mono text-white tracking-wider">
                SOCMINT & DARK WEB OSINT RADAR
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>REAL-TIME SCRAPE STREAM ACTIVE</span>
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              3-Column Surveillance Intelligence Console // STF Directive PS 13
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search OSINT intercepts..."
              className="w-60 bg-slate-900 border border-slate-700 rounded-md pl-9 pr-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-md px-3 py-1.5 text-xs font-mono text-slate-300 focus:outline-hidden focus:border-sky-500"
          >
            <option value="ALL">All Sources</option>
            <option value="WhatsApp Forensic Extraction">WhatsApp UFED Extractions</option>
            <option value="Telegram Channel">Telegram Channels</option>
            <option value="Encrypted Chat Intercept">Encrypted VoIP Intercepts</option>
            <option value="X Burner Handle">X Burner Handles</option>
            <option value="Darknet Onion Relay">Darknet Relays</option>
          </select>

          <button
            onClick={handleRefreshLogs}
            disabled={isFetchingLogs}
            title="Fetch latest OSINT intercepts from API"
            className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-sky-400 hover:text-white transition-colors flex items-center space-x-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLogs ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline text-xs font-mono">Sync</span>
          </button>
        </div>
      </div>

      {/* 3-COLUMN TACTICAL GRID WORKSPACE */}
      <div className="flex-1 min-h-0 w-full grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* COLUMN 1: SCRAPED INCIDENT STREAM (4 cols) */}
        <div className="lg:col-span-4 h-full border-r border-slate-800 flex flex-col bg-slate-950/60 overflow-hidden">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase font-bold tracking-wider text-slate-300">
              Scraped Incident Stream
            </span>
            <span>{filteredItems.length} Signals</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredItems.map((item) => {
              const isSelected = item.id === selectedItemId;
              const isCritical = item.threatRating === 'CRITICAL';

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemId(item.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                        item.platform === 'WhatsApp Forensic Extraction'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : item.platform === 'Telegram Channel'
                          ? 'bg-sky-950 text-sky-300 border-sky-800'
                          : item.platform === 'Encrypted Chat Intercept'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : item.platform === 'X Burner Handle'
                          ? 'bg-slate-800 text-slate-300 border-slate-700'
                          : 'bg-purple-950 text-purple-300 border-purple-800'
                      }`}
                    >
                      {item.platform}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold ${
                        isCritical ? 'text-rose-400' : 'text-amber-400'
                      }`}
                    >
                      RISK {item.riskScore}
                    </span>
                  </div>

                  <div className="text-xs font-mono font-bold text-white mt-1.5 truncate">
                    {item.channelName}
                  </div>
                  <div className="text-[11px] font-mono text-sky-400">
                    {item.handle}
                  </div>

                  <p className="text-[11.5px] text-slate-300 font-sans line-clamp-2 mt-1.5 leading-snug">
                    {item.rawExcerpt}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{item.timestamp}</span>
                    <span className="text-slate-400">{item.highlightedEntities.length} entities</span>
                  </div>

                  {item.chainOfCustody && (
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[9.5px] font-mono text-emerald-400">
                      <span className="truncate">{item.chainOfCustody}</span>
                      <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0 ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* COLUMN 2: TELEMETRY & INTERCEPT EXCERPT (5 cols) */}
        <div className="lg:col-span-5 h-full border-r border-slate-800 flex flex-col bg-slate-900/40 overflow-hidden">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase font-bold tracking-wider text-slate-300">
              Raw Telemetry & Intercept Excerpt
            </span>
            <span className="text-emerald-400 font-bold">
              {selectedItem?.chainOfCustody ? 'BSA SEC 63 ADMISSIBLE' : 'SEC 63 BSA HASH LOCKED'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Source Channel:</span>
                <span className="text-sky-300 font-bold">{selectedItem.channelName}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Handle / Origin:</span>
                <span className="text-slate-200">{selectedItem.handle}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Intercept Timestamp:</span>
                <span className="text-slate-200">{selectedItem.timestamp}</span>
              </div>
            </div>

            {/* Transcription Box with Highlighted Entities */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400 flex items-center space-x-1.5">
                <Terminal className="w-3.5 h-3.5 text-sky-400" />
                <span>Sanitized Intercept Content</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs sm:text-[13px] leading-relaxed text-slate-200 font-sans shadow-inner">
                "{selectedItem.rawExcerpt}"
              </div>
            </div>

            {/* Extracted Entity Badges in this excerpt */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Detected Target Entities in Stream:
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedItem.highlightedEntities.map((ent, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md bg-sky-950 text-sky-200 border border-sky-800 text-xs font-mono font-semibold flex items-center space-x-1.5 shadow-2xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{ent}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Evidence Hash Stamp */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Cryptographic Chain-of-Custody</div>
              <div className="text-emerald-400 truncate">
                {selectedItem?.hashStamp || 'SHA-256: e81a9420b92c47a00192e41cba0991828400192'}
              </div>
              <div className="text-[10px] text-slate-500">
                {selectedItem?.chainOfCustody || 'Tamper-evident verification certified under Section 63 BSA'}
              </div>
            </div>
          </div>
        </div>

        {/* COLUMN 3: AI-DERIVED INTELLIGENCE INSIGHTS (3 cols) */}
        <div className="lg:col-span-3 h-full flex flex-col bg-slate-950 overflow-hidden">
          <div className="p-3 bg-slate-950 border-b border-slate-800 text-xs font-mono uppercase font-bold tracking-wider text-slate-300">
            AI Intelligence Insights
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Threat Rating Tag */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Assessed Threat Level</div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs font-mono font-black px-2.5 py-1 rounded border uppercase ${
                      selectedItem.threatRating === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}
                  >
                    {selectedItem.threatRating}
                  </span>
                  <span className="text-sm font-mono font-bold text-white">
                    Score: {selectedItem.riskScore}/100
                  </span>
                </div>
              </div>

              {/* Primary Linked Accused */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-1">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Correlated Primary Node</div>
                <div className="text-xs font-bold text-white truncate">
                  {selectedItem.associatedNodeName}
                </div>
                <div className="text-[10px] font-mono text-sky-400">
                  ID: {selectedItem.associatedNodeId}
                </div>
              </div>

              {/* Flagged Tactical Keywords */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Flagged Keywords & Tags:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.flaggedKeywords.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-slate-800 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Action: Map to Syndicate Graph Button */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <button
                onClick={() => handleTriggerMap(selectedItem)}
                className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] transition-colors border border-blue-600 flex items-center justify-center space-x-2 group"
              >
                <span>Map to Syndicate Graph</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>

              <div className="text-[10px] font-mono text-slate-500 text-center">
                Isolates {selectedItem.entityIdsToMap.length} nodes on Network Workbench
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

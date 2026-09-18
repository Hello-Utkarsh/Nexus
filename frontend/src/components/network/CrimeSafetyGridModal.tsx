'use client';

import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  ShieldAlert, 
  Radio, 
  Send, 
  CheckCircle2, 
  ExternalLink, 
  Share2, 
  Building2, 
  PhoneCall, 
  MapPin, 
  AlertOctagon,
  Check
} from 'lucide-react';

interface CrimeSafetyGridModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CrimeSafetyGridModal: React.FC<CrimeSafetyGridModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDispatched, setIsDispatched] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('URGENT STF DIRECTIVE PS 13: Intercept alert for Black Scorpio UP-65-AX-0091 and target Vicky Kashi. Assi Ghat / Bhelupur corridor cordoned.');

  if (!isOpen) return null;

  const handleDispatch = () => {
    setIsDispatched(true);
    setTimeout(() => setIsDispatched(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 sm:p-6 font-sans select-none">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-white tracking-wider">
                  INDIA CRIME SAFETY & INTER-STATE STF GRID
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                  MHA CCTNS SYNCED
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Centralized National Law Enforcement Telemetry & WhatsApp Field Bridge
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Telemetry Grid Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-500 uppercase">CCTNS State Grid</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">ONLINE</div>
              <div className="text-[10px] text-slate-400">UP / Bihar / Delhi</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-500 uppercase">WhatsApp Field Sync</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">34 Units</div>
              <div className="text-[10px] text-sky-300">Varanasi STF Pickets</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-500 uppercase">NCRP Cyber Portal</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">200 OK</div>
              <div className="text-[10px] text-slate-400">API Sync Verified</div>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[9.5px] text-slate-500 uppercase">Interpol NCB Link</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">5 Fugitives</div>
              <div className="text-[10px] text-amber-300">Red Notice Active</div>
            </div>
          </div>

          {/* Real-Time Operational Briefing */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold text-amber-300 uppercase">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Inter-State Syndicate Advisory (Operation Syndicate-Viper)</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              Real-time telemetry reports cross-border Hawala coordination between Deira (Dubai) and Varanasi bullion markets. All field units along Nepal Border Checkpost 04 and GT Road highway corridors are placed on tactical intercept status.
            </p>
          </div>

          {/* WhatsApp Field Intelligence Dispatch Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono font-bold text-emerald-400 uppercase">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Broadcast to 34 WhatsApp STF Field Patrols</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">ENCRYPTED DISPATCH</span>
            </div>

            <textarea
              rows={3}
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500 leading-relaxed"
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-mono text-slate-400">
                {isDispatched ? '✓ Dispatched to STF Field Channel' : 'Authorized by Central STF Command'}
              </span>

              <button
                onClick={handleDispatch}
                disabled={isDispatched}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 shadow-md transition-all"
              >
                {isDispatched ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Broadcast Sent</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Tactical Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

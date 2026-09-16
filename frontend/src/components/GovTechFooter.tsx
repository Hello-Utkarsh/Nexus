'use client';

import React from 'react';
import { Shield, Lock, Terminal, FileSpreadsheet, PhoneCall } from 'lucide-react';

interface GovTechFooterProps {
  onOpenConsole: () => void;
  onOpenDossier: () => void;
}

export const GovTechFooter: React.FC<GovTechFooterProps> = ({
  onOpenConsole,
  onOpenDossier,
}) => {
  return (
    <footer className="bg-white dark:bg-[#050711] border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-sans text-xs">
      {/* Top Banner: Classification */}
      <div className="bg-slate-900 dark:bg-black/90 text-white py-2 px-4 text-center font-mono text-[11px] tracking-widest uppercase flex items-center justify-center space-x-2">
        <Lock className="w-3.5 h-3.5 text-rose-400" />
        <span>RESTRICTED LAW ENFORCEMENT ACCESS // FOR OFFICIAL USE ONLY (FOUO)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Col 1: System Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
              <Shield className="w-4 h-4 text-slate-900 dark:text-slate-100" />
              <span>CHAKRAVYUH-OS</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Specialized Criminal Syndicate Graph & Forensic Analytics Engine engineered for State Special Task Forces, Crime Intelligence Wings, and Cyber Investigation Wings.
            </p>
            <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
              Directive PS 13 • Build v4.2.1 • UP STF Deploy
            </div>
          </div>

          {/* Col 2: Technical Stack */}
          <div className="space-y-2.5 font-mono">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Core Architecture
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• Next.js 14 (App Router & React 18)</li>
              <li>• Tuned 60 FPS HTML5 Canvas 2D Engine</li>
              <li>• NetworkX Topology & Betweenness Centrality</li>
              <li>• Louvain Community Detection (Modularity v4)</li>
              <li>• Dijkstra Shortest Path Financial Tracer</li>
              <li>• Bi-lingual Hindi/English NLP Entity Extraction</li>
            </ul>
          </div>

          {/* Col 3: Legal Compliance & Statutory Acts */}
          <div className="space-y-2.5 font-mono">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Statutory Admissibility
            </h4>
            <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• Sec 63 Bharatiya Sakshya Adhiniyam, 2023 (BSA)</li>
              <li>• Erstwhile Sec 65B Indian Evidence Act (IEA)</li>
              <li>• Sec 193 Bharatiya Nagarik Suraksha Sanhita (BNSS)</li>
              <li>• Sec 111 Bharatiya Nyaya Sanhita, 2023 (BNS)</li>
              <li>• Sec 3 & 4 Prevention of Money Laundering Act</li>
              <li>• SHA-256 Cryptographic Chain of Custody</li>
            </ul>
          </div>

          {/* Col 4: STF Operations Dispatch */}
          <div className="space-y-2.5 font-mono">
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Emergency STF Dispatch
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              24x7 Cyber Forensic Quick Reaction Team & Airgapped Database Integration Support:
            </p>
            <div className="bg-slate-50 dark:bg-[#0A0F1D] p-2.5 rounded border border-slate-200 dark:border-slate-800 space-y-1 text-[11px]">
              <div className="text-slate-900 dark:text-slate-100 font-bold flex items-center space-x-1.5">
                <PhoneCall className="w-3 h-3 text-emerald-600" />
                <span>+91-522-2200-STF / Ext 402</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400">ops@stf.up.gov.in (NIC Secure Mail)</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500">HQ Signature: Varanasi / Lucknow Cyber Range</div>
            </div>
            <div className="pt-1 flex space-x-2">
              <button
                onClick={onOpenConsole}
                className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 underline hover:text-slate-700 dark:hover:text-white"
              >
                Launch Console →
              </button>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <button
                onClick={onOpenDossier}
                className="text-[11px] font-semibold text-slate-900 dark:text-slate-200 underline hover:text-slate-700 dark:hover:text-white"
              >
                BNSS Dossier →
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 dark:text-slate-500 font-mono text-[11px]">
          <div>
            © 2026 Government of Uttar Pradesh / Special Task Force. All rights reserved.
          </div>
          <div className="flex items-center space-x-4">
            <span>Airgapped Secure Deployment</span>
            <span>•</span>
            <span>Zero External AI Dependencies</span>
            <span>•</span>
            <span>100% In-Memory Graph Processing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

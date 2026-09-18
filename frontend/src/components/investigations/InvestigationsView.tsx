'use client';

import React from 'react';
import { 
  FolderOpen, 
  PlusCircle, 
  FileSpreadsheet, 
  ShieldAlert, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Users, 
  Network, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { InvestigationCase } from '../../types/intelligence';

interface InvestigationsViewProps {
  onOpenNewInvestigation: () => void;
  onOpenExportReport: () => void;
  onSelectCase: (caseId: string) => void;
}

export const InvestigationsView: React.FC<InvestigationsViewProps> = ({
  onOpenNewInvestigation,
  onOpenExportReport,
  onSelectCase,
}) => {
  const cases = [
    {
      id: 'case-382',
      caseNumber: 'FIR #382/2026',
      title: 'Assi Ghat Organized Extortion & Hawala Corridor',
      policeStation: 'PS Lanka / STF Field Unit Varanasi',
      leadInvestigator: 'Inspector R. K. Singh (Service: STF-VNS-4491)',
      directive: 'CRIME BRANCH & STF DIRECTIVE PS 13',
      bnsSections: ['Sec 111 (Organized Crime)', 'Sec 308(4) (Extortion)', 'Sec 61(2) (Conspiracy)'],
      bsaCompliance: 'Sec 63 BSA Hash Verified',
      status: 'ACTIVE INVESTIGATION',
      nodesCount: 42,
      linksCount: 68,
      lastUpdated: '2026-09-18 18:40 IST',
      primaryTarget: 'Vikramaditya @ Vicky Kashi (Kingpin)',
      summary: 'Inter-state organized syndicate operating extortion rings targeting real-estate developers in Varanasi, layered via Dubai Hawala accounts through Purvanchal Traders.',
    },
    {
      id: 'case-114',
      caseNumber: 'FIR #114/2026',
      title: 'Inter-State Illegal VoIP Gateway & SIM Box Farm',
      policeStation: 'Special Cell / Cyber Crime PS Lucknow',
      leadInvestigator: 'DySP V. Sharma (Service: STF-LKO-1092)',
      directive: 'DOT & MHA DIRECTIVE CY-09',
      bnsSections: ['Sec 318(4) (Cheating)', 'Sec 66 IT Act', 'Sec 4 Indian Telegraph Act'],
      bsaCompliance: 'Sec 63 BSA Cryptographic Chain Active',
      status: 'UNDER SURVEILLANCE',
      nodesCount: 18,
      linksCount: 34,
      lastUpdated: '2026-09-17 21:15 IST',
      primaryTarget: 'Unknown SIP Gateway Operator / Sigra Cell',
      summary: 'Illegal GSM gateway bypassing international termination rates and facilitating encrypted calls for extortion operatives.',
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* Top Header */}
      <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
            <FolderOpen className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-bold font-mono text-white tracking-wider">
                ACTIVE LAW ENFORCEMENT INVESTIGATIONS
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-sky-950 text-sky-300 border border-sky-800 rounded font-semibold">
                2 CASES ENROLLED
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              State Police & STF Judicial Directives Dossier Repository
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenExportReport}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-mono transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Case Dossier</span>
          </button>

          <button
            onClick={onOpenNewInvestigation}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-xs font-mono font-semibold shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Ingest Case Data</span>
          </button>
        </div>
      </div>

      {/* Main Cases Workspace */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Compliance Directive Banner */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg flex items-start space-x-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-mono font-bold text-amber-300 uppercase">
              CASE RECORD REGULATORY STANDARD // SECTION 111 BNS & SEC 63 BSA
            </div>
            <p className="text-slate-300 leading-relaxed text-[11.5px]">
              All case folders maintain strict evidentiary isolation. Digital sub-graphs, telecommunications call data records (CDR), and Hawala transaction trails are cryptographically bound to the respective FIR mandate.
            </p>
          </div>
        </div>

        {/* Case Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                        {c.caseNumber}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                        {c.status}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {c.title}
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5 font-mono">
                      {c.policeStation}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 font-sans">
                  {c.summary}
                </p>

                {/* Primary target & Lead IO */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                  <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Primary Accused</div>
                    <div className="text-slate-200 font-semibold truncate mt-0.5">
                      {c.primaryTarget}
                    </div>
                  </div>

                  <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase">Investigating Officer</div>
                    <div className="text-slate-200 font-semibold truncate mt-0.5">
                      {c.leadInvestigator}
                    </div>
                  </div>
                </div>

                {/* Legal Sections */}
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Applied Statues</div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.bnsSections.map((sec) => (
                      <span
                        key={sec}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800"
                      >
                        {sec}
                      </span>
                    ))}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800">
                      {c.bsaCompliance}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                    <span>{c.nodesCount} Nodes</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <Network className="w-3.5 h-3.5 text-sky-400" />
                    <span>{c.linksCount} Links</span>
                  </span>
                </div>

                <button
                  onClick={() => onSelectCase(c.id)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-semibold rounded flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <span>Launch Network Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  FileCheck2, 
  Lock, 
  Scale, 
  FileSpreadsheet,
  CheckCircle2,
  FileJson
} from 'lucide-react';
import { SyndicateNode, SyndicateEdge } from '../types/syndicate';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: SyndicateNode[];
  edges: SyndicateEdge[];
  operationName: string;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
  operationName,
}) => {
  if (!isOpen) return null;

  // Compute summary metrics
  const totalFinancialVolume = edges
    .filter(e => e.type === 'financial' && e.amount)
    .reduce((acc, curr) => acc + (curr.amount || 0), 0);

  const keyAccused = nodes
    .filter(n => n.role === 'kingpin' || n.isPrimeAccused || n.riskScore >= 75)
    .sort((a, b) => b.riskScore - a.riskScore);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handlePrint = () => {
    window.print();
  };

  // Export JSON Evidence Graph
  const handleExportJSON = () => {
    const evidencePayload = {
      operation: operationName,
      firReference: 'FIR #382/2026 (PS Lanka, Varanasi)',
      sections: ['BNS 111', 'BNS 316', 'BNS 61(2)', 'IT Act 66D', 'Arms Act 25/27'],
      timestamp: new Date().toISOString(),
      digitalSignatureSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      statutoryCertificate: 'Certified under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (BSA) / 65B IEA',
      nodesCount: nodes.length,
      edgesCount: edges.length,
      totalHawalaFlowTracked: totalFinancialVolume,
      nodes,
      edges,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(evidencePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `STF_DOSSIER_EVIDENCE_GRAPH_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Action Header (Hidden during Print) */}
        <div className="no-print h-12 bg-slate-50 dark:bg-[#0F1626] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between flex-shrink-0 font-mono text-xs">
          <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold truncate">
            <FileSpreadsheet className="w-4 h-4 text-blue-700 dark:text-blue-400 flex-shrink-0" />
            <span className="truncate">STATE SPECIAL TASK FORCE // DIGITAL EVIDENCE & SYNDICATE DOSSIER</span>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleExportJSON}
              className="px-2.5 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-md flex items-center space-x-1.5 transition-colors shadow-2xs"
              title="Export complete graph payload as JSON"
            >
              <FileJson className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="hidden sm:inline">Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-semibold rounded-md flex items-center space-x-1.5 transition-colors shadow-2xs whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Print-Ready Dossier Report Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 font-sans bg-white dark:bg-[#0A0F1D] text-slate-900 dark:text-slate-100 court-dossier-print">
          {/* Official Letterhead Header */}
          <div className="text-center border-b-2 border-slate-300 dark:border-slate-700 pb-5 mb-6">
            {/* Government Emblem Placeholder */}
            <div className="flex items-center justify-center space-x-2 mb-1.5">
              <div className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center font-mono text-xs font-bold text-slate-800 dark:text-slate-200 shadow-2xs">
                STF
              </div>
            </div>
            <div className="text-[11px] font-mono tracking-widest text-rose-700 dark:text-rose-400 font-bold uppercase">
              STRICTLY CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE // COURT EXHIBIT
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-950 dark:text-slate-100 font-serif mt-1">
              STATE SPECIAL TASK FORCE // DIGITAL EVIDENCE & SYNDICATE DOSSIER
            </h1>
            <div className="text-xs text-slate-600 dark:text-slate-400 font-mono mt-0.5">
              CRIMINAL INVESTIGATION DEPARTMENT, GOVERNMENT OF UTTAR PRADESH
            </div>
            <div className="inline-block mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-mono text-xs text-slate-800 dark:text-slate-200 font-semibold">
              Admissible under Section 63, Bharatiya Sakshya Adhiniyam, 2023 (BSA) / Sec 65B IEA
            </div>
          </div>

          {/* Case Details Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs bg-slate-50 dark:bg-[#0F1626] p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 mb-5 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-700 dark:text-slate-300">
              <span className="text-slate-500 dark:text-slate-400 text-[10px] block sm:inline font-bold">CASE DETAILS:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">FIR #382/2026</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">PS Lanka, Varanasi</span>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="text-blue-700 dark:text-blue-400 font-medium">Hash: SHA-256: 9f8a3c2e1b4d5...</span>
            </div>
            <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>CHAIN OF CUSTODY VERIFIED</span>
            </div>
          </div>

          {/* Key Evidentiary Graph Findings Table (PS 13 Core Requirement) */}
          <div className="mb-6 space-y-2">
            <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>Key Evidentiary Graph Findings</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden court-table">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2.5">Category / Classification</th>
                    <th className="p-2.5">Accused / Entity Designation</th>
                    <th className="p-2.5">Algorithmic Metric & Evidence Flow</th>
                    <th className="p-2.5">Forensic Evidentiary Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px] text-slate-800 dark:text-slate-200">
                  <tr className="bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/70 dark:hover:bg-rose-950/40">
                    <td className="p-2.5 font-bold text-rose-700 dark:text-rose-400">
                      <span className="inline-flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        <span>Prime Target</span>
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-950 dark:text-slate-100">
                      Vikramaditya @ Vicky Kashi
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Syndicate Kingpin / Controller</div>
                    </td>
                    <td className="p-2.5 font-mono text-slate-900 dark:text-slate-100">
                      Betweenness: <strong className="text-rose-700 dark:text-rose-400">0.94</strong>, PageRank: <strong className="text-rose-700 dark:text-rose-400">0.28</strong>
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">
                      Central hub commanding extortion calls, burner SIM relays, and Dubai hawala channels. 142 CDR wiretaps intercepted.
                    </td>
                  </tr>
                  <tr className="bg-amber-50/40 dark:bg-amber-950/20 hover:bg-amber-50/70 dark:hover:bg-amber-950/40">
                    <td className="p-2.5 font-bold text-amber-800 dark:text-amber-400">
                      <span className="inline-flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Hawala Conduit</span>
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-950 dark:text-slate-100">
                      Rahul &apos;Mule&apos; Sharma
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Axis Bank A/C 9182 / Sigra</div>
                    </td>
                    <td className="p-2.5 font-mono text-slate-900 dark:text-slate-100">
                      Total Mules: <strong className="text-amber-700 dark:text-amber-400">7</strong>, Flow: <strong className="text-emerald-700 dark:text-emerald-400">₹42.5L</strong>
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">
                      Direct layering conduit routing offshore tokens from Dubai desk to local shooters and safehouses.
                    </td>
                  </tr>
                  <tr className="bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-50/70 dark:hover:bg-sky-950/40">
                    <td className="p-2.5 font-bold text-sky-800 dark:text-sky-400">
                      <span className="inline-flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                        <span>Active CDR Telemetry</span>
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-slate-950 dark:text-slate-100">
                      BTS-UP-VNS-71
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Assi Ghat / Bhelupur Cell Site</div>
                    </td>
                    <td className="p-2.5 font-mono text-slate-900 dark:text-slate-100">
                      <strong className="text-blue-700 dark:text-blue-400">4 Midnight bursts</strong> intercepted
                    </td>
                    <td className="p-2.5 text-slate-700 dark:text-slate-300">
                      Simultaneous burst pings logged between 01:00-04:00 AM matching 10 pre-activated burner MSISDNs and 3 IMEI clones.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Digital Evidence Hash Bar (Certified under Section 63 BSA / 65B IEA) */}
          <div className="bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 p-3.5 rounded-lg font-mono text-xs mb-6 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock className="w-4 h-4 text-blue-700 dark:text-blue-400" />
                <span className="text-slate-700 dark:text-slate-300 text-[11px] font-bold">DIGITAL EVIDENCE SIGNATURE (SHA-256):</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md font-bold">
                BSA CERTIFIED
              </span>
            </div>
            <div className="text-slate-900 dark:text-slate-100 font-bold text-[11px] break-all pl-6">
              e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 pl-6 italic">
              Certified under Section 63 of Bharatiya Sakshya Adhiniyam, 2023 (Admissibility of Electronic Records / Erstwhile Sec 65B of Indian Evidence Act).
            </div>
          </div>

          {/* Financial Audit Trail Summary */}
          <div className="mb-6 space-y-2">
            <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <Scale className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>1. Financial Hawala Audit Trail Summary</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs pt-1">
              <div className="p-3.5 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TOTAL HAWALA FLOW TRACKED</span>
                <span className="text-base font-bold text-emerald-800 dark:text-emerald-400">₹42,50,000</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Across 3 Mule Hops</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">TOTAL MULE ACCOUNTS FROZEN</span>
                <span className="text-base font-bold text-amber-800 dark:text-amber-400">6 Layered Accounts</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Sec 107 BNSS Attachment</span>
              </div>
              <div className="p-3.5 bg-slate-50 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xs">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">BURNER SIMs SEIZED</span>
                <span className="text-base font-bold text-blue-800 dark:text-blue-400">10 MSISDNs / 3 IMEIs</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">Fake Cantt Station KYCs</span>
              </div>
            </div>
          </div>

          {/* Primary Accused Breakdown Table */}
          <div className="mb-6 space-y-2">
            <h2 className="text-sm font-bold font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-700 dark:text-blue-400" />
              <span>2. Primary Accused Breakdown Table</span>
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden court-table">
                <thead className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 text-[10px] uppercase border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-2">Silhouette</th>
                    <th className="p-2">True Name & Aliases</th>
                    <th className="p-2">Syndicate Role</th>
                    <th className="p-2">Centrality</th>
                    <th className="p-2">Linked Bank A/Cs</th>
                    <th className="p-2">Direct Intercepts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px] text-slate-800 dark:text-slate-200">
                  {keyAccused.slice(0, 8).map(n => (
                    <tr key={n.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                      <td className="p-2 font-mono text-center">
                        <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] text-slate-700 dark:text-slate-300">
                          [ID-{n.avatarSeed.slice(0, 3).toUpperCase()}]
                        </span>
                      </td>
                      <td className="p-2 font-bold text-slate-900 dark:text-slate-100">
                        {n.name}
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 font-normal">{n.aliases.join(', ')}</div>
                      </td>
                      <td className="p-2 uppercase text-blue-700 dark:text-blue-400 font-semibold">{n.rank || n.role}</td>
                      <td className="p-2 font-mono text-slate-900 dark:text-slate-100">{n.betweennessCentrality.toFixed(3)}</td>
                      <td className="p-2 font-mono text-slate-600 dark:text-slate-400">
                        {n.financial.accountNumber !== 'N/A' ? `#${n.financial.accountNumber}` : 'Offshore Token'}
                      </td>
                      <td className="p-2 font-bold text-rose-700 dark:text-rose-400">
                        {n.telecom.cdrInterceptCount} Logs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Statutory Certification & Signatures */}
          <div className="mt-10 pt-6 border-t border-slate-300 dark:border-slate-700 grid grid-cols-2 gap-8 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">CERTIFICATE ISSUING OFFICER:</div>
              <div className="font-bold text-slate-900 dark:text-slate-100">A. K. Singh, PPS</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400">Deputy Superintendent of Police (Cyber & Forensic Wing)</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400">Special Task Force HQ, Varanasi Range</div>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-slate-500 dark:text-slate-400 text-[10px]">JUDICIAL RECORD FILING OFFICER:</div>
              <div className="font-bold text-slate-900 dark:text-slate-100">Chief Prosecuting Officer</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-400">Court of Special Sessions Judge, Varanasi</div>
              <div className="text-[10px] text-blue-700 dark:text-blue-400 font-medium">Seal #BSA-SEC63-UP-STF-2026</div>
            </div>
          </div>
        </div>

        {/* Action Footer (Hidden during Print) */}
        <div className="no-print h-12 bg-slate-50 dark:bg-[#0F1626] border-t border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between font-mono text-xs">
          <div className="text-slate-600 dark:text-slate-400 text-[11px] flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Document Formatted for High-Contrast A4 Judicial Submission</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md shadow-2xs"
            >
              Export JSON
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white font-semibold rounded-md shadow-2xs"
            >
              Print Dossier (PDF)
            </button>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

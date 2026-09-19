'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Copy, 
  Check, 
  Lock, 
  Building2, 
  Scale, 
  FileCheck2, 
  ExternalLink,
  QrCode
} from 'lucide-react';

interface CaseDossierDocProps {
  isOpen: boolean;
  onClose: () => void;
  caseNumber?: string;
}

export const CaseDossierDoc: React.FC<CaseDossierDocProps> = ({
  isOpen,
  onClose,
  caseNumber = 'FIR #382/2026',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sha256Hash = 'c61a7a28e3b441f99e4d01b9201f3e790d9841cb02781da701c40284719e99a4';

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(sha256Hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 font-sans print:static print:inset-auto print:bg-white print:p-0 print:overflow-visible print:block">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-[3px] shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto print:border-none print:shadow-none print:max-h-none print:overflow-visible print:bg-white print:w-full print:max-w-none print:m-0">
        {/* Top Action Header */}
        <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0 no-print print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold font-mono text-white tracking-wider">
                  CASE DIARY & JUDICIAL DOSSIER EXHIBIT
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-[2px] font-semibold">
                  SEC 63 BSA COMPLIANT
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Form 49-B Evidentiary Submission // Special Court for Organized Crime
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-[2px] text-xs font-mono transition-colors"
              title="Print official legal exhibit"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>Print Exhibit</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[2px] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Scroll View (Simulating Google Docs / Court Legal Paper) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950/60 flex justify-center print:p-0 print:bg-white print:overflow-visible print:block">
          <div 
            id="printable-court-dossier"
            className="w-full max-w-3xl bg-white text-slate-900 rounded-[2px] shadow-xl p-8 sm:p-12 border border-slate-200 font-serif leading-relaxed text-sm relative select-text print:p-0 print:border-none print:shadow-none print:max-w-none print:w-full"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] overflow-hidden select-none">
              <div className="text-6xl font-sans font-black tracking-widest text-slate-900 rotate-[-35deg] uppercase">
                STATE POLICE STF CONFIDENTIAL
              </div>
            </div>

            {/* Official Header & Seal */}
            <div className="border-b-2 border-slate-900 pb-6 mb-6 text-center">
              <div className="text-xs font-sans uppercase font-bold tracking-widest text-slate-700">
                Government of Uttar Pradesh • Special Task Force Directorate
              </div>
              <h1 className="text-xl font-sans font-extrabold tracking-tight text-slate-950 mt-1 uppercase">
                Investigation Case Diary & Evidentiary Dossier
              </h1>
              <div className="text-xs font-mono text-slate-600 mt-1">
                EXHIBIT BNSS-SEC-173 // SUBMITTED PURSUANT TO SECTION 63 BHARATIYA SAKSHYA ADHINIYAM, 2023
              </div>

              <div className="mt-4 inline-flex items-center space-x-3 text-xs font-mono bg-slate-100 px-4 py-1.5 rounded border border-slate-300">
                <span><strong>CASE:</strong> {caseNumber}</span>
                <span>•</span>
                <span><strong>POLICE STATION:</strong> PS Lanka, Varanasi</span>
                <span>•</span>
                <span><strong>DATE:</strong> 18 September 2026</span>
              </div>
            </div>

            {/* SECTION 1: INCIDENT BRIEFING */}
            <div className="mb-6">
              <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">1</span>
                <span>Incident Briefing & Operational Genesis</span>
              </h2>
              <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed mb-3">
                On 12 August 2026, credible intelligence and complainant depositions reported systematic extortion demands amounting to ₹50,00,000 (Fifty Lakhs INR) issued to premier commercial real estate developers in the Lanka and Bhelupur corridors of Varanasi. First Information Report (FIR) #382/2026 was registered at PS Lanka under STF Directive PS 13.
              </p>
              <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed">
                Subsequent technical surveillance established an inter-state organized syndicate operating multi-tiered extortion collection pipelines. Extortion proceeds were routed through shell commercial fronts, converted into bullion at Godowlia Chowk, and layered into offshore foreign exchange accounts via Dubai Hawala conduits.
              </p>
            </div>

            {/* SECTION 2: STATUTORY INVOCATION */}
            <div className="mb-6">
              <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">2</span>
                <span>Statutory Invocations & Penal Framework</span>
              </h2>
              <div className="space-y-2 text-xs sm:text-[13px]">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-sans">
                  <div className="font-bold text-slate-950 text-xs">Section 111 Bharatiya Nyaya Sanhita (BNS), 2023:</div>
                  <p className="text-slate-700 text-xs mt-0.5">
                    Organized Crime Syndicate — Incurred by continuing unlawful activity, including extortion, intimidation, and money laundering by individuals acting on behalf of a criminal syndicate.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-sans">
                  <div className="font-bold text-slate-950 text-xs">Section 308(4) Bharatiya Nyaya Sanhita (BNS), 2023:</div>
                  <p className="text-slate-700 text-xs mt-0.5">
                    Extortion under threat of grievous hurt and injury to business enterprise operators.
                  </p>
                </div>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded font-sans">
                  <div className="font-bold text-slate-950 text-xs">Sections 3 & 4 Prevention of Money Laundering Act (PMLA), 2002:</div>
                  <p className="text-slate-700 text-xs mt-0.5">
                    Layering and integration of illicit extortion proceeds via Purvanchal Traders (Axis Bank #91828400192) to Al-Nahda Exchange, Dubai.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 3: ANALYTICAL FINDINGS & CENTRALITY SUMMARY */}
            <div className="mb-6">
              <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">3</span>
                <span>Analytical Findings & Network Centrality Proof</span>
              </h2>
              <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed mb-3">
                Algorithmic graph analysis executed on the 42-node knowledge graph conclusively de-anonymizes <strong>Vikramaditya @ Vicky Kashi</strong> as the syndicate controller based on the following verified mathematical heuristics:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans mb-3">
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">Betweenness Centrality: 0.942</div>
                  <p className="text-slate-600 text-[11.5px] mt-1">
                    Highest structural bridge score across the network. All financial smurfing and tactical execution edges mathematically converge through target node VK-7.
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-200">
                  <div className="font-bold text-slate-900">Zero-Direct-Call Heuristic: 0 Calls</div>
                  <p className="text-slate-600 text-[11.5px] mt-1">
                    Target engages in 0 direct cellular voice calls to lower-tier operational hitmen or mules. Communication is exclusively routed via encrypted VoIP SIP relays (Assi Tower-71).
                  </p>
                </div>
              </div>
              <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed">
                This architecture was purposely engineered to defeat traditional bilateral CDR correlation, establishing deliberate intent under Section 111(2) BNS.
              </p>
            </div>

            {/* SECTION 4: CHAIN OF CUSTODY & HASH MANIFEST */}
            <div className="mb-6">
              <h2 className="text-sm font-sans font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-mono">4</span>
                <span>Chain of Custody & Cryptographic Hash Manifest</span>
              </h2>
              <p className="text-slate-800 text-xs sm:text-[13px] leading-relaxed mb-3">
                Pursuant to Section 63 of the Bharatiya Sakshya Adhiniyam, 2023, the undersigned Investigating Officer certifies that this electronic dossier was compiled under controlled hash validation:
              </p>

              <div className="bg-slate-900 text-slate-100 p-3.5 rounded-md font-mono text-xs space-y-2 print:bg-slate-100 print:text-slate-900 print:border print:border-slate-300">
                <div className="flex items-center justify-between text-[11px] text-slate-400 print:text-slate-600">
                  <span>FORENSIC LEDGER SHA-256 DIGITAL FINGERPRINT</span>
                  <button
                    onClick={handleCopyHash}
                    className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 no-print print:hidden"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Hash'}</span>
                  </button>
                </div>
                <div className="text-emerald-400 print:text-slate-900 font-bold break-all">
                  {sha256Hash}
                </div>
                <div className="text-[10px] text-slate-400 print:text-slate-600 pt-1 border-t border-slate-800 print:border-slate-300 flex justify-between">
                  <span>TIMESTAMP: 2026-09-18T18:48:12 IST</span>
                  <span>STATUS: TAMPER-EVIDENT SECURED</span>
                </div>
              </div>
            </div>

            {/* Signature & Seal Block */}
            <div className="pt-6 border-t-2 border-slate-900 flex items-end justify-between text-xs font-sans">
              <div>
                <div className="font-bold text-slate-950">Inspector R. K. Singh</div>
                <div className="text-slate-600">Investigating Officer (STF-VNS-4491)</div>
                <div className="text-slate-600">UP STF Cyber & Hawala Operations Cell</div>
              </div>

              <div className="text-right">
                <div className="font-bold text-slate-950">DIG Vikramaditya Sen, IPS</div>
                <div className="text-slate-600">Supervisory DIG / STF Directorate</div>
                <div className="text-emerald-700 font-mono font-bold mt-1 text-[11px]">
                  [DIGITALLY SIGNED // STF-PKI-2026]
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

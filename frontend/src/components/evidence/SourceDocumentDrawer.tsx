'use client';

import React from 'react';
import { 
  X, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink, 
  Calendar, 
  User, 
  Hash, 
  Copy, 
  Download,
  Building2
} from 'lucide-react';

interface SourceDocumentDrawerProps {
  sourceTag: string | null;
  onClose: () => void;
  onNavigateToEntity?: (entityId: string) => void;
}

interface SourceDocDetail {
  tag: string;
  documentTitle: string;
  officerId: string;
  officerName: string;
  seizureDate: string;
  location: string;
  sha256Hash: string;
  sanitizedSheetText: string;
  statuteCitation: string;
  linkedEntityIds: Array<{ id: string; name: string }>;
}

const SOURCE_DETAILS: Record<string, SourceDocDetail> = {
  'GD-ENTRY-382-LANKA': {
    tag: 'GD-ENTRY-382-LANKA',
    documentTitle: 'General Diary Entry #382 (PS Lanka, Varanasi)',
    officerId: 'STF-VNS-4491',
    officerName: 'Inspector R. K. Singh',
    seizureDate: '2026-08-12 10:30 IST',
    location: 'PS Lanka Police Station Records Room',
    sha256Hash: 'a89f3029bc417e2910fa78219482019482049182309182409182401928401928',
    sanitizedSheetText: 'Complainant Shri R. Agrawal, M/D Purvanchal Heights, submitted official deposition reporting repeated calls from an anonymous VoIP number demanding ₹50 Lacs in cash courier drop at Assi Ghat. The caller identified as Vicky Kashi and warned of fatal consequences upon non-compliance.',
    statuteCitation: 'Section 111 BNS, Section 308(4) Extortion',
    linkedEntityIds: [
      { id: 'ent-vicky', name: 'Vikramaditya @ Vicky Kashi' },
      { id: 'ent-purvanchal', name: 'Purvanchal Traders Front' },
    ],
  },
  'CDR-DUMP-71': {
    tag: 'CDR-DUMP-71',
    documentTitle: 'Tower Dump & CDR Telemetry Extract: BTS-UP-VNS-71',
    officerId: 'SYS-MONITOR-01',
    officerName: 'STF Telecom Technical Unit',
    seizureDate: '2026-09-14 23:30 IST',
    location: 'Assi Ghat / Bhelupur Corridor (Cell ID 404-45-71)',
    sha256Hash: 'e81a9420b92c47a00192e41cba0991828400192418294018240192840192831',
    sanitizedSheetText: 'Bulk cellular correlation of 4,200 Call Detail Records recorded during the 23:00 to 01:00 IST transit window. Intercept captured IMSI 404450192837461 linked to IMEI 864291040819284 communicating with UAE SIP roaming proxy.',
    statuteCitation: 'Section 63 Bharatiya Sakshya Adhiniyam, 2023',
    linkedEntityIds: [
      { id: 'ent-vicky', name: 'Vikramaditya @ Vicky Kashi' },
      { id: 'ent-al-nahda', name: 'Al-Nahda Exchange (Dubai)' },
    ],
  },
  'EVID-STF-2026-0941': {
    tag: 'EVID-STF-2026-0941',
    documentTitle: 'Physical Seizure Memo & Ledger Recovery',
    officerId: 'STF-VNS-4491',
    officerName: 'Inspector R. K. Singh',
    seizureDate: '2026-09-15 04:15 IST',
    location: 'Godowlia Chowk Bullion Transit Hub',
    sha256Hash: 'c61a7a28e3b441f99e4d01b9201f3e790d9841cb02781da701c40284719e99a4',
    sanitizedSheetText: 'Seizure of Hawala disbursement token slips (marked #TK-889), 6 pre-activated burner SIM cards from Sigra cell, and handwritten ledger indicating inward remittance of ₹42,50,000 INR from Deira, Dubai.',
    statuteCitation: 'PMLA Sec 3 & 4, Section 111 BNS',
    linkedEntityIds: [
      { id: 'ent-vicky', name: 'Vikramaditya @ Vicky Kashi' },
      { id: 'ent-rahul', name: 'Munim @ Rahul Sharma' },
      { id: 'ent-tariq', name: 'Tariq @ Dubai Handler' },
    ],
  },
  'WT-LOG-902-TAP': {
    tag: 'WT-LOG-902-TAP',
    documentTitle: 'Audio Intercept Transcription Log #WT-902',
    officerId: 'STF-SIGINT-04',
    officerName: 'Lawful Interception Monitoring Analyst',
    seizureDate: '2026-09-14 23:18 IST',
    location: 'Encrypted SIP Telephony Trunk 404-45-71',
    sha256Hash: 'f492049182390192834019284019284019284019284019284019284019284012',
    sanitizedSheetText: 'Audio snippet intercepted under Section 5(2) Telegraph Act. Voice match confirmed against Vicky Kashi database sample (Confidence: 94.2%). Key quotation: "Bhejo usko Lanka wale builder ke paas. 50 peti se ek rupya kam nahi."',
    statuteCitation: 'Section 63 BSA Electronic Evidence Certificate',
    linkedEntityIds: [
      { id: 'ent-vicky', name: 'Vikramaditya @ Vicky Kashi' },
    ],
  },
};

export const SourceDocumentDrawer: React.FC<SourceDocumentDrawerProps> = ({
  sourceTag,
  onClose,
  onNavigateToEntity,
}) => {
  if (!sourceTag) return null;

  const detail: SourceDocDetail = SOURCE_DETAILS[sourceTag] || {
    tag: sourceTag,
    documentTitle: `Forensic Evidentiary Seizure Record [${sourceTag}]`,
    officerId: 'STF-VNS-4491',
    officerName: 'Inspector R. K. Singh',
    seizureDate: '2026-09-15 IST',
    location: 'PS Lanka Case Records Repository',
    sha256Hash: 'c61a7a28e3b441f99e4d01b9201f3e790d9841cb02781da701c40284719e99a4',
    sanitizedSheetText: `Sanitized electronic case diary exhibit indexed under tag ${sourceTag}. Content verified and hashed under Section 63 BSA forensic standards.`,
    statuteCitation: 'Section 111 BNS, Section 63 BSA',
    linkedEntityIds: [{ id: 'ent-vicky', name: 'Vikramaditya @ Vicky Kashi' }],
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-slate-950 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-sky-400 uppercase bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {detail.tag}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-semibold">
                    100% ADMISSIBLE
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-300 mt-1 truncate max-w-xs">
                  {detail.documentTitle}
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Optical Stamp */}
            <div className="border-2 border-emerald-500/60 bg-emerald-950/20 rounded-lg p-3 text-center space-y-1">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>VERIFIED EVIDENTIARY RECORD // UP STF FORENSIC LAB</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                TAMPER-EVIDENT SECURED PURSUANT TO SECTION 63 BSA, 2023
              </div>
            </div>

            {/* Metadata Summary */}
            <div className="bg-slate-900/80 rounded-lg p-3.5 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Seizure Timestamp:</span>
                <span className="text-slate-200">{detail.seizureDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Seizing Officer:</span>
                <span className="text-sky-300 font-semibold">{detail.officerName} ({detail.officerId})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Location:</span>
                <span className="text-slate-300">{detail.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Statutory Citation:</span>
                <span className="text-amber-300">{detail.statuteCitation}</span>
              </div>
            </div>

            {/* Sanitized Case Diary Sheet */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Official Case Diary Excerpt (Sanitized Record):
              </div>
              <div className="bg-white text-slate-900 font-serif p-5 rounded-lg border border-slate-300 shadow-inner text-xs sm:text-[13px] leading-relaxed select-text">
                <div className="text-[10px] font-mono text-slate-500 uppercase border-b border-slate-200 pb-1 mb-2">
                  UP POLICE FORM 49-B // EXHIBIT DOCUMENT
                </div>
                "{detail.sanitizedSheetText}"
              </div>
            </div>

            {/* Linked Entities */}
            <div className="space-y-2">
              <div className="text-xs font-mono uppercase text-slate-400">
                Linked Network Graph Entities:
              </div>
              <div className="flex flex-wrap gap-2">
                {detail.linkedEntityIds.map((ent) => (
                  <button
                    key={ent.id}
                    onClick={() => {
                      if (onNavigateToEntity) {
                        onNavigateToEntity(ent.id);
                        onClose();
                      }
                    }}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 rounded text-xs font-mono flex items-center space-x-1.5 transition-colors group"
                  >
                    <span>{ent.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-sky-400" />
                  </button>
                ))}
              </div>
            </div>

            {/* SHA-256 Hash */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="text-slate-500 uppercase text-[10px]">Digital Signature Hash (SHA-256)</div>
              <div className="text-emerald-400 font-bold break-all">
                {detail.sha256Hash}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

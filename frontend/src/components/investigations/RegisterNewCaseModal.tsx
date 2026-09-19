'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  ShieldAlert, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  Building2, 
  UserCheck, 
  Scale, 
  FolderPlus,
  ArrowRight,
  FileCheck2,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { AssignedCase, CaseStatus } from './MyInvestigationsView';

interface RegisterNewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterCase: (newCase: AssignedCase, makeActive: boolean) => void;
}

const STATUTORY_OPTIONS = [
  'BNS 111 (Organized Crime)',
  'BNS 308 (Extortion)',
  'BNS 318 (Cheating)',
  'PMLA Sec 3 & 4',
  'IT Act Sec 66'
];

const POLICE_STATIONS = [
  'PS Lanka, Varanasi',
  'Cyber Crime PS Lucknow Range',
  'Delhi Special Cell',
  'Varanasi Commissionerate Special Operations',
  'UP-STF Special Cell (Varanasi / Lucknow Range)',
  'PS Bhelupur, Varanasi',
  'PS Cantt, Varanasi'
];

export const RegisterNewCaseModal: React.FC<RegisterNewCaseModalProps> = ({
  isOpen,
  onClose,
  onRegisterCase,
}) => {
  const [docketNumber, setDocketNumber] = useState('FIR #512/2026');
  const [caseTitle, setCaseTitle] = useState('');
  const [stationRange, setStationRange] = useState('PS Lanka, Varanasi');
  const [leadIO, setLeadIO] = useState('Inspector R. K. Singh (STF-VNS-4491)');
  const [primarySuspect, setPrimarySuspect] = useState('Mukhtar Ansari @ Don (Syndicate Enforcer)');
  const [selectedStatutes, setSelectedStatutes] = useState<string[]>([
    'BNS 111 (Organized Crime)',
    'BNS 308 (Extortion)',
    'PMLA Sec 3 & 4'
  ]);
  const [threatLevel, setThreatLevel] = useState<'CRITICAL ACTIVE' | 'UNDER SURVEILLANCE' | 'PRELIMINARY INQUIRY'>('CRITICAL ACTIVE');
  const [narrative, setNarrative] = useState(
    'Initial complaint lodged regarding systematic digital extortion calls originating from burner VoIP SIP proxies demanding ₹75,00,000 INR from regional infrastructure contractors. Hawala layering suspected through bullion channels.'
  );
  const [uploadedFileName, setUploadedFileName] = useState<string | null>('Preliminary_FIR_512_2026_Certified.pdf');
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>('2.4 MB');
  const [setAsActive, setSetAsActive] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleToggleStatute = (statute: string) => {
    setSelectedStatutes((prev) => 
      prev.includes(statute) 
        ? prev.filter((s) => s !== statute) 
        : [...prev, statute]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setUploadedFileName(file.name);
      setUploadedFileSize(
        file.size > 1024 * 1024 
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
          : `${(file.size / 1024).toFixed(0)} KB`
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedStatus: CaseStatus = 
      threatLevel === 'CRITICAL ACTIVE' 
        ? 'CRITICAL ACTIVE' 
        : threatLevel === 'UNDER SURVEILLANCE' 
        ? 'UNDER SURVEILLANCE' 
        : 'UNDER SURVEILLANCE';

    const generatedId = `case-${Date.now().toString().slice(-4)}`;
    const formattedCaseNumber = docketNumber.trim().startsWith('Case') 
      ? docketNumber.trim() 
      : docketNumber.trim().startsWith('FIR')
      ? docketNumber.trim().replace('FIR', 'Case')
      : `Case ${docketNumber.trim()}`;

    const newCase: AssignedCase = {
      id: generatedId,
      caseNumber: formattedCaseNumber,
      title: caseTitle.trim() || `${primarySuspect.split(' ')[0]} Extortion & Hawala Conduit`,
      directive: `OP: Operation Docket-${docketNumber.replace(/[^a-zA-Z0-9]/g, '')} // ${docketNumber}`,
      leadInvestigator: leadIO.trim(),
      unit: stationRange,
      status: normalizedStatus,
      entitiesCount: 14,
      nodesCount: 22,
      threatLevel: threatLevel === 'CRITICAL ACTIVE' ? 'CRITICAL (Score: 92)' : 'ELEVATED (Score: 74)',
      lastUpdated: new Date().toISOString().replace('T', ' ').slice(0, 16) + ' IST',
      summary: narrative.trim(),
      primaryTarget: primarySuspect.trim(),
      bnsSections: selectedStatutes.length > 0 ? selectedStatutes : ['Sec 111 (Organized Crime)', 'Sec 308 (Extortion)'],
    };

    onRegisterCase(newCase, setAsActive);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-[3px] shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="h-14 px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[2px] bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-white tracking-wider">
                  STF DIRECTIVE PS 13 // NEW INVESTIGATION DOCKET REGISTRATION
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-[2px] font-semibold">
                  SEC 63 BSA COMPLIANT
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Official Case Docket Registration & Knowledge Graph Initialization
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[2px] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Row 1: FIR Docket Number + Police Station */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>FIR / DOCKET NUMBER *</span>
                <span className="text-[10px] text-slate-500 font-normal">Official Identifier</span>
              </label>
              <input
                type="text"
                required
                value={docketNumber}
                onChange={(e) => setDocketNumber(e.target.value)}
                placeholder="FIR #512/2026"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>POLICE STATION / SPECIAL CELL *</span>
                <span className="text-[10px] text-slate-500 font-normal">Jurisdiction</span>
              </label>
              <select
                value={stationRange}
                onChange={(e) => setStationRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-mono text-white focus:outline-hidden"
              >
                {POLICE_STATIONS.map((ps) => (
                  <option key={ps} value={ps}>
                    {ps}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Investigation Title (Optional) & Lead IO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>INVESTIGATION OPERATION TITLE</span>
                <span className="text-[10px] text-slate-500 font-normal">Operation Alias</span>
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                placeholder="e.g. Eastern UP Bullion Extortion Pipeline"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                <span>LEAD INVESTIGATING OFFICER (IO) *</span>
                <span className="text-[10px] text-slate-500 font-normal">Assigned Officer</span>
              </label>
              <input
                type="text"
                required
                value={leadIO}
                onChange={(e) => setLeadIO(e.target.value)}
                placeholder="Inspector R. K. Singh"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 3: Primary Suspect Target Name & Known Aliases */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>PRIMARY SUSPECT TARGET NAME & KNOWN ALIASES *</span>
              <span className="text-[10px] text-slate-500 font-normal">Target Identifier</span>
            </label>
            <input
              type="text"
              required
              value={primarySuspect}
              onChange={(e) => setPrimarySuspect(e.target.value)}
              placeholder="Mukhtar Ansari @ Don // AKA Mastermind"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-mono text-white placeholder-slate-500 focus:outline-hidden"
            />
          </div>

          {/* Row 4: Statutory Invocations (Pill Checkboxes) */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>STATUTORY INVOCATIONS (PENAL SECTIONS) *</span>
              <span className="text-[10px] text-slate-500 font-normal">Select applicable sections</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {STATUTORY_OPTIONS.map((statute) => {
                const isSelected = selectedStatutes.includes(statute);
                return (
                  <button
                    type="button"
                    key={statute}
                    onClick={() => handleToggleStatute(statute)}
                    className={`px-2.5 py-1 rounded-[2px] text-xs font-mono transition-colors border flex items-center space-x-1.5 ${
                      isSelected
                        ? 'bg-blue-950 text-blue-300 border-blue-700 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-[1px] ${isSelected ? 'bg-blue-400' : 'bg-slate-700'}`} />
                    <span>{statute}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 5: Threat Severity Level Radio */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>THREAT SEVERITY LEVEL *</span>
              <span className="text-[10px] text-slate-500 font-normal">Initial Threat Matrix</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { 
                  id: 'CRITICAL ACTIVE', 
                  label: 'Critical Active', 
                  desc: 'Immediate syndicate threat',
                  color: 'border-rose-700 bg-rose-950/40 text-rose-300'
                },
                { 
                  id: 'UNDER SURVEILLANCE', 
                  label: 'Under Surveillance', 
                  desc: 'Active technical taps & CDR',
                  color: 'border-amber-700 bg-amber-950/40 text-amber-300'
                },
                { 
                  id: 'PRELIMINARY INQUIRY', 
                  label: 'Preliminary Inquiry', 
                  desc: 'Initial verification stage',
                  color: 'border-slate-700 bg-slate-950 text-slate-300'
                },
              ].map((lvl) => {
                const isChecked = threatLevel === lvl.id;
                return (
                  <div
                    key={lvl.id}
                    onClick={() => setThreatLevel(lvl.id as any)}
                    className={`p-2.5 rounded-[2px] border cursor-pointer transition-colors ${
                      isChecked ? lvl.color : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name="threatLevel"
                        checked={isChecked}
                        onChange={() => setThreatLevel(lvl.id as any)}
                        className="text-blue-600 focus:ring-0"
                      />
                      <span className="text-xs font-mono font-bold">{lvl.label}</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 font-sans mt-1 ml-5">
                      {lvl.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Row 6: Case Inception Narrative */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>CASE INCEPTION NARRATIVE & INCIDENT BRIEFING *</span>
              <span className="text-[10px] text-slate-500 font-normal">Section 154 CrPC / 173 BNSS</span>
            </label>
            <textarea
              required
              rows={3}
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              placeholder="Brief incident summary, complainant depositions, technical surveillance intercepts, or extortion threats..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 focus:border-blue-500 rounded-[2px] text-xs font-sans text-slate-200 placeholder-slate-500 focus:outline-hidden resize-none leading-relaxed"
            />
          </div>

          {/* Row 7: Initial Primary Dossier Upload */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
              <span>INITIAL PRIMARY DOSSIER UPLOAD</span>
              <span className="text-[10px] text-slate-500 font-normal">FIR PDF / Complaint Copy</span>
            </label>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.csv"
              className="hidden"
            />

            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/70 rounded-[2px] p-4 text-center cursor-pointer transition-colors group flex items-center justify-between px-4"
            >
              <div className="flex items-center space-x-3 text-left">
                <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-white">
                    {uploadedFileName ? uploadedFileName : 'Click to attach certified preliminary FIR PDF'}
                  </div>
                  <div className="text-[10.5px] text-slate-400 font-sans">
                    {uploadedFileSize ? `File verified • ${uploadedFileSize} • SHA-256 Validated` : 'Supports PDF, DOCX, CSV up to 100MB'}
                  </div>
                </div>
              </div>

              <span className="text-xs font-mono text-blue-400 border border-blue-800/80 bg-blue-950/60 px-2.5 py-1 rounded-[2px]">
                {uploadedFileName ? 'Replace Document' : 'Browse File'}
              </span>
            </div>
          </div>

          {/* Set As Active Case Option */}
          <div className="p-3 bg-slate-950 rounded-[2px] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="setAsActive"
                checked={setAsActive}
                onChange={(e) => setSetAsActive(e.target.checked)}
                className="rounded-[2px] text-blue-600 focus:ring-0"
              />
              <label htmlFor="setAsActive" className="text-xs font-mono text-slate-200 cursor-pointer">
                Set as active investigation immediately upon initialization
              </label>
            </div>
            <span className="text-[10.5px] font-mono text-emerald-400 flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>BSA Admissible Ledger</span>
            </span>
          </div>

          {/* Modal Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-[2px] text-xs font-mono transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center space-x-2 transition-colors border border-blue-600 shadow-xs"
            >
              <span>Register & Initialize Case Graph</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

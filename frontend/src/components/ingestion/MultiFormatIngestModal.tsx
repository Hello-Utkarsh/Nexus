'use client';

import React, { useState } from 'react';
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Sparkles, 
  Database, 
  ArrowRight,
  Shield,
  Layers,
  FileSpreadsheet,
  Mic,
  Video,
  Globe,
  Cpu,
  Terminal,
  Activity
} from 'lucide-react';

interface MultiFormatIngestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteIngestion: () => void;
}

export interface IngestFormatOption {
  id: string;
  name: string;
  extension: string;
  icon: React.ComponentType<{ className?: string }>;
  sampleFile: string;
  badgeColor: string;
}

export const INGEST_FORMATS: IngestFormatOption[] = [
  {
    id: 'fir',
    name: 'FIR / Case Diaries',
    extension: '.PDF',
    icon: FileText,
    sampleFile: 'FIR_382_2026_PS_Lanka_Depositions.pdf',
    badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
  },
  {
    id: 'cdr',
    name: 'CDR / IPDR Telecom Dumps',
    extension: '.CSV',
    icon: FileSpreadsheet,
    sampleFile: 'Tower_71_Assi_Ghat_CDR_Dump_Sep26.csv',
    badgeColor: 'bg-sky-950 text-sky-300 border-sky-800',
  },
  {
    id: 'wiretap',
    name: 'Wiretap Audio',
    extension: '.WAV / .MP3',
    icon: Mic,
    sampleFile: 'Intercept_WT902_AssiCorridor_CallSnippet.wav',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
  },
  {
    id: 'cctv',
    name: 'CCTV Footage',
    extension: '.MP4',
    icon: Video,
    sampleFile: 'CCTV_CAM_ASSI_04_Midnight_Transit.mp4',
    badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
  },
  {
    id: 'osint',
    name: 'Dark Web / Social Scrapes',
    extension: '.JSON',
    icon: Globe,
    sampleFile: 'Telegram_Scrape_PurvanchalOps_Dump.json',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
  },
];

export const MultiFormatIngestModal: React.FC<MultiFormatIngestModalProps> = ({
  isOpen,
  onClose,
  onCompleteIngestion,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<IngestFormatOption>(INGEST_FORMATS[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const ingestionSteps = [
    'Parsing document structure & optical character recognition (OCR)',
    'Extracting bilingual Hindi/English entities (Persons, Phones, Accounts)',
    'Cross-referencing CDR towers with Assi Ghat Tower 71 logs',
    'Indexing into Knowledge Management System (KMS) with Section 63 BSA Hash',
  ];

  const handleStartIngest = (format: IngestFormatOption) => {
    setSelectedFormat(format);
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setIsCompleted(false);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < ingestionSteps.length) {
        setCurrentStepIndex(step);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsCompleted(true);
      }
    }, 700);
  };

  const handleReset = () => {
    setIsProcessing(false);
    setIsCompleted(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-xs p-4 sm:p-6 font-sans">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-[3px] shadow-2xl overflow-hidden my-auto text-slate-100">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-[2px] bg-slate-900 border border-slate-700 flex items-center justify-center text-blue-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold font-mono text-white tracking-wider">
                  MULTI-FORMAT EVIDENCE INGESTION SUITE
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 rounded-[2px] font-semibold">
                  OCR & KMS READY
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Multi-Modal Ingestion Pipeline // Bharatiya Sakshya Adhiniyam Sec 63
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isProcessing && !isCompleted && (
            <div className="space-y-4">
              <div className="text-xs text-slate-300 leading-relaxed font-sans">
                Select an evidence modality to initiate AI-powered entity extraction, bilingual OCR, and cellular tower cross-referencing:
              </div>

              {/* 5 File Format Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INGEST_FORMATS.map((fmt) => {
                  const Icon = fmt.icon;
                  return (
                    <button
                      key={fmt.id}
                      onClick={() => handleStartIngest(fmt)}
                      className="p-3.5 bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-slate-600 rounded-[2px] text-left transition-colors group flex items-start space-x-3 shadow-sm"
                    >
                      <div className="p-2 rounded-[2px] bg-slate-900 border border-slate-800 text-blue-400 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white group-hover:text-blue-300 truncate">
                            {fmt.name}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] border font-bold ${fmt.badgeColor}`}>
                            {fmt.extension}
                          </span>
                        </div>
                        <div className="text-[11px] font-mono text-slate-500 truncate mt-1">
                          {fmt.sampleFile}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Drag and Drop Zone */}
              <div 
                onClick={() => handleStartIngest(INGEST_FORMATS[0])}
                className="border border-dashed border-slate-700 hover:border-slate-500 bg-slate-950/60 rounded-[2px] p-6 text-center cursor-pointer transition-colors space-y-2 group"
              >
                <div className="w-10 h-10 mx-auto rounded-[2px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-mono font-bold text-white">
                  Drop evidence records here or click to simulate ingestion
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Supports PDF, CSV, WAV/MP3, MP4, JSON (Max 500MB per batch)
                </div>
              </div>
            </div>
          )}

          {/* Processing State with 4 Realistic Steps */}
          {isProcessing && (
            <div className="py-4 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  <span className="text-xs font-mono font-bold text-white">
                    INGESTING: {selectedFormat.sampleFile}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-[2px] border border-amber-800">
                  STAGE {currentStepIndex + 1} OF {ingestionSteps.length}
                </span>
              </div>

              {/* Step checklist */}
              <div className="space-y-2.5 bg-slate-950 p-4 rounded-[2px] border border-slate-800 font-mono text-xs">
                {ingestionSteps.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center space-x-2.5 transition-all ${
                        isDone
                          ? 'text-emerald-400 font-semibold'
                          : isCurrent
                          ? 'text-blue-300 font-bold'
                          : 'text-slate-600'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : isCurrent ? (
                        <Cpu className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-[1px] border border-slate-700 shrink-0" />
                      )}
                      <span className="text-[11.5px] leading-tight">{step}</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-950 rounded-[2px] h-1.5 overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / ingestionSteps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Completion Summary State */}
          {isCompleted && (
            <div className="space-y-5 py-2">
              <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-[2px] flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <div className="font-mono font-bold text-emerald-300 uppercase">
                    INGESTION & SECTION 63 BSA HASHING COMPLETE
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11.5px]">
                    Intelligence successfully integrated into the central Purvanchal Syndicate graph. All extracted entities and relationships are cryptographically bound.
                  </p>
                </div>
              </div>

              {/* 3 Summary Counters */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="bg-slate-950 p-3 rounded-[2px] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Entities Extracted</div>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">42 Entities</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">100% Resolved</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-[2px] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Relationships Mapped</div>
                  <div className="text-lg font-bold text-indigo-400 mt-0.5">87 Links</div>
                  <div className="text-[10px] text-indigo-300 mt-0.5">BFS Multi-Hop</div>
                </div>

                <div className="bg-slate-950 p-3 rounded-[2px] border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Patterns Flagged</div>
                  <div className="text-lg font-bold text-amber-400 mt-0.5">4 Patterns</div>
                  <div className="text-[10px] text-amber-300 mt-0.5">Hawala / Burst</div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-[2px] text-xs font-mono transition-colors"
                >
                  Ingest Another Batch
                </button>

                <button
                  onClick={() => {
                    onCompleteIngestion();
                    onClose();
                  }}
                  className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-mono text-xs font-bold uppercase tracking-wider rounded-[2px] flex items-center space-x-1.5 transition-colors border border-blue-600"
                >
                  <span>Launch Network Workbench</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

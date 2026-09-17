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
  Layers
} from 'lucide-react';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteIngestion: () => void;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({
  isOpen,
  onClose,
  onCompleteIngestion,
}) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const pipelineSteps = [
    'Document parsed & structure recognized',
    'Text extracted & normalized',
    'AI entities identified (Persons, Phones, Accounts, Locations)',
    'Relationships extracted & confidence scored',
    'Entities resolved & aliases correlated',
    'Knowledge graph updated with 4 patterns detected'
  ];

  const handleStartIngestion = (fileName: string) => {
    setSelectedFile(fileName);
    setIsProcessing(true);
    setStepIndex(0);
    setIsCompleted(false);

    // Progressive step animation (deterministic demo flow)
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < pipelineSteps.length) {
        setStepIndex(currentStep);
      } else {
        clearInterval(interval);
        setIsProcessing(false);
        setIsCompleted(true);
      }
    }, 450);
  };

  const handleFinish = () => {
    onCompleteIngestion();
    onClose();
    // Reset state
    setTimeout(() => {
      setSelectedFile(null);
      setIsProcessing(false);
      setIsCompleted(false);
      setStepIndex(0);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">New Investigation Ingestion</h2>
              <p className="text-xs text-slate-500">Ingest raw structured or unstructured intelligence into the knowledge graph</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {!isProcessing && !isCompleted && (
            <>
              {/* Demo 1-Click Action */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-600 text-white rounded-full">RECOMMENDED</span>
                    <h3 className="text-sm font-bold text-blue-950">Load Demo Investigation</h3>
                  </div>
                  <p className="text-xs text-blue-800/80 mt-1 max-w-md">
                    Instant demonstration using <strong>Case #382/2026</strong> synthetic investigation with 42 entities, 87 relationships, and 4 patterns.
                  </p>
                </div>
                <button
                  onClick={() => handleStartIngestion('Case_382_Purvanchal_Intel_Package.pdf')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 flex-shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Demo</span>
                </button>
              </div>

              {/* Upload Drop Zone */}
              <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-slate-800">
                  Upload Intelligence Documents
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  FIRs, Police Case Diaries, Telecom CDRs, or Financial CSV/JSON ledgers
                </p>
                <div className="mt-3 flex items-center justify-center space-x-2 text-[11px] font-mono text-slate-400">
                  <span>Supported: PDF, TXT, CSV, JSON</span>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  {[
                    'FIR_382_Lanka.pdf',
                    'Tower_71_CDR_Dump.csv',
                    'Axis_Bank_Ledger.json'
                  ].map(file => (
                    <button
                      key={file}
                      onClick={() => handleStartIngestion(file)}
                      className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 flex items-center space-x-1.5 shadow-2xs transition-colors"
                    >
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span>{file}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Processing Progress View */}
          {(isProcessing || isCompleted) && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm text-slate-900">{selectedFile}</span>
                </div>
                <span className="text-xs font-mono text-slate-500">
                  {isCompleted ? 'Analysis Complete' : 'AI Pipeline Running...'}
                </span>
              </div>

              {/* Step Checklist */}
              <div className="space-y-3">
                {pipelineSteps.map((step, idx) => {
                  const isDone = isCompleted || stepIndex > idx;
                  const isCurrent = isProcessing && stepIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className={`flex items-center space-x-3 text-xs transition-opacity duration-300 ${
                        isDone || isCurrent ? 'opacity-100' : 'opacity-35'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-300 flex-shrink-0" />
                      )}
                      <span className={`${isDone ? 'text-slate-800 font-medium' : isCurrent ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Extraction Output Stats */}
              {isCompleted && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg grid grid-cols-4 gap-3 text-center animate-in fade-in duration-300">
                  <div>
                    <div className="text-lg font-bold font-mono text-slate-900">42</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Entities</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-blue-600">87</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Relations</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-amber-600">4</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Matches</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold font-mono text-rose-600">4</div>
                    <div className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Patterns</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Synthetic Investigation Prototype</span>
          </div>

          <div className="flex items-center space-x-2">
            {!isCompleted ? (
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors flex items-center space-x-1.5"
              >
                <span>Open Investigation Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Shield, 
  Network, 
  Radar, 
  Database, 
  FileCheck, 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  X, 
  Sparkles,
  Compass
} from 'lucide-react';
import { NavigationTab } from '../NavigationHeader';

export interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchTab: (tab: NavigationTab) => void;
  onOpenDossier?: () => void;
}

interface TourStep {
  stepNumber: number;
  title: string;
  moduleCategory: string;
  tab: NavigationTab;
  description: string;
  keyMetric: string;
  targetFocus: string;
  actionText?: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  {
    stepNumber: 1,
    title: 'ACTIVE CASE DIRECTIVE & TELEMETRY',
    moduleCategory: 'MODULE 01 // C4I OVERVIEW',
    tab: 'overview',
    description:
      'Real-time Purvanchal syndicate case telemetry tracking 42 entities, 87 relationships, and active statutory mandates under UP-STF Directive PS 13.',
    keyMetric: 'FIR #382/2026 • 42 Entities • UP-STF Directive PS 13',
    targetFocus: 'Purvanchal Syndicate C4I Command Deck & Operations Briefing',
    icon: Shield,
  },
  {
    stepNumber: 2,
    title: 'ZERO-CALL MASTERMIND ISOLATION',
    moduleCategory: 'MODULE 02 // TOPOLOGICAL GRAPH ANALYSIS',
    tab: 'network',
    description:
      'De-anonymizes syndicate masterminds who make zero direct phone calls to victims using Betweenness Centrality (0.942) and topological bridge heuristics.',
    keyMetric: 'Target: Vikramaditya (VK-7) • Betweenness Centrality: 0.942',
    targetFocus: 'Interactive Link Analysis & Algorithmic Community Hulls',
    icon: Network,
  },
  {
    stepNumber: 3,
    title: 'EXPLAINABLE AI PATTERN RADAR',
    moduleCategory: 'MODULE 03 // DETECTOR ENGINE',
    tab: 'patterns',
    description:
      'Replaces black-box predictions with auditable evidence chains: identifies 4-hop circular Hawala transaction loops and midnight telecom bursts.',
    keyMetric: '4 Loop Patterns • Assi Ghat CDR & Godowlia Bullion Ledger',
    targetFocus: 'Syndicate Radar & Rule-Based Behavioral Anomalies',
    icon: Radar,
  },
  {
    stepNumber: 4,
    title: 'MULTI-MODAL EVIDENCE & UFED INGESTION',
    moduleCategory: 'MODULE 04 // EVIDENCE REPOSITORY',
    tab: 'evidence',
    description:
      'Ingests bilingual FIRs, bank ledgers, CCTV ANPR, and Cellebrite UFED WhatsApp forensic streams, all cryptographically sealed under Section 63 BSA.',
    keyMetric: 'SHA-256 Custody Hash • WhatsApp Cellebrite UFED Extraction',
    targetFocus: 'Multi-Source Digital Evidence Vault & Chain of Custody',
    icon: Database,
  },
  {
    stepNumber: 5,
    title: 'COURT-ADMISSIBLE BNSS CHARGE-SHEET',
    moduleCategory: 'MODULE 05 // JUDICIAL PROSECUTION',
    tab: 'overview',
    description:
      'Instantly compiles an immutable, digitally-signed Form 49-B Case Diary and Evidentiary Dossier admissible under Bharatiya Nyaya Sanhita (BNS) Section 111.',
    keyMetric: 'Section 111 BNS Mandate • Form 49-B Case Diary Exhibit',
    targetFocus: 'Instant Print-Ready Court Dossier Export (Section 63 BSA)',
    actionText: 'Preview Court Dossier (Form 49-B)',
    icon: FileCheck,
  },
];

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({
  isOpen,
  onClose,
  onSwitchTab,
  onOpenDossier,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Sync tab whenever tour step changes or tour opens
  useEffect(() => {
    if (isOpen) {
      const step = TOUR_STEPS[currentStepIndex];
      if (step) {
        onSwitchTab(step.tab);
      }
    }
  }, [isOpen, currentStepIndex, onSwitchTab]);

  // Reset to step 1 whenever opened
  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
    }
  }, [isOpen]);

  const handleNext = useCallback(() => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentStepIndex, onClose]);

  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  // Keyboard navigation: Esc to close, Arrow keys for next/back
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handleBack, onClose]);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;

  return (
    /* Non-intrusive container: pointer-events-none on backdrop preserves 100% crystal clear view of underlying page */
    <aside
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-label="Interactive Tour Walkthrough"
    >
      {/* Floating Tactical HUD Docked to Bottom-Right */}
      <div
        className="fixed bottom-6 right-6 z-50 pointer-events-auto max-w-md w-[calc(100vw-3rem)] sm:w-full bg-slate-950/95 border border-cyan-500/50 rounded-xl p-5 shadow-[0_0_35px_rgba(6,182,212,0.25)] backdrop-blur-md text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-3.5 select-none font-sans"
        role="region"
        aria-labelledby="tour-hud-title"
      >
        {/* Top Header Row: Mini-Badge & Close Trigger */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 tracking-wider font-semibold">
            STEP {currentStep.stepNumber} OF {TOUR_STEPS.length} // {currentStep.moduleCategory}
          </span>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            title="Exit Walkthrough (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Icon Header */}
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <StepIcon className="w-4 h-4" />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              id="tour-hud-title"
              className="text-sm font-bold font-mono text-white tracking-tight leading-snug"
            >
              {currentStep.title}
            </h3>
            <div className="text-[10.5px] font-mono text-cyan-400/90 mt-0.5 flex items-center gap-1">
              <Compass className="w-3 h-3 shrink-0 text-cyan-400" />
              <span className="truncate">{currentStep.targetFocus}</span>
            </div>
          </div>
        </div>

        {/* Description & Key Telemetry Badge */}
        <div className="space-y-2">
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStep.description}
          </p>

          <div className="flex items-center gap-1.5 text-[10.5px] font-mono text-emerald-400 bg-emerald-950/50 border border-emerald-800/60 px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="truncate font-semibold">{currentStep.keyMetric}</span>
          </div>

          {/* Step 5 Direct Action Button */}
          {currentStep.actionText && onOpenDossier && (
            <button
              onClick={() => {
                onClose();
                onOpenDossier();
              }}
              className="w-full mt-1.5 py-1.5 px-3 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/50 rounded text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currentStep.actionText}</span>
            </button>
          )}
        </div>

        {/* Continuous Progress Bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_8px_#06b6d4]" 
            style={{ width: `${((currentStepIndex + 1) / TOUR_STEPS.length) * 100}%` }} 
          />
        </div>

        {/* Controls Footer */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer underline-offset-4 hover:underline"
          >
            Skip Tour
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBack}
              disabled={isFirstStep}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-slate-800 disabled:cursor-not-allowed text-slate-200 text-xs font-mono font-medium rounded border border-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded transition-colors flex items-center gap-1 cursor-pointer shadow-sm ${
                isLastStep
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
              }`}
            >
              <span>{isLastStep ? 'Finish Walkthrough' : 'Next'}</span>
              {isLastStep ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default GuidedTourModal;

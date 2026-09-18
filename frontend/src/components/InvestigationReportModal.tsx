'use client';

import React from 'react';
import { 
  X, 
  Printer, 
  FileSpreadsheet, 
  FileJson, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { Entity, Relationship, Pattern, Evidence, InvestigationCase } from '../types/intelligence';

interface InvestigationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigationCase: InvestigationCase;
  entities: Entity[];
  relationships: Relationship[];
  patterns: Pattern[];
  evidenceCatalog: Evidence[];
}

export const InvestigationReportModal: React.FC<InvestigationReportModalProps> = ({
  isOpen,
  onClose,
  investigationCase,
  entities,
  relationships,
  patterns,
  evidenceCatalog,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    const payload = {
      reportType: 'Investigation Analysis Report',
      disclaimer: 'AI-generated analytical content. Verify all findings against original source records before operational or legal use.',
      generatedAt: new Date().toISOString(),
      case: investigationCase,
      statistics: {
        totalEntities: entities.length,
        totalRelationships: relationships.length,
        totalPatterns: patterns.length,
        totalEvidenceRecords: evidenceCatalog.length,
      },
      detectedPatterns: patterns,
      keyEntities: entities.slice(0, 15),
      evidenceInventory: evidenceCatalog,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `CHAKRAVYUH_ANALYSIS_REPORT_${investigationCase.caseNumber.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const highInfluenceEntities = entities
    .filter(e => e.metrics.betweenness > 0.5)
    .sort((a, b) => b.metrics.betweenness - a.metrics.betweenness);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 select-none overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-[3px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Action Header */}
        <div className="no-print h-14 px-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-sm text-slate-900">
              Investigation Analysis Report Export
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 text-xs font-mono font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-[2px] shadow-2xs transition-colors flex items-center space-x-1.5"
            >
              <FileJson className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-mono font-semibold text-white bg-blue-700 hover:bg-blue-600 rounded-[2px] shadow-xs transition-colors flex items-center space-x-1.5 uppercase tracking-wider"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-[2px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 report-print-container">
          {/* Official Document Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold font-mono text-blue-600 uppercase tracking-widest block mb-1">
                  CHAKRAVYUH // CRIMINAL NETWORK INTELLIGENCE
                </span>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Investigation Analysis Report
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Synthetic Demonstration Dataset Analysis • {investigationCase.caseNumber}
                </p>
              </div>

              <div className="text-right text-xs font-mono text-slate-500 space-y-0.5">
                <div>Date Generated: {new Date().toLocaleDateString('en-GB')}</div>
                <div>Status: {investigationCase.status}</div>
                <div>Case ID: {investigationCase.id}</div>
              </div>
            </div>

            {/* Prominent Mandatory AI Disclaimer (Section 31) */}
            <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200/80 rounded-[2px] text-xs text-amber-900 flex items-start space-x-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Investigative Notice & Disclaimer:</strong> This document contains AI-generated analytical content synthesized from structured and unstructured data. Verify all findings, relationships, and pattern detections against original source records before operational or legal use.
              </div>
            </div>
          </div>

          {/* Section 1: Executive Case Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              01. CASE SUMMARY & INTELLIGENCE SCOPE
            </h2>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-[2px] text-xs leading-relaxed text-slate-700 space-y-2">
              <p>
                <strong>Subject:</strong> {investigationCase.title}
              </p>
              <p>
                {investigationCase.description}
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-600">
                <strong>Intelligence Sources Ingested:</strong> {investigationCase.sources.join(', ')}.
              </div>
            </div>
          </div>

          {/* Section 2: Network Overview Metrics */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              02. KNOWLEDGE GRAPH OVERVIEW
            </h2>
            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                <div className="text-xl font-bold font-mono text-slate-900">{entities.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Entities</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                <div className="text-xl font-bold font-mono text-blue-600">{relationships.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Relationships</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                <div className="text-xl font-bold font-mono text-rose-600">{patterns.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Detected Patterns</div>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-[2px]">
                <div className="text-xl font-bold font-mono text-emerald-600">{evidenceCatalog.length}</div>
                <div className="text-[11px] text-slate-500 font-medium">Source Evidence</div>
              </div>
            </div>
          </div>

          {/* Section 3: Key Network Influence Signals */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              03. KEY STRUCTURAL ENTITIES (HIGHEST BETWEENNESS CENTRALITY)
            </h2>
            <div className="border border-slate-200 rounded-[2px] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Entity Name</th>
                    <th className="py-2.5 px-3">Type</th>
                    <th className="py-2.5 px-3">Centrality Score</th>
                    <th className="py-2.5 px-3">Degree</th>
                    <th className="py-2.5 px-3">Network Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {highInfluenceEntities.map(e => (
                    <tr key={e.id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-semibold text-slate-900 font-sans">{e.name}</td>
                      <td className="py-2 px-3 uppercase text-slate-500">{e.type}</td>
                      <td className="py-2 px-3 text-blue-600 font-bold">{e.metrics.betweenness.toFixed(3)}</td>
                      <td className="py-2 px-3">{e.metrics.degree}</td>
                      <td className="py-2 px-3 font-sans text-slate-600">{e.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Detected Patterns Breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
              04. EXPLAINABLE PATTERN FINDINGS
            </h2>
            <div className="space-y-3">
              {patterns.map(p => (
                <div key={p.id} className="p-4 border border-slate-200 rounded-[2px] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-900">{p.title}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-[2px] bg-rose-50 text-rose-700 border border-rose-200 uppercase">
                      {p.confidence}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{p.explanation}</p>
                  <div className="text-[11px] text-slate-500 font-mono">
                    <strong>Evidence:</strong> {p.evidenceIds.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Analytical Methodology */}
          <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              05. ANALYTICAL METHODOLOGY & RESOLUTION NOTES
            </h3>
            <p>
              Entity resolution performed using Jaro-Winkler string similarity, co-location latches, and shared account association. Community detection performed using the Louvain modularity optimization algorithm. Centrality metrics computed via Brandes betweenness algorithm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

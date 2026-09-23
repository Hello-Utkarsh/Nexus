'use client';

import React, { useState } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  AlertCircle, 
  ArrowRight,
  Shield,
  HelpCircle,
  X,
  ShieldAlert,
  Network,
  Terminal,
  ExternalLink
} from 'lucide-react';
import { CopilotMessage, Entity, Relationship, Pattern } from '../types/intelligence';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  relationships: Relationship[];
  patterns: Pattern[];
  onFocusEntity: (entityId: string) => void;
  onOpenInterpolNotice?: () => void;
}

const PRESET_QUERIES = [
  "Top 5 Wanted Criminals",
  "Trace Hawala Layering Loop",
  "Isolate Zero-Call Mastermind",
  "What are the strongest connections involving Rahul Kumar?",
  "Trace the financial path between Rahul Kumar and Kashi Bullion.",
  "Summarize the main investigative patterns."
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  entities,
  relationships,
  patterns,
  onFocusEntity,
  onOpenInterpolNotice,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Hello, Officer. I am the CHAKRAVYUH Investigation Copilot. I correlate knowledge graph telemetry, CDR records, and Section 63 BSA evidence. Select a query below or enter an investigative question.'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const handleSend = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // AI synthesis (deterministic domain-backed responses with structured signals)
    setTimeout(() => {
      let botResponse: CopilotMessage;

      if (queryText.includes('Wanted') || queryText.includes('interpol') || queryText.includes('Criminals')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Cross-referencing Interpol Red Corner Notices & CBI Look-Out Circulars (LOC) for Case #382/2026.',
          structuredFinding: {
            finding: '5 syndicate nodes carry active Tier-1 international warrants across Varanasi, Deira (Dubai), and Nepal transit corridors.',
            signals: [
              'Vikramaditya @ Vicky Kashi (VK-7) — TIER-1 MASTERMIND (Score: 96) • INTERPOL-RN-2026/IN-0941',
              'Tariq @ Al-Nahda Handler — CROSS-BORDER HAWALA (Score: 92) • INTERPOL-RN-2025/AE-4412',
              'Sharad "Shooter" Tiwari — CONTRACT ENFORCER (Score: 88) • INTERPOL-RN-2026/IN-1108',
              'Imran @ SIM Box Operator — VOIP GATEWAY GHOST (Score: 81) • INTERPOL-RN-2026/NP-0329',
              'Munim @ Rahul Sharma — FINANCIAL COURIER (Score: 85) • INTERPOL-RN-2026/IN-0824'
            ],
            evidence: ['INTERPOL-RED-NOTICE-0941', 'CBI-LOC-VNS-2026', 'STF-WARRANT-BNS111'],
            confidence: 0.98,
            disclaimer: 'Red Corner Notices registered with NCB New Delhi. Cross-verified under Section 63 BSA.'
          }
        };
      } else if (queryText.includes('Hawala') || queryText.includes('Loop') || queryText.includes('Layering')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Hawala Layering Loop algorithmic deduction completed for ₹18,50,000 illicit transaction chain.',
          structuredFinding: {
            finding: '4-stage circular hawala cycle de-anonymized returning to origin entity via token offset clearing.',
            signals: [
              'Stage 1: Purvanchal Agro / Axis #9182 transfers ₹18,50,000 to Mule A/C (HDFC #4412 / Rahul Kumar)',
              'Stage 2: Structured cash withdrawals via Rahul Kumar across 3 ATMs in Godowlia Chowk corridor',
              'Stage 3: Bullion invoice purchase (Kashi Bullion Traders / ICICI #5020) for 24K gold bars',
              'Stage 4: Dubai book balancing token offset against Al-Nahda Exchange (AED 81,500)'
            ],
            evidence: ['TXN-RTGS-AXIS-9812', 'TXN-MULE-SMURF-4412', 'INTEL-VOIP-UAE-971'],
            confidence: 0.96,
            disclaimer: 'Banking transaction telemetry verified via Axis/HDFC ledger logs. Certified under BNS Section 111.'
          }
        };
      } else if (queryText.includes('Mastermind') || queryText.includes('Zero-Call') || queryText.includes('Kingpin')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Zero-Call Mastermind Centrality Isolation Proof executed.',
          structuredFinding: {
            finding: 'Vikramaditya @ Vicky Kashi (VK-7) is mathematically isolated as the zero-call orchestrator shielded by cut-out intermediaries.',
            signals: [
              'Betweenness Centrality: 0.94 (Highest structural bridge across all 5 syndicate cells)',
              'Zero-Call Heuristic: Zero direct CDR calls to operational field shooters or extortion targets',
              'Single cut-out relay via encrypted VoIP through Tariq (Dubai) and Munim (Rahul)',
              'Burner hardware churn: 6 IMEI hops identified in Assi Ghat cluster'
            ],
            evidence: ['GRAPH-CENTRALITY-SOLVER', 'BTS-UP-VNS-71', 'CONFESSION-CASE-DIARY-14'],
            confidence: 0.95,
            disclaimer: 'Graph theory isolation verified via betweenness centrality and Louvain community detection heuristics.'
          }
        };
      } else if (queryText.includes('Rahul Kumar') && queryText.includes('strongest')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Analysis of connections for Rahul Kumar @ Munim reveals intense multi-channel financial and logistical centrality.',
          structuredFinding: {
            finding: 'Rahul Kumar functions as the primary bridge entity between the coordination cell and local bank mule accounts.',
            signals: [
              'Direct financial control over HDFC A/C #44120918231 (₹31,00,000 inflow)',
              'Inward remittance receipt of ₹18,50,000 from Axis Bank (Purvanchal Agro)',
              'Onward bullion purchase transaction with Kashi Bullion Traders (Godowlia Chowk)',
              'High betweenness centrality (0.88) across 21 network connections'
            ],
            evidence: ['TXN-RTGS-AXIS-9812', 'TXN-MULE-SMURF-4412', 'CONFESSION-CASE-DIARY-14'],
            confidence: 0.94,
            disclaimer: 'Analytical signal derived from transaction records and custodial statement Case Diary #14. Verify all findings against source bank vouchers.'
          }
        };
      } else if (queryText.includes('financial path') || queryText.includes('Kashi Bullion')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Financial path resolved via BFS multi-hop analysis from Axis Bank #9182 to Kashi Bullion.',
          structuredFinding: {
            finding: 'Layered 3-hop transaction path identified with exact monetary continuity (₹18,50,000).',
            signals: [
              'Hop 1: [Purvanchal Agro / Axis #9182] ➔ [HDFC #4412 / Rahul Kumar] via RTGS #AXISNEFT202608189812',
              'Hop 2: [HDFC #4412 / Rahul Kumar] ➔ [ICICI #5020 / Kashi Bullion Traders] via NEFT #HDFCNEFT202608194412',
              'Hop 3: [Kashi Bullion] ➔ [Al-Nahda Exchange Ledger / Tariq] via token offset voucher #9841'
            ],
            evidence: ['TXN-RTGS-AXIS-9812', 'TXN-BULLION-GOLD-5020', 'INTEL-VOIP-UAE-971'],
            confidence: 0.96,
            disclaimer: 'Path verified across bank statements and bullion invoices. Subpoena certified ledgers from Chowk branch before judicial submission.'
          }
        };
      } else if (queryText.includes('communities') || queryText.includes('connect')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Top community bridge entities identified using betweenness centrality graph metrics.',
          structuredFinding: {
            finding: 'Entity Rahul Kumar (Betweenness 0.88) and Vikramaditya (Betweenness 0.94) form the dual gateways connecting the 5 detected community clusters.',
            signals: [
              'Vikramaditya bridges Coordination Cell (Cluster 1) with Telecom Dispenser Cell (Cluster 4)',
              'Rahul Kumar bridges Financial Clearing Cell (Cluster 3) with Field Operations (Cluster 2)',
              'Deepak Yadav acts as the single gateway for burner SIM replenishment'
            ],
            evidence: ['CDR-UP-VNS-18302', 'POS-AUDIT-CANTT-984'],
            confidence: 0.91,
            disclaimer: 'Network centrality metrics indicate influence and structural bridging; does not constitute proof of guilt without primary evidentiary corroboration.'
          }
        };
      } else if (queryText.includes('patterns') || queryText.includes('Summarize')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Investigation Case #382/2026 exhibits 4 distinct algorithmic pattern anomalies.',
          structuredFinding: {
            finding: '4 major behavioral anomalies detected: Circular Financial Layering, Off-Hours Midnight Burst, Multi-SIM Hardware Churn, and Operational Bridge.',
            signals: [
              'Circular Hawala Loop: ₹18,50,000 looped through 4 accounts back to Dubai origin (91% confidence)',
              'Midnight Burst: 14 rapid calls between 01:45-02:30 AM on Assi Ghat Tower 71 (94% confidence)',
              'Hardware Churn: 6 SIM identities utilized on single IMEI 864291040819284 (88% confidence)',
              'Structural Bottleneck: 2 cut-out intermediaries shielding prime coordinators'
            ],
            evidence: ['TXN-RTGS-AXIS-9812', 'CDR-DUMP-BURST-71', 'POS-AUDIT-CANTT-984'],
            confidence: 0.92,
            disclaimer: 'Patterns generated through cross-source correlation. Confirm all findings with original CDR and banking files.'
          }
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: `Analysis for query "${queryText}":`,
          structuredFinding: {
            finding: 'Relevant entity records identified across Case #382/2026 intelligence repository.',
            signals: [
              'Correlated across 18 source evidence records',
              'Active in Coordination Cell and Financial Clearing subgraphs',
              'Traceable CDR latches verified in Assi Ghat sector'
            ],
            evidence: ['CDR-UP-VNS-18302', 'CONFESSION-CASE-DIARY-14'],
            confidence: 0.88,
            disclaimer: 'This analytical output is generated from the synthetic dataset. Always verify findings against primary records.'
          }
        };
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex justify-end">
      {/* Click-outside backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      <aside className="relative w-full sm:w-[480px] max-w-full bg-slate-900 border-l border-slate-700 shadow-2xl flex flex-col h-screen select-none pointer-events-auto z-10 text-slate-100 font-sans animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="h-13 px-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-[2px] bg-blue-700 border border-blue-600 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xs font-bold font-mono text-white uppercase tracking-wider">INVESTIGATION COPILOT</h2>
                <span className="text-[9px] font-mono px-1.5 py-0.2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-[2px] font-semibold">
                  SEC 63 BSA GROUNDED
                </span>
              </div>
              <p className="text-[10.5px] font-mono text-slate-400">Case #382/2026 Evidence Repository</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-[2px] transition-colors"
            title="Close Copilot (Esc)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/70 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
            SUGGESTED ANALYTICAL QUERIES
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
            {PRESET_QUERIES.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isTyping}
                className="text-[10.5px] font-mono text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white border border-slate-700 hover:border-slate-600 px-2.5 py-1 rounded-[2px] transition-colors flex items-center space-x-1 shadow-2xs truncate max-w-full text-left"
              >
                <span>{q}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Messages Thread (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`max-w-[94%] rounded-[2px] p-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-700 text-white border border-blue-600'
                      : 'bg-slate-950 text-slate-200 border border-slate-800'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Structured Analytical Finding */}
                  {msg.structuredFinding && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 text-xs space-y-2.5 text-slate-300 font-sans">
                      <div className="p-2.5 bg-slate-900 rounded-[2px] border border-slate-800">
                        <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider block mb-1">
                          ANALYTICAL FINDING
                        </span>
                        <p className="font-semibold text-white leading-snug">
                          {msg.structuredFinding.finding}
                        </p>
                      </div>

                      {/* Signals */}
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          SUPPORTING SIGNALS
                        </span>
                        <ul className="space-y-1">
                          {msg.structuredFinding.signals.map((sig, i) => (
                            <li key={i} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                              <span className="text-blue-400 font-bold leading-none mt-0.5">•</span>
                              <span>{sig}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Evidence & Confidence */}
                      <div className="flex items-center justify-between pt-1 text-[10.5px] font-mono text-slate-400 border-t border-slate-850">
                        <div className="truncate max-w-[240px]">
                          <strong className="text-slate-500">Citations:</strong> {msg.structuredFinding.evidence.join(', ')}
                        </div>
                        <div className="font-bold text-emerald-400 shrink-0">
                          {Math.round(msg.structuredFinding.confidence * 100)}% Confidence
                        </div>
                      </div>

                      {/* Grounding Disclaimer */}
                      <div className="p-2 bg-amber-950/30 border border-amber-800/40 rounded-[2px] text-[10.5px] text-amber-300 font-mono">
                        <span className="font-bold">BSA NOTICE:</span> {msg.structuredFinding.disclaimer}
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-[9.5px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
              <div className="w-1.5 h-1.5 rounded-[1px] bg-blue-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-[1px] bg-blue-500 animate-pulse delay-75" />
              <div className="w-1.5 h-1.5 rounded-[1px] bg-blue-500 animate-pulse delay-150" />
              <span className="text-[11px] font-mono">Synthesizing knowledge graph telemetry...</span>
            </div>
          )}
        </div>

        {/* Sticky Input Bar at Bottom */}
        <div className="p-3 pb-4 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0 sticky bottom-0 z-10">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(inputText);
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Ask investigation question... (Ctrl+K)"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-[2px] focus:outline-hidden focus:border-blue-500 text-white placeholder:text-slate-500 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-40 text-white rounded-[2px] text-xs font-mono font-bold uppercase transition-colors flex items-center space-x-1.5 shrink-0 shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </aside>
    </div>
  );
};


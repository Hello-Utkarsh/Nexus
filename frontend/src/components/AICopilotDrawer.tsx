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
  X
} from 'lucide-react';
import { CopilotMessage, Entity, Relationship, Pattern } from '../types/intelligence';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  relationships: Relationship[];
  patterns: Pattern[];
  onFocusEntity: (entityId: string) => void;
}

const PRESET_QUERIES = [
  "What are the strongest connections involving Rahul Kumar?",
  "Trace the financial path between Rahul Kumar and Kashi Bullion.",
  "Which entities connect different communities?",
  "What changed in this network over time?",
  "Why was entity Vikramaditya flagged?",
  "Summarize the main investigative patterns."
];

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  entities,
  relationships,
  patterns,
  onFocusEntity,
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'Hello, Investigator. I am the CHAKRAVYUH Copilot. I analyze the knowledge graph and synthesize evidence-backed signals. Select a query below or enter your question.'
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

      if (queryText.includes('Rahul Kumar') && queryText.includes('strongest')) {
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
            disclaimer: 'This is an analytical signal derived from transaction records and custodial statement Case Diary #14. Verify all findings against source bank vouchers.'
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
    <aside className="w-[420px] flex-shrink-0 border-l border-slate-200 bg-white flex flex-col h-full select-none z-20 shadow-sm">
      {/* Header */}
      <div className="h-14 px-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70 flex-shrink-0">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Investigation Copilot</h2>
            <p className="text-[11px] text-slate-500">Ask questions grounded in Case #382/2026 evidence</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="p-3 border-b border-slate-100 bg-slate-50/40">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
          SUGGESTED ANALYTICAL QUERIES
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_QUERIES.slice(0, 3).map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-[11px] text-left text-slate-700 bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 px-2.5 py-1 rounded-md transition-all truncate max-w-full shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => {
          const isUser = msg.sender === 'user';
          return (
            <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
              <div
                className={`max-w-[92%] rounded-xl p-3 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-100 text-slate-800 rounded-bl-xs border border-slate-200/80'
                }`}
              >
                {msg.text}

                {/* Structured Analytical Finding */}
                {msg.structuredFinding && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs space-y-2.5 text-slate-800">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                        ANALYTICAL FINDING
                      </span>
                      <p className="font-medium text-slate-900 leading-snug">
                        {msg.structuredFinding.finding}
                      </p>
                    </div>

                    {/* Signals */}
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        SUPPORTING SIGNALS
                      </span>
                      <ul className="space-y-1">
                        {msg.structuredFinding.signals.map((sig, i) => (
                          <li key={i} className="text-[11px] text-slate-700 flex items-start space-x-1.5">
                            <span className="text-blue-500 font-bold leading-none mt-0.5">•</span>
                            <span>{sig}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Evidence & Confidence */}
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                      <div>
                        <strong>Evidence:</strong> {msg.structuredFinding.evidence.join(', ')}
                      </div>
                      <div className="font-bold text-emerald-600">
                        {Math.round(msg.structuredFinding.confidence * 100)}% Confidence
                      </div>
                    </div>

                    {/* Grounding Disclaimer */}
                    <div className="p-2 bg-amber-50/70 border border-amber-200/80 rounded text-[10px] text-amber-800">
                      <strong>Note:</strong> {msg.structuredFinding.disclaimer}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs py-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-75" />
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse delay-150" />
            <span className="text-[11px]">Synthesizing knowledge graph...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend(inputText);
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder="Ask investigation question..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </aside>
  );
};

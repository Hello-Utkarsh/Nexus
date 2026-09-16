'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Shield, Phone, Landmark, Radio, X, ArrowRight, CornerDownLeft } from 'lucide-react';
import { SyndicateNode } from '../types/syndicate';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: SyndicateNode[];
  onSelectNode: (node: SyndicateNode) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  nodes,
  onSelectNode,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Global Ctrl+K / Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Filter nodes matching query
  const q = query.trim().toLowerCase();
  const filteredNodes = nodes.filter(n => {
    if (!q) return true;
    return (
      n.name.toLowerCase().includes(q) ||
      n.aliases.some(a => a.toLowerCase().includes(q)) ||
      n.role.toLowerCase().includes(q) ||
      n.telecom.primaryImei.includes(q) ||
      n.telecom.activeTowerId.toLowerCase().includes(q) ||
      n.telecom.linkedMsisdns.some(m => m.includes(q)) ||
      n.financial.accountNumber.includes(q) ||
      n.financial.bankName.toLowerCase().includes(q) ||
      (n.financial.upiId && n.financial.upiId.toLowerCase().includes(q))
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredNodes.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredNodes.length) % Math.max(1, filteredNodes.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredNodes[selectedIndex]) {
        onSelectNode(filteredNodes[selectedIndex]);
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0A0F1D] border border-slate-300 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col font-mono text-xs">
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0F1626]">
          <Search className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2.5 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search Suspect, Alias, IMEI, UPI ID, Bank A/C, BTS Tower..."
            className="flex-1 bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-xs"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-1.5 divide-y divide-slate-100 dark:divide-slate-800/60">
          {filteredNodes.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              No criminal entities found matching query &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredNodes.map((n, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={n.id}
                  onClick={() => {
                    onSelectNode(n);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-lg cursor-pointer flex items-center justify-between transition-colors ${
                    isSelected ? 'bg-blue-50/90 dark:bg-blue-950/50 text-slate-900 dark:text-slate-100 border border-blue-200 dark:border-blue-800 shadow-2xs' : 'text-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      n.role === 'kingpin' ? 'bg-rose-500' :
                      n.role === 'mule' ? 'bg-amber-500' :
                      n.role === 'telecom' ? 'bg-sky-500' :
                      n.role === 'shell' ? 'bg-purple-500' :
                      n.role === 'enforcer' ? 'bg-orange-500' : 'bg-slate-500'
                    }`} />

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold truncate text-slate-900 dark:text-slate-100">{n.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">({n.role})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate flex items-center space-x-3 mt-0.5">
                        <span>Aliases: {n.aliases.join(', ')}</span>
                        <span>|</span>
                        <span>IMEI: {n.telecom.primaryImei}</span>
                        <span>|</span>
                        <span>A/C: #{n.financial.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      n.riskScore > 80 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/60'
                    }`}>
                      Risk {n.riskScore}
                    </span>
                    {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-3 py-2 bg-slate-50 dark:bg-[#0F1626] border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span>Use ↑↓ to navigate</span>
            <span>•</span>
            <span>↵ to inspect</span>
            <span>•</span>
            <span>ESC to dismiss</span>
          </div>
          <div>{filteredNodes.length} matches found</div>
        </div>
      </div>
    </div>
  );
};

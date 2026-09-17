'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, CornerDownLeft, Users, Smartphone, CreditCard, Building2, MapPin, Car } from 'lucide-react';
import { Entity, EntityType } from '../types/intelligence';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  entities: Entity[];
  onSelectEntity: (entity: Entity) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  entities,
  onSelectEntity,
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

  // Global Ctrl+K / Escape handler
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

  const q = query.trim().toLowerCase();
  const filteredEntities = entities.filter(e => {
    if (!q) return true;
    return (
      e.name.toLowerCase().includes(q) ||
      e.aliases.some(a => a.toLowerCase().includes(q)) ||
      e.type.toLowerCase().includes(q) ||
      (e.telecom?.imei && e.telecom.imei.includes(q)) ||
      (e.financial?.accountNumber && e.financial.accountNumber.includes(q)) ||
      (e.location?.address && e.location.address.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredEntities.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredEntities.length) % Math.max(1, filteredEntities.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredEntities[selectedIndex]) {
        onSelectEntity(filteredEntities[selectedIndex]);
        onClose();
      }
    }
  };

  const getTypeBadgeColor = (type: EntityType) => {
    switch (type) {
      case 'person': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'phone': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'account': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'organization': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'location': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'vehicle': return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/40 backdrop-blur-xs p-4 select-none">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="h-12 px-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50/50">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search entity name, alias, IMEI, account, location..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
          {filteredEntities.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching entities found.
            </div>
          ) : (
            filteredEntities.map((ent, idx) => {
              const isSelected = idx === selectedIndex;
              const badgeClass = getTypeBadgeColor(ent.type);

              return (
                <div
                  key={ent.id}
                  onClick={() => {
                    onSelectEntity(ent);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${badgeClass}`}>
                      {ent.type}
                    </span>
                    <span className="text-xs font-semibold truncate">{ent.name}</span>
                    {ent.aliases.length > 0 && (
                      <span className="text-[11px] text-slate-400 truncate">
                        ({ent.aliases[0]})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400 flex-shrink-0">
                    <span>Centrality: {ent.metrics.betweenness.toFixed(2)}</span>
                    {isSelected && <CornerDownLeft className="w-3 h-3 text-blue-600" />}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

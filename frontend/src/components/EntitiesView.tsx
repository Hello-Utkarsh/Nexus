'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ExternalLink, 
  Eye, 
  FileText, 
  CheckCircle2, 
  Building2, 
  Smartphone, 
  CreditCard, 
  MapPin, 
  Car,
  GitMerge
} from 'lucide-react';
import { Entity, EntityType, Evidence, EntityMatch } from '../types/intelligence';
import { EntityResolutionView } from './EntityResolutionView';

interface EntitiesViewProps {
  entities: Entity[];
  evidenceCatalog: Evidence[];
  matches: EntityMatch[];
  onSelectEntity: (entity: Entity) => void;
  onViewInNetwork: (entityId: string) => void;
  onLinkEntities: (matchId: string, primaryId: string, candidateId: string) => void;
  onIgnoreMatch: (matchId: string) => void;
}

export const EntitiesView: React.FC<EntitiesViewProps> = ({
  entities,
  evidenceCatalog,
  matches,
  onSelectEntity,
  onViewInNetwork,
  onLinkEntities,
  onIgnoreMatch,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'resolution'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<EntityType | 'all'>('all');

  const pendingMatchesCount = matches.filter(m => m.status === 'pending').length;

  const filteredEntities = entities.filter(ent => {
    if (selectedType !== 'all' && ent.type !== selectedType) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ent.name.toLowerCase().includes(q) ||
      ent.aliases.some(a => a.toLowerCase().includes(q)) ||
      ent.role.toLowerCase().includes(q) ||
      ent.type.toLowerCase().includes(q)
    );
  });

  const getEntityIcon = (type: EntityType) => {
    switch (type) {
      case 'person': return Users;
      case 'phone': return Smartphone;
      case 'account': return CreditCard;
      case 'organization': return Building2;
      case 'location': return MapPin;
      case 'vehicle': return Car;
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#F8FAFC] overflow-hidden select-none">
      {/* Top Header */}
      <div className="h-14 px-6 border-b border-slate-200 bg-white flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900">Entity Intelligence & Resolution</h1>
            <p className="text-xs text-slate-500">Explore extracted intelligence entities or review potential identity matches</p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveSubTab('catalog')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'catalog'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Extracted Entities ({entities.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('resolution')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              activeSubTab === 'resolution'
                ? 'bg-white text-blue-600 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GitMerge className="w-3.5 h-3.5" />
            <span>Potential Matches</span>
            {pendingMatchesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">
                {pendingMatchesCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUB-TAB */}
      {activeSubTab === 'resolution' ? (
        <div className="flex-1 min-h-0">
          <EntityResolutionView
            matches={matches}
            entities={entities}
            onLinkEntities={onLinkEntities}
            onIgnoreMatch={onIgnoreMatch}
            onViewEntityInNetwork={onViewInNetwork}
          />
        </div>
      ) : (
        <>
          {/* Sub-bar: Type Pills & Search */}
          <div className="px-6 py-3 border-b border-slate-200 bg-white/60 flex items-center justify-between flex-wrap gap-3">
            <div className="relative w-80">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter entities by name, alias, role..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Type Filters */}
            <div className="flex items-center space-x-1 text-xs">
              {(['all', 'person', 'phone', 'account', 'organization', 'location', 'vehicle'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2 py-1 rounded capitalize text-xs transition-colors ${
                    selectedType === t
                      ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-200/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Entity Cards Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEntities.map(entity => {
                const Icon = getEntityIcon(entity.type);
                const sourceRecords = evidenceCatalog.filter(ev => entity.sourceIds.includes(ev.id));

                return (
                  <div
                    key={entity.id}
                    className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header: Type Badge & Confidence */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 text-slate-700 flex items-center space-x-1">
                          <Icon className="w-3 h-3 text-slate-500" />
                          <span>{entity.type}</span>
                        </span>
                        <span className="text-xs font-semibold font-mono text-emerald-600 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{Math.round(entity.confidence * 100)}% Confidence</span>
                        </span>
                      </div>

                      {/* Entity Name & Role */}
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {entity.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{entity.role}</p>

                      {/* Aliases */}
                      {entity.aliases.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1">
                          {entity.aliases.map((alias, idx) => (
                            <span key={idx} className="text-[10px] bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                              {alias}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Source Document References */}
                      <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                          SOURCE RECORDS ({sourceRecords.length})
                        </span>
                        {sourceRecords.slice(0, 2).map(src => (
                          <div key={src.id} className="text-[11px] text-slate-600 truncate flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate">{src.sourceName} • {src.recordId}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        Deg: {entity.metrics.degree} | Betw: {entity.metrics.betweenness.toFixed(2)}
                      </span>
                      <button
                        onClick={() => onViewInNetwork(entity.id)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View in Network</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

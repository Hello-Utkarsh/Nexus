'use client';

import React from 'react';
import { 
  Filter, 
  Layers, 
  Sliders, 
  Share2, 
  RotateCcw, 
  Users, 
  Phone, 
  CreditCard, 
  Building2, 
  MapPin, 
  Car,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Entity, Relationship, EntityType, RelationshipType } from '../types/intelligence';

interface NetworkFiltersDrawerProps {
  entities: Entity[];
  selectedTypes: Set<EntityType>;
  onToggleType: (type: EntityType) => void;
  selectedRelTypes: Set<RelationshipType>;
  onToggleRelType: (type: RelationshipType) => void;
  betweennessThreshold: number;
  onChangeBetweenness: (val: number) => void;
  confidenceThreshold: number;
  onChangeConfidence: (val: number) => void;
  showCommunities: boolean;
  onToggleCommunities: () => void;
  onCalculateShortestPath: (sourceId: string, targetId: string) => void;
  shortestPathResult: {
    pathNodeIds: string[];
    totalAmount: number;
    hopCount: number;
  } | null;
  onResetShortestPath: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const NetworkFiltersDrawer: React.FC<NetworkFiltersDrawerProps> = ({
  entities,
  selectedTypes,
  onToggleType,
  selectedRelTypes,
  onToggleRelType,
  betweennessThreshold,
  onChangeBetweenness,
  confidenceThreshold,
  onChangeConfidence,
  showCommunities,
  onToggleCommunities,
  onCalculateShortestPath,
  shortestPathResult,
  onResetShortestPath,
  isCollapsed,
  onToggleCollapse,
}) => {
  const [pathSource, setPathSource] = React.useState('ent-vicky');
  const [pathTarget, setPathTarget] = React.useState('ent-kashi-bullion');

  if (isCollapsed) {
    return (
      <aside className="w-10 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col items-center py-3 select-none z-20">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-500 mb-4 transition-colors"
          title="Expand Graph Controls"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <div className="writing-mode-vertical text-[10px] font-mono tracking-widest text-slate-400 uppercase font-semibold">
          CONTROLS
        </div>
      </aside>
    );
  }

  const typeIcons: Record<EntityType, any> = {
    person: Users,
    phone: Phone,
    account: CreditCard,
    organization: Building2,
    location: MapPin,
    vehicle: Car,
  };

  return (
    <aside className="w-72 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-y-auto select-none z-20 shadow-xs text-xs">
      {/* Header */}
      <div className="h-12 px-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-bold text-slate-900 text-xs">Graph Filters & Paths</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-slate-200/60 rounded text-slate-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* 1. Entity Types Filter */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ENTITY TYPES
          </span>
          <div className="space-y-1">
            {(['person', 'phone', 'account', 'organization', 'location', 'vehicle'] as EntityType[]).map(t => {
              const Icon = typeIcons[t];
              const isChecked = selectedTypes.has(t);
              const count = entities.filter(e => e.type === t).length;

              return (
                <label
                  key={t}
                  className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded cursor-pointer transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleType(t)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                    />
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="capitalize text-slate-700 font-medium">{t}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* 2. Analytical Thresholds */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            ANALYTICAL SIGNALS
          </span>

          {/* Centrality Threshold Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Betweenness Centrality:</span>
              <span className="font-mono font-bold text-blue-600">{betweennessThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.9"
              step="0.05"
              value={betweennessThreshold}
              onChange={e => onChangeBetweenness(parseFloat(e.target.value))}
              className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>All entities</span>
              <span>Hubs only</span>
            </div>
          </div>

          {/* Confidence Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Link Confidence:</span>
              <span className="font-mono font-bold text-emerald-600">{Math.round(confidenceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.95"
              step="0.05"
              value={confidenceThreshold}
              onChange={e => onChangeConfidence(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-1 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Communities Toggle */}
          <label className="flex items-center justify-between pt-1 cursor-pointer">
            <span className="text-slate-700">Community Clusters</span>
            <input
              type="checkbox"
              checked={showCommunities}
              onChange={onToggleCommunities}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
          </label>
        </div>

        {/* 3. Shortest Path Solver (Section 19: Real graph pathfinder) */}
        <div className="space-y-2.5 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              SHORTEST PATH ANALYZER
            </span>
            {shortestPathResult && (
              <button
                onClick={onResetShortestPath}
                className="text-[10px] text-blue-600 hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-2 text-slate-700">
            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Source Entity:</label>
              <select
                value={pathSource}
                onChange={e => setPathSource(e.target.value)}
                className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
              >
                {entities.slice(0, 15).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 block mb-0.5">Target Entity:</label>
              <select
                value={pathTarget}
                onChange={e => setPathTarget(e.target.value)}
                className="w-full text-xs p-1.5 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
              >
                {entities.slice(0, 15).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => onCalculateShortestPath(pathSource, pathTarget)}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs transition-colors flex items-center justify-center space-x-1"
            >
              <Share2 className="w-3 h-3" />
              <span>Resolve Shortest Path</span>
            </button>

            {shortestPathResult && (
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-md space-y-1 text-xs">
                <div className="font-bold text-blue-900">Path Resolved ({shortestPathResult.hopCount} Intermediaries)</div>
                <div className="text-[11px] text-blue-700">
                  Total Tracked Flow: ₹{shortestPathResult.totalAmount.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

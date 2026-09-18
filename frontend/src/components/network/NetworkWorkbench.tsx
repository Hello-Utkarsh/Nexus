'use client';

import React, { useState, useEffect } from 'react';
import { 
  Network, 
  AlertTriangle, 
  Cpu, 
  Radio, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  RotateCcw,
  Sliders,
  Maximize2
} from 'lucide-react';
import { Entity, Relationship, EntityType, RelationshipType } from '../../types/intelligence';
import { NetworkFiltersDrawer } from '../NetworkFiltersDrawer';
import { GraphCanvas } from '../GraphCanvas';
import { NodeInspector } from './NodeInspector';
import { CrimeSafetyGridModal } from './CrimeSafetyGridModal';
import { fetchSyndicateGraph } from '../../lib/api';

interface NetworkWorkbenchProps {
  entities: Entity[];
  relationships: Relationship[];
  filteredEntities: Entity[];
  filteredRelationships: Relationship[];
  selectedEntity: Entity | null;
  selectedEntityId: string | null;
  focusEntityId: string | null;
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
  onSelectEntity: (entity: Entity) => void;
  onSelectRelationship: (rel: Relationship) => void;
  onCalculateShortestPath: (sourceId: string, targetId: string) => void;
  shortestPathResult: {
    pathNodeIds: string[];
    totalAmount: number;
    hopCount: number;
  } | null;
  onResetShortestPath: () => void;
  highlightedPatternEntityIds: string[] | null;
  onSetHighlightedPatternEntityIds: (ids: string[] | null) => void;
  evidenceCatalog: any[];
  onSelectSourceTag?: (tag: string) => void;
}

export type HeuristicFilterType = 'hawala' | 'midnight' | 'sim' | null;

export const NetworkWorkbench: React.FC<NetworkWorkbenchProps> = ({
  entities,
  relationships,
  filteredEntities,
  filteredRelationships,
  selectedEntity,
  selectedEntityId,
  focusEntityId,
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
  onSelectEntity,
  onSelectRelationship,
  onCalculateShortestPath,
  shortestPathResult,
  onResetShortestPath,
  highlightedPatternEntityIds,
  onSetHighlightedPatternEntityIds,
  evidenceCatalog,
  onSelectSourceTag,
}) => {
  // Drawers
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  // Heuristic Radar Filter State
  const [activeHeuristic, setActiveHeuristic] = useState<HeuristicFilterType>(null);

  // Heavy Compute Simulation State (4 Seconds)
  const [isComputing, setIsComputing] = useState(false);
  const [computeTickerText, setComputeTickerText] = useState('');
  const [pendingComputeAction, setPendingComputeAction] = useState<(() => void) | null>(null);

  // Crime Safety Grid Modal State
  const [isSafetyGridOpen, setIsSafetyGridOpen] = useState(false);

  // Backend API Sync State
  const [apiMetrics, setApiMetrics] = useState<{ density: number; totalRecords: number } | null>(null);
  const [isSyncingGraph, setIsSyncingGraph] = useState(false);

  const handleSyncGraphApi = async () => {
    setIsSyncingGraph(true);
    try {
      const graphData = await fetchSyndicateGraph();
      if (graphData && graphData.metrics) {
        setApiMetrics({
          density: graphData.metrics.density,
          totalRecords: graphData.metrics.totalRecords,
        });
      }
    } catch (e) {
      console.info('[Telemetry Client] Sync failed, using local dataset');
    } finally {
      setTimeout(() => setIsSyncingGraph(false), 500);
    }
  };

  // Heuristic Node Groups
  const HAWALA_NODES = ['ent-vicky', 'ent-purvanchal', 'ent-rahul', 'ent-al-nahda', 'ent-axis'];
  const MIDNIGHT_NODES = ['ent-vicky', 'ent-phone-vicky', 'ent-tower71', 'ent-sharad'];
  const SIM_SWAP_NODES = ['ent-vicky', 'ent-imran', 'ent-phone-vicky', 'ent-sigra-farm'];

  // Handle Heuristic Radar Filter Click
  const handleToggleHeuristic = (type: 'hawala' | 'midnight' | 'sim') => {
    if (activeHeuristic === type) {
      setActiveHeuristic(null);
      onSetHighlightedPatternEntityIds(null);
    } else {
      setActiveHeuristic(type);
      onResetShortestPath();
      if (type === 'hawala') {
        onSetHighlightedPatternEntityIds(HAWALA_NODES);
      } else if (type === 'midnight') {
        onSetHighlightedPatternEntityIds(MIDNIGHT_NODES);
      } else {
        onSetHighlightedPatternEntityIds(SIM_SWAP_NODES);
      }
    }
  };

  // 4-Second Heavy Compute Simulation Runner
  const runHeavyCompute = (action: () => void) => {
    setIsComputing(true);
    setPendingComputeAction(() => action);

    // Step 1 (0 - 1.5s)
    setComputeTickerText('Traversing 1.2M historical telecom sub-graphs...');

    const t1 = setTimeout(() => {
      // Step 2 (1.5s - 3.0s)
      setComputeTickerText('Executing Dijkstra multi-hop shortest path algorithm...');
    }, 1500);

    const t2 = setTimeout(() => {
      // Step 3 (3.0s - 4.0s)
      setComputeTickerText('Normalizing PageRank eigenvalues & isolating bridge nodes...');
    }, 3000);

    const t3 = setTimeout(() => {
      // Complete at 4s
      setIsComputing(false);
      action();
    }, 4000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  // Compute Triggers
  const handleTriggerShortestPathCompute = (sourceId: string, targetId: string) => {
    runHeavyCompute(() => {
      onCalculateShortestPath(sourceId, targetId);
    });
  };

  const handleIsolateKingpinCompute = () => {
    runHeavyCompute(() => {
      onSetHighlightedPatternEntityIds(['ent-vicky', 'ent-rahul', 'ent-sharad']);
      const vicky = entities.find(e => e.id === 'ent-vicky');
      if (vicky) {
        onSelectEntity(vicky);
        setIsInspectorCollapsed(false);
      }
    });
  };

  return (
    <div className="flex-1 w-full h-full flex overflow-hidden font-sans">
      {/* 1. Left Column: Filters & Multi-Hop Path Drawer */}
      <NetworkFiltersDrawer
        entities={entities}
        selectedTypes={selectedTypes}
        onToggleType={onToggleType}
        selectedRelTypes={selectedRelTypes}
        onToggleRelType={onToggleRelType}
        betweennessThreshold={betweennessThreshold}
        onChangeBetweenness={onChangeBetweenness}
        confidenceThreshold={confidenceThreshold}
        onChangeConfidence={onChangeConfidence}
        showCommunities={showCommunities}
        onToggleCommunities={onToggleCommunities}
        onCalculateShortestPath={handleTriggerShortestPathCompute}
        shortestPathResult={shortestPathResult}
        onResetShortestPath={onResetShortestPath}
        isCollapsed={isFiltersCollapsed}
        onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
      />

      {/* 2. Central Interactive Canvas Area */}
      <div className="flex-1 min-w-0 h-full relative flex flex-col overflow-hidden">
        {/* TOP HEURISTIC PATTERN RADAR FILTER STRIP */}
        <div className="h-11 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between z-10 shrink-0 select-none">
          {/* Heuristic Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            <span className="text-[11px] font-mono text-slate-500 uppercase mr-1 hidden sm:inline">
              Heuristic Radar:
            </span>

            {/* Pill 1: Hawala Loops */}
            <button
              onClick={() => handleToggleHeuristic('hawala')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 shrink-0 ${
                activeHeuristic === 'hawala'
                  ? 'bg-rose-600 text-white font-bold shadow-md ring-2 ring-rose-500/50'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <span>🚨 Hawala Loops (4-Hop Cycles)</span>
            </button>

            {/* Pill 2: Midnight Bursts */}
            <button
              onClick={() => handleToggleHeuristic('midnight')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 shrink-0 ${
                activeHeuristic === 'midnight'
                  ? 'bg-amber-600 text-white font-bold shadow-md ring-2 ring-amber-500/50'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <span>🌙 Midnight Bursts (01:00-04:00 AM)</span>
            </button>

            {/* Pill 3: SIM Swapping */}
            <button
              onClick={() => handleToggleHeuristic('sim')}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all flex items-center space-x-1.5 shrink-0 ${
                activeHeuristic === 'sim'
                  ? 'bg-sky-600 text-white font-bold shadow-md ring-2 ring-sky-500/50'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700'
              }`}
            >
              <span>📱 SIM Swapping Anomalies (Cantt Tower)</span>
            </button>

            {/* Reset active filter */}
            {activeHeuristic && (
              <button
                onClick={() => {
                  setActiveHeuristic(null);
                  onSetHighlightedPatternEntityIds(null);
                }}
                className="text-[11px] font-mono text-slate-400 hover:text-white underline px-1"
              >
                Reset
              </button>
            )}
          </div>

          {/* Right Toolbar Action: India Crime Safety Grid */}
          <div className="flex items-center space-x-2 shrink-0 ml-2">
            <button
              onClick={handleSyncGraphApi}
              disabled={isSyncingGraph}
              className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-sky-300 border border-slate-700 rounded-md text-xs font-mono transition-colors"
              title="Sync graph topology from FastAPI/MongoDB backend"
            >
              <RotateCcw className={`w-3 h-3 text-sky-400 ${isSyncingGraph ? 'animate-spin' : ''}`} />
              <span>{isSyncingGraph ? 'Syncing...' : 'Sync Graph Telemetry'}</span>
              {apiMetrics && (
                <span className="text-[10px] text-slate-400 font-mono ml-1">
                  ({apiMetrics.totalRecords} recs)
                </span>
              )}
            </button>

            <button
              onClick={handleIsolateKingpinCompute}
              className="hidden xl:flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-800/80 rounded-md text-xs font-mono transition-colors"
              title="Compute and isolate Kingpin via PageRank"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Isolate Kingpin</span>
            </button>

            <button
              onClick={() => setIsSafetyGridOpen(true)}
              className="flex items-center space-x-1.5 px-2.5 py-1 bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded-md text-xs font-mono font-bold transition-all shadow-2xs"
            >
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span className="hidden md:inline">🗺️ India Crime Safety Grid</span>
              <span className="md:hidden">Crime Grid</span>
            </button>
          </div>
        </div>

        {/* 2D Canvas Container */}
        <div className="flex-1 min-w-0 h-full relative">
          <GraphCanvas
            entities={filteredEntities}
            relationships={filteredRelationships}
            selectedEntityId={selectedEntityId}
            onSelectEntity={(ent) => {
              onSelectEntity(ent);
              setIsInspectorCollapsed(false);
            }}
            highlightedPathNodeIds={shortestPathResult?.pathNodeIds || null}
            highlightedPatternEntityIds={highlightedPatternEntityIds}
            showCommunities={showCommunities}
            onSelectRelationship={onSelectRelationship}
            focusEntityId={focusEntityId}
          />

          {/* 4-SECOND ENTERPRISE HEAVY COMPUTE TACTICAL OVERLAY */}
          {isComputing && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs font-mono">
              <div className="bg-slate-900 border border-slate-700 rounded-[3px] p-6 shadow-2xl max-w-md w-full mx-4 space-y-4 text-center relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-0.5 bg-blue-600" />

                <div className="w-12 h-12 mx-auto rounded-[2px] bg-slate-950 border border-slate-700 flex items-center justify-center text-blue-400">
                  <Cpu className="w-6 h-6" />
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-blue-400 tracking-wider uppercase flex items-center justify-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-blue-400" />
                    <span>CHAKRAVYUH GRAPH COMPUTE ENGINE</span>
                  </div>
                  <p className="text-xs text-slate-200 h-10 flex items-center justify-center font-sans font-medium">
                    {computeTickerText}
                  </p>
                </div>

                {/* Compute Progress bar */}
                <div className="w-full bg-slate-950 rounded-[2px] h-1.5 overflow-hidden border border-slate-800">
                  <div className="h-full bg-blue-600 rounded-[1px] animate-progress" style={{ width: '100%' }} />
                </div>

                <div className="text-[10px] text-slate-500">
                  SECTION 111 BNS // ALGORITHMIC HEURISTIC SOLVER
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Right Column: Explainable AI Node Inspector */}
      <NodeInspector
        entity={selectedEntity}
        evidenceCatalog={evidenceCatalog}
        relationships={relationships}
        isCollapsed={isInspectorCollapsed}
        onToggleCollapse={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
        onTracePathToEntity={(targetId) => handleTriggerShortestPathCompute('ent-vicky', targetId)}
        onSelectSourceTag={onSelectSourceTag}
      />

      {/* India Crime Safety Grid Modal */}
      <CrimeSafetyGridModal
        isOpen={isSafetyGridOpen}
        onClose={() => setIsSafetyGridOpen(false)}
      />
    </div>
  );
};

'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { NavigationHeader, NavigationTab } from '../components/NavigationHeader';
import { LandingHero } from '../components/LandingHero';
import { GraphCanvas } from '../components/GraphCanvas';
import { NetworkFiltersDrawer } from '../components/NetworkFiltersDrawer';
import { EntityInspector } from '../components/EntityInspector';
import { EntitiesView } from '../components/EntitiesView';
import { EntityResolutionView } from '../components/EntityResolutionView';
import { PatternsView } from '../components/PatternsView';
import { EvidenceView } from '../components/EvidenceView';
import { TimelineEvolutionView } from '../components/TimelineEvolutionView';
import { AICopilotDrawer } from '../components/AICopilotDrawer';
import { NewInvestigationModal } from '../components/NewInvestigationModal';
import { InvestigationReportModal } from '../components/InvestigationReportModal';
import { CommandPalette } from '../components/CommandPalette';
import { EdgeEvidencePopover } from '../components/EdgeEvidencePopover';

import { 
  INITIAL_ENTITIES, 
  INITIAL_RELATIONSHIPS, 
  SYNTHETIC_EVIDENCE_CATALOG, 
  DETECTED_PATTERNS, 
  POTENTIAL_ENTITY_MATCHES, 
  DEMO_CASE 
} from '../data/intelligenceData';
import { 
  Entity, 
  Relationship, 
  EntityType, 
  RelationshipType, 
  EntityMatch 
} from '../types/intelligence';

export default function ChakravyuhPlatform() {
  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Core Dataset State
  const [entities, setEntities] = useState<Entity[]>(INITIAL_ENTITIES);
  const [relationships, setRelationships] = useState<Relationship[]>(INITIAL_RELATIONSHIPS);
  const [matches, setMatches] = useState<EntityMatch[]>(POTENTIAL_ENTITY_MATCHES);
  const [patterns, setPatterns] = useState(DETECTED_PATTERNS);
  const [evidenceCatalog, setEvidenceCatalog] = useState(SYNTHETIC_EVIDENCE_CATALOG);

  // Selection & Focus
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>('ent-vicky');
  const [selectedRelationship, setSelectedRelationship] = useState<Relationship | null>(null);
  const [focusEntityId, setFocusEntityId] = useState<string | null>('ent-vicky');

  // Modals & Drawers
  const [isNewInvestigationOpen, setIsNewInvestigationOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  // Network Filtering State
  const [selectedTypes, setSelectedTypes] = useState<Set<EntityType>>(
    new Set<EntityType>(['person', 'phone', 'account', 'organization', 'location', 'vehicle'])
  );
  const [selectedRelTypes, setSelectedRelTypes] = useState<Set<RelationshipType>>(
    new Set<RelationshipType>(['communication', 'financial', 'association', 'location', 'ownership'])
  );
  const [betweennessThreshold, setBetweennessThreshold] = useState<number>(0.0);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [showCommunities, setShowCommunities] = useState<boolean>(true);

  // Shortest Path State
  const [shortestPathResult, setShortestPathResult] = useState<{
    pathNodeIds: string[];
    totalAmount: number;
    hopCount: number;
  } | null>(null);

  // Pattern Highlight State
  const [highlightedPatternEntityIds, setHighlightedPatternEntityIds] = useState<string[] | null>(null);

  // Timeline Evolution State
  const allDates = useMemo(() => {
    const dates = new Set<string>();
    INITIAL_ENTITIES.forEach(e => dates.add(e.firstSeen));
    INITIAL_RELATIONSHIPS.forEach(r => dates.add(r.timestamp));
    return Array.from(dates).sort();
  }, []);

  const [currentDateIndex, setCurrentDateIndex] = useState<number>(allDates.length - 1);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const activeDate = allDates[currentDateIndex] || '2026-09-15';

  // Toggle Filters
  const handleToggleType = (type: EntityType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  const handleToggleRelType = (type: RelationshipType) => {
    setSelectedRelTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  // Filtered Entities & Relationships based on active filters and timeline date
  const filteredEntities = useMemo(() => {
    return entities.filter(ent => {
      if (!selectedTypes.has(ent.type)) return false;
      if (ent.metrics.betweenness < betweennessThreshold) return false;
      if (ent.firstSeen > activeDate) return false;
      return true;
    });
  }, [entities, selectedTypes, betweennessThreshold, activeDate]);

  const filteredEntityIds = useMemo(() => new Set(filteredEntities.map(e => e.id)), [filteredEntities]);

  const filteredRelationships = useMemo(() => {
    return relationships.filter(rel => {
      if (!filteredEntityIds.has(rel.sourceId) || !filteredEntityIds.has(rel.targetId)) return false;
      if (!selectedRelTypes.has(rel.type)) return false;
      if (rel.confidence < confidenceThreshold) return false;
      if (rel.timestamp > activeDate) return false;
      return true;
    });
  }, [relationships, filteredEntityIds, selectedRelTypes, confidenceThreshold, activeDate]);

  const selectedEntity = useMemo(() => {
    return entities.find(e => e.id === selectedEntityId) || null;
  }, [entities, selectedEntityId]);

  // Shortest Path Solver (BFS)
  const handleCalculateShortestPath = (sourceId: string, targetId: string) => {
    const adj = new Map<string, Array<{ to: string; rel: Relationship }>>();
    relationships.forEach(r => {
      if (!adj.has(r.sourceId)) adj.set(r.sourceId, []);
      if (!adj.has(r.targetId)) adj.set(r.targetId, []);
      adj.get(r.sourceId)!.push({ to: r.targetId, rel: r });
      adj.get(r.targetId)!.push({ to: r.sourceId, rel: r });
    });

    const queue: Array<{ current: string; path: string[]; relsInPath: Relationship[] }> = [
      { current: sourceId, path: [sourceId], relsInPath: [] }
    ];
    const visited = new Set<string>([sourceId]);
    let foundPath: string[] | null = null;
    let foundRels: Relationship[] = [];

    while (queue.length > 0) {
      const { current, path, relsInPath } = queue.shift()!;
      if (current === targetId) {
        foundPath = path;
        foundRels = relsInPath;
        break;
      }

      const neighbors = adj.get(current) || [];
      for (const { to, rel } of neighbors) {
        if (!visited.has(to)) {
          visited.add(to);
          queue.push({
            current: to,
            path: [...path, to],
            relsInPath: [...relsInPath, rel]
          });
        }
      }
    }

    if (foundPath) {
      const totalAmount = foundRels.reduce((sum, r) => sum + (r.metadata?.amount || 0), 0) || 1850000;
      setShortestPathResult({
        pathNodeIds: foundPath,
        totalAmount,
        hopCount: Math.max(0, foundPath.length - 2),
      });
      setHighlightedPatternEntityIds(null);
    }
  };

  // Entity Resolution: Merge Candidate Entity into Primary Entity
  const handleLinkEntities = (matchId: string, primaryId: string, candidateId: string) => {
    setEntities(prev => {
      const primary = prev.find(e => e.id === primaryId);
      const candidate = prev.find(e => e.id === candidateId);
      if (!primary || !candidate) return prev;

      // Merge aliases and sources
      const mergedAliases = Array.from(new Set([...primary.aliases, candidate.name, ...candidate.aliases]));
      const mergedSources = Array.from(new Set([...primary.sourceIds, ...candidate.sourceIds]));

      const updatedPrimary: Entity = {
        ...primary,
        aliases: mergedAliases,
        sourceIds: mergedSources,
        confidence: Math.max(primary.confidence, candidate.confidence),
      };

      // Remove candidate, keep updated primary
      return prev.map(e => (e.id === primaryId ? updatedPrimary : e)).filter(e => e.id !== candidateId);
    });

    // Re-route relationships
    setRelationships(prev => {
      return prev.map(r => {
        let newSource = r.sourceId === candidateId ? primaryId : r.sourceId;
        let newTarget = r.targetId === candidateId ? primaryId : r.targetId;
        return { ...r, sourceId: newSource, targetId: newTarget };
      }).filter(r => r.sourceId !== r.targetId); // Remove self-loops
    });

    // Mark match as linked
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'linked' } : m));
  };

  const handleIgnoreMatch = (matchId: string) => {
    setMatches(prev => prev.map(m => m.id === matchId ? { ...m, status: 'ignored' } : m));
  };

  // Switch to Network & Focus on specific entity
  const handleFocusEntityInNetwork = (entityId: string) => {
    setActiveTab('network');
    setSelectedEntityId(entityId);
    setFocusEntityId(entityId);
    setIsInspectorCollapsed(false);
  };

  // Switch to Network & Highlight Pattern Entities
  const handleViewPatternInNetwork = (entityIds: string[]) => {
    setActiveTab('network');
    setHighlightedPatternEntityIds(entityIds);
    setShortestPathResult(null);
    if (entityIds.length > 0) {
      setSelectedEntityId(entityIds[0]);
      setFocusEntityId(entityIds[0]);
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#F8FAFC] text-slate-900 font-sans select-none">
      {/* 1. Unified Navigation Header */}
      <NavigationHeader
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'investigations') {
            setIsNewInvestigationOpen(true);
          } else if (tab === 'copilot') {
            setIsCopilotOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        caseNumber={DEMO_CASE.caseNumber}
        entitiesCount={entities.length}
        relationshipsCount={relationships.length}
        patternsCount={patterns.length}
        onOpenNewInvestigation={() => setIsNewInvestigationOpen(true)}
        onOpenExportReport={() => setIsReportModalOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* 2. Main Tabbed Workspaces */}
      <div className="flex-1 min-h-0 w-full flex overflow-hidden relative">
        {/* VIEW A: OVERVIEW / LANDING */}
        {activeTab === 'overview' && (
          <div className="flex-1 overflow-y-auto">
            <LandingHero
              onStartInvestigation={() => setIsNewInvestigationOpen(true)}
              onExploreDemo={() => {
                setActiveTab('network');
                setFocusEntityId('ent-vicky');
              }}
            />
          </div>
        )}

        {/* VIEW B: NETWORK GRAPH (The Core Workspace) */}
        {activeTab === 'network' && (
          <div className="flex-1 w-full h-full flex overflow-hidden">
            {/* Left Column: Filters & Path Drawer */}
            <NetworkFiltersDrawer
              entities={entities}
              selectedTypes={selectedTypes}
              onToggleType={handleToggleType}
              selectedRelTypes={selectedRelTypes}
              onToggleRelType={handleToggleRelType}
              betweennessThreshold={betweennessThreshold}
              onChangeBetweenness={setBetweennessThreshold}
              confidenceThreshold={confidenceThreshold}
              onChangeConfidence={setConfidenceThreshold}
              showCommunities={showCommunities}
              onToggleCommunities={() => setShowCommunities(!showCommunities)}
              onCalculateShortestPath={handleCalculateShortestPath}
              shortestPathResult={shortestPathResult}
              onResetShortestPath={() => setShortestPathResult(null)}
              isCollapsed={isFiltersCollapsed}
              onToggleCollapse={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
            />

            {/* Central Canvas */}
            <div className="flex-1 min-w-0 h-full relative">
              <GraphCanvas
                entities={filteredEntities}
                relationships={filteredRelationships}
                selectedEntityId={selectedEntityId}
                onSelectEntity={(ent) => {
                  setSelectedEntityId(ent.id);
                  setIsInspectorCollapsed(false);
                }}
                highlightedPathNodeIds={shortestPathResult?.pathNodeIds || null}
                highlightedPatternEntityIds={highlightedPatternEntityIds}
                showCommunities={showCommunities}
                onSelectRelationship={(rel) => setSelectedRelationship(rel)}
                focusEntityId={focusEntityId}
              />
            </div>

            {/* Right Column: Entity Inspector */}
            <EntityInspector
              entity={selectedEntity}
              evidenceCatalog={evidenceCatalog}
              relationships={relationships}
              isCollapsed={isInspectorCollapsed}
              onToggleCollapse={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
              onTracePathToEntity={(targetId) => handleCalculateShortestPath('ent-vicky', targetId)}
            />
          </div>
        )}

        {/* VIEW C: EXTRACTED ENTITIES & RESOLUTION */}
        {activeTab === 'entities' && (
          <EntitiesView
            entities={entities}
            evidenceCatalog={evidenceCatalog}
            matches={matches}
            onSelectEntity={(ent) => handleFocusEntityInNetwork(ent.id)}
            onViewInNetwork={handleFocusEntityInNetwork}
            onLinkEntities={handleLinkEntities}
            onIgnoreMatch={handleIgnoreMatch}
          />
        )}

        {/* VIEW D: EXPLAINABLE PATTERNS */}
        {activeTab === 'patterns' && (
          <PatternsView
            patterns={patterns}
            entities={entities}
            evidenceCatalog={evidenceCatalog}
            onViewPatternInNetwork={handleViewPatternInNetwork}
          />
        )}

        {/* VIEW E: EVIDENCE VAULT */}
        {activeTab === 'evidence' && (
          <EvidenceView
            evidenceCatalog={evidenceCatalog}
            entities={entities}
            onViewInNetwork={(entIds) => handleViewPatternInNetwork(entIds)}
          />
        )}

        {/* VIEW F: NETWORK EVOLUTION TIMELINE */}
        {activeTab === 'timeline' && (
          <TimelineEvolutionView
            dates={allDates}
            currentDateIndex={currentDateIndex}
            onScrubDate={setCurrentDateIndex}
            isPlaying={isPlayingTimeline}
            onTogglePlay={() => setIsPlayingTimeline(!isPlayingTimeline)}
            activeEntityCount={filteredEntities.length}
            activeRelationshipCount={filteredRelationships.length}
            activePatternCount={patterns.length}
          />
        )}

        {/* AI Copilot Side Drawer (Accessible from any screen or dedicated trigger) */}
        <AICopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          entities={entities}
          relationships={relationships}
          patterns={patterns}
          onFocusEntity={handleFocusEntityInNetwork}
        />
      </div>

      {/* Global Modals */}
      <NewInvestigationModal
        isOpen={isNewInvestigationOpen}
        onClose={() => setIsNewInvestigationOpen(false)}
        onCompleteIngestion={() => {
          setActiveTab('network');
          setFocusEntityId('ent-vicky');
        }}
      />

      <InvestigationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        investigationCase={DEMO_CASE}
        entities={entities}
        relationships={relationships}
        patterns={patterns}
        evidenceCatalog={evidenceCatalog}
      />

      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        entities={entities}
        onSelectEntity={(ent) => handleFocusEntityInNetwork(ent.id)}
      />

      <EdgeEvidencePopover
        relationship={selectedRelationship}
        entities={entities}
        evidenceCatalog={evidenceCatalog}
        onClose={() => setSelectedRelationship(null)}
      />
    </main>
  );
}

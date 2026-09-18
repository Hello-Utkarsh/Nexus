'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { NavigationHeader, NavigationTab } from '../components/NavigationHeader';
import { Sidebar } from '../components/layout/Sidebar';
import { GovAuthModal } from '../components/auth/GovAuthModal';
import { AuditDock } from '../components/admin/AuditDock';
import { SocmintView } from '../components/socmint/SocmintView';
import { InvestigationsView } from '../components/investigations/InvestigationsView';
import { MyInvestigationsView } from '../components/investigations/MyInvestigationsView';
import { CaseMetadataBar } from '../components/investigations/CaseMetadataBar';
import { CaseDossierDoc } from '../components/investigations/CaseDossierDoc';
import { TimelineView } from '../components/timeline/TimelineView';
import { LandingHero } from '../components/LandingHero';
import { NetworkWorkbench } from '../components/network/NetworkWorkbench';
import { GraphCanvas } from '../components/GraphCanvas';
import { NetworkFiltersDrawer } from '../components/NetworkFiltersDrawer';
import { EntityInspector } from '../components/EntityInspector';
import { EntitiesView } from '../components/EntitiesView';
import { EntityResolutionView } from '../components/EntityResolutionView';
import { PatternsView } from '../components/PatternsView';
import { EvidenceView } from '../components/EvidenceView';
import { EvidenceVaultView } from '../components/evidence/EvidenceVaultView';
import { SourceDocumentDrawer } from '../components/evidence/SourceDocumentDrawer';
import { TimelineEvolutionView } from '../components/TimelineEvolutionView';
import { AICopilotDrawer } from '../components/AICopilotDrawer';
import { NewInvestigationModal } from '../components/NewInvestigationModal';
import { MultiFormatIngestModal } from '../components/ingestion/MultiFormatIngestModal';
import { InvestigationReportModal } from '../components/InvestigationReportModal';
import { CommandPalette } from '../components/CommandPalette';
import { EdgeEvidencePopover } from '../components/EdgeEvidencePopover';
import { GlobalFloatingPrompt } from '../components/copilot/GlobalFloatingPrompt';
import { AuthProvider, useAuth } from '../context/AuthContext';

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

function ChakravyuhPlatformInner() {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth();

  // Navigation
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Super Admin Audit Dock State
  const [isAuditDockOpen, setIsAuditDockOpen] = useState(false);

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
  const [isDossierDocOpen, setIsDossierDocOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);
  const [selectedSourceTag, setSelectedSourceTag] = useState<string | null>(null);

  // Active Case Directive & Metadata
  const [activeCaseDirective, setActiveCaseDirective] = useState('OP: Operation Syndicate-Viper // FIR #382/2026');
  const [activeUnitName, setActiveUnitName] = useState('UP-STF Special Cell (Varanasi / Lucknow Range)');

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

  // If loading session state from storage
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center font-mono text-slate-400 space-y-3">
        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
        <div className="text-xs tracking-widest text-slate-300 uppercase">
          INITIALIZING CHAKRAVYUH SECURE SESSION...
        </div>
      </div>
    );
  }

  // If unauthenticated guest, render GovAuthModal
  if (!isAuthenticated) {
    return <GovAuthModal isOpen={true} />;
  }

  return (
    <main className="h-screen w-full flex bg-slate-950 text-slate-900 font-sans select-none">
      {/* 1. Left-Side Responsive Collapsible GovTech Sidebar (Pinned to Viewport Height) */}
      <div className="shrink-0 h-full z-40">
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'investigations') {
              setActiveTab('investigations');
            } else if (tab === 'copilot') {
              setIsCopilotOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          patternsCount={patterns.length}
          evidenceCount={evidenceCatalog.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onOpenAuditDock={() => setIsAuditDockOpen(true)}
        />
      </div>

      {/* 2. Main Content Application Shell (Natural 100% Zoom Scrolling) */}
      <div className="flex-1 h-screen overflow-y-auto overflow-x-hidden min-h-0 flex flex-col bg-[#F8FAFC] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-slate-950 [&::-webkit-scrollbar-thumb]:bg-slate-800 hover:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        {/* Top Sticky Tactical Navigation Bar & Investigation Metadata */}
        <div className="sticky top-0 z-30 bg-white shrink-0 shadow-xs">
          <NavigationHeader
            activeTab={activeTab}
            onSelectTab={(tab) => {
              if (tab === 'investigations') {
                setActiveTab('investigations');
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
            onOpenAuditDock={() => setIsAuditDockOpen(true)}
            onOpenCopilot={() => setIsCopilotOpen(true)}
          />

          <CaseMetadataBar
            caseDirective={activeCaseDirective}
            unitName={activeUnitName}
            onExportExhibit={() => setIsDossierDocOpen(true)}
          />
        </div>

        {/* 3. Main Dynamic Workspace Area */}
        <div className="flex-1 w-full relative">
          {/* VIEW A: OVERVIEW / LANDING */}
          {activeTab === 'overview' && (
            <div className="w-full min-h-full bg-slate-950">
              <LandingHero
                onStartInvestigation={() => setIsNewInvestigationOpen(true)}
                onExploreDemo={() => {
                  setActiveTab('network');
                  setFocusEntityId('ent-vicky');
                }}
              />
            </div>
          )}

          {/* VIEW B: NETWORK WORKBENCH (The Core Graph Workspace) */}
          {activeTab === 'network' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
            <NetworkWorkbench
              entities={entities}
              relationships={relationships}
              filteredEntities={filteredEntities}
              filteredRelationships={filteredRelationships}
              selectedEntity={selectedEntity}
              selectedEntityId={selectedEntityId}
              focusEntityId={focusEntityId}
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
              onSelectEntity={(ent) => {
                setSelectedEntityId(ent.id);
                setFocusEntityId(ent.id);
              }}
              onSelectRelationship={(rel) => setSelectedRelationship(rel)}
              onCalculateShortestPath={handleCalculateShortestPath}
              shortestPathResult={shortestPathResult}
              onResetShortestPath={() => setShortestPathResult(null)}
              highlightedPatternEntityIds={highlightedPatternEntityIds}
              onSetHighlightedPatternEntityIds={setHighlightedPatternEntityIds}
              evidenceCatalog={evidenceCatalog}
              onSelectSourceTag={(tag) => setSelectedSourceTag(tag)}
            />
            </div>
          )}

          {/* VIEW C: PATTERNS RADAR */}
          {activeTab === 'patterns' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
              <PatternsView
                patterns={patterns}
                entities={entities}
                evidenceCatalog={evidenceCatalog}
                onViewPatternInNetwork={handleViewPatternInNetwork}
              />
            </div>
          )}

          {/* VIEW D: TIMELINE ANALYSIS */}
          {activeTab === 'timeline' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
              <TimelineView
                currentStageIndex={3}
                onSelectStage={(stageIndex, date) => {
                  const matched = allDates.indexOf(date);
                  if (matched !== -1) {
                    setCurrentDateIndex(matched);
                  }
                }}
                onLaunchWorkbench={() => {
                  setActiveTab('network');
                  setFocusEntityId('ent-vicky');
                }}
              />
            </div>
          )}

          {/* VIEW E: MULTIMEDIA EVIDENCE VAULT */}
          {activeTab === 'evidence' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
              <EvidenceVaultView
                evidenceCatalog={evidenceCatalog}
                entities={entities}
                onViewInNetwork={(entIds) => handleViewPatternInNetwork(entIds)}
                onSelectSourceTag={(tag) => setSelectedSourceTag(tag)}
              />
            </div>
          )}

          {/* VIEW F: SOCMINT & OSINT RADAR */}
          {activeTab === 'socmint' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
              <SocmintView 
                onViewEntityInNetwork={handleFocusEntityInNetwork}
                onMapToGraph={(entityIds, focusId) => {
                  setActiveTab('network');
                  setHighlightedPatternEntityIds(entityIds);
                  setShortestPathResult(null);
                  if (focusId) {
                    setSelectedEntityId(focusId);
                    setFocusEntityId(focusId);
                    setIsInspectorCollapsed(false);
                  }
                }}
              />
            </div>
          )}

          {/* VIEW G: MY INVESTIGATIONS CASE MANAGEMENT */}
          {activeTab === 'investigations' && (
            <div className="w-full h-[calc(100vh-6.5rem)] min-h-[720px]">
              <MyInvestigationsView
                onSelectCase={(caseId) => {
                  if (caseId === 'case-382') {
                    setActiveCaseDirective('OP: Operation Syndicate-Viper // FIR #382/2026');
                    setActiveUnitName('UP-STF Special Cell (Varanasi / Lucknow Range)');
                  } else if (caseId === 'case-104') {
                    setActiveCaseDirective('OP: Operation Signal-Ghost // FIR #104/2026');
                    setActiveUnitName('Cyber Crime PS Lucknow Range');
                  } else {
                    setActiveCaseDirective('OP: Operation Silent-Tower // FIR #042/2025');
                    setActiveUnitName('Varanasi Commissionerate Special Operations');
                  }
                  setActiveTab('network');
                  setFocusEntityId('ent-vicky');
                }}
                onOpenNewInvestigation={() => setIsNewInvestigationOpen(true)}
                onOpenExportReport={() => setIsDossierDocOpen(true)}
                onOpenDossier={() => setIsDossierDocOpen(true)}
              />
            </div>
          )}

          {/* AI Copilot Side Drawer */}
          <AICopilotDrawer
            isOpen={isCopilotOpen}
            onClose={() => setIsCopilotOpen(false)}
            entities={entities}
            relationships={relationships}
            patterns={patterns}
            onFocusEntity={handleFocusEntityInNetwork}
          />
        </div>
      </div>

      {/* Super Admin Audit Dock Drawer */}
      <AuditDock
        isOpen={isAuditDockOpen}
        onClose={() => setIsAuditDockOpen(false)}
      />

      {/* Multi-Format Ingestion Modal (Phase 4) */}
      <MultiFormatIngestModal
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

      {/* Google Docs-Style Case Diary & Official Report Modal */}
      <CaseDossierDoc
        isOpen={isDossierDocOpen}
        onClose={() => setIsDossierDocOpen(false)}
        caseNumber={DEMO_CASE.caseNumber}
      />

      {/* Source Document Evidentiary Drawer (Phase 4) */}
      <SourceDocumentDrawer
        sourceTag={selectedSourceTag}
        onClose={() => setSelectedSourceTag(null)}
        onNavigateToEntity={handleFocusEntityInNetwork}
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

      {/* Global Persistent AI Prompt Dock */}
      <GlobalFloatingPrompt
        onHighlightInGraph={(entityIds, focusId) => {
          setActiveTab('network');
          setHighlightedPatternEntityIds(entityIds);
          setShortestPathResult(null);
          if (focusId) {
            setSelectedEntityId(focusId);
            setFocusEntityId(focusId);
            setIsInspectorCollapsed(false);
          } else if (entityIds.length > 0) {
            setSelectedEntityId(entityIds[0]);
            setFocusEntityId(entityIds[0]);
            setIsInspectorCollapsed(false);
          }
        }}
        onNavigateTab={(tab) => setActiveTab(tab as any)}
      />
    </main>
  );
}

export default function ChakravyuhPlatform() {
  return (
    <AuthProvider>
      <ChakravyuhPlatformInner />
    </AuthProvider>
  );
}

'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GovTechNavbar } from '../components/GovTechNavbar';
import { HeroDirective } from '../components/HeroDirective';
import { ProofMetricsStrip } from '../components/ProofMetricsStrip';
import { InteractiveShowcase } from '../components/InteractiveShowcase';
import { CapabilitiesGrid } from '../components/CapabilitiesGrid';
import { StakeholderQuotes } from '../components/StakeholderQuotes';
import { GovTechFooter } from '../components/GovTechFooter';

import { TopCommandBar } from '../components/TopCommandBar';
import { LeftDock } from '../components/LeftDock';
import { GraphCanvas } from '../components/GraphCanvas';
import { TimelineScrubber } from '../components/TimelineScrubber';
import { RightInspector } from '../components/RightInspector';
import { DossierModal } from '../components/DossierModal';
import { CommandPalette } from '../components/CommandPalette';
import { AnomalyRadar, AnomalyType } from '../components/AnomalyRadar';
import { EdgeEvidencePopover } from '../components/EdgeEvidencePopover';

import { 
  INITIAL_SYNDICATE_NODES, 
  INITIAL_SYNDICATE_EDGES 
} from '../data/syndicateData';
import { 
  SyndicateNode, 
  SyndicateEdge, 
  EntityRole, 
  ExtractedEntity 
} from '../types/syndicate';

export default function DefenseOperatingSystem() {
  // Environmental Lighting Mode: 'oled' (Tactical Dark OLED) vs 'judicial' (Judicial Light Paper)
  const [themeMode, setThemeMode] = useState<'oled' | 'judicial'>('judicial');

  useEffect(() => {
    if (themeMode === 'oled') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // Master Operating System View Mode: Executive Directive Overview vs Full Investigation Console
  const [activeView, setActiveView] = useState<'overview' | 'console'>('overview');
  const [activeNavTab, setActiveNavTab] = useState<string>('console');

  // Master Syndicate Data state
  const [nodes, setNodes] = useState<SyndicateNode[]>(INITIAL_SYNDICATE_NODES);
  const [edges, setEdges] = useState<SyndicateEdge[]>(INITIAL_SYNDICATE_EDGES);

  // Active operation
  const [selectedOperation, setSelectedOperation] = useState(
    'Operation Syndicate-Viper // FIR #382/2026 (PS Lanka, Varanasi)'
  );

  // Selected Target Node for Inspection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-vicky'); // Default to Vicky Kashi

  // Topology View (2D Force or 3D Hive)
  const [topologyMode, setTopologyMode] = useState<'2D-FORCE' | '3D-HIVE'>('2D-FORCE');

  // Left Dock & Tabs
  const [leftDockTab, setLeftDockTab] = useState<'filters' | 'ingestion'>('filters');

  // Inspector Collapsed State
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(false);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDossierModalOpen, setIsDossierModalOpen] = useState(false);

  // Filter States
  const [selectedRoles, setSelectedRoles] = useState<Set<EntityRole>>(
    new Set<EntityRole>(['kingpin', 'mule', 'telecom', 'shell', 'enforcer', 'victim'])
  );
  const [betweennessThreshold, setBetweennessThreshold] = useState<number>(0.0);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.5);
  const [isKingpinIsolated, setIsKingpinIsolated] = useState<boolean>(false);

  // Shortest Path state
  const [shortestPathResult, setShortestPathResult] = useState<{
    pathNodeIds: string[];
    totalAmount: number;
    hopCount: number;
  } | null>(null);

  // Louvain Community & Anomaly Radar States
  const [showLouvainCommunities, setShowLouvainCommunities] = useState<boolean>(true);
  const [activeAnomaly, setActiveAnomaly] = useState<AnomalyType>(null);
  const [selectedEdgeForEvidence, setSelectedEdgeForEvidence] = useState<SyndicateEdge | null>(null);

  // NLP Entity Sync with Canvas state
  const [nlpHighlightedNodeIds, setNlpHighlightedNodeIds] = useState<Set<string> | null>(null);
  const [canvasFocusNodeId, setCanvasFocusNodeId] = useState<string | null>(null);

  const handleSyncNlpEntities = useCallback((nodeIds: string[], focusId: string) => {
    setNlpHighlightedNodeIds(new Set(nodeIds));
    setSelectedNodeId(focusId);
    setCanvasFocusNodeId(focusId);
  }, []);

  // Timeline DVR state
  const allDates = useMemo(() => {
    const datesSet = new Set<string>();
    INITIAL_SYNDICATE_NODES.forEach(n => datesSet.add(n.firstActivityDate));
    INITIAL_SYNDICATE_EDGES.forEach(e => datesSet.add(e.timestamp));
    return Array.from(datesSet).sort();
  }, []);

  const [currentDateIndex, setCurrentDateIndex] = useState<number>(allDates.length - 1);
  const [isPlayingDVR, setIsPlayingDVR] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const currentDate = allDates[currentDateIndex] || '2026-09-15';

  // Toggle Role Filter
  const handleToggleRole = (role: EntityRole) => {
    setSelectedRoles(prev => {
      const next = new Set(prev);
      if (next.has(role)) {
        next.delete(role);
      } else {
        next.add(role);
      }
      return next;
    });
  };

  // Shortest Money Path (BFS / Dijkstra)
  const handleCalculateShortestPath = (sourceId: string, targetId: string) => {
    const adj = new Map<string, Array<{ to: string; edge: SyndicateEdge }>>();
    edges.forEach(e => {
      if (!adj.has(e.source)) adj.set(e.source, []);
      if (!adj.has(e.target)) adj.set(e.target, []);
      adj.get(e.source)!.push({ to: e.target, edge: e });
      adj.get(e.target)!.push({ to: e.source, edge: e });
    });

    const queue: Array<{ current: string; path: string[]; edgesInPath: SyndicateEdge[] }> = [
      { current: sourceId, path: [sourceId], edgesInPath: [] }
    ];
    const visited = new Set<string>([sourceId]);
    let foundPath: string[] | null = null;
    let foundEdges: SyndicateEdge[] = [];

    while (queue.length > 0) {
      const { current, path, edgesInPath } = queue.shift()!;
      if (current === targetId) {
        foundPath = path;
        foundEdges = edgesInPath;
        break;
      }

      const neighbors = adj.get(current) || [];
      for (const { to, edge } of neighbors) {
        if (!visited.has(to)) {
          visited.add(to);
          queue.push({
            current: to,
            path: [...path, to],
            edgesInPath: [...edgesInPath, edge]
          });
        }
      }
    }

    if (foundPath) {
      const totalAmount = foundEdges.reduce((sum, e) => sum + (e.amount || 0), 0) || 4250000;
      setShortestPathResult({
        pathNodeIds: foundPath,
        totalAmount,
        hopCount: Math.max(0, foundPath.length - 2),
      });
    } else {
      setShortestPathResult({
        pathNodeIds: [sourceId, targetId],
        totalAmount: 1450000,
        hopCount: 1,
      });
    }
  };

  // Trace Hawala flow to Dubai desk from any node
  const handleTraceHawala = (nodeId: string) => {
    handleCalculateShortestPath('node-tariq', nodeId);
  };

  // Toggle Prime Accused
  const handleMarkPrimeAccused = (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, isPrimeAccused: !n.isPrimeAccused } : n));
  };

  // Toggle LOC Flag
  const handleToggleLOC = (nodeId: string) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, flaggedForLoc: !n.flaggedForLoc } : n));
  };

  // Inject Extracted Entity from Ingestion Tab
  const handleInjectExtractedEntity = (ent: ExtractedEntity) => {
    const newId = `injected-${Date.now()}`;
    const mappedRole: EntityRole = 
      ent.type === 'PERSON' ? 'enforcer' :
      ent.type === 'BANK' ? 'mule' :
      ent.type === 'SIM' ? 'telecom' :
      ent.type === 'COMPANY' ? 'shell' : 'victim';

    const newNode: SyndicateNode = {
      id: newId,
      name: ent.value,
      aliases: [ent.type + '-EXTRACTED'],
      role: mappedRole,
      cluster: 'C',
      clusterName: 'Interrogation Ingested Leads',
      subType: ent.type === 'BANK' ? 'bank' : ent.type === 'SIM' ? 'sim' : ent.type === 'COMPANY' ? 'shell' : 'person',
      rank: 'Interrogation Corroborated Entity',
      status: 'UNDER_SURVEILLANCE',
      riskScore: 75,
      betweennessCentrality: 0.45,
      pageRank: 0.08,
      inDegree: 1,
      outDegree: 1,
      flaggedForLoc: false,
      isPrimeAccused: false,
      avatarSeed: ent.value,
      firstActivityDate: currentDate,
      lastActivityDate: currentDate,
      telecom: {
        primaryImei: 'IMEI-PENDING-CAF',
        imsi: 'IMSI-PENDING',
        carrier: 'Airtel/Jio UP East',
        activeTowerId: 'UP-EAST-VNS-71',
        towerLocation: 'Varanasi Central',
        linkedMsisdns: [ent.value],
        cdrInterceptCount: 12,
        lastInterceptTimestamp: '2026-09-15 11:00:00 IST'
      },
      financial: {
        accountNumber: 'PENDING-KYC',
        bankName: 'Axis/SBI Field Branch',
        ifsc: 'SBIN0001248',
        accountHolder: ent.value,
        layeringRole: 'Newly Ingested Lead',
        totalInflow: 500000,
        totalOutflow: 480000
      },
      evidence: {
        firReference: 'FIR #382/2026 (PS Lanka)',
        evidenceTag: `EVID-NLP-${Date.now().toString().slice(-4)}`,
        wiretapLogId: 'WT-LOG-NLP-NEW',
        towerDumpMatch: true,
        bnsSections: ['Sec 61(2) BNS'],
        ipcEquivalent: ['IPC 120B'],
        confidenceScore: ent.confidence * 100,
        confessionExcerpt: `Entity extracted via NLP NER from interrogation diary: "${ent.context}"`
      }
    };

    setNodes(prev => [...prev, newNode]);

    const targetLink = nodes.find(n => n.role === 'kingpin') || nodes[0];
    const newEdge: SyndicateEdge = {
      id: `edge-injected-${Date.now()}`,
      source: targetLink.id,
      target: newId,
      type: mappedRole === 'mule' ? 'financial' : mappedRole === 'telecom' ? 'telecom' : 'conspiracy',
      label: 'NLP Interrogation Lead Link',
      timestamp: currentDate,
      confidence: ent.confidence,
    };

    setEdges(prev => [...prev, newEdge]);
    setSelectedNodeId(newId);
  };

  // Filtered Nodes & Edges based on Role, Thresholds, and Timeline DVR date
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      if (!selectedRoles.has(n.role)) return false;
      if (n.betweennessCentrality < betweennessThreshold) return false;
      if (n.firstActivityDate > currentDate) return false;
      return true;
    });
  }, [nodes, selectedRoles, betweennessThreshold, currentDate]);

  const filteredNodeIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return edges.filter(e => {
      if (!filteredNodeIds.has(e.source) || !filteredNodeIds.has(e.target)) return false;
      if (e.confidence < confidenceThreshold) return false;
      if (e.timestamp > currentDate) return false;
      return true;
    });
  }, [edges, filteredNodeIds, confidenceThreshold, currentDate]);

  // Selected Node Object
  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  // Network Density & Risk calculation
  const networkStats = useMemo(() => {
    const N = filteredNodes.length;
    const E = filteredEdges.length;
    const maxEdges = N > 1 ? (N * (N - 1)) / 2 : 1;
    const density = Math.min(1.0, E / maxEdges);
    return {
      density,
      riskScore: 92,
      activeNodes: N,
      activeEdges: E,
    };
  }, [filteredNodes, filteredEdges]);

  // -------------------------------------------------------------
  // VIEW 1: DIRECTIVE OVERVIEW & INTERACTIVE SHOWCASE
  // -------------------------------------------------------------
  if (activeView === 'overview') {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#050711] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-blue-100 dark:selection:bg-cyan-950 selection:text-blue-900 dark:selection:text-cyan-200 transition-colors duration-100 ease-linear">
        {/* Navigation Bar */}
        <GovTechNavbar
          activeTab={activeNavTab}
          onSelectTab={(tab) => {
            setActiveNavTab(tab);
            if (tab === 'console') setActiveView('console');
          }}
          onOpenConsole={() => setActiveView('console')}
          onOpenDossier={() => setIsDossierModalOpen(true)}
          themeMode={themeMode}
          onToggleTheme={setThemeMode}
        />

        <main className="flex-1">
          {/* 1. Hero Directive */}
          <HeroDirective
            onLaunchConsole={() => setActiveView('console')}
            onViewCaseFile={() => setIsDossierModalOpen(true)}
          />

          {/* 2. 4-Column Proof Metrics Strip */}
          <ProofMetricsStrip />

          {/* 3. Dual-Column Interactive Intelligence Showcase */}
          <InteractiveShowcase
            onLaunchFullConsole={() => setActiveView('console')}
          />

          {/* 4. Asymmetric 2x2 Capabilities Grid */}
          <CapabilitiesGrid
            onExploreCapability={(id) => {
              if (id === 'kingpin') setIsKingpinIsolated(true);
              setActiveView('console');
            }}
          />

          {/* 5. Realistic Stakeholder Operational Quotes */}
          <StakeholderQuotes />
        </main>

        {/* 6. GovTech Standard Footer */}
        <GovTechFooter
          onOpenConsole={() => setActiveView('console')}
          onOpenDossier={() => setIsDossierModalOpen(true)}
        />

        {/* Modals available globally */}
        <DossierModal
          isOpen={isDossierModalOpen}
          onClose={() => setIsDossierModalOpen(false)}
          nodes={nodes}
          edges={edges}
          operationName={selectedOperation}
        />
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: FULL-SCREEN INVESTIGATION CONSOLE
  // -------------------------------------------------------------
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-[#F8FAFC] dark:bg-[#050711] text-slate-900 dark:text-slate-100 select-none transition-colors duration-100 ease-linear">
      {/* 1. TOP COMMAND BAR (Height: 56px / h-14) */}
      <TopCommandBar
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenIngestDrawer={() => setLeftDockTab('ingestion')}
        onOpenExportDossier={() => setIsDossierModalOpen(true)}
        topologyMode={topologyMode}
        onToggleTopology={() => setTopologyMode(prev => prev === '2D-FORCE' ? '3D-HIVE' : '2D-FORCE')}
        selectedOperation={selectedOperation}
        onSelectOperation={setSelectedOperation}
        onBackToOverview={() => setActiveView('overview')}
        networkStats={networkStats}
        themeMode={themeMode}
        onToggleTheme={setThemeMode}
      />

      {/* 2. MAIN WORKSPACE ROW (Left Dock 320px | Canvas Flex min-w-0 | Right Inspector 380px) */}
      <div className="flex-1 w-full flex overflow-hidden">
        {/* LEFT DOCK - FILTERS & MULTI-MODAL INGESTION */}
        <LeftDock
          nodes={nodes}
          edges={edges}
          selectedRoles={selectedRoles}
          onToggleRole={handleToggleRole}
          betweennessThreshold={betweennessThreshold}
          onChangeBetweenness={setBetweennessThreshold}
          confidenceThreshold={confidenceThreshold}
          onChangeConfidence={setConfidenceThreshold}
          isKingpinIsolated={isKingpinIsolated}
          onToggleIsolateKingpin={() => setIsKingpinIsolated(!isKingpinIsolated)}
          onCalculateShortestPath={handleCalculateShortestPath}
          shortestPathResult={shortestPathResult}
          onResetShortestPath={() => setShortestPathResult(null)}
          onInjectExtractedEntity={handleInjectExtractedEntity}
          activeTab={leftDockTab}
          onChangeTab={setLeftDockTab}
          showLouvainCommunities={showLouvainCommunities}
          onToggleLouvainCommunities={() => setShowLouvainCommunities(prev => !prev)}
          onSyncNlpEntities={handleSyncNlpEntities}
        />

        {/* CENTRAL WORKSPACE - 2D FORCE / HIVE CANVAS & DVR TIMELINE SCRUBBER */}
        <div className="flex-1 min-w-0 h-full relative flex flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#050711]">
          {/* Canvas Engine */}
          <div className="flex-1 w-full h-full relative">
            <GraphCanvas
              nodes={filteredNodes}
              edges={filteredEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={(node) => setSelectedNodeId(node.id)}
              topologyMode={topologyMode}
              isKingpinIsolated={isKingpinIsolated}
              highlightedPathNodeIds={shortestPathResult?.pathNodeIds || null}
              showLouvainCommunities={showLouvainCommunities}
              activeAnomaly={activeAnomaly}
              onSelectEdge={(edge) => setSelectedEdgeForEvidence(edge)}
              nlpHighlightedNodeIds={nlpHighlightedNodeIds}
              focusNodeId={canvasFocusNodeId}
              themeMode={themeMode}
            />

            {/* Innovation 1: Automated Pattern & Anomaly Radar (PS 13 Core Requirement) */}
            <AnomalyRadar
              activeAnomaly={activeAnomaly}
              onSelectAnomaly={setActiveAnomaly}
            />

            {/* DVR Chronological Timeline Scrubber Overlay */}
            <TimelineScrubber
              currentDateIndex={currentDateIndex}
              dates={allDates}
              isPlaying={isPlayingDVR}
              onTogglePlay={() => setIsPlayingDVR(!isPlayingDVR)}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
              onScrubDate={setCurrentDateIndex}
              onReset={() => setCurrentDateIndex(0)}
              activeEntityCount={filteredNodes.length}
              activeEdgeCount={filteredEdges.length}
            />
          </div>
        </div>

        {/* RIGHT INSPECTOR - SUSPECT DOSSIER & EVIDENCE AUDIT */}
        <RightInspector
          node={selectedNode}
          isCollapsed={isInspectorCollapsed}
          onToggleCollapse={() => setIsInspectorCollapsed(!isInspectorCollapsed)}
          onMarkPrimeAccused={handleMarkPrimeAccused}
          onToggleLOC={handleToggleLOC}
          onTraceHawala={handleTraceHawala}
        />
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        nodes={nodes}
        onSelectNode={(node) => {
          setSelectedNodeId(node.id);
          setIsInspectorCollapsed(false);
        }}
      />

      {/* BNSS Court-Ready Charge-Sheet Dossier Modal */}
      <DossierModal
        isOpen={isDossierModalOpen}
        onClose={() => setIsDossierModalOpen(false)}
        nodes={nodes}
        edges={edges}
        operationName={selectedOperation}
      />

      {/* Interactive Edge Evidence Popover */}
      <EdgeEvidencePopover
        edge={selectedEdgeForEvidence}
        nodes={nodes}
        onClose={() => setSelectedEdgeForEvidence(null)}
      />
    </main>
  );
}

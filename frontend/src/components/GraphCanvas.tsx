'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  RotateCcw, 
  Pause, 
  Play, 
  Compass, 
  Layers, 
  Crosshair,
  ShieldAlert,
  Info
} from 'lucide-react';
import { SyndicateNode, SyndicateEdge, EntityRole, TacticalCluster } from '../types/syndicate';
import { AnomalyType } from './AnomalyRadar';

interface GraphCanvasProps {
  nodes: SyndicateNode[];
  edges: SyndicateEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: SyndicateNode) => void;
  topologyMode: '2D-FORCE' | '3D-HIVE';
  isKingpinIsolated: boolean;
  highlightedPathNodeIds: string[] | null;
  showLouvainCommunities?: boolean;
  activeAnomaly?: AnomalyType;
  onSelectEdge?: (edge: SyndicateEdge) => void;
  nlpHighlightedNodeIds?: Set<string> | null;
  focusNodeId?: string | null;
  themeMode?: 'oled' | 'judicial';
}

// 2D Cross product for Convex Hull
function crossProduct(o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

// Monotone chain 2D Convex Hull
function computeConvexHull(points: Array<{ x: number; y: number }>) {
  if (points.length <= 2) return points;
  const sorted = points.slice().sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));

  const lower: Array<{ x: number; y: number }> = [];
  for (const p of sorted) {
    while (lower.length >= 2 && crossProduct(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }

  const upper: Array<{ x: number; y: number }> = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i];
    while (upper.length >= 2 && crossProduct(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }

  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  topologyMode,
  isKingpinIsolated,
  highlightedPathNodeIds,
  showLouvainCommunities = false,
  activeAnomaly = null,
  onSelectEdge,
  nlpHighlightedNodeIds = null,
  focusNodeId = null,
  themeMode = 'judicial',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transformation state
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.95 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<SyndicateNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<SyndicateNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<SyndicateEdge | null>(null);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);

  // Node position map: id -> position & velocity
  const nodePositionsRef = useRef<Map<string, { 
    x: number; 
    y: number; 
    vx: number; 
    vy: number; 
    radius: number; 
    cluster: TacticalCluster;
  }>>(new Map());

  const pulsePhaseRef = useRef<number>(0);
  const particlePhaseRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  // Cluster Target Centers for layout
  const getClusterTargetCenter = (cluster: TacticalCluster, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    switch (cluster) {
      case 'A': // Core Leadership -> Top Center
        return { x: cx, y: cy - 150 };
      case 'B': // Hawala & Mules -> Left Center
        return { x: cx - 250, y: cy - 30 };
      case 'C': // Burner SIM Racket -> Center Bottom
        return { x: cx - 40, y: cy + 130 };
      case 'D': // Physical Enforcement -> Right Bottom
        return { x: cx + 240, y: cy + 70 };
      case 'E': // BTS Towers -> Perimeter & Top Right
        return { x: cx + 200, y: cy - 160 };
      default:
        return { x: cx, y: cy };
    }
  };

  // Anomaly Highlight Sets
  const anomalyNodes = React.useMemo(() => {
    if (!activeAnomaly) return null;
    if (activeAnomaly === 'HAWALA_CYCLE') {
      return new Set(['node-purvanchal-agro', 'node-rahul-mule', 'node-kashi-bullion', 'node-tariq']);
    }
    if (activeAnomaly === 'MIDNIGHT_BURST') {
      return new Set(['node-sim-1', 'node-sim-3', 'node-sim-5', 'node-sim-10', 'node-bts-1']);
    }
    if (activeAnomaly === 'SIM_SWAP') {
      return new Set(['node-imei-1', 'node-sim-1', 'node-sim-2', 'node-sim-3', 'node-sim-6', 'node-sim-9', 'node-sim-10']);
    }
    return null;
  }, [activeAnomaly]);

  // Initialize node positions across clusters
  useEffect(() => {
    const currentPositions = nodePositionsRef.current;
    const width = containerRef.current?.clientWidth || 900;
    const height = containerRef.current?.clientHeight || 650;

    nodes.forEach((node, index) => {
      if (!currentPositions.has(node.id)) {
        const cluster = node.cluster || 'A';
        const targetCenter = getClusterTargetCenter(cluster, width, height);
        const angle = (index * 1.37) * Math.PI * 2;
        const dist = 35 + (index % 6) * 22;

        currentPositions.set(node.id, {
          x: targetCenter.x + Math.cos(angle) * dist,
          y: targetCenter.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: node.role === 'kingpin' ? 22 : node.subType === 'tower' ? 18 : node.role === 'mule' ? 17 : 15,
          cluster,
        });
      }
    });

    const validIds = new Set(nodes.map(n => n.id));
    Array.from(currentPositions.keys()).forEach(id => {
      if (!validIds.has(id)) {
        currentPositions.delete(id);
      }
    });
  }, [nodes]);

  const handleRecenter = useCallback(() => {
    setTransform({ x: 0, y: 0, k: 0.95 });
  }, []);

  // Camera Pan & Zoom Center on focused node (e.g. Vicky Kashi on NLP sync)
  useEffect(() => {
    if (!focusNodeId) return;
    const targetPos = nodePositionsRef.current.get(focusNodeId);
    const container = containerRef.current;
    if (targetPos && container) {
      const width = container.clientWidth || 900;
      const height = container.clientHeight || 650;
      const targetK = 1.35;
      setTransform({
        x: targetK * (width / 2 - targetPos.x),
        y: targetK * (height / 2 - targetPos.y),
        k: targetK,
      });
    }
  }, [focusNodeId]);

  const handleZoom = (factor: number) => {
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.3, Math.min(3.5, prev.k * factor))
    }));
  };

  const getConnectedNodeIds = useCallback((nodeId: string | null) => {
    if (!nodeId) return new Set<string>();
    const connected = new Set<string>([nodeId]);
    edges.forEach(e => {
      if (e.source === nodeId) connected.add(e.target);
      if (e.target === nodeId) connected.add(e.source);
    });
    return connected;
  }, [edges]);

  // 60 FPS Canvas Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      const width = containerRef.current?.clientWidth || 900;
      const height = containerRef.current?.clientHeight || 650;

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      pulsePhaseRef.current = (pulsePhaseRef.current + 0.04) % (Math.PI * 2);
      particlePhaseRef.current = (particlePhaseRef.current + 0.02) % 1.0;
      const pulseVal = Math.sin(pulsePhaseRef.current);

      const positions = nodePositionsRef.current;
      const connectedSet = getConnectedNodeIds(selectedNodeId);

      // --- 1. PHYSICS STEP (CHARGE -550, COLLISION RADIUS 40px) ---
      if (!isSimulationPaused) {
        const cx = width / 2;
        const cy = height / 2;
        const nodeArray = Array.from(positions.entries());

        if (topologyMode === '2D-FORCE') {
          // A. Strong Repulsion: strength -550
          for (let i = 0; i < nodeArray.length; i++) {
            const [id1, pos1] = nodeArray[i];
            for (let j = i + 1; j < nodeArray.length; j++) {
              const [id2, pos2] = nodeArray[j];
              const dx = pos2.x - pos1.x;
              const dy = pos2.y - pos1.y;
              const distSq = dx * dx + dy * dy || 1;
              const dist = Math.sqrt(distSq);

              if (dist < 380) {
                const repulseStrength = 550; // Tuned to -550
                const force = (repulseStrength / (distSq + 120));
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                if (draggedNode?.id !== id1) {
                  pos1.vx -= fx;
                  pos1.vy -= fy;
                }
                if (draggedNode?.id !== id2) {
                  pos2.vx += fx;
                  pos2.vy += fy;
                }
              }

              // B. Strict Collision Radius: forceCollide(40) to prevent overlaps
              const minAllowedDist = 40; // Tuned collision radius
              if (dist < minAllowedDist) {
                const overlap = (minAllowedDist - dist) * 0.55;
                const nx = (dx / dist) * overlap;
                const ny = (dy / dist) * overlap;

                if (draggedNode?.id !== id1) {
                  pos1.vx -= nx;
                  pos1.vy -= ny;
                }
                if (draggedNode?.id !== id2) {
                  pos2.vx += nx;
                  pos2.vy += ny;
                }
              }
            }

            // Cluster Centroid Soft Attraction
            const clusterCenter = getClusterTargetCenter(pos1.cluster, width, height);
            const cdx = clusterCenter.x - pos1.x;
            const cdy = clusterCenter.y - pos1.y;
            pos1.vx += cdx * 0.005;
            pos1.vy += cdy * 0.005;

            // Global Center Gravity
            const gdx = cx - pos1.x;
            const gdy = cy - pos1.y;
            pos1.vx += gdx * 0.0008;
            pos1.vy += gdy * 0.0008;
          }

          // C. Link Spring Distance
          edges.forEach(edge => {
            const pSource = positions.get(edge.source);
            const pTarget = positions.get(edge.target);
            if (pSource && pTarget) {
              const dx = pTarget.x - pSource.x;
              const dy = pTarget.y - pSource.y;
              const dist = Math.sqrt(dx * dx + dy * dy) || 1;
              const idealDist = edge.type === 'financial' ? 75 : edge.type === 'conspiracy' ? 90 : 105;
              const displacement = dist - idealDist;
              const spring = displacement * 0.018;

              const sx = (dx / dist) * spring;
              const sy = (dy / dist) * spring;

              if (draggedNode?.id !== edge.source) {
                pSource.vx += sx;
                pSource.vy += sy;
              }
              if (draggedNode?.id !== edge.target) {
                pTarget.vx -= sx;
                pTarget.vy -= sy;
              }
            }
          });

          // D. Velocity dampening
          positions.forEach((pos, id) => {
            if (draggedNode?.id === id) return;
            pos.vx *= 0.80;
            pos.vy *= 0.80;
            pos.x += pos.vx;
            pos.y += pos.vy;

            pos.x = Math.max(50, Math.min(width - 50, pos.x));
            pos.y = Math.max(50, Math.min(height - 50, pos.y));
          });
        } else {
          // 3D Hive Topology Mode
          nodes.forEach((node) => {
            const pos = positions.get(node.id);
            if (!pos || draggedNode?.id === node.id) return;

            let orbitRadius = 240;
            if (node.cluster === 'A') orbitRadius = 80;
            else if (node.cluster === 'B') orbitRadius = 160;
            else if (node.cluster === 'C') orbitRadius = 230;
            else if (node.cluster === 'D') orbitRadius = 300;
            else orbitRadius = 360;

            const clusterNodes = nodes.filter(n => n.cluster === node.cluster);
            const idx = clusterNodes.findIndex(n => n.id === node.id);
            const angle = (idx / clusterNodes.length) * Math.PI * 2 + (pulsePhaseRef.current * 0.03);

            const tx = cx + Math.cos(angle) * orbitRadius;
            const ty = cy + Math.sin(angle) * orbitRadius;

            pos.x += (tx - pos.x) * 0.06;
            pos.y += (ty - pos.y) * 0.06;
          });
        }
      }

      // --- 2. CLEAR & APPLY VIEWPORT MATRIX ---
      const isOled = themeMode === 'oled';
      ctx.fillStyle = isOled ? '#050711' : '#F8FAFC';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + transform.x, height / 2 + transform.y);
      ctx.scale(transform.k, transform.k);
      ctx.translate(-width / 2, -height / 2);

      // Subtle Dot Matrix Grid in world coordinates
      const gridSize = 32;
      const startX = Math.floor((-transform.x / transform.k) / gridSize) * gridSize - 128;
      const endX = startX + (width / transform.k) + 256;
      const startY = Math.floor((-transform.y / transform.k) / gridSize) * gridSize - 128;
      const endY = startY + (height / transform.k) + 256;

      ctx.fillStyle = isOled ? 'rgba(51, 65, 85, 0.45)' : '#E2E8F0';
      for (let gx = startX; gx < endX; gx += gridSize) {
        for (let gy = startY; gy < endY; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // --- 3. LOUVAIN COMMUNITY BOUNDS (3 TACTICAL CONVEX HULLS) ---
      if (showLouvainCommunities) {
        const clustersConfig = [
          {
            clusterId: 'A',
            name: 'Cluster 1: Command & Control (Dubai / Varanasi)',
            filter: (n: SyndicateNode) => n.cluster === 'A',
            fillColor: isOled ? 'rgba(239, 68, 68, 0.08)' : 'rgba(239, 68, 68, 0.05)',
            strokeColor: isOled ? 'rgba(239, 68, 68, 0.65)' : 'rgba(220, 38, 38, 0.45)',
            textColor: isOled ? '#EF4444' : '#B91C1C',
            cardBg: isOled ? '#0A0F1D' : '#FFFFFF'
          },
          {
            clusterId: 'B',
            name: 'Cluster 2: Hawala Laundering Network',
            filter: (n: SyndicateNode) => n.cluster === 'B',
            fillColor: isOled ? 'rgba(245, 158, 11, 0.08)' : 'rgba(245, 158, 11, 0.05)',
            strokeColor: isOled ? 'rgba(245, 158, 11, 0.65)' : 'rgba(217, 119, 6, 0.45)',
            textColor: isOled ? '#F59E0B' : '#B45309',
            cardBg: isOled ? '#0A0F1D' : '#FFFFFF'
          },
          {
            clusterId: 'CDE',
            name: 'Cluster 3: Field Telecom & Enforcers',
            filter: (n: SyndicateNode) => n.cluster === 'C' || n.cluster === 'D' || n.cluster === 'E',
            fillColor: isOled ? 'rgba(6, 182, 212, 0.08)' : 'rgba(2, 132, 199, 0.05)',
            strokeColor: isOled ? 'rgba(6, 182, 212, 0.60)' : 'rgba(2, 132, 199, 0.40)',
            textColor: isOled ? '#06B6D4' : '#0369A1',
            cardBg: isOled ? '#0A0F1D' : '#FFFFFF'
          }
        ];

        clustersConfig.forEach(cfg => {
          const clusterNodes = nodes.filter(cfg.filter);
          const pts: Array<{ x: number; y: number }> = [];

          clusterNodes.forEach(n => {
            const p = positions.get(n.id);
            if (p) {
              pts.push({ x: p.x - 30, y: p.y - 30 });
              pts.push({ x: p.x + 30, y: p.y - 30 });
              pts.push({ x: p.x + 30, y: p.y + 30 });
              pts.push({ x: p.x - 30, y: p.y + 30 });
            }
          });

          if (pts.length >= 3) {
            const hull = computeConvexHull(pts);
            if (hull.length >= 3) {
              ctx.save();
              ctx.beginPath();
              ctx.moveTo(hull[0].x, hull[0].y);
              for (let i = 1; i < hull.length; i++) {
                ctx.lineTo(hull[i].x, hull[i].y);
              }
              ctx.closePath();
              ctx.fillStyle = cfg.fillColor;
              ctx.fill();

              ctx.strokeStyle = cfg.strokeColor;
              ctx.lineWidth = 1.5;
              ctx.setLineDash([6, 4]);
              ctx.stroke();
              ctx.setLineDash([]);

              // Floating Cluster Header Card
              const minY = Math.min(...hull.map(h => h.y));
              const avgX = hull.reduce((sum, h) => sum + h.x, 0) / hull.length;

              ctx.font = 'bold 10px "JetBrains Mono", monospace';
              const labelWidth = ctx.measureText(cfg.name).width;
              ctx.fillStyle = cfg.cardBg;
              ctx.fillRect(avgX - labelWidth / 2 - 6, minY - 18, labelWidth + 12, 16);
              ctx.strokeStyle = cfg.strokeColor;
              ctx.lineWidth = 1;
              ctx.strokeRect(avgX - labelWidth / 2 - 6, minY - 18, labelWidth + 12, 16);

              ctx.fillStyle = cfg.textColor;
              ctx.fillText(cfg.name, avgX - labelWidth / 2, minY - 6);
              ctx.restore();
            }
          }
        });
      }

      // --- 4. DRAW SLEEK DIRECTED EDGES (HOVER-ONLY BADGES & VELOCITY PARTICLES) ---
      edges.forEach(edge => {
        const pSource = positions.get(edge.source);
        const pTarget = positions.get(edge.target);
        if (!pSource || !pTarget) return;

        const isHighlightedPath = highlightedPathNodeIds && 
          highlightedPathNodeIds.includes(edge.source) && 
          highlightedPathNodeIds.includes(edge.target);

        const isDirectConnection = selectedNodeId && 
          (edge.source === selectedNodeId || edge.target === selectedNodeId);

        const isHovered = hoveredEdge?.id === edge.id;

        // Anomaly Highlight Check
        const isAnomalyEdge = activeAnomaly && anomalyNodes?.has(edge.source) && anomalyNodes?.has(edge.target);

        let isDimmed = false;
        if (activeAnomaly && !isAnomalyEdge) {
          isDimmed = true;
        } else if (highlightedPathNodeIds && !isHighlightedPath) {
          isDimmed = true;
        } else if (selectedNodeId && !isDirectConnection) {
          isDimmed = true;
        } else if (isKingpinIsolated) {
          const sNode = nodes.find(n => n.id === edge.source);
          const tNode = nodes.find(n => n.id === edge.target);
          if (sNode?.role !== 'kingpin' && tNode?.role !== 'kingpin') {
            isDimmed = true;
          }
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pSource.x, pSource.y);
        ctx.lineTo(pTarget.x, pTarget.y);

        // Styling based on edge type & environmental theme
        if (isAnomalyEdge) {
          ctx.strokeStyle = isOled ? '#F59E0B' : '#D97706';
          ctx.lineWidth = 3.0;
        } else if (isHighlightedPath) {
          ctx.strokeStyle = isOled ? '#10B981' : '#059669';
          ctx.lineWidth = 3.5;
        } else if (edge.type === 'financial') {
          ctx.strokeStyle = isDimmed 
            ? (isOled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(5, 150, 105, 0.15)') 
            : isHovered 
            ? (isOled ? '#10B981' : '#059669') 
            : (isOled ? 'rgba(16, 185, 129, 0.65)' : 'rgba(5, 150, 105, 0.6)');
          ctx.lineWidth = isHovered ? 2.5 : 1.8;
          ctx.setLineDash([]);
        } else if (edge.type === 'conspiracy') {
          ctx.strokeStyle = isDimmed 
            ? (isOled ? 'rgba(239, 68, 68, 0.12)' : 'rgba(220, 38, 38, 0.15)') 
            : isHovered 
            ? (isOled ? '#EF4444' : '#DC2626') 
            : (isOled ? 'rgba(239, 68, 68, 0.65)' : 'rgba(220, 38, 38, 0.6)');
          ctx.lineWidth = isHovered ? 2.5 : 1.8;
          ctx.setLineDash([]);
        } else if (edge.type === 'telemetry') {
          ctx.strokeStyle = isDimmed 
            ? (isOled ? 'rgba(168, 85, 247, 0.12)' : 'rgba(124, 58, 237, 0.15)') 
            : isHovered 
            ? (isOled ? '#A855F7' : '#7C3AED') 
            : (isOled ? 'rgba(168, 85, 247, 0.55)' : 'rgba(124, 58, 237, 0.5)');
          ctx.lineWidth = isHovered ? 2.0 : 1.4;
          ctx.setLineDash([4, 4]);
        } else if (edge.type === 'telecom') {
          ctx.strokeStyle = isDimmed 
            ? (isOled ? 'rgba(6, 182, 212, 0.12)' : 'rgba(2, 132, 199, 0.15)') 
            : isHovered 
            ? (isOled ? '#06B6D4' : '#0284C7') 
            : (isOled ? 'rgba(6, 182, 212, 0.55)' : 'rgba(2, 132, 199, 0.5)');
          ctx.lineWidth = isHovered ? 2.0 : 1.4;
          ctx.setLineDash([5, 3]);
        } else {
          ctx.strokeStyle = isDimmed 
            ? (isOled ? 'rgba(245, 158, 11, 0.12)' : 'rgba(217, 119, 6, 0.15)') 
            : isHovered 
            ? (isOled ? '#F59E0B' : '#D97706') 
            : (isOled ? 'rgba(245, 158, 11, 0.55)' : 'rgba(217, 119, 6, 0.5)');
          ctx.lineWidth = 1.4;
          ctx.setLineDash([3, 3]);
        }

        ctx.stroke();

        // Directional Arrow Head
        if (!isDimmed) {
          const dx = pTarget.x - pSource.x;
          const dy = pTarget.y - pSource.y;
          const angle = Math.atan2(dy, dx);
          const arrowDist = pTarget.radius + 6;
          const ax = pTarget.x - Math.cos(angle) * arrowDist;
          const ay = pTarget.y - Math.sin(angle) * arrowDist;

          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(ax - Math.cos(angle - Math.PI / 6) * 6, ay - Math.sin(angle - Math.PI / 6) * 6);
          ctx.lineTo(ax - Math.cos(angle + Math.PI / 6) * 6, ay - Math.sin(angle + Math.PI / 6) * 6);
          ctx.closePath();
          ctx.fillStyle = ctx.strokeStyle;
          ctx.fill();
        }
        ctx.restore();

        // Animated Directional Particles for Financial Velocity
        if ((edge.type === 'financial' || isAnomalyEdge) && !isDimmed) {
          const t = (particlePhaseRef.current + (parseInt(edge.id.slice(-1), 10) || 0) * 0.2) % 1.0;
          const px = pSource.x + (pTarget.x - pSource.x) * t;
          const py = pSource.y + (pTarget.y - pSource.y) * t;

          ctx.save();
          ctx.beginPath();
          ctx.arc(px, py, isAnomalyEdge ? 3.0 : 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isAnomalyEdge ? (isOled ? '#F59E0B' : '#D97706') : (isOled ? '#10B981' : '#059669');
          ctx.fill();
          ctx.restore();
        }

        // Hover-Only Badge (or anomaly edge)
        if ((isHovered || isHighlightedPath || isAnomalyEdge) && !isDimmed) {
          const midX = (pSource.x + pTarget.x) / 2;
          const midY = (pSource.y + pTarget.y) / 2;

          let badgeText = '';
          if (edge.amount) badgeText = `₹${(edge.amount / 100000).toFixed(1)}L`;
          else if (edge.callCount) badgeText = `${edge.callCount} calls`;
          else badgeText = edge.label;

          ctx.save();
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          const textWidth = ctx.measureText(badgeText).width;
          const px = midX - textWidth / 2 - 5;
          const py = midY - 8;

          ctx.fillStyle = isOled ? '#0A0F1D' : '#FFFFFF';
          ctx.strokeStyle = isAnomalyEdge 
            ? (isOled ? '#F59E0B' : '#D97706') 
            : edge.type === 'financial' 
            ? (isOled ? '#10B981' : '#059669') 
            : edge.type === 'conspiracy' 
            ? (isOled ? '#EF4444' : '#DC2626') 
            : (isOled ? '#06B6D4' : '#0284C7');
          ctx.lineWidth = 1;
          ctx.fillRect(px, py, textWidth + 10, 16);
          ctx.strokeRect(px, py, textWidth + 10, 16);

          ctx.fillStyle = isOled 
            ? '#F8FAFC' 
            : (isAnomalyEdge 
            ? '#B45309' 
            : edge.type === 'financial' 
            ? '#065F46' 
            : edge.type === 'conspiracy' 
            ? '#991B1B' 
            : '#075985');
          ctx.fillText(badgeText, midX - textWidth / 2, midY + 4);
          ctx.restore();
        }
      });

      // --- 5. DRAW NODES WITH CLEAN NON-TRUNCATED 11px FONT-MONO LABELS ---
      nodes.forEach(node => {
        const pos = positions.get(node.id);
        if (!pos) return;

        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode?.id === node.id;
        const isConnected = connectedSet.has(node.id);
        const isPathHighlighted = highlightedPathNodeIds?.includes(node.id);
        const isAnomalyNode = anomalyNodes?.has(node.id);

        let isDimmed = false;
        if (activeAnomaly && !isAnomalyNode) {
          isDimmed = true;
        } else if (highlightedPathNodeIds && !isPathHighlighted) {
          isDimmed = true;
        } else if (selectedNodeId && !isConnected) {
          isDimmed = true;
        } else if (isKingpinIsolated && node.role !== 'kingpin') {
          isDimmed = true;
        }

        ctx.save();
        const baseRadius = pos.radius;
        const isNlpSynced = nlpHighlightedNodeIds ? nlpHighlightedNodeIds.has(node.id) : false;

        // Pulsing glow ring on Kingpins
        if (node.role === 'kingpin' && !isDimmed) {
          const glowRadius = baseRadius + 5 + pulseVal * 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, glowRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isOled ? 'rgba(239, 68, 68, 0.55)' : 'rgba(220, 38, 38, 0.35)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // Distinct Pulsing Glow for NLP Ingested & Synced Entities (node-vicky, node-rahul-mule, node-bts-1)
        if (isNlpSynced && !isDimmed) {
          const nlpGlowRadius = baseRadius + 6 + pulseVal * 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nlpGlowRadius, 0, Math.PI * 2);
          ctx.strokeStyle = isOled ? '#38BDF8' : '#1E3A8A';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Selection / Path / Anomaly / NLP Synced Halo
        if ((isSelected || isPathHighlighted || isAnomalyNode || isNlpSynced) && !isDimmed) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, baseRadius + 4, 0, Math.PI * 2);
          ctx.strokeStyle = isNlpSynced 
            ? (isOled ? '#38BDF8' : '#1E3A8A') 
            : isAnomalyNode 
            ? (isOled ? '#F59E0B' : '#D97706') 
            : isPathHighlighted 
            ? (isOled ? '#10B981' : '#059669') 
            : (isOled ? '#F8FAFC' : '#0F172A');
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, baseRadius, 0, Math.PI * 2);

        let roleColor = isOled ? '#0F1626' : '#FFFFFF';
        let strokeColor = isOled ? '#334155' : '#94A3B8';
        let glyphColor = isOled ? '#94A3B8' : '#475569';
        let roleGlyph = '•';

        if (node.role === 'kingpin') {
          roleColor = isOled ? '#2A0B0E' : '#FEE2E2';
          strokeColor = isOled ? '#EF4444' : '#DC2626';
          glyphColor = isOled ? '#FCA5A5' : '#991B1B';
          roleGlyph = '👑';
        } else if (node.cluster === 'B') {
          roleColor = isOled ? '#2B1E05' : '#FEF3C7';
          strokeColor = isOled ? '#F59E0B' : '#D97706';
          glyphColor = isOled ? '#FCD34D' : '#92400E';
          roleGlyph = '₹';
        } else if (node.cluster === 'C') {
          roleColor = isOled ? '#05232E' : '#E0F2FE';
          strokeColor = isOled ? '#06B6D4' : '#0284C7';
          glyphColor = isOled ? '#67E8F9' : '#075985';
          roleGlyph = node.subType === 'imei' ? '📱' : '📡';
        } else if (node.cluster === 'D') {
          roleColor = isOled ? '#2D1405' : '#FFEDD5';
          strokeColor = isOled ? '#F97316' : '#EA580C';
          glyphColor = isOled ? '#FDBA74' : '#9A3412';
          roleGlyph = node.subType === 'vehicle' ? '🏍' : node.subType === 'safehouse' ? '🏚' : '🎯';
        } else if (node.cluster === 'E') {
          roleColor = isOled ? '#1E1136' : '#EDE9FE';
          strokeColor = isOled ? '#A855F7' : '#7C3AED';
          glyphColor = isOled ? '#D8B4FE' : '#5B21B6';
          roleGlyph = '🗼';
        }

        if (isDimmed) {
          ctx.fillStyle = isOled ? '#080D18' : '#F1F5F9';
          ctx.strokeStyle = isOled ? '#1E293B' : '#E2E8F0';
          ctx.lineWidth = 1;
        } else {
          ctx.fillStyle = roleColor;
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = isSelected || isAnomalyNode || isNlpSynced ? 2.5 : 1.8;
        }

        ctx.fill();
        ctx.stroke();

        // Node Glyph inside
        if (!isDimmed) {
          ctx.font = `${node.role === 'kingpin' ? 12 : 10}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = glyphColor;
          ctx.fillText(roleGlyph, pos.x, pos.y);
        }

        // --- ENHANCED LABEL RENDERING (NO AWKWARD TRUNCATION, text-[11px] font-mono) ---
        const shouldShowLabel = (transform.k >= 1.05 || isSelected || isHovered || isAnomalyNode || isNlpSynced) && !isDimmed;

        if (shouldShowLabel) {
          ctx.font = 'bold 10.5px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const displayName = node.name;
          const textMetrics = ctx.measureText(displayName);
          const bgW = textMetrics.width + 12;
          const bgH = 16;
          const labelY = pos.y + baseRadius + 12;

          ctx.fillStyle = isOled ? '#0A0F1D' : '#FFFFFF';
          ctx.fillRect(pos.x - bgW / 2, labelY, bgW, bgH);

          ctx.strokeStyle = isNlpSynced
            ? (isOled ? '#38BDF8' : '#1E3A8A')
            : isSelected
            ? (isOled ? '#F8FAFC' : '#0F172A')
            : isAnomalyNode
            ? (isOled ? '#F59E0B' : '#D97706')
            : isPathHighlighted
            ? (isOled ? '#10B981' : '#059669')
            : (isOled ? '#1E293B' : '#CBD5E1');
          ctx.lineWidth = 1;
          ctx.strokeRect(pos.x - bgW / 2, labelY, bgW, bgH);

          ctx.fillStyle = isNlpSynced
            ? (isOled ? '#38BDF8' : '#1E3A8A')
            : isSelected
            ? (isOled ? '#F8FAFC' : '#0F172A')
            : isAnomalyNode
            ? (isOled ? '#FCD34D' : '#B45309')
            : isPathHighlighted
            ? (isOled ? '#34D399' : '#065F46')
            : (isOled ? '#CBD5E1' : '#1E293B');
          ctx.fillText(displayName, pos.x, labelY + 2.5);
        }

        ctx.restore();
      });

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    nodes,
    edges,
    selectedNodeId,
    hoveredNode,
    hoveredEdge,
    transform,
    topologyMode,
    isKingpinIsolated,
    highlightedPathNodeIds,
    isSimulationPaused,
    draggedNode,
    showLouvainCommunities,
    activeAnomaly,
    anomalyNodes,
    getConnectedNodeIds,
    nlpHighlightedNodeIds,
    themeMode,
  ]);

  // Distance from point to line segment
  const distToSegment = (px: number, py: number, x1: number, y1: number, x2: number, y2: number) => {
    const l2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    if (l2 === 0) return Math.sqrt((px - x1) * (px - x1) + (py - y1) * (py - y1));
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    const projX = x1 + t * (x2 - x1);
    const projY = y1 + t * (y2 - y1);
    return Math.sqrt((px - projX) * (px - projX) + (py - projY) * (py - projY));
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const worldX = (mouseX - (width / 2 + transform.x)) / transform.k + width / 2;
    const worldY = (mouseY - (height / 2 + transform.y)) / transform.k + height / 2;

    // Check node click
    let clickedNode: SyndicateNode | null = null;
    const positions = nodePositionsRef.current;

    for (const node of nodes) {
      const pos = positions.get(node.id);
      if (pos) {
        const dx = worldX - pos.x;
        const dy = worldY - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) <= pos.radius + 6) {
          clickedNode = node;
          break;
        }
      }
    }

    if (clickedNode) {
      setDraggedNode(clickedNode);
      onSelectNode(clickedNode);
      return;
    }

    // Check edge click (Interactive Edge Evidence Popover Trigger)
    let clickedEdge: SyndicateEdge | null = null;
    for (const edge of edges) {
      const pSource = positions.get(edge.source);
      const pTarget = positions.get(edge.target);
      if (pSource && pTarget) {
        const dist = distToSegment(worldX, worldY, pSource.x, pSource.y, pTarget.x, pTarget.y);
        if (dist < 8) {
          clickedEdge = edge;
          break;
        }
      }
    }

    if (clickedEdge && onSelectEdge) {
      onSelectEdge(clickedEdge);
      return;
    }

    // Otherwise Pan
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const width = canvas.width;
    const height = canvas.height;
    const worldX = (mouseX - (width / 2 + transform.x)) / transform.k + width / 2;
    const worldY = (mouseY - (height / 2 + transform.y)) / transform.k + height / 2;

    if (draggedNode) {
      const pos = nodePositionsRef.current.get(draggedNode.id);
      if (pos) {
        pos.x = worldX;
        pos.y = worldY;
        pos.vx = 0;
        pos.vy = 0;
      }
    } else if (isDraggingCanvas) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    } else {
      // Hover detection
      let foundNode: SyndicateNode | null = null;
      const positions = nodePositionsRef.current;

      for (const node of nodes) {
        const pos = positions.get(node.id);
        if (pos) {
          const dx = worldX - pos.x;
          const dy = worldY - pos.y;
          if (Math.sqrt(dx * dx + dy * dy) <= pos.radius + 6) {
            foundNode = node;
            break;
          }
        }
      }
      setHoveredNode(foundNode);

      if (!foundNode) {
        let foundEdge: SyndicateEdge | null = null;
        for (const edge of edges) {
          const pSource = positions.get(edge.source);
          const pTarget = positions.get(edge.target);
          if (pSource && pTarget) {
            const dist = distToSegment(worldX, worldY, pSource.x, pSource.y, pTarget.x, pTarget.y);
            if (dist < 8) {
              foundEdge = edge;
              break;
            }
          }
        }
        setHoveredEdge(foundEdge);
      } else {
        setHoveredEdge(null);
      }
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsDraggingCanvas(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    handleZoom(zoomFactor);
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#F8FAFC] dark:bg-[#050711] overflow-hidden select-none transition-colors duration-100 ease-linear">
      {/* 2D Canvas Engine */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Top Left Canvas HUD */}
      <div className="absolute top-3 left-3 flex items-center space-x-2 pointer-events-none font-mono text-[11px] text-slate-500">
        <div className="bg-white/95 dark:bg-[#0A0F1D]/95 border border-slate-200/90 dark:border-slate-800 px-3 py-1.5 rounded-md shadow-xs flex items-center space-x-2.5 text-slate-700 dark:text-slate-300">
          <Crosshair className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
          <span>NODES: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{nodes.length}</strong></span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>LINKS: <strong className="text-slate-900 dark:text-slate-100 font-semibold">{edges.length}</strong></span>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span>
            LOUVAIN: <strong className={showLouvainCommunities ? "text-indigo-600 dark:text-cyan-400 font-semibold" : "text-slate-400 dark:text-slate-500"}>
              {showLouvainCommunities ? "3 GANG HULLS ACTIVE" : "OFF"}
            </strong>
          </span>
        </div>
      </div>

      {/* On Hover Tooltip Card */}
      {hoveredNode && !draggedNode && (
        <div
          className="absolute pointer-events-none z-30 bg-white/95 dark:bg-[#0A0F1D]/95 border border-slate-300 dark:border-slate-700 p-3 rounded-md shadow-lg text-xs max-w-xs font-mono text-slate-800 dark:text-slate-200"
          style={{ left: 20, bottom: 170 }}
        >
          <div className="flex items-center justify-between font-bold border-b border-slate-200 dark:border-slate-800 pb-1.5 mb-1.5">
            <span className="truncate text-slate-900 dark:text-slate-100 font-sans font-semibold">{hoveredNode.name}</span>
            <span className="text-[10px] bg-slate-100 dark:bg-[#0F1626] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono uppercase">CLUSTER {hoveredNode.cluster}</span>
          </div>
          <div className="text-[11px] space-y-1 text-slate-600 dark:text-slate-400">
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">ROLE:</span> <span className="uppercase text-slate-900 dark:text-slate-200 font-medium">{hoveredNode.rank || hoveredNode.role}</span></div>
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">THREAT SCORE:</span> <strong className="text-rose-600 dark:text-rose-400 font-semibold">{hoveredNode.riskScore}/100</strong></div>
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">CENTRALITY:</span> <span className="text-slate-800 dark:text-slate-200">{hoveredNode.betweennessCentrality.toFixed(3)}</span></div>
            <div className="flex justify-between"><span className="text-slate-400 dark:text-slate-500">TOWER SITE:</span> <span className="text-slate-800 dark:text-slate-200">{hoveredNode.telecom.activeTowerId}</span></div>
          </div>
        </div>
      )}

      {/* Floating Canvas Control Bar */}
      <div className="absolute top-3 right-3 flex items-center space-x-1 bg-white/95 dark:bg-[#0A0F1D]/95 border border-slate-200/90 dark:border-slate-800 p-1 rounded-md shadow-xs">
        <button
          onClick={() => handleZoom(1.2)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#141D30] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded transition-colors duration-100 ease-linear"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#141D30] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded transition-colors duration-100 ease-linear"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleRecenter}
          className="p-1.5 hover:bg-slate-100 dark:hover:bg-[#141D30] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 rounded transition-colors duration-100 ease-linear"
          title="Reset View / Fit to Screen"
        >
          <Maximize className="w-3.5 h-3.5" />
        </button>
        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-0.5" />
        <button
          onClick={() => setIsSimulationPaused(!isSimulationPaused)}
          className={`p-1.5 rounded transition-colors duration-100 ease-linear ${
            isSimulationPaused 
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
              : 'hover:bg-slate-100 dark:hover:bg-[#141D30] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
          title={isSimulationPaused ? "Resume Force Simulation" : "Freeze Force Simulation"}
        >
          {isSimulationPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

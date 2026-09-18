'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RotateCcw, 
  Layers,
  Search,
  Filter
} from 'lucide-react';
import { Entity, Relationship, EntityType } from '../types/intelligence';

interface GraphCanvasProps {
  entities: Entity[];
  relationships: Relationship[];
  selectedEntityId: string | null;
  onSelectEntity: (entity: Entity) => void;
  highlightedPathNodeIds?: string[] | null;
  highlightedPatternEntityIds?: string[] | null;
  showCommunities?: boolean;
  onSelectRelationship?: (relationship: Relationship) => void;
  focusEntityId?: string | null;
}

// 2D Cross product for Monotone Chain Convex Hull
function crossProduct(o: { x: number; y: number }, a: { x: number; y: number }, b: { x: number; y: number }) {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
}

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

// Entity type colors (Clean SaaS)
const ENTITY_COLORS: Record<EntityType, { bg: string; border: string; label: string; text: string }> = {
  person: { bg: '#2563EB', border: '#1D4ED8', label: 'PERSON', text: '#FFFFFF' },
  phone: { bg: '#0284C7', border: '#0369A1', label: 'PHONE', text: '#FFFFFF' },
  account: { bg: '#059669', border: '#047857', label: 'ACCOUNT', text: '#FFFFFF' },
  organization: { bg: '#7C3AED', border: '#6D28D9', label: 'ORG', text: '#FFFFFF' },
  location: { bg: '#D97706', border: '#B45309', label: 'LOCATION', text: '#FFFFFF' },
  vehicle: { bg: '#E11D48', border: '#BE123C', label: 'VEHICLE', text: '#FFFFFF' },
};

const COMMUNITY_COLORS: Record<number, { fill: string; stroke: string; label: string }> = {
  1: { fill: 'rgba(37, 99, 235, 0.07)', stroke: 'rgba(37, 99, 235, 0.35)', label: 'Coordination Cell' },
  2: { fill: 'rgba(225, 29, 72, 0.07)', stroke: 'rgba(225, 29, 72, 0.35)', label: 'Field Operations Cell' },
  3: { fill: 'rgba(5, 150, 105, 0.07)', stroke: 'rgba(5, 150, 105, 0.35)', label: 'Financial Clearing Cell' },
  4: { fill: 'rgba(2, 132, 199, 0.07)', stroke: 'rgba(2, 132, 199, 0.35)', label: 'Telecom Dispenser Cell' },
  5: { fill: 'rgba(217, 119, 6, 0.07)', stroke: 'rgba(217, 119, 6, 0.35)', label: 'Geographic Infrastructure Cell' },
};

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  entities,
  relationships,
  selectedEntityId,
  onSelectEntity,
  highlightedPathNodeIds = null,
  highlightedPatternEntityIds = null,
  showCommunities = true,
  onSelectRelationship,
  focusEntityId = null,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Viewport transformation
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.95 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [draggedEntity, setDraggedEntity] = useState<Entity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<Entity | null>(null);
  const [hoveredRelationship, setHoveredRelationship] = useState<Relationship | null>(null);

  // Position storage: id -> physics data
  const positionsRef = useRef<Map<string, {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    type: EntityType;
    community: number;
  }>>(new Map());

  const particlePhaseRef = useRef<number>(0);

  // Community centers layout
  const getCommunityCenter = (community: number, width: number, height: number) => {
    const cx = width / 2;
    const cy = height / 2;
    switch (community) {
      case 1: return { x: cx, y: cy - 140 };        // Coordination -> Top Center
      case 2: return { x: cx + 220, y: cy + 80 };   // Field Ops -> Right Bottom
      case 3: return { x: cx - 220, y: cy - 20 };   // Financial -> Left Center
      case 4: return { x: cx - 50, y: cy + 150 };   // Telecom -> Bottom Center
      case 5: return { x: cx + 200, y: cy - 140 };  // Location -> Top Right
      default: return { x: cx, y: cy };
    }
  };

  // Initialize and synchronize entity positions
  useEffect(() => {
    const currentPositions = positionsRef.current;
    let width = 900;
    let height = 650;
    if (containerRef.current) {
      const { width: w, height: h } = containerRef.current.getBoundingClientRect();
      if (w > 0 && h > 0) {
        width = w;
        height = h;
      } else if (containerRef.current.clientWidth > 0 && containerRef.current.clientHeight > 0) {
        width = containerRef.current.clientWidth;
        height = containerRef.current.clientHeight;
      }
    }

    entities.forEach((ent, idx) => {
      if (!currentPositions.has(ent.id)) {
        const center = getCommunityCenter(ent.community, width, height);
        const angle = (idx * 1.37) * Math.PI * 2;
        const dist = 30 + (idx % 6) * 25;

        currentPositions.set(ent.id, {
          x: center.x + Math.cos(angle) * dist,
          y: center.y + Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: ent.metrics.betweenness > 0.7 ? 20 : 15,
          type: ent.type,
          community: ent.community,
        });
      }
    });

    // Cleanup removed entities
    const validIds = new Set(entities.map(e => e.id));
    Array.from(currentPositions.keys()).forEach(id => {
      if (!validIds.has(id)) {
        currentPositions.delete(id);
      }
    });
  }, [entities]);

  // Focus Camera on specific entity
  useEffect(() => {
    if (!focusEntityId) return;
    const pos = positionsRef.current.get(focusEntityId);
    const container = containerRef.current;
    if (pos && container) {
      const targetK = 1.3;
      setTransform({
        x: targetK * (container.clientWidth / 2 - pos.x),
        y: targetK * (container.clientHeight / 2 - pos.y),
        k: targetK,
      });
    }
  }, [focusEntityId]);

  const handleZoom = (factor: number) => {
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.3, Math.min(3.5, prev.k * factor))
    }));
  };

  // Dynamic Fit to Screen utilizing getBoundingClientRect
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const w = width || containerRef.current.clientWidth || 900;
    const h = height || containerRef.current.clientHeight || 650;

    const positions = Array.from(positionsRef.current.values());
    if (positions.length === 0) {
      setTransform({ x: 0, y: 0, k: 0.95 });
      return;
    }

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    positions.forEach(p => {
      if (p.x < minX) minX = p.x;
      if (p.x > maxX) maxX = p.x;
      if (p.y < minY) minY = p.y;
      if (p.y > maxY) maxY = p.y;
    });

    const graphWidth = Math.max(maxX - minX + 80, 100);
    const graphHeight = Math.max(maxY - minY + 80, 100);

    const scaleX = w / graphWidth;
    const scaleY = h / graphHeight;
    const k = Math.min(1.4, Math.max(0.4, Math.min(scaleX, scaleY) * 0.85));

    setTransform({
      x: (w - (minX + maxX) * k) / 2,
      y: (h - (minY + maxY) * k) / 2,
      k,
    });
  }, []);

  const resetView = useCallback(() => {
    fitToScreen();
  }, [fitToScreen]);

  const handleFitNetwork = () => {
    fitToScreen();
  };

  const handleReset = () => {
    resetView();
  };

  // Automated fitToScreen and resetView after initial layout stabilization
  useEffect(() => {
    const timer = setTimeout(() => {
      resetView();
      fitToScreen();
    }, 250);

    let resizeTimer: NodeJS.Timeout;
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
              fitToScreen();
            }, 120);
          }
        }
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      if (observer) observer.disconnect();
    };
  }, [resetView, fitToScreen]);

  // Connected nodes helper
  const getConnectedIds = useCallback((entityId: string | null) => {
    if (!entityId) return new Set<string>();
    const connected = new Set<string>([entityId]);
    relationships.forEach(r => {
      if (r.sourceId === entityId) connected.add(r.targetId);
      if (r.targetId === entityId) connected.add(r.sourceId);
    });
    return connected;
  }, [relationships]);

  // 60 FPS Physics & Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!isRunning) return;

      let width = 900;
      let height = 650;
      if (containerRef.current) {
        const { width: w, height: h } = containerRef.current.getBoundingClientRect();
        if (w > 0 && h > 0) {
          width = w;
          height = h;
        } else if (containerRef.current.clientWidth > 0 && containerRef.current.clientHeight > 0) {
          width = containerRef.current.clientWidth;
          height = containerRef.current.clientHeight;
        }
      }

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      particlePhaseRef.current = (particlePhaseRef.current + 0.015) % 1.0;
      const positions = positionsRef.current;
      const connectedSet = getConnectedIds(selectedEntityId);

      // --- 1. PHYSICS STEP ---
      const entries = Array.from(positions.entries());
      const cx = width / 2;
      const cy = height / 2;

      // Repulsion (Force: -550)
      for (let i = 0; i < entries.length; i++) {
        const [id1, p1] = entries[i];
        for (let j = i + 1; j < entries.length; j++) {
          const [id2, p2] = entries[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSq = dx * dx + dy * dy || 1;
          const dist = Math.sqrt(distSq);

          // Standard inter-node repulsion
          const force = -550 / (distSq + 200);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          p1.vx += fx;
          p1.vy += fy;
          p2.vx -= fx;
          p2.vy -= fy;

          // Collision separation
          const minDist = (p1.radius + p2.radius) * 2.2;
          if (dist < minDist) {
            const overlap = (minDist - dist) * 0.4;
            const sepX = (dx / dist) * overlap;
            const sepY = (dy / dist) * overlap;
            p1.vx -= sepX;
            p1.vy -= sepY;
            p2.vx += sepX;
            p2.vy += sepY;
          }
        }

        // Community anchor pull
        const targetCenter = getCommunityCenter(p1.community, width, height);
        p1.vx += (targetCenter.x - p1.x) * 0.015;
        p1.vy += (targetCenter.y - p1.y) * 0.015;

        // Global gentle centering gravity
        p1.vx += (cx - p1.x) * 0.003;
        p1.vy += (cy - p1.y) * 0.003;
      }

      // Spring tension along relationships
      relationships.forEach(rel => {
        const p1 = positions.get(rel.sourceId);
        const p2 = positions.get(rel.targetId);
        if (p1 && p2) {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const desiredDist = rel.type === 'financial' ? 85 : 75;
          const springForce = (dist - desiredDist) * 0.035;

          const fx = (dx / dist) * springForce;
          const fy = (dy / dist) * springForce;

          p1.vx += fx;
          p1.vy += fy;
          p2.vx -= fx;
          p2.vy -= fy;
        }
      });

      // Integrate velocities with damping
      entries.forEach(([id, p]) => {
        if (draggedEntity?.id === id) {
          p.vx = 0;
          p.vy = 0;
        } else {
          p.vx *= 0.65; // High damping for stability
          p.vy *= 0.65;
          p.x += p.vx;
          p.y += p.vy;
        }
      });

      // --- 2. RENDER STEP ---
      ctx.clearRect(0, 0, width, height);
      ctx.save();

      // Apply pan & zoom
      ctx.translate(transform.x, transform.y);
      ctx.scale(transform.k, transform.k);

      // A. Convex Hull Communities
      if (showCommunities) {
        const communityGroups = new Map<number, Array<{ x: number; y: number }>>();
        positions.forEach(p => {
          if (!communityGroups.has(p.community)) communityGroups.set(p.community, []);
          communityGroups.get(p.community)!.push({ x: p.x, y: p.y });
        });

        communityGroups.forEach((pts, commId) => {
          if (pts.length >= 3) {
            const hull = computeConvexHull(pts);
            const style = COMMUNITY_COLORS[commId] || COMMUNITY_COLORS[1];

            ctx.beginPath();
            ctx.moveTo(hull[0].x, hull[0].y);
            for (let k = 1; k < hull.length; k++) {
              ctx.lineTo(hull[k].x, hull[k].y);
            }
            ctx.closePath();

            ctx.fillStyle = style.fill;
            ctx.fill();
            ctx.strokeStyle = style.stroke;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);

            // Community Badge Label
            const avgX = pts.reduce((s, p) => s + p.x, 0) / pts.length;
            const minY = Math.min(...pts.map(p => p.y));

            ctx.font = '500 10px Inter, sans-serif';
            ctx.fillStyle = '#475569';
            ctx.fillText(style.label.toUpperCase(), avgX - 40, minY - 14);
          }
        });
      }

      // Active highlighting sets
      const isPathActive = Boolean(highlightedPathNodeIds && highlightedPathNodeIds.length > 0);
      const pathSet = new Set(highlightedPathNodeIds || []);
      const patternSet = new Set(highlightedPatternEntityIds || []);
      const isPatternActive = Boolean(highlightedPatternEntityIds && highlightedPatternEntityIds.length > 0);

      // B. Relationships (Edges)
      relationships.forEach(rel => {
        const p1 = positions.get(rel.sourceId);
        const p2 = positions.get(rel.targetId);
        if (!p1 || !p2) return;

        const isRelSelected = selectedEntityId && (rel.sourceId === selectedEntityId || rel.targetId === selectedEntityId);
        const isRelInPath = isPathActive && pathSet.has(rel.sourceId) && pathSet.has(rel.targetId);
        const isRelInPattern = isPatternActive && patternSet.has(rel.sourceId) && patternSet.has(rel.targetId);

        let strokeColor = '#CBD5E1'; // Default clean slate
        let lineWidth = 1.2;
        let opacity = 1.0;

        if (isPathActive) {
          if (isRelInPath) {
            strokeColor = '#2563EB';
            lineWidth = 2.5;
            opacity = 1.0;
          } else {
            opacity = 0.12;
          }
        } else if (isPatternActive) {
          if (isRelInPattern) {
            strokeColor = '#DC2626';
            lineWidth = 2.5;
            opacity = 1.0;
          } else {
            opacity = 0.12;
          }
        } else if (selectedEntityId) {
          if (isRelSelected) {
            strokeColor = rel.type === 'financial' ? '#059669' : rel.type === 'communication' ? '#0284C7' : '#2563EB';
            lineWidth = 2.2;
            opacity = 1.0;
          } else {
            opacity = 0.18;
          }
        } else {
          // Standard view
          if (rel.type === 'financial') {
            strokeColor = '#10B981';
            lineWidth = 1.8;
          } else if (rel.type === 'communication') {
            strokeColor = '#38BDF8';
            lineWidth = 1.5;
          } else if (rel.type === 'ownership') {
            strokeColor = '#8B5CF6';
            lineWidth = 1.5;
          }
        }

        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = lineWidth;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Directional arrow
        const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        const targetRadius = p2.radius + 4;
        const arrowX = p2.x - Math.cos(angle) * targetRadius;
        const arrowY = p2.y - Math.sin(angle) * targetRadius;

        ctx.beginPath();
        ctx.moveTo(arrowX, arrowY);
        ctx.lineTo(arrowX - 7 * Math.cos(angle - Math.PI / 6), arrowY - 7 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(arrowX - 7 * Math.cos(angle + Math.PI / 6), arrowY - 7 * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = strokeColor;
        ctx.fill();

        // Particle flow along edges (subtle)
        if (opacity > 0.4 && (rel.type === 'financial' || rel.type === 'communication')) {
          const t = particlePhaseRef.current;
          const px = p1.x + (p2.x - p1.x) * t;
          const py = p1.y + (p2.y - p1.y) * t;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = rel.type === 'financial' ? '#059669' : '#0284C7';
          ctx.fill();
        }

        ctx.restore();
      });

      // C. Entities (Nodes)
      entities.forEach(ent => {
        const pos = positions.get(ent.id);
        if (!pos) return;

        const isSelected = selectedEntityId === ent.id;
        const isHovered = hoveredEntity?.id === ent.id;
        const isConnected = connectedSet.has(ent.id);
        const isInPath = isPathActive && pathSet.has(ent.id);
        const isInPattern = isPatternActive && patternSet.has(ent.id);

        let opacity = 1.0;
        if (isPathActive) {
          opacity = isInPath ? 1.0 : 0.15;
        } else if (isPatternActive) {
          opacity = isInPattern ? 1.0 : 0.15;
        } else if (selectedEntityId) {
          opacity = isSelected || isConnected ? 1.0 : 0.2;
        }

        ctx.save();
        ctx.globalAlpha = opacity;

        const style = ENTITY_COLORS[ent.type] || ENTITY_COLORS.person;
        const radius = pos.radius;

        // Selection focus ring
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#2563EB';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 10, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(37, 99, 235, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (isInPattern) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius + 6, 0, Math.PI * 2);
          ctx.strokeStyle = '#DC2626';
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }

        // Node background circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = style.bg;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#FFFFFF' : style.border;
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();

        // Node center symbol / letter
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `600 ${radius > 16 ? 11 : 9}px Inter, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const glyph = ent.type === 'person' ? 'P' :
                      ent.type === 'phone' ? 'T' :
                      ent.type === 'account' ? '₹' :
                      ent.type === 'organization' ? 'O' :
                      ent.type === 'location' ? 'L' : 'V';
        ctx.fillText(glyph, pos.x, pos.y);

        // Name label (shown if selected, hovered, high importance, or zoomed in)
        const shouldShowLabel = isSelected || isHovered || isInPath || isInPattern || transform.k > 1.1 || ent.metrics.betweenness > 0.65;
        if (shouldShowLabel) {
          ctx.font = `${isSelected ? '600' : '500'} 11px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';

          const labelY = pos.y + radius + 4;
          const text = ent.name.length > 22 ? ent.name.slice(0, 20) + '…' : ent.name;

          // Subtle text background pill
          const textWidth = ctx.measureText(text).width;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillRect(pos.x - textWidth / 2 - 4, labelY - 1, textWidth + 8, 15);
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(pos.x - textWidth / 2 - 4, labelY - 1, textWidth + 8, 15);

          ctx.fillStyle = '#0F172A';
          ctx.fillText(text, pos.x, labelY);
        }

        ctx.restore();
      });

      ctx.restore();

      // Tooltip on Hover
      if (hoveredEntity && !isDraggingCanvas) {
        const pos = positions.get(hoveredEntity.id);
        if (pos) {
          const screenX = pos.x * transform.k + transform.x;
          const screenY = pos.y * transform.k + transform.y;

          ctx.save();
          const tooltipWidth = 190;
          const tooltipHeight = 60;
          const tx = Math.min(width - tooltipWidth - 10, Math.max(10, screenX + 15));
          const ty = Math.min(height - tooltipHeight - 10, Math.max(10, screenY - 20));

          ctx.fillStyle = '#0F172A';
          ctx.beginPath();
          ctx.roundRect(tx, ty, tooltipWidth, tooltipHeight, 6);
          ctx.fill();

          ctx.fillStyle = '#94A3B8';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(hoveredEntity.type.toUpperCase() + ` • ${Math.round(hoveredEntity.confidence * 100)}% CONFIDENCE`, tx + 10, ty + 16);

          ctx.fillStyle = '#FFFFFF';
          ctx.font = '600 12px Inter, sans-serif';
          const truncatedName = hoveredEntity.name.length > 22 ? hoveredEntity.name.slice(0, 20) + '…' : hoveredEntity.name;
          ctx.fillText(truncatedName, tx + 10, ty + 32);

          ctx.fillStyle = '#60A5FA';
          ctx.font = '10px Inter, sans-serif';
          ctx.fillText(`Connections: ${hoveredEntity.metrics.degree} | Centrality: ${hoveredEntity.metrics.betweenness.toFixed(2)}`, tx + 10, ty + 48);

          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    let animationFrameId = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    entities, 
    relationships, 
    selectedEntityId, 
    transform, 
    hoveredEntity, 
    isDraggingCanvas, 
    draggedEntity, 
    highlightedPathNodeIds, 
    highlightedPatternEntityIds, 
    showCommunities, 
    getConnectedIds
  ]);

  // Mouse & Pointer handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = (e.clientX - rect.left - transform.x) / transform.k;
    const clickY = (e.clientY - rect.top - transform.y) / transform.k;

    // Hit test entities
    for (const ent of entities) {
      const pos = positionsRef.current.get(ent.id);
      if (pos) {
        const dx = clickX - pos.x;
        const dy = clickY - pos.y;
        if (dx * dx + dy * dy <= (pos.radius + 5) * (pos.radius + 5)) {
          setDraggedEntity(ent);
          onSelectEntity(ent);
          return;
        }
      }
    }

    // Hit test relationships (approximate distance to segment)
    if (onSelectRelationship) {
      for (const rel of relationships) {
        const p1 = positionsRef.current.get(rel.sourceId);
        const p2 = positionsRef.current.get(rel.targetId);
        if (p1 && p2) {
          const l2 = (p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2;
          if (l2 > 0) {
            const t = Math.max(0, Math.min(1, ((clickX - p1.x) * (p2.x - p1.x) + (clickY - p1.y) * (p2.y - p1.y)) / l2));
            const projX = p1.x + t * (p2.x - p1.x);
            const projY = p1.y + t * (p2.y - p1.y);
            const distSq = (clickX - projX) ** 2 + (clickY - projY) ** 2;
            if (distSq < 36) { // 6px tolerance
              onSelectRelationship(rel);
              return;
            }
          }
        }
      }
    }

    // Canvas panning start
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (draggedEntity) {
      const x = (e.clientX - rect.left - transform.x) / transform.k;
      const y = (e.clientY - rect.top - transform.y) / transform.k;
      const pos = positionsRef.current.get(draggedEntity.id);
      if (pos) {
        pos.x = x;
        pos.y = y;
        pos.vx = 0;
        pos.vy = 0;
      }
      return;
    }

    if (isDraggingCanvas) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
      return;
    }

    // Hover test
    const clickX = (e.clientX - rect.left - transform.x) / transform.k;
    const clickY = (e.clientY - rect.top - transform.y) / transform.k;

    let foundEntity: Entity | null = null;
    for (const ent of entities) {
      const pos = positionsRef.current.get(ent.id);
      if (pos) {
        const dx = clickX - pos.x;
        const dy = clickY - pos.y;
        if (dx * dx + dy * dy <= (pos.radius + 6) * (pos.radius + 6)) {
          foundEntity = ent;
          break;
        }
      }
    }
    setHoveredEntity(foundEntity);
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggedEntity(null);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.92;
    handleZoom(factor);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-[#F8FAFC] select-none bg-canvas-grid">
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="w-full h-full block cursor-grab active:cursor-grabbing"
      />

      {/* Minimal Floating Canvas Controls */}
      <div className="absolute top-4 right-4 flex items-center space-x-1.5 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
        <button
          onClick={() => handleZoom(1.2)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-slate-200" />
        <button
          onClick={handleFitNetwork}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Fit Network to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Entity Legend Pill */}
      <div className="absolute bottom-4 left-4 flex flex-wrap items-center gap-3 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs text-xs font-medium text-slate-700">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">ENTITIES</span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
          <span>Person</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
          <span>Phone</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#059669]" />
          <span>Account</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" />
          <span>Organization</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
          <span>Location</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E11D48]" />
          <span>Vehicle</span>
        </span>
      </div>
    </div>
  );
};

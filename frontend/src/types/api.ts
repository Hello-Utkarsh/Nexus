import { Entity, Relationship, EntityType, RelationshipType } from './intelligence';
import { AuditLogEntry, LogSeverity } from '../components/admin/AuditDock';
import { SocmintFeedItem } from '../components/socmint/SocmintView';

// ==========================================
// 1. SYNDICATE GRAPH API SCHEMAS
// ==========================================

export interface GraphNode extends Entity {
  // Alias / flexibility properties for backend mapping
  subType?: string;
  rank?: string;
  status?: string;
  riskScore?: number;
}

export interface GraphLink {
  id: string;
  source: string; // source entity ID
  target: string; // target entity ID
  type: RelationshipType;
  label: string;
  confidence: number;
  amount?: number;
  callCount?: number;
  durationSeconds?: number;
  timestamp: string;
  sourceIds?: string[];
  metadata?: Record<string, any>;
}

export interface Cluster {
  id: number | string;
  name: string;
  nodeCount: number;
  primaryRole?: string;
  color?: string;
}

export interface GraphMetrics {
  density: number;
  totalRecords: number;
  totalNodes?: number;
  totalLinks?: number;
  averageDegree?: number;
  modularityScore?: number;
}

export interface SyndicateGraphResponse {
  nodes: GraphNode[];
  links: GraphLink[];
  clusters: Cluster[];
  metrics: GraphMetrics;
}

// ==========================================
// 2. INTELLIGENCE INCIDENT LOGS SCHEMAS
// ==========================================

export type IntelligenceLog = SocmintFeedItem;

export interface IntelligenceLogsResponse {
  incidents: IntelligenceLog[];
  count: number;
  timestamp: string;
}

// ==========================================
// 3. SHORTEST PATH & CONDUIT TRACE SCHEMAS
// ==========================================

export interface PathResolveRequest {
  sourceId: string;
  targetId: string;
  maxHops?: number;
  includeFinancialOnly?: boolean;
}

export interface PathResolveResponse {
  path: string[];             // Array of entity node IDs in order
  totalHops: number;          // Number of intermediate hops (length - 2, min 0)
  totalAmount: number;        // Sum of financial laundering amounts (in INR)
  evidenceChain: string[];    // Array of Section 63 BSA evidence IDs / record tags
}

// ==========================================
// 4. TELEMETRY & AUDIT SCHEMAS
// ==========================================

export type AuditEntry = AuditLogEntry;

export interface AuditLogsResponse {
  logs: AuditEntry[];
  totalQueries: number;
}

// ==========================================
// 5. SYSTEM HEALTH & TELEMETRY
// ==========================================

export interface BackendHealthResponse {
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  timestamp: string;
  database: 'connected' | 'disconnected';
  version: string;
  activeWorkers?: number;
}

export type ConnectionMode = 'LIVE' | 'FALLBACK';

export interface TelemetryConnectionState {
  mode: ConnectionMode;
  isOnline: boolean;
  backendUrl: string;
  lastChecked: string;
  latencyMs?: number;
  errorMessage?: string;
}

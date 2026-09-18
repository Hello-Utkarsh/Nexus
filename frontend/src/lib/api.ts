import { 
  SyndicateGraphResponse, 
  IntelligenceLogsResponse, 
  PathResolveRequest, 
  PathResolveResponse, 
  AuditLogsResponse, 
  BackendHealthResponse,
  TelemetryConnectionState,
  GraphNode,
  GraphLink,
  Cluster
} from '../types/api';
export type { TelemetryConnectionState };
import { 
  INITIAL_ENTITIES, 
  INITIAL_RELATIONSHIPS,
  SYNTHETIC_EVIDENCE_CATALOG 
} from '../data/intelligenceData';
import { SOCMINT_FEED_ITEMS } from '../components/socmint/SocmintView';
import { INITIAL_TELEMETRY_LOGS } from '../components/admin/AuditDock';
import { Relationship } from '../types/intelligence';

// ==========================================
// CONFIGURATION & RESILIENT TELEMETRY STATE
// ==========================================

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
export const API_TIMEOUT_MS = 2500;

let currentTelemetryState: TelemetryConnectionState = {
  mode: 'FALLBACK',
  isOnline: false,
  backendUrl: BACKEND_URL,
  lastChecked: new Date().toISOString(),
  latencyMs: undefined,
  errorMessage: undefined,
};

type TelemetrySubscriber = (state: TelemetryConnectionState) => void;
const subscribers = new Set<TelemetrySubscriber>();

export function getTelemetryState(): TelemetryConnectionState {
  return currentTelemetryState;
}

export function subscribeTelemetry(callback: TelemetrySubscriber): () => void {
  subscribers.add(callback);
  callback(currentTelemetryState);
  return () => {
    subscribers.delete(callback);
  };
}

function updateTelemetryState(updates: Partial<TelemetryConnectionState>) {
  currentTelemetryState = {
    ...currentTelemetryState,
    ...updates,
    lastChecked: new Date().toISOString(),
  };
  subscribers.forEach((sub) => {
    try {
      sub(currentTelemetryState);
    } catch (e) {
      console.error('[Telemetry Client] Subscriber update error:', e);
    }
  });
}

// ==========================================
// INTERNAL TIMED FETCH WITH FAILOVER ABORT
// ==========================================

async function fetchWithTimeout<T>(
  endpoint: string, 
  options: RequestInit = {}, 
  timeoutMs: number = API_TIMEOUT_MS
): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const startTime = Date.now();

  try {
    const url = `${BACKEND_URL.replace(/\/$/, '')}${endpoint}`;
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timer);
    const latency = Date.now() - startTime;

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }

    const data = await res.json();
    updateTelemetryState({
      mode: 'LIVE',
      isOnline: true,
      latencyMs: latency,
      errorMessage: undefined,
    });
    return data as T;
  } catch (error: any) {
    clearTimeout(timer);
    const latency = Date.now() - startTime;
    const isAbort = error.name === 'AbortError';
    const errMessage = isAbort ? `Timed out after ${timeoutMs}ms` : (error.message || 'Connection refused');
    
    console.info(`[Telemetry Client] Backend offline (${errMessage}) - falling back to tactical local dataset`);

    updateTelemetryState({
      mode: 'FALLBACK',
      isOnline: false,
      latencyMs: latency,
      errorMessage: errMessage,
    });
    return null;
  }
}

// ==========================================
// 1. SYNDICATE GRAPH API
// ==========================================

export async function fetchSyndicateGraph(): Promise<SyndicateGraphResponse> {
  try {
    const result = await fetchWithTimeout<SyndicateGraphResponse>('/api/v1/graph');
    if (result && Array.isArray(result.nodes) && Array.isArray(result.links)) {
      return result;
    }
  } catch (err) {
    console.info('[Telemetry Client] Backend offline - falling back to tactical local dataset');
  }

  // Tactical Local Dataset Fallback
  const nodes: GraphNode[] = INITIAL_ENTITIES.map((e) => ({
    ...e,
    riskScore: Math.round(e.confidence * 100),
    rank: e.role,
    status: 'IDENTIFIED',
  }));

  const links: GraphLink[] = INITIAL_RELATIONSHIPS.map((r) => ({
    id: r.id,
    source: r.sourceId,
    target: r.targetId,
    type: r.type,
    label: r.label,
    confidence: r.confidence,
    amount: r.metadata?.amount,
    callCount: r.metadata?.callCount,
    durationSeconds: r.metadata?.durationSeconds,
    timestamp: r.timestamp,
    sourceIds: r.sourceIds,
    metadata: r.metadata,
  }));

  const clusters: Cluster[] = [
    { id: 1, name: 'Coordination Cell', nodeCount: 8, primaryRole: 'Executive Command' },
    { id: 2, name: 'Hawala Channel (UAE / Mumbai)', nodeCount: 11, primaryRole: 'Layering & Settlement' },
    { id: 3, name: 'Burner SIM Distribution (Cantt)', nodeCount: 9, primaryRole: 'Telecom Obfuscation' },
    { id: 4, name: 'Field Enforcers & Cut-outs', nodeCount: 8, primaryRole: 'Physical Extortion' },
    { id: 5, name: 'Corrupt Transit Facilitators', nodeCount: 6, primaryRole: 'Logistical Cover' },
  ];

  const metrics = {
    density: 0.042,
    totalRecords: nodes.length + links.length,
    totalNodes: nodes.length,
    totalLinks: links.length,
    averageDegree: Number(((links.length * 2) / nodes.length).toFixed(2)),
  };

  return { nodes, links, clusters, metrics };
}

// ==========================================
// 2. INTELLIGENCE LOGS API (SOCMINT/OSINT)
// ==========================================

export async function fetchIntelligenceLogs(): Promise<IntelligenceLogsResponse> {
  try {
    const result = await fetchWithTimeout<IntelligenceLogsResponse>('/api/v1/logs');
    if (result && Array.isArray(result.incidents)) {
      return result;
    }
  } catch (err) {
    console.info('[Telemetry Client] Backend offline - falling back to tactical local dataset');
  }

  return {
    incidents: SOCMINT_FEED_ITEMS,
    count: SOCMINT_FEED_ITEMS.length,
    timestamp: new Date().toISOString(),
  };
}

// ==========================================
// 3. SHORTEST PATH & CONDUIT TRACE API
// ==========================================

export async function resolveShortestPath(
  sourceId: string, 
  targetId: string,
  options: Partial<PathResolveRequest> = {}
): Promise<PathResolveResponse> {
  try {
    const result = await fetchWithTimeout<PathResolveResponse>('/api/v1/path/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, targetId, ...options }),
    });

    if (result && Array.isArray(result.path)) {
      return result;
    }
  } catch (err) {
    console.info('[Telemetry Client] Backend offline - falling back to tactical local dataset');
  }

  // Tactical Local Shortest Path Resolution (BFS)
  const adj = new Map<string, Array<{ to: string; rel: Relationship }>>();
  INITIAL_RELATIONSHIPS.forEach((r) => {
    if (!adj.has(r.sourceId)) adj.set(r.sourceId, []);
    if (!adj.has(r.targetId)) adj.set(r.targetId, []);
    adj.get(r.sourceId)!.push({ to: r.targetId, rel: r });
    adj.get(r.targetId)!.push({ to: r.sourceId, rel: r });
  });

  const queue: Array<{ current: string; path: string[]; relsInPath: Relationship[] }> = [
    { current: sourceId, path: [sourceId], relsInPath: [] },
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
          relsInPath: [...relsInPath, rel],
        });
      }
    }
  }

  if (foundPath) {
    const totalAmount = foundRels.reduce((sum, r) => sum + (r.metadata?.amount || 0), 0) || 1850000;
    const evidenceSet = new Set<string>();
    foundRels.forEach((r) => {
      r.sourceIds.forEach((sid) => evidenceSet.add(sid));
    });

    // Match evidence record tags from catalog
    const evidenceChain = Array.from(evidenceSet).map((eid) => {
      const match = SYNTHETIC_EVIDENCE_CATALOG.find((ev) => ev.id === eid);
      return match ? match.recordId : eid;
    });

    return {
      path: foundPath,
      totalHops: Math.max(0, foundPath.length - 2),
      totalAmount,
      evidenceChain: evidenceChain.length > 0 ? evidenceChain : ['GD-ENTRY-382-LANKA', 'CDR-DUMP-71'],
    };
  }

  // Direct edge or fallback connection
  return {
    path: [sourceId, targetId],
    totalHops: 0,
    totalAmount: 425000,
    evidenceChain: ['GD-ENTRY-382-LANKA'],
  };
}

// ==========================================
// 4. AUDIT & TELEMETRY LOGS API
// ==========================================

export async function fetchAuditLogs(): Promise<AuditLogsResponse> {
  try {
    const result = await fetchWithTimeout<AuditLogsResponse>('/api/v1/audit');
    if (result && Array.isArray(result.logs)) {
      return result;
    }
  } catch (err) {
    console.info('[Telemetry Client] Backend offline - falling back to tactical local dataset');
  }

  return {
    logs: INITIAL_TELEMETRY_LOGS,
    totalQueries: INITIAL_TELEMETRY_LOGS.length,
  };
}

// ==========================================
// 5. SYSTEM HEALTH CHECK
// ==========================================

export async function checkBackendHealth(): Promise<TelemetryConnectionState> {
  try {
    const result = await fetchWithTimeout<BackendHealthResponse>('/api/v1/health', {}, 2000);
    if (result && (result.status === 'ONLINE' || result.database === 'connected')) {
      return getTelemetryState();
    }
  } catch (err) {
    // Already handled in fetchWithTimeout
  }
  return getTelemetryState();
}

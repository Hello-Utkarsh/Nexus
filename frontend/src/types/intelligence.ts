/**
 * CHAKRAVYUH 2.0 — Intelligence Data Models
 * Clean, extensible interfaces for entities, relationships, evidence, patterns, and entity resolution.
 */

export type EntityType = 
  | 'person' 
  | 'phone' 
  | 'account' 
  | 'organization' 
  | 'location' 
  | 'vehicle';

export type RelationshipType = 
  | 'communication' 
  | 'financial' 
  | 'association' 
  | 'location' 
  | 'ownership';

export type EvidenceSourceType = 
  | 'FIR' 
  | 'CDR' 
  | 'FINANCIAL' 
  | 'INTEL' 
  | 'LOCATION';

export interface EntityMetrics {
  degree: number;
  betweenness: number; // 0.0 to 1.0
  pageRank: number;    // 0.0 to 1.0
  inDegree: number;
  outDegree: number;
}

export interface EntityTelecomMeta {
  imei?: string;
  imsi?: string;
  carrier?: string;
  linkedMsisdns?: string[];
  callCount?: number;
  lastIntercept?: string;
  activeTower?: string;
}

export interface EntityFinancialMeta {
  accountNumber?: string;
  bankName?: string;
  ifsc?: string;
  holderName?: string;
  role?: string;
  inflow?: number;
  outflow?: number;
  upiId?: string;
}

export interface EntityLocationMeta {
  address?: string;
  coordinates?: { lat: number; lng: number };
  cellId?: string;
  azimuth?: string;
  jurisdiction?: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  aliases: string[];
  confidence: number; // 0.0 to 1.0
  role: string;       // e.g. "High Network Influence", "Account Holder", "Communication Bridge"
  community: number;  // Community cluster ID (1, 2, 3, 4, 5)
  communityName: string;
  flaggedSignal?: string;
  metrics: EntityMetrics;
  sourceIds: string[]; // references to Evidence records
  telecom?: EntityTelecomMeta;
  financial?: EntityFinancialMeta;
  location?: EntityLocationMeta;
  firstSeen: string;  // YYYY-MM-DD
  lastSeen: string;   // YYYY-MM-DD
  
  // Canvas physics properties
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  radius?: number;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  label: string;
  confidence: number; // 0.0 to 1.0
  sourceIds: string[]; // references to Evidence records
  timestamp: string;  // YYYY-MM-DD
  metadata?: {
    amount?: number;        // In INR if financial
    callCount?: number;     // If telecom
    durationSeconds?: number;
    utrNumber?: string;
    cdrId?: string;
    channel?: string;
    notes?: string;
  };
}

export interface Evidence {
  id: string;
  sourceType: EvidenceSourceType;
  sourceName: string;
  recordId: string;
  timestamp: string;
  content: string;
  entities: string[];      // Entity IDs involved
  relationships: string[]; // Relationship IDs linked
  confidence: number;      // 0.0 to 1.0
  location?: string;
  verified: boolean;
}

export interface EntityMatch {
  id: string;
  primaryEntityId: string;
  candidateEntityId: string;
  nameSimilarity: number;     // 0-100%
  phoneAssociation: number;   // 0-100%
  locationOverlap: number;    // 0-100%
  contextSimilarity: number;  // 0-100%
  overallConfidence: number;  // 0-100%
  status: 'pending' | 'linked' | 'ignored';
  sharedSignals: string[];
}

export type PatternType = 
  | 'CIRCULAR_TRANSACTION' 
  | 'COMMUNICATION_BURST' 
  | 'SIM_DEVICE_SWAP' 
  | 'CROSS_COMMUNITY_BRIDGE';

export interface Pattern {
  id: string;
  type: PatternType;
  title: string;
  severity: 'high' | 'medium' | 'low';
  confidence: number;        // 0-100%
  whyFlagged: string[];      // Explainable reasons
  entityIds: string[];
  relationshipIds: string[];
  evidenceIds: string[];
  explanation: string;
  actionRecommendation: string;
}

export interface InvestigationCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  sources: string[];
  status: 'Active' | 'Under Review' | 'Archived';
  entitiesCount: number;
  relationshipsCount: number;
  patternsCount: number;
  evidenceCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredFinding?: {
    finding: string;
    signals: string[];
    evidence: string[];
    confidence: number;
    disclaimer: string;
  };
}

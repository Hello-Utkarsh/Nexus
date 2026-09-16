export type EntityRole = 
  | 'kingpin' 
  | 'mule' 
  | 'telecom' 
  | 'shell' 
  | 'enforcer' 
  | 'victim';

export type RelationshipType = 
  | 'conspiracy' 
  | 'financial' 
  | 'telecom' 
  | 'telemetry'
  | 'logistics';

export type TacticalCluster = 'A' | 'B' | 'C' | 'D' | 'E';

export interface TelecomTelemetry {
  primaryImei: string;
  imsi: string;
  carrier: string;
  activeTowerId: string;
  towerLocation: string;
  linkedMsisdns: string[];
  cdrInterceptCount: number;
  lastInterceptTimestamp: string;
  interceptSnippet?: string;
  coordinates?: { lat: number; lng: number };
  cellId?: string;
  azimuth?: string;
}

export interface FinancialTrail {
  accountNumber: string;
  bankName: string;
  ifsc: string;
  accountHolder: string;
  layeringRole: string;
  totalInflow: number;
  totalOutflow: number;
  hawalaSource?: string;
  upiId?: string;
}

export interface EvidenceAudit {
  firReference: string;
  evidenceTag: string;
  wiretapLogId: string;
  towerDumpMatch: boolean;
  bnsSections: string[];
  ipcEquivalent: string[];
  confidenceScore: number;
  confessionExcerpt: string;
}

export interface SyndicateNode {
  id: string;
  name: string;
  aliases: string[];
  role: EntityRole;
  cluster: TacticalCluster;
  clusterName: string;
  subType?: 'person' | 'bank' | 'sim' | 'imei' | 'vehicle' | 'tower' | 'shell' | 'safehouse';
  rank: string;
  status: 'WANTED' | 'UNDER_SURVEILLANCE' | 'DETAINED' | 'IDENTIFIED' | 'TARGET';
  riskScore: number; // 0 to 100
  betweennessCentrality: number; // 0.0 to 1.0
  pageRank: number;
  inDegree: number;
  outDegree: number;
  flaggedForLoc: boolean;
  isPrimeAccused: boolean;
  avatarSeed: string;
  firstActivityDate: string; // ISO date YYYY-MM-DD
  lastActivityDate: string;
  telecom: TelecomTelemetry;
  financial: FinancialTrail;
  evidence: EvidenceAudit;
  
  // Canvas physics coordinates & velocity
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SyndicateEdge {
  id: string;
  source: string;
  target: string;
  type: RelationshipType;
  label: string;
  timestamp: string; // ISO date YYYY-MM-DD
  confidence: number; // 0.5 to 1.0
  amount?: number; // In INR if financial
  callCount?: number; // If telecom
  interceptEvidenceId?: string;
}

export interface SyndicateGraphData {
  nodes: SyndicateNode[];
  edges: SyndicateEdge[];
}

export interface ExtractedEntity {
  id: string;
  type: 'PERSON' | 'BANK' | 'SIM' | 'LOCATION' | 'COMPANY';
  value: string;
  confidence: number;
  context: string;
}


export interface Record {
  id: string;
  patientId?: string;
  firstName: string;
  lastName: string;
  gender: string;
  birthDate: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  healthFacility?: string;
  lastVisit?: string;
  tags?: string[];
  identifiers?: {
    type: string;
    value: string;
  }[];
  metadata?: {
    createdAt: string;
    updatedAt: string;
    source: string;
  };
  // New fields for linkage
  village?: string;
  district?: string;
  householdHead?: string;
  motherName?: string;
  fuzzyScore?: number;
}

export interface RecordMatch {
  sourceRecord: Record;
  potentialMatches: Array<{
    record: Record;
    score: number;
    matchedOn: string[];
  }>;
}

export interface MatchResult {
  sourceId: string;
  matchId: string | null;
  status: 'matched' | 'rejected' | 'manual-review';
  confidence: number;
  matchedBy: string;
  matchedAt: string;
}

export interface DashboardStats {
  totalRecords: number;
  matchedRecords: number;
  pendingMatches: number;
  matchRate: number;
}

// New interfaces for data loading functionality
export interface DataSource {
  id: string;
  name: string;
  description?: string;
  recordCount: number;
  lastUpdated: string;
  type: 'community' | 'facility' | 'imported';
}

export interface MatchingAlgorithm {
  id: string;
  name: string;
  description: string;
  thresholds: {
    high: number;
    medium: number;
    low: number;
  };
}

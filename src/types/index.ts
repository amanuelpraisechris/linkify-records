
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

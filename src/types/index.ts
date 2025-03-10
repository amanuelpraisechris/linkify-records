
export interface Record {
  id: string;
  patientId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex: string;
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
    matchScore?: number;
    matchNotes?: string;
  };
  // Residence fields
  village?: string;
  subVillage?: string;
  district?: string;
  householdHead?: string;
  motherName?: string;
  yearMovedIn?: string;
  neverInDSS?: boolean;
  balozi_first_name?: string;
  balozi_middle_name?: string;
  balozi_last_name?: string;
  oldest_member_first_name?: string;
  oldest_member_middle_name?: string;
  oldest_member_last_name?: string;
  telephone?: string;
  fuzzyScore?: number;
  matchedOn?: string[];
  fieldScores?: {[key: string]: number};
  sourceId?: string;
  householdMembers?: string[];
  visits?: Visit[];
  residencyTimeline?: ResidencyPeriod[];
  // Support for imported data with varying property names
  [key: string]: any;
}

export interface Visit {
  id: string;
  date: string;
  visitBy: 'PATIENT' | 'TREATMENT SUPPORTER';
  clinicId?: string;
  facility?: string;
}

export interface ResidencyPeriod {
  village: string;
  subVillage: string;
  startYear: string;
  endYear?: string;
  balozi?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
  oldestMember?: {
    firstName?: string;
    middleName?: string;
    lastName?: string;
  };
}

export interface RecordMatch {
  sourceRecord: Record;
  potentialMatches: Array<{
    record: Record;
    score: number;
    matchedOn: string[];
    fieldScores?: {[key: string]: number};
  }>;
}

export interface MatchResult {
  sourceId: string;
  matchId: string | null;
  status: 'matched' | 'rejected' | 'manual-review';
  confidence: number;
  matchedBy: string;
  matchedAt: string;
  notes?: string;
  fieldScores?: {[key: string]: number};
  consentObtained?: boolean;
  consentDate?: string;
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

// New user management interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'user' | 'pending';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  permissions: Permission[];
  activityLog?: UserActivity[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  module: 'records' | 'matching' | 'admin' | 'reports';
}

export interface UserActivity {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'create_record' | 'update_record' | 'delete_record' | 'export_data' | 'import_data' | 'password_change' | 'matching_review';
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  recentActivities: {
    passwordChanges: number;
    dataExports: number;
    dataImports: number;
    recordCreations: number;
    matchingReviews: number;
  };
}

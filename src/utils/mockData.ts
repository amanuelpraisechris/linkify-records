import { Record, RecordMatch, User, UserActivity, Visit, MatchResult } from '@/types';

// Keep minimal example data for fallback/testing purposes only
export const exampleRecords: Record[] = [];

export const newRecords: Record[] = [];

// Remove the static record matches since we're using real data now
export const recordMatches: RecordMatch[] = [];

// Dashboard stats will be calculated from real data
export const dashboardStats = {
  totalRecords: 0,
  matchedRecords: 0,
  pendingMatches: 0,
  matchRate: 0
};

// User management mock data (keep for admin functionality)
export const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'Admin User',
    role: 'admin',
    status: 'active' as const,
    createdAt: '2023-01-01T00:00:00Z',
    lastLogin: '2023-06-01T08:30:00Z',
    permissions: [],
    activityLog: []
  },
  {
    id: 'user_2',
    username: 'manager1',
    email: 'manager@example.com',
    fullName: 'Manager User',
    role: 'manager',
    status: 'active' as const,
    createdAt: '2023-02-15T00:00:00Z',
    lastLogin: '2023-05-28T14:45:00Z',
    permissions: [],
    activityLog: []
  },
  {
    id: 'user_3',
    username: 'user1',
    email: 'user1@example.com',
    fullName: 'Regular User',
    role: 'user',
    status: 'active' as const,
    createdAt: '2023-03-20T00:00:00Z',
    lastLogin: '2023-05-30T09:15:00Z',
    permissions: [],
    activityLog: []
  },
  {
    id: 'user_4',
    username: 'newuser',
    email: 'newuser@example.com',
    fullName: 'New Pending User',
    role: 'user',
    status: 'pending' as const,
    createdAt: '2023-05-29T00:00:00Z',
    permissions: [],
    activityLog: []
  },
  {
    id: 'user_5',
    username: 'inactive',
    email: 'inactive@example.com',
    fullName: 'Inactive User',
    role: 'user',
    status: 'inactive' as const,
    createdAt: '2023-01-10T00:00:00Z',
    lastLogin: '2023-03-15T16:20:00Z',
    permissions: [],
    activityLog: []
  }
];

export const mockUserActivities: UserActivity[] = [
  {
    id: 'activity_1',
    userId: 'user_1',
    action: 'login',
    timestamp: '2023-06-01T08:30:00Z',
    details: 'Admin login from 192.168.1.1',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'activity_2',
    userId: 'user_2',
    action: 'export_data',
    timestamp: '2023-05-28T14:45:00Z',
    details: 'Exported patient records (filtered by: date range)',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'activity_3',
    userId: 'user_3',
    action: 'create_record',
    timestamp: '2023-05-30T09:15:00Z',
    details: 'Created new patient record ID: PAT-12345',
    ipAddress: '192.168.1.3'
  },
  {
    id: 'activity_4',
    userId: 'user_1',
    action: 'import_data',
    timestamp: '2023-05-25T10:30:00Z',
    details: 'Imported 150 community HDSS records',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'activity_5',
    userId: 'user_2',
    action: 'matching_review',
    timestamp: '2023-05-27T11:20:00Z',
    details: 'Reviewed and approved 12 record matches',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'activity_6',
    userId: 'user_3',
    action: 'password_change',
    timestamp: '2023-05-29T16:45:00Z',
    details: 'User changed their password',
    ipAddress: '192.168.1.3'
  },
  {
    id: 'activity_7',
    userId: 'user_1',
    action: 'login',
    timestamp: '2023-05-31T08:15:00Z',
    details: 'Admin login from 192.168.1.1',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'activity_8',
    userId: 'user_3',
    action: 'logout',
    timestamp: '2023-05-30T17:30:00Z',
    details: 'User logged out',
    ipAddress: '192.168.1.3'
  }
];

// Removed generateRecordMatches function since we're using real data now
export const generateRecordMatches = (): RecordMatch[] => {
  return [];
};

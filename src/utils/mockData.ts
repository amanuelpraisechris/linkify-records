
import { Record, RecordMatch, User, UserActivity, Visit, MatchResult } from '@/types';

// Define missing variables
export const exampleRecords: Record[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    sex: 'Male', // Changed from gender to sex
    birthDate: '1985-03-15',
    village: 'Central',
    subVillage: 'Downtown',
    identifiers: [
      { type: 'Health ID', value: 'H12345' }
    ],
    metadata: {
      createdAt: '2023-05-10T09:30:00Z',
      updatedAt: '2023-05-10T09:30:00Z',
      source: 'Clinical Entry'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    sex: 'Female', // Changed from gender to sex
    birthDate: '1990-07-22',
    village: 'Eastern',
    subVillage: 'Riverside',
    identifiers: [
      { type: 'Health ID', value: 'H54321' }
    ],
    metadata: {
      createdAt: '2023-05-11T14:15:00Z',
      updatedAt: '2023-05-11T14:15:00Z',
      source: 'Clinical Entry'
    }
  }
];

export const newRecords: Record[] = [
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    sex: 'Male',
    birthDate: '1978-11-30',
    village: 'Western',
    subVillage: 'Hilltop',
    identifiers: [
      { type: 'Health ID', value: 'H67890' }
    ],
    metadata: {
      createdAt: '2023-05-12T10:45:00Z',
      updatedAt: '2023-05-12T10:45:00Z',
      source: 'Clinical Entry'
    }
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Williams',
    sex: 'Female',
    birthDate: '1992-04-17',
    village: 'Northern',
    subVillage: 'Lakeside',
    identifiers: [
      { type: 'Health ID', value: 'H24680' }
    ],
    metadata: {
      createdAt: '2023-05-13T09:15:00Z',
      updatedAt: '2023-05-13T09:15:00Z',
      source: 'Clinical Entry'
    }
  }
];

// Create record matches for demo
export const recordMatches: RecordMatch[] = newRecords.map(newRecord => {
  // Find potential matches in the example records
  const potentialMatches = exampleRecords
    .filter(record => 
      record.lastName.toLowerCase().includes(newRecord.lastName.toLowerCase().substring(0, 3)) || 
      record.firstName.toLowerCase().includes(newRecord.firstName.toLowerCase().substring(0, 3)) ||
      record.birthDate.substring(0, 7) === newRecord.birthDate.substring(0, 7)
    )
    .map(record => {
      // Calculate a basic similarity score
      let score = 0;
      const matchedOn: string[] = [];
      
      // Check first name
      if (record.firstName.toLowerCase() === newRecord.firstName.toLowerCase()) {
        score += 25;
        matchedOn.push('firstName');
      } else if (record.firstName.toLowerCase().startsWith(newRecord.firstName.toLowerCase().substring(0, 3))) {
        score += 15;
        matchedOn.push('firstName (partial)');
      }
      
      // Check last name
      if (record.lastName.toLowerCase() === newRecord.lastName.toLowerCase()) {
        score += 25;
        matchedOn.push('lastName');
      } else if (record.lastName.toLowerCase().startsWith(newRecord.lastName.toLowerCase().substring(0, 3))) {
        score += 15;
        matchedOn.push('lastName (partial)');
      }
      
      // Check birth date
      if (record.birthDate === newRecord.birthDate) {
        score += 25;
        matchedOn.push('birthDate');
      } else if (record.birthDate.substring(0, 7) === newRecord.birthDate.substring(0, 7)) {
        score += 15;
        matchedOn.push('birthDate (year/month)');
      }
      
      // Check sex
      if (record.sex === newRecord.sex) {
        score += 10;
        matchedOn.push('sex');
      }
      
      // Check phone
      if (record.phoneNumber && newRecord.phoneNumber && 
          record.phoneNumber.replace(/\D/g, '').slice(-4) === newRecord.phoneNumber.replace(/\D/g, '').slice(-4)) {
        score += 15;
        matchedOn.push('phoneNumber (last 4 digits)');
      }
      
      return {
        record,
        score,
        matchedOn
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 5); // Get top 5 matches
  
  return {
    sourceRecord: newRecord,
    potentialMatches
  };
});

// Add dashboard stats
export const dashboardStats = {
  totalRecords: exampleRecords.length + newRecords.length,
  matchedRecords: 18,
  pendingMatches: 7,
  matchRate: 72.5
};

// User management mock data
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

// Create some record matches for demonstration (this was already here)
export const generateRecordMatches = (): RecordMatch[] => {
  return newRecords.map(newRecord => {
    // Find potential matches in the example records
    const potentialMatches = exampleRecords
      .filter(record => 
        record.lastName.toLowerCase().includes(newRecord.lastName.toLowerCase().substring(0, 3)) || 
        record.firstName.toLowerCase().includes(newRecord.firstName.toLowerCase().substring(0, 3)) ||
        record.birthDate.substring(0, 7) === newRecord.birthDate.substring(0, 7)
      )
      .map(record => {
        // Calculate a basic similarity score
        let score = 0;
        const matchedOn: string[] = [];
        
        // Check first name
        if (record.firstName.toLowerCase() === newRecord.firstName.toLowerCase()) {
          score += 25;
          matchedOn.push('firstName');
        } else if (record.firstName.toLowerCase().startsWith(newRecord.firstName.toLowerCase().substring(0, 3))) {
          score += 15;
          matchedOn.push('firstName (partial)');
        }
        
        // Check last name
        if (record.lastName.toLowerCase() === newRecord.lastName.toLowerCase()) {
          score += 25;
          matchedOn.push('lastName');
        } else if (record.lastName.toLowerCase().startsWith(newRecord.lastName.toLowerCase().substring(0, 3))) {
          score += 15;
          matchedOn.push('lastName (partial)');
        }
        
        // Check birth date
        if (record.birthDate === newRecord.birthDate) {
          score += 25;
          matchedOn.push('birthDate');
        } else if (record.birthDate.substring(0, 7) === newRecord.birthDate.substring(0, 7)) {
          score += 15;
          matchedOn.push('birthDate (year/month)');
        }
        
        // Check sex (changed from gender)
        if (record.sex === newRecord.sex) {
          score += 10;
          matchedOn.push('sex');
        }
        
        // Check phone
        if (record.phoneNumber && newRecord.phoneNumber && 
            record.phoneNumber.replace(/\D/g, '').slice(-4) === newRecord.phoneNumber.replace(/\D/g, '').slice(-4)) {
          score += 15;
          matchedOn.push('phoneNumber (last 4 digits)');
        }
        
        return {
          record,
          score,
          matchedOn
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // Get top 5 matches
    
    return {
      sourceRecord: newRecord,
      potentialMatches
    };
  });
};

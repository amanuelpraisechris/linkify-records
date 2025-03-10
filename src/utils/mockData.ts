import { Record, RecordMatch, DashboardStats, User, UserActivity } from '@/types';

// Generate a random date within the last few years
const randomDate = (start: Date, end: Date) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split('T')[0];
};

// Generate random phone number
const randomPhone = () => {
  return `+${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;
};

// List of facilities
const healthFacilities = [
  'Central Hospital',
  'North Medical Center',
  'East Community Clinic',
  'South Regional Hospital',
  'West Health Center',
  'University Medical Center',
  'Children\'s Hospital',
  'Veterans Medical Center',
  'Rural Health Clinic',
  'Downtown Health Clinic'
];

// Generate identifier
const generateIdentifier = (type: string) => {
  let value = '';
  switch (type) {
    case 'SSN':
      value = `${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 90 + 10)}-${Math.floor(Math.random() * 9000 + 1000)}`;
      break;
    case 'PatientID':
      value = `P${Math.floor(Math.random() * 900000 + 100000)}`;
      break;
    case 'MRN':
      value = `MRN-${Math.floor(Math.random() * 900000 + 100000)}`;
      break;
    case 'Insurance':
      value = `INS-${Math.floor(Math.random() * 900000 + 100000)}`;
      break;
    default:
      value = `ID-${Math.floor(Math.random() * 900000 + 100000)}`;
  }
  return { type, value };
};

// Names for generating test data
const firstNames = ['John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer', 'William', 'Linda', 'James', 'Patricia', 'Maria', 'Thomas', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Charles'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Garcia', 'Martinez', 'Robinson'];

// Generate test records
export const generateRecords = (count: number): Record[] => {
  const records: Record[] = [];
  const today = new Date();
  const startDate = new Date();
  startDate.setFullYear(today.getFullYear() - 80);
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const gender = Math.random() > 0.5 ? 'Male' : 'Female';
    const birthDate = randomDate(startDate, new Date(today.getFullYear() - 18, 0, 1));
    const facility = healthFacilities[Math.floor(Math.random() * healthFacilities.length)];
    
    const identifierTypes = ['SSN', 'PatientID', 'MRN', 'Insurance'];
    const identifiers = [];
    
    // Add 1-3 random identifiers
    for (let j = 0; j < Math.floor(Math.random() * 3) + 1; j++) {
      const type = identifierTypes[Math.floor(Math.random() * identifierTypes.length)];
      identifiers.push(generateIdentifier(type));
    }
    
    const lastVisit = randomDate(new Date(today.getFullYear() - 2, 0, 1), today);
    
    records.push({
      id: `rec-${i + 1}`,
      patientId: `P${100000 + i}`,
      firstName,
      lastName,
      gender,
      birthDate,
      address: `${Math.floor(Math.random() * 9000) + 1000} Main St, City, State`,
      phoneNumber: randomPhone(),
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      healthFacility: facility,
      lastVisit,
      identifiers,
      metadata: {
        createdAt: new Date(new Date().setMonth(today.getMonth() - Math.floor(Math.random() * 24))).toISOString(),
        updatedAt: new Date().toISOString(),
        source: Math.random() > 0.5 ? 'Electronic Health Record' : 'Manual Entry'
      }
    });
  }
  
  return records;
};

// Generate similar record but with potential typos or variations
export const generateSimilarRecord = (original: Record): Record => {
  const record = { ...original };
  
  // Create a new ID
  record.id = `new-${original.id}`;
  
  // Make random changes to simulate data entry errors
  const changeType = Math.floor(Math.random() * 4);
  
  switch (changeType) {
    case 0: // Name typo
      if (Math.random() > 0.5) {
        record.firstName = record.firstName.substring(0, record.firstName.length - 1) + (Math.random() > 0.5 ? record.firstName.charAt(record.firstName.length - 1).toLowerCase() : record.firstName.charAt(0));
      } else {
        record.lastName = record.lastName.substring(0, record.lastName.length - 1) + (Math.random() > 0.5 ? record.lastName.charAt(record.lastName.length - 1).toLowerCase() : record.lastName.charAt(0));
      }
      break;
    case 1: // Date format or slight change
      const dateParts = record.birthDate.split('-');
      if (dateParts.length === 3) {
        // Swap day/month or add/subtract a day
        if (Math.random() > 0.5) {
          const tempDay = dateParts[2];
          dateParts[2] = dateParts[1];
          dateParts[1] = tempDay;
        } else {
          const day = parseInt(dateParts[2]);
          dateParts[2] = (day + 1).toString().padStart(2, '0');
        }
        record.birthDate = dateParts.join('-');
      }
      break;
    case 2: // Phone number variation
      if (record.phoneNumber) {
        const digits = record.phoneNumber.replace(/\D/g, '');
        const lastFour = digits.slice(-4);
        const randomDigit = Math.floor(Math.random() * 10);
        record.phoneNumber = record.phoneNumber.replace(lastFour, lastFour.substring(0, 3) + randomDigit);
      }
      break;
    case 3: // Address variation
      if (record.address) {
        record.address = record.address.replace(/\d+/, (match) => {
          const num = parseInt(match);
          return (num + (Math.floor(Math.random() * 10) - 5)).toString();
        });
      }
      break;
  }
  
  // Update metadata
  record.metadata = {
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    source: 'New Entry'
  };
  
  return record;
};

// Generate example records for the application
export const exampleRecords = generateRecords(50);

// Generate new records that need to be matched
export const newRecords = exampleRecords.slice(0, 10).map(record => generateSimilarRecord(record));

// Create some record matches for demonstration
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
        
        // Check gender
        if (record.gender === newRecord.gender) {
          score += 10;
          matchedOn.push('gender');
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

export const recordMatches = generateRecordMatches();

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalRecords: exampleRecords.length,
  matchedRecords: Math.floor(exampleRecords.length * 0.68),
  pendingMatches: recordMatches.length,
  matchRate: 68
};

// Mock user data for user management
export const mockUsers: User[] = [
  {
    id: 'user_1',
    username: 'admin',
    email: 'admin@example.com',
    fullName: 'System Administrator',
    role: 'admin',
    status: 'active',
    createdAt: '2023-06-10T12:00:00Z',
    lastLogin: '2023-07-14T08:25:43Z',
    permissions: [
      { id: 'perm_1', name: 'manage_users', description: 'Can manage users', module: 'admin' },
      { id: 'perm_2', name: 'manage_records', description: 'Can manage records', module: 'records' },
      { id: 'perm_3', name: 'manage_matching', description: 'Can manage matching', module: 'matching' },
    ]
  },
  {
    id: 'user_2',
    username: 'manager',
    email: 'manager@example.com',
    fullName: 'Data Manager',
    role: 'manager',
    status: 'active',
    createdAt: '2023-06-12T14:30:00Z',
    lastLogin: '2023-07-13T16:42:19Z',
    permissions: [
      { id: 'perm_2', name: 'manage_records', description: 'Can manage records', module: 'records' },
      { id: 'perm_3', name: 'manage_matching', description: 'Can manage matching', module: 'matching' },
    ]
  },
  {
    id: 'user_3',
    username: 'user1',
    email: 'user1@example.com',
    fullName: 'Regular User',
    role: 'user',
    status: 'active',
    createdAt: '2023-06-15T09:45:00Z',
    lastLogin: '2023-07-14T11:30:22Z',
    permissions: [
      { id: 'perm_4', name: 'view_records', description: 'Can view records', module: 'records' },
    ]
  },
  {
    id: 'user_4',
    username: 'user2',
    email: 'user2@example.com',
    fullName: 'Data Entry Clerk',
    role: 'user',
    status: 'active',
    createdAt: '2023-06-18T13:15:00Z',
    lastLogin: '2023-07-13T14:20:45Z',
    permissions: [
      { id: 'perm_4', name: 'view_records', description: 'Can view records', module: 'records' },
      { id: 'perm_5', name: 'create_records', description: 'Can create records', module: 'records' },
    ]
  },
  {
    id: 'user_5',
    username: 'newuser',
    email: 'newuser@example.com',
    fullName: 'New Pending User',
    role: 'user',
    status: 'pending',
    createdAt: '2023-07-12T08:30:00Z',
    permissions: []
  },
  {
    id: 'user_6',
    username: 'inactive',
    email: 'inactive@example.com',
    fullName: 'Inactive User',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-06-05T10:20:00Z',
    lastLogin: '2023-06-20T15:45:12Z',
    permissions: [
      { id: 'perm_4', name: 'view_records', description: 'Can view records', module: 'records' },
    ]
  }
];

// Mock user activity data
export const mockUserActivities: UserActivity[] = [
  {
    id: 'act_1',
    userId: 'user_1',
    action: 'login',
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    details: 'Admin login from 192.168.1.1',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'act_2',
    userId: 'user_1',
    action: 'import_data',
    timestamp: new Date(Date.now() - 3000 * 1000).toISOString(),
    details: 'Imported 250 records from Health Facility A',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'act_3',
    userId: 'user_2',
    action: 'login',
    timestamp: new Date(Date.now() - 86400 * 1000).toISOString(),
    details: 'Manager login from 192.168.1.2',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'act_4',
    userId: 'user_2',
    action: 'export_data',
    timestamp: new Date(Date.now() - 82800 * 1000).toISOString(),
    details: 'Exported 150 matched records to CSV',
    ipAddress: '192.168.1.2'
  },
  {
    id: 'act_5',
    userId: 'user_3',
    action: 'login',
    timestamp: new Date(Date.now() - 172800 * 1000).toISOString(),
    details: 'User login from 192.168.1.3',
    ipAddress: '192.168.1.3'
  },
  {
    id: 'act_6',
    userId: 'user_3',
    action: 'create_record',
    timestamp: new Date(Date.now() - 170000 * 1000).toISOString(),
    details: 'Created new patient record',
    ipAddress: '192.168.1.3'
  },
  {
    id: 'act_7',
    userId: 'user_4',
    action: 'login',
    timestamp: new Date(Date.now() - 259200 * 1000).toISOString(),
    details: 'User login from 192.168.1.4',
    ipAddress: '192.168.1.4'
  },
  {
    id: 'act_8',
    userId: 'user_4',
    action: 'update_record',
    timestamp: new Date(Date.now() - 255600 * 1000).toISOString(),
    details: 'Updated patient information',
    ipAddress: '192.168.1.4'
  },
  {
    id: 'act_9',
    userId: 'user_1',
    action: 'password_change',
    timestamp: new Date(Date.now() - 604800 * 1000).toISOString(),
    details: 'Changed account password',
    ipAddress: '192.168.1.1'
  },
  {
    id: 'act_10',
    userId: 'user_2',
    action: 'matching_review',
    timestamp: new Date(Date.now() - 432000 * 1000).toISOString(),
    details: 'Reviewed and approved 25 record matches',
    ipAddress: '192.168.1.2'
  },
  // Additional activity entries spread over time for chart visualization
  ...[...Array(30)].map((_, i) => ({
    id: `act_gen_${i}`,
    userId: mockUsers[i % mockUsers.length].id,
    action: ['login', 'export_data', 'import_data', 'create_record', 'password_change', 'matching_review'][i % 6] as any,
    timestamp: new Date(Date.now() - (i * 24 * 3600 * 1000)).toISOString(),
    details: `Generated activity for testing - ${i}`,
    ipAddress: `192.168.1.${i % 255}`
  }))
];


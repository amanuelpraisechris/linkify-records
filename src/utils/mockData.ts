
import { Record, RecordMatch, DashboardStats } from '@/types';

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

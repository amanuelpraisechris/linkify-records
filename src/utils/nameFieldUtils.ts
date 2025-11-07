
// List of keys that should be excluded from name fields
export const nonPatientNameFields = [
  "balozi_first_name", "\"balozi_first_name\"",
  "balozi_middle_name", "\"balozi_middle_name\"", 
  "balozi_last_name", "\"balozi_last_name\"",
  "oldest_member_first_name", "\"oldest_member_first_name\"",
  "oldest_member_middle_name", "\"oldest_member_middle_name\"",
  "oldest_member_last_name", "\"oldest_member_last_name\"",
  "cellLeaderFirstName", "cellLeaderMiddleName", "cellLeaderLastName",
  "oldestHouseholdMemberFirstName", "oldestHouseholdMemberMiddleName", "oldestHouseholdMemberLastName",
  "Ten Cell Leader First Name", "\"Ten Cell Leader First Name\"",
  "Ten Cell Leader Middle Name", "\"Ten Cell Leader Middle Name\"",
  "Ten Cell Leader Last Name", "\"Ten Cell Leader Last Name\""
];

/**
 * Enhanced helper to get name fields correctly with improved priority and consistency
 * This function checks multiple possible field patterns to ensure names are extracted
 * consistently across different data sources (clinic records and HDSS)
 */
export const getNameField = (record: Record<string, unknown>, field: 'firstName' | 'lastName' | 'middleName', defaultValue = '-'): string => {
  if (!record) return defaultValue;
  
  // Define all possible field patterns for each name type
  const fieldPatterns: Record<string, string[]> = {
    firstName: [
      'firstName', 'FirstName', 'first_name', 'First_Name', 'first name', 'First Name',
      '"firstName"', '"FirstName"', '"first_name"', '"First_Name"', '"first name"', '"First Name"',
      'first', 'First', 'givenName', 'GivenName', 'given_name', 'Given_Name',
      'name', 'Name', '"name"', '"Name"'
    ],
    lastName: [
      'lastName', 'LastName', 'last_name', 'Last_Name', 'last name', 'Last Name', 
      '"lastName"', '"LastName"', '"last_name"', '"Last_Name"', '"last name"', '"Last Name"',
      'surname', 'Surname', 'familyName', 'FamilyName', 'family_name', 'Family_Name'
    ],
    middleName: [
      'middleName', 'MiddleName', 'middle_name', 'Middle_Name', 'middle name', 'Middle Name',
      '"middleName"', '"MiddleName"', '"middle_name"', '"Middle_Name"', '"middle name"', '"Middle Name"',
      'otherName', 'OtherName', 'other_name', 'Other_Name'
    ]
  };

  // Try to find the field value using all possible patterns
  const patterns = fieldPatterns[field] || [];
  
  for (const pattern of patterns) {
    // Check for exact match
    if (record[pattern] !== undefined && record[pattern] !== null) {
      // Remove quotes if they exist in the value
      const value = String(record[pattern]);
      return value.replace(/^"(.*)"$/, '$1');
    }
  }
  
  // If we couldn't find an exact match, try case-insensitive matching
  for (const key in record) {
    // Skip undefined or null values
    if (record[key] === undefined || record[key] === null) continue;
    
    // Skip keys that match the non-patient name fields
    if (nonPatientNameFields.some(nonField => 
        nonField.toLowerCase() === key.toLowerCase() || 
        nonField.replace(/"/g, '') === key.replace(/"/g, ''))) continue;
    
    const lcKey = key.toLowerCase().replace(/"/g, '');
    
    // Check if the key might match the field we're looking for
    if (field === 'firstName' && 
        (lcKey.includes('first') && lcKey.includes('name')) && 
        !lcKey.includes('cell') && 
        !lcKey.includes('leader') && 
        !lcKey.includes('oldest') && 
        !lcKey.includes('balozi') && 
        !lcKey.includes('household') && 
        !lcKey.includes('member')) {
      return String(record[key]).replace(/^"(.*)"$/, '$1');
    }
    
    if (field === 'lastName' && 
        ((lcKey.includes('last') && lcKey.includes('name')) || lcKey.includes('surname')) && 
        !lcKey.includes('cell') && 
        !lcKey.includes('leader') && 
        !lcKey.includes('oldest') && 
        !lcKey.includes('balozi') && 
        !lcKey.includes('household') && 
        !lcKey.includes('member')) {
      return String(record[key]).replace(/^"(.*)"$/, '$1');
    }
    
    if (field === 'middleName' && 
        (lcKey.includes('middle') && lcKey.includes('name')) && 
        !lcKey.includes('cell') && 
        !lcKey.includes('leader') && 
        !lcKey.includes('oldest') && 
        !lcKey.includes('balozi') && 
        !lcKey.includes('household') && 
        !lcKey.includes('member')) {
      return String(record[key]).replace(/^"(.*)"$/, '$1');
    }
  }
  
  // Special case for fullName field - try to extract parts if we have a full name
  const fullNameFields = ['name', 'fullName', 'full_name', 'full name', 'Name', 'FullName', 'Full_Name', 'Full Name',
                          '"name"', '"fullName"', '"full_name"', '"full name"', '"Name"', '"FullName"', '"Full_Name"', '"Full Name"'];
  
  for (const fullNameField of fullNameFields) {
    if (record[fullNameField]) {
      const fullName = String(record[fullNameField]).replace(/^"(.*)"$/, '$1');
      const parts = fullName.split(' ').filter(Boolean);
      
      if (parts.length > 0) {
        if (field === 'firstName') return parts[0];
        if (field === 'lastName' && parts.length > 1) return parts[parts.length - 1];
        if (field === 'middleName' && parts.length > 2) return parts.slice(1, -1).join(' ');
      }
      break;
    }
  }
  
  return defaultValue;
};

/**
 * Gets the full name of a person from a record in a consistent format
 * @param record The record containing name fields
 * @param format Optional format to specify how name parts should be combined
 * @returns Formatted full name
 */
export const getFullName = (
  record: Record<string, unknown>,
  format: 'firstLast' | 'lastFirst' | 'firstMiddleLast' = 'firstMiddleLast'
): string => {
  const firstName = getNameField(record, 'firstName', '');
  const lastName = getNameField(record, 'lastName', '');
  const middleName = getNameField(record, 'middleName', '');
  
  // If the record already has a full name field, use that directly
  const fullNameFields = ['name', 'fullName', 'full_name', 'full name', 'Name', 'FullName', 'Full_Name', 'Full Name',
                          '"name"', '"fullName"', '"full_name"', '"full name"', '"Name"', '"FullName"', '"Full_Name"', '"Full Name"'];
  
  for (const field of fullNameFields) {
    if (record[field]) {
      const fullName = String(record[field]).replace(/^"(.*)"$/, '$1');
      if (fullName.trim()) return fullName.trim();
    }
  }
  
  // If no full name field, build from parts
  if (!firstName && !lastName) return '-';
  
  switch (format) {
    case 'lastFirst':
      return [lastName, firstName].filter(Boolean).join(', ');
    case 'firstMiddleLast':
      return [firstName, middleName, lastName].filter(Boolean).join(' ');
    case 'firstLast':
    default:
      return [firstName, lastName].filter(Boolean).join(' ');
  }
};

/**
 * Normalizes name fields in two records to ensure consistent comparison
 * @param record1 First record to compare
 * @param record2 Second record to compare
 * @returns Object with normalized name fields for both records
 */
export const normalizeNameFields = (
  record1: Record<string, unknown>,
  record2: Record<string, unknown>
): { 
  first: { firstName: string; middleName: string; lastName: string; fullName: string; },
  second: { firstName: string; middleName: string; lastName: string; fullName: string; } 
} => {
  const first = {
    firstName: getNameField(record1, 'firstName', ''),
    middleName: getNameField(record1, 'middleName', ''),
    lastName: getNameField(record1, 'lastName', ''),
    fullName: getFullName(record1, 'firstMiddleLast')
  };
  
  const second = {
    firstName: getNameField(record2, 'firstName', ''),
    middleName: getNameField(record2, 'middleName', ''),
    lastName: getNameField(record2, 'lastName', ''),
    fullName: getFullName(record2, 'firstMiddleLast')
  };
  
  return { first, second };
};

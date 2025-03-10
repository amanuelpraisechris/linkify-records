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

// Enhanced helper to get name fields correctly with improved priority handling
export const getNameField = (record: Record<string, any>, field: 'firstName' | 'lastName' | 'middleName', defaultValue = '-'): string => {
  // Direct exact property check with highest priority
  if (field === 'firstName') {
    // Exact matches with highest priority
    if (record.FirstName !== undefined) return String(record.FirstName);
    if (record.firstName !== undefined) return String(record.firstName);
    
    // Check specific quoted formats
    if (record["FirstName"] !== undefined) return String(record["FirstName"]);
    if (record["firstName"] !== undefined) return String(record["firstName"]);
    if (record["\"FirstName\""] !== undefined) return String(record["\"FirstName\""]).replace(/"/g, '');
    if (record["\"firstName\""] !== undefined) return String(record["\"firstName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.first_name !== undefined) return String(record.first_name);
    if (record["first_name"] !== undefined) return String(record["first_name"]);
    if (record["\"first_name\""] !== undefined) return String(record["\"first_name\""]).replace(/"/g, '');
    
    // Special case for common alternate name field
    if (record.name !== undefined && !nonPatientNameFields.some(field => field.toLowerCase().includes('name'))) {
      return String(record.name);
    }
    
    // Case-insensitive check for first name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "firstname" || lcKey === "first_name") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('first') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
  }
  
  if (field === 'lastName') {
    // Exact matches with highest priority
    if (record.LastName !== undefined) return String(record.LastName);
    if (record.lastName !== undefined) return String(record.lastName);
    
    // Check specific quoted formats
    if (record["LastName"] !== undefined) return String(record["LastName"]);
    if (record["lastName"] !== undefined) return String(record["lastName"]);
    if (record["\"LastName\""] !== undefined) return String(record["\"LastName\""]).replace(/"/g, '');
    if (record["\"lastName\""] !== undefined) return String(record["\"lastName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.last_name !== undefined) return String(record.last_name);
    if (record["last_name"] !== undefined) return String(record["last_name"]);
    if (record["\"last_name\""] !== undefined) return String(record["\"last_name\""]).replace(/"/g, '');
    
    // Check surname variants
    if (record.surname !== undefined) return String(record.surname);
    if (record["surname"] !== undefined) return String(record["surname"]);
    if (record["\"surname\""] !== undefined) return String(record["\"surname\""]).replace(/"/g, '');
    
    // Case-insensitive check for last name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "lastname" || lcKey === "last_name" || lcKey === "surname") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('last') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
  }
  
  if (field === 'middleName') {
    // Exact matches with highest priority
    if (record.MiddleName !== undefined) return String(record.MiddleName);
    if (record.middleName !== undefined) return String(record.middleName);
    
    // Check specific quoted formats
    if (record["MiddleName"] !== undefined) return String(record["MiddleName"]);
    if (record["middleName"] !== undefined) return String(record["middleName"]);
    if (record["\"MiddleName\""] !== undefined) return String(record["\"MiddleName\""]).replace(/"/g, '');
    if (record["\"middleName\""] !== undefined) return String(record["\"middleName\""]).replace(/"/g, '');
    
    // Standard naming conventions
    if (record.middle_name !== undefined) return String(record.middle_name);
    if (record["middle_name"] !== undefined) return String(record["middle_name"]);
    if (record["\"middle_name\""] !== undefined) return String(record["\"middle_name\""]).replace(/"/g, '');
    
    // Case-insensitive check for middle name variants
    for (const key in record) {
      const lcKey = key.toLowerCase();
      if ((lcKey === "middlename" || lcKey === "middle_name") && 
          !nonPatientNameFields.some(field => field.toLowerCase() === lcKey) &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
    
    // Scan for other matching fields but explicitly exclude non-patient name fields
    for (const key in record) {
      if (nonPatientNameFields.some(field => 
          field.toLowerCase() === key.toLowerCase() || 
          field.replace(/"/g, '') === key)) continue;
      
      const lcKey = key.toLowerCase();
      if ((lcKey.includes('middle') && lcKey.includes('name')) &&
          !lcKey.includes('cell') &&
          !lcKey.includes('leader') &&
          !lcKey.includes('oldest') &&
          !lcKey.includes('balozi') &&
          !lcKey.includes('household') &&
          !lcKey.includes('member') &&
          typeof record[key] === 'string') {
        return String(record[key]);
      }
    }
  }
  
  return defaultValue;
};

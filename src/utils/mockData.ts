
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

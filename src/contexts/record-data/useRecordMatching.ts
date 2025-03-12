
import { Record } from '@/types';
import { calculateMatchScore } from '@/utils/matching';
import { findProbabilisticMatches } from '@/utils/probabilisticMatching';
import { useMatchingConfig } from '../MatchingConfigContext';

export const useRecordMatching = () => {
  const { config } = useMatchingConfig();

  const findMatchesForRecord = (
    sourceRecord: Record, 
    communityRecords: Record[],
    importedRecords: Record[],
    allRecords: Record[]
  ) => {
    try {
      console.log(`Finding matches for record:`, JSON.stringify(sourceRecord, null, 2));
      console.log(`Total records: ${allRecords.length}`);
      console.log(`Community records: ${communityRecords.length}`);
      console.log(`Imported records: ${importedRecords.length}`);
      
      let searchPool = communityRecords.length > 0 ? [...communityRecords] : [];
      
      if (searchPool.length === 0 && importedRecords.length > 0) {
        console.log('No community records found, using imported records as search pool');
        searchPool = [...importedRecords];
      }
      
      if (searchPool.length === 0) {
        console.log('No community or imported records, using all records as search pool');
        searchPool = allRecords.filter(record => record.id !== sourceRecord.id);
      }
      
      console.log(`Searching for matches in ${searchPool.length} records`);
      
      if (searchPool.length === 0) {
        console.log('No records available to search in. Make sure to import HDSS community database.');
        return [];
      }
      
      try {
        const lowThreshold = 10;
        const matches = findProbabilisticMatches(sourceRecord, searchPool, lowThreshold);
        
        console.log(`Found ${matches.length} probabilistic matches`);
        
        const enrichedMatches = matches.map(match => {
          const householdMembers = match.record.householdMembers || [];
          return {
            ...match,
            record: {
              ...match.record,
              householdMembers
            }
          };
        });
        
        const allMatches = enrichedMatches.map(match => ({
          score: match.score,
          matchedOn: match.matchedOn,
          fieldScores: match.fieldScores,
          recordInfo: {
            id: match.record.id,
            firstName: match.record.firstName,
            lastName: match.record.lastName,
            birthDate: match.record.birthDate,
            village: match.record.village
          }
        }));
        
        console.log('All potential matches:', JSON.stringify(allMatches, null, 2));
        
        if (enrichedMatches.length > 0) {
          return enrichedMatches.sort((a, b) => b.score - a.score);
        }
      } catch (error) {
        console.error("Error in probabilistic matching:", error);
      }
      
      try {
        const matches = searchPool
          .map(record => {
            const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
            return { 
              record: {
                ...record, 
                householdMembers: record.householdMembers || []
              }, 
              score, 
              matchedOn 
            };
          })
          .filter(match => match.score > 0)
          .sort((a, b) => b.score - a.score);
        
        console.log(`Found ${matches.length} deterministic matches`);
        console.log('Deterministic match scores:', 
          matches.slice(0, 10).map(m => ({ 
            score: m.score, 
            name: `${m.record.firstName} ${m.record.lastName}` 
          }))
        );
        
        return matches;
      } catch (error) {
        console.error("Error in deterministic matching:", error);
        return [];
      }
    } catch (error) {
      console.error("Error in findMatchesForRecord:", error);
      return [];
    }
  };

  return { findMatchesForRecord };
};

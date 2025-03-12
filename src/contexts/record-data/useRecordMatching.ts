
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
      console.log(`Using algorithm type: ${config.algorithmType}`);
      
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

      // Use probabilistic matching if selected in config
      if (config.algorithmType === 'probabilistic') {
        try {
          // Use threshold from config or fallback to reasonable default
          const minThreshold = config.threshold.low || 10;
          console.log(`Using probabilistic matching with minimum threshold: ${minThreshold}`);
          
          const matches = findProbabilisticMatches(sourceRecord, searchPool, minThreshold);
          
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
          
          if (enrichedMatches.length > 0) {
            console.log(`Returning ${enrichedMatches.length} probabilistic matches`);
            return enrichedMatches.sort((a, b) => b.score - a.score);
          } else {
            console.log('No probabilistic matches found above threshold, falling back to deterministic matching');
          }
        } catch (error) {
          console.error("Error in probabilistic matching:", error);
          console.log('Falling back to deterministic matching due to error');
        }
      }
      
      // Default to deterministic matching if probabilistic is not selected or found no results
      try {
        console.log('Using deterministic matching');
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


import { Record } from '@/types';
import { calculateMatchScore } from '@/utils/matching';
import { findProbabilisticMatches } from '@/utils/matching/probabilistic';
import { useMatchingConfig } from '../MatchingConfigContext';

export const useRecordMatching = () => {
  const { config } = useMatchingConfig();

  const findMatchesForRecord = (
    sourceRecord: Record, 
    communityRecords: Record[] = [],
    importedRecords: Record[] = [],
    allRecords: Record[] = []
  ) => {
    try {
      console.log(`Finding matches for record:`, JSON.stringify(sourceRecord, null, 2));
      console.log(`Total records: ${allRecords.length}`);
      console.log(`Community records: ${communityRecords.length}`);
      console.log(`Imported records: ${importedRecords.length}`);
      console.log(`Using algorithm type: ${config.algorithmType}`);
      
      // Prioritize community records first, then imported records, then all records
      let searchPool = [];
      
      if (communityRecords && communityRecords.length > 0) {
        console.log('Using community records as primary search pool');
        searchPool = [...communityRecords];
      } else if (importedRecords && importedRecords.length > 0) {
        console.log('No community records found, using imported records as search pool');
        searchPool = [...importedRecords];
      } else if (allRecords && allRecords.length > 0) {
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
          console.log('Probabilistic match scores:', 
            matches.slice(0, 5).map(m => ({ 
              score: m.score, 
              name: `${m.record.firstName} ${m.record.lastName}`,
              matchedOn: m.matchedOn
            }))
          );
          
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
            // Limit to top 20 matches as per Fellegi-Sunter specification
            const sortedMatches = enrichedMatches.sort((a, b) => b.score - a.score);
            const top20Matches = sortedMatches.slice(0, 20);
            console.log(`Returning top ${Math.min(enrichedMatches.length, 20)} probabilistic matches out of ${enrichedMatches.length} total`);
            return top20Matches;
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
            const { score, matchedOn, fieldScores } = calculateMatchScore(sourceRecord, record, config);
            return { 
              record: {
                ...record, 
                householdMembers: record.householdMembers || []
              }, 
              score, 
              matchedOn,
              fieldScores 
            };
          })
          .filter(match => match.score > config.threshold.low)
          .sort((a, b) => b.score - a.score);
        
        console.log(`Found ${matches.length} deterministic matches`);
        console.log('Deterministic match scores:',
          matches.slice(0, 5).map(m => ({
            score: m.score,
            name: `${m.record.firstName} ${m.record.lastName}`,
            matchedOn: m.matchedOn
          }))
        );

        // Limit to top 20 matches as per Fellegi-Sunter specification
        const top20Matches = matches.slice(0, 20);
        console.log(`Returning top ${Math.min(matches.length, 20)} deterministic matches out of ${matches.length} total`);

        return top20Matches;
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

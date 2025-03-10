
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Record, MatchResult, Visit } from '@/types';
import { calculateMatchScore } from '@/utils/matchingAlgorithms';
import { findProbabilisticMatches } from '@/utils/probabilisticMatching';
import { useMatchingConfig } from './MatchingConfigContext';

interface RecordDataContextType {
  records: Record[];
  communityRecords: Record[];
  clinicRecords: Record[];
  importedRecords: Record[];
  addRecord: (record: Record, recordType?: 'clinic' | 'community') => void;
  addImportedRecords: (records: Record[], isMainCommunityData?: boolean) => void;
  findMatchesForRecord: (record: Record) => Array<{record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number}}>;
  clearImportedRecords: () => void;
  saveMatchResult: (result: MatchResult) => void;
  matchResults: MatchResult[];
  addVisitToRecord: (recordId: string, visit: Visit) => void;
  saveMatchNotes: (recordId: string, notes: string) => void;
}

const RecordDataContext = createContext<RecordDataContextType | undefined>(undefined);

export const useRecordData = () => {
  const context = useContext(RecordDataContext);
  if (!context) {
    throw new Error('useRecordData must be used within a RecordDataProvider');
  }
  return context;
};

interface RecordDataProviderProps {
  children: ReactNode;
  initialRecords?: Record[];
}

export const RecordDataProvider: React.FC<RecordDataProviderProps> = ({ 
  children, 
  initialRecords = [] 
}) => {
  const [records, setRecords] = useState<Record[]>(initialRecords);
  const [communityRecords, setCommunityRecords] = useState<Record[]>([]);
  const [clinicRecords, setClinicRecords] = useState<Record[]>(initialRecords);
  const [importedRecords, setImportedRecords] = useState<Record[]>([]);
  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [matchNotes, setMatchNotes] = useState<Record<string, string>>({});
  const { config } = useMatchingConfig();

  const addRecord = (record: Record, recordType: 'clinic' | 'community' = 'clinic') => {
    // Add to general records
    setRecords(prevRecords => [...prevRecords, record]);
    
    // Add to specific record type collection
    if (recordType === 'clinic') {
      setClinicRecords(prevRecords => [...prevRecords, record]);
    } else {
      setCommunityRecords(prevRecords => [...prevRecords, record]);
    }
  };

  const addImportedRecords = (newRecords: Record[], isMainCommunityData: boolean = false) => {
    try {
      if (isMainCommunityData) {
        // Replace community records with new records
        setCommunityRecords(newRecords);
        console.log(`Set ${newRecords.length} records as main community data source (HDSS Database)`);
        console.log('Sample community record:', newRecords.length > 0 ? JSON.stringify(newRecords[0], null, 2) : 'No records');
        
        // Update general records to include new community records
        setRecords(prevRecords => {
          // Filter out old community records (if any way to identify them)
          const nonCommunityRecords = prevRecords.filter(r => 
            r.metadata?.source !== 'Community Database' && 
            r.metadata?.source !== 'HDSS Database'
          );
          return [...nonCommunityRecords, ...newRecords];
        });
      } else {
        // Add to imported records
        setImportedRecords(newRecords);
        console.log(`Added ${newRecords.length} records to imported data`);
      }
    } catch (error) {
      console.error("Error in addImportedRecords:", error);
    }
  };

  const clearImportedRecords = () => {
    setImportedRecords([]);
  };

  const saveMatchResult = (result: MatchResult) => {
    setMatchResults(prev => [...prev, result]);
  };
  
  const saveMatchNotes = (recordId: string, notes: string) => {
    setMatchNotes(prev => ({
      ...prev,
      [recordId]: notes
    }));
    
    // Also update the record with these notes in all collections
    const updateRecordWithNotes = (recordsArray: Record[]) => {
      return recordsArray.map(record => {
        if (record.id === recordId) {
          return {
            ...record,
            metadata: {
              ...record.metadata,
              matchNotes: notes,
              updatedAt: new Date().toISOString()
            }
          };
        }
        return record;
      });
    };
    
    setRecords(updateRecordWithNotes);
    setClinicRecords(updateRecordWithNotes);
    setCommunityRecords(updateRecordWithNotes);
  };
  
  const addVisitToRecord = (recordId: string, visit: Visit) => {
    // Helper function to update a record with a new visit
    const updateRecordWithVisit = (recordsArray: Record[]) => {
      return recordsArray.map(record => {
        if (record.id === recordId) {
          const visits = record.visits || [];
          return {
            ...record,
            visits: [...visits, visit],
            lastVisit: visit.date,
            metadata: {
              ...record.metadata,
              updatedAt: new Date().toISOString()
            }
          };
        }
        return record;
      });
    };
    
    // Update in all collections
    setRecords(updateRecordWithVisit);
    setClinicRecords(updateRecordWithVisit);
  };

  const findMatchesForRecord = (sourceRecord: Record) => {
    try {
      // Debug information about available records
      console.log(`Finding matches for record:`, JSON.stringify(sourceRecord, null, 2));
      console.log(`Total records: ${records.length}`);
      console.log(`Community records: ${communityRecords.length}`);
      console.log(`Clinic records: ${clinicRecords.length}`);
      console.log(`Imported records: ${importedRecords.length}`);
      
      // First search in community records as the primary database
      let searchPool = communityRecords.length > 0 ? [...communityRecords] : [];
      
      // If no community records, fall back to imported records
      if (searchPool.length === 0 && importedRecords.length > 0) {
        console.log('No community records found, using imported records as search pool');
        searchPool = [...importedRecords];
      }
      
      // If still no records to search in, use all available records excluding the source record
      if (searchPool.length === 0) {
        console.log('No community or imported records, using all records as search pool');
        searchPool = records.filter(record => record.id !== sourceRecord.id);
      }
      
      console.log(`Searching for matches in ${searchPool.length} records`);
      
      // If we have no records to search in, return empty results
      if (searchPool.length === 0) {
        console.log('No records available to search in. Make sure to import HDSS community database.');
        return [];
      }
      
      // Try using probabilistic matching first
      console.log('Using probabilistic matching with lower threshold for initial search');
      try {
        // Set a very low threshold to catch all potential matches
        const lowThreshold = 10; // Very low threshold to see any potential matches
        const matches = findProbabilisticMatches(sourceRecord, searchPool, lowThreshold);
        
        console.log(`Found ${matches.length} probabilistic matches`);
        
        // Add household members data to match results
        const enrichedMatches = matches.map(match => {
          // Extract household members from matching record (could be inferred from other records)
          const householdMembers = match.record.householdMembers || [];
          
          return {
            ...match,
            record: {
              ...match.record,
              householdMembers
            }
          };
        });
        
        // Log match details for debugging
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
        
        // If we found any matches at all, even low probability ones, return them
        if (enrichedMatches.length > 0) {
          // Return all matches sorted by score for review, even ones below threshold
          return enrichedMatches.sort((a, b) => b.score - a.score);
        }
      } catch (error) {
        console.error("Error in probabilistic matching:", error);
      }
      
      // Fall back to deterministic matching if probabilistic matching found nothing
      console.log('Probabilistic matching failed or found no matches, trying deterministic matching');
      try {
        const matches = searchPool
          .map(record => {
            const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
            return { 
              record: {
                ...record, 
                // Extract household members (could be inferred in a real implementation)
                householdMembers: record.householdMembers || []
              }, 
              score, 
              matchedOn 
            };
          })
          // Include even very low scores for examination
          .filter(match => match.score > 0)
          .sort((a, b) => b.score - a.score);
        
        console.log(`Found ${matches.length} deterministic matches`);
        console.log('Deterministic match scores:', 
          matches.slice(0, 10).map(m => ({ 
            score: m.score, 
            name: `${m.record.firstName} ${m.record.lastName}` 
          }))
        );
        
        // Return all matches, even low probability ones for debugging
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

  return (
    <RecordDataContext.Provider 
      value={{ 
        records, 
        communityRecords,
        clinicRecords,
        importedRecords, 
        addRecord, 
        addImportedRecords,
        findMatchesForRecord,
        clearImportedRecords,
        saveMatchResult,
        matchResults,
        addVisitToRecord,
        saveMatchNotes
      }}
    >
      {children}
    </RecordDataContext.Provider>
  );
};

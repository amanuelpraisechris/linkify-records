
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Record, MatchResult } from '@/types';
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

  const findMatchesForRecord = (sourceRecord: Record) => {
    try {
      // Debug information about available records
      console.log(`Total records: ${records.length}`);
      console.log(`Community records: ${communityRecords.length}`);
      console.log(`Clinic records: ${clinicRecords.length}`);
      console.log(`Imported records: ${importedRecords.length}`);
      
      // Use community records as the main database to search in
      const searchPool = communityRecords.length > 0 
        ? communityRecords 
        : [...records, ...importedRecords].filter(record => record.id !== sourceRecord.id);
      
      console.log(`Searching for matches in ${searchPool.length} records`);
      console.log('Search source record:', JSON.stringify(sourceRecord, null, 2));
      
      // If we have no records to search in, return empty results
      if (searchPool.length === 0) {
        console.log('No records available to search in. Make sure to import HDSS community database.');
        return [];
      }
      
      // Use probabilistic matching with community records
      if (communityRecords.length > 0) {
        console.log('Using probabilistic matching algorithm with threshold:', config.threshold.low);
        
        try {
          // Set a very low threshold to catch all potential matches
          const lowThreshold = 10; // Very low threshold to see any potential matches
          const matches = findProbabilisticMatches(sourceRecord, searchPool, lowThreshold);
          
          console.log(`Found ${matches.length} probabilistic matches`);
          
          // Log match details for the top 3 matches or all if fewer
          const topMatches = matches.slice(0, Math.min(3, matches.length));
          topMatches.forEach((match, index) => {
            console.log(`Match ${index + 1}:`, {
              score: match.score,
              matchedOn: match.matchedOn,
              fieldScores: match.fieldScores,
              record: {
                id: match.record.id,
                firstName: match.record.firstName,
                lastName: match.record.lastName,
                birthDate: match.record.birthDate,
                village: match.record.village
              }
            });
          });
          
          // Return matches that meet our threshold
          return matches.filter(match => match.score >= config.threshold.low);
        } catch (error) {
          console.error("Error in probabilistic matching:", error);
          return [];
        }
      } else {
        // Fall back to existing algorithm if no community records
        console.log('Using fallback deterministic matching algorithm');
        try {
          const matches = searchPool
            .map(record => {
              const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
              return { record, score, matchedOn };
            })
            .filter(match => match.score >= config.threshold.low)
            .sort((a, b) => b.score - a.score);
          
          console.log(`Found ${matches.length} deterministic matches`);
          return matches;
        } catch (error) {
          console.error("Error in deterministic matching:", error);
          return [];
        }
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
        matchResults
      }}
    >
      {children}
    </RecordDataContext.Provider>
  );
};

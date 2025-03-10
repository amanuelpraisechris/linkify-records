
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
    if (isMainCommunityData) {
      // Replace community records with new records
      setCommunityRecords(newRecords);
      // Update general records to include new community records
      setRecords(prevRecords => {
        // Filter out old community records (if any way to identify them)
        const nonCommunityRecords = prevRecords.filter(r => 
          r.metadata?.source !== 'Community Database' && 
          r.metadata?.source !== 'HDSS Database'
        );
        return [...nonCommunityRecords, ...newRecords];
      });
      console.log(`Set ${newRecords.length} records as main community data source`);
    } else {
      // Add to imported records
      setImportedRecords(newRecords);
      console.log(`Added ${newRecords.length} records to imported data`);
    }
  };

  const clearImportedRecords = () => {
    setImportedRecords([]);
  };

  const saveMatchResult = (result: MatchResult) => {
    setMatchResults(prev => [...prev, result]);
  };

  const findMatchesForRecord = (sourceRecord: Record) => {
    // Use community records as the main database to search in
    // If no community records, fall back to all records plus imported records
    const searchPool = communityRecords.length > 0 
      ? communityRecords 
      : [...records, ...importedRecords].filter(record => record.id !== sourceRecord.id);
    
    console.log(`Searching for matches in ${searchPool.length} records`);
    
    // Use probabilistic matching if community records exist
    if (communityRecords.length > 0) {
      return findProbabilisticMatches(sourceRecord, searchPool, config.threshold.low)
        .map(match => ({
          record: match.record,
          score: match.score,
          matchedOn: match.matchedOn,
          fieldScores: match.fieldScores
        }));
    } else {
      // Fall back to existing algorithm if no community records
      return searchPool
        .map(record => {
          const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
          return { record, score, matchedOn };
        })
        .filter(match => match.score >= config.threshold.low)
        .sort((a, b) => b.score - a.score);
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

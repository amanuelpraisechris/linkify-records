import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Record, MatchResult, Visit } from '@/types';
import { calculateMatchScore } from '@/utils/matchingAlgorithms';
import { findProbabilisticMatches } from '@/utils/probabilisticMatching';
import { useMatchingConfig } from './MatchingConfigContext';

const STORAGE_KEYS = {
  COMMUNITY_RECORDS: 'community_records',
  IMPORTED_RECORDS: 'imported_records',
  CLINIC_RECORDS: 'clinic_records',
  MATCH_RESULTS: 'match_results'
};

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
  const getInitialState = <T extends unknown>(key: string, defaultValue: T): T => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        return JSON.parse(saved) as T;
      }
    } catch (err) {
      console.error(`Error retrieving ${key} from localStorage:`, err);
    }
    return defaultValue;
  };

  const [records, setRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.CLINIC_RECORDS, initialRecords));
  const [communityRecords, setCommunityRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.COMMUNITY_RECORDS, []));
  const [clinicRecords, setClinicRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.CLINIC_RECORDS, initialRecords));
  const [importedRecords, setImportedRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.IMPORTED_RECORDS, []));
  const [matchResults, setMatchResults] = useState<MatchResult[]>(getInitialState(STORAGE_KEYS.MATCH_RESULTS, []));
  const [matchNotes, setMatchNotes] = useState<{[key: string]: string}>({});
  const { config } = useMatchingConfig();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COMMUNITY_RECORDS, JSON.stringify(communityRecords));
      console.log(`Saved ${communityRecords.length} community records to localStorage`);
    } catch (err) {
      console.error('Error saving community records to localStorage:', err);
    }
  }, [communityRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.IMPORTED_RECORDS, JSON.stringify(importedRecords));
    } catch (err) {
      console.error('Error saving imported records to localStorage:', err);
    }
  }, [importedRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLINIC_RECORDS, JSON.stringify(clinicRecords));
    } catch (err) {
      console.error('Error saving clinic records to localStorage:', err);
    }
  }, [clinicRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MATCH_RESULTS, JSON.stringify(matchResults));
    } catch (err) {
      console.error('Error saving match results to localStorage:', err);
    }
  }, [matchResults]);

  const addRecord = (record: Record, recordType: 'clinic' | 'community' = 'clinic') => {
    setRecords(prevRecords => [...prevRecords, record]);
    
    if (recordType === 'clinic') {
      setClinicRecords(prevRecords => [...prevRecords, record]);
    } else {
      setCommunityRecords(prevRecords => [...prevRecords, record]);
    }
  };

  const addImportedRecords = (newRecords: Record[], isMainCommunityData: boolean = false) => {
    try {
      if (isMainCommunityData) {
        setCommunityRecords(newRecords);
        console.log(`Set ${newRecords.length} records as main community data source (HDSS Database)`);
        console.log('Sample community record:', newRecords.length > 0 ? JSON.stringify(newRecords[0], null, 2) : 'No records');
        
        setRecords(prevRecords => {
          const nonCommunityRecords = prevRecords.filter(r => 
            r.metadata?.source !== 'Community Database' && 
            r.metadata?.source !== 'HDSS Database'
          );
          return [...nonCommunityRecords, ...newRecords];
        });

        try {
          localStorage.setItem(STORAGE_KEYS.COMMUNITY_RECORDS, JSON.stringify(newRecords));
          console.log(`Immediately saved ${newRecords.length} community records to localStorage`);
        } catch (err) {
          console.error('Error immediately saving community records to localStorage:', err);
        }
      } else {
        setImportedRecords(newRecords);
        console.log(`Added ${newRecords.length} records to imported data`);
        
        try {
          localStorage.setItem(STORAGE_KEYS.IMPORTED_RECORDS, JSON.stringify(newRecords));
        } catch (err) {
          console.error('Error immediately saving imported records to localStorage:', err);
        }
      }
    } catch (error) {
      console.error("Error in addImportedRecords:", error);
    }
  };

  const clearImportedRecords = () => {
    setImportedRecords([]);
    setCommunityRecords([]);
    localStorage.removeItem(STORAGE_KEYS.IMPORTED_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.COMMUNITY_RECORDS);
    console.log('Cleared all imported records from state and localStorage');
  };

  const saveMatchResult = (result: MatchResult) => {
    const enrichedResult = {
      ...result,
      consentObtained: true,
      consentDate: result.consentDate || new Date().toISOString()
    };
    
    setMatchResults(prev => [...prev, enrichedResult]);
    
    if (result.matchId && result.notes) {
      saveMatchNotes(result.matchId, result.notes);
    }
    
    if (result.sourceId && result.notes) {
      saveMatchNotes(result.sourceId, result.notes);
    }
    
    console.log('Match result saved:', enrichedResult);
  };
  
  const saveMatchNotes = (recordId: string, notes: string) => {
    setMatchNotes(prev => ({
      ...prev,
      [recordId]: notes
    }));
    
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
    
    console.log(`Saved notes for record ${recordId}: ${notes.substring(0, 30)}...`);
  };
  
  const addVisitToRecord = (recordId: string, visit: Visit) => {
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
    
    setRecords(updateRecordWithVisit);
    setClinicRecords(updateRecordWithVisit);
  };

  const findMatchesForRecord = (sourceRecord: Record) => {
    try {
      console.log(`Finding matches for record:`, JSON.stringify(sourceRecord, null, 2));
      console.log(`Total records: ${records.length}`);
      console.log(`Community records: ${communityRecords.length}`);
      console.log(`Clinic records: ${clinicRecords.length}`);
      console.log(`Imported records: ${importedRecords.length}`);
      
      let searchPool = communityRecords.length > 0 ? [...communityRecords] : [];
      
      if (searchPool.length === 0 && importedRecords.length > 0) {
        console.log('No community records found, using imported records as search pool');
        searchPool = [...importedRecords];
      }
      
      if (searchPool.length === 0) {
        console.log('No community or imported records, using all records as search pool');
        searchPool = records.filter(record => record.id !== sourceRecord.id);
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


import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Record, MatchResult, Visit } from '@/types';
import { RecordDataContextType, STORAGE_KEYS } from './recordDataTypes';
import { getInitialState, updateRecordWithVisit, updateRecordWithNotes } from './recordDataUtils';
import { useRecordMatching } from './useRecordMatching';

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
  const [records, setRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.CLINIC_RECORDS, initialRecords));
  const [communityRecords, setCommunityRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.COMMUNITY_RECORDS, []));
  const [clinicRecords, setClinicRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.CLINIC_RECORDS, initialRecords));
  const [importedRecords, setImportedRecords] = useState<Record[]>(getInitialState(STORAGE_KEYS.IMPORTED_RECORDS, []));
  const [matchResults, setMatchResults] = useState<MatchResult[]>(getInitialState(STORAGE_KEYS.MATCH_RESULTS, []));
  const [matchNotes, setMatchNotes] = useState<{[key: string]: string}>({});
  
  const { findMatchesForRecord: findMatches } = useRecordMatching();

  // Save to localStorage when records change
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
    
    setRecords(prevRecords => updateRecordWithNotes(prevRecords, recordId, notes));
    setClinicRecords(prevRecords => updateRecordWithNotes(prevRecords, recordId, notes));
    setCommunityRecords(prevRecords => updateRecordWithNotes(prevRecords, recordId, notes));
    
    console.log(`Saved notes for record ${recordId}: ${notes.substring(0, 30)}...`);
  };
  
  const addVisitToRecord = (recordId: string, visit: Visit) => {
    setRecords(prevRecords => updateRecordWithVisit(prevRecords, recordId, visit));
    setClinicRecords(prevRecords => updateRecordWithVisit(prevRecords, recordId, visit));
  };

  const findMatchesForRecord = (sourceRecord: Record) => {
    return findMatches(sourceRecord, communityRecords, importedRecords, records);
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

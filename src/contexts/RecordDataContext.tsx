
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Record } from '@/types';
import { calculateMatchScore } from '@/utils/matchingAlgorithms';
import { useMatchingConfig } from './MatchingConfigContext';

interface RecordDataContextType {
  records: Record[];
  importedRecords: Record[];
  addRecord: (record: Record) => void;
  addImportedRecords: (records: Record[]) => void;
  findMatchesForRecord: (record: Record) => Array<{record: Record; score: number; matchedOn: string[]}>;
  clearImportedRecords: () => void;
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
  const [importedRecords, setImportedRecords] = useState<Record[]>([]);
  const { config } = useMatchingConfig();

  const addRecord = (record: Record) => {
    setRecords(prevRecords => [...prevRecords, record]);
  };

  const addImportedRecords = (newRecords: Record[]) => {
    setImportedRecords(newRecords);
  };

  const clearImportedRecords = () => {
    setImportedRecords([]);
  };

  const findMatchesForRecord = (sourceRecord: Record) => {
    const allRecordsToSearch = [...records, ...importedRecords];
    
    return allRecordsToSearch
      .filter(record => record.id !== sourceRecord.id)  // Don't match with self
      .map(record => {
        const { score, matchedOn } = calculateMatchScore(sourceRecord, record, config);
        return { record, score, matchedOn };
      })
      .filter(match => match.score >= config.threshold.low)
      .sort((a, b) => b.score - a.score);
  };

  return (
    <RecordDataContext.Provider 
      value={{ 
        records, 
        importedRecords, 
        addRecord, 
        addImportedRecords,
        findMatchesForRecord,
        clearImportedRecords
      }}
    >
      {children}
    </RecordDataContext.Provider>
  );
};

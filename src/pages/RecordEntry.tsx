
import { RecordDataProvider } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import RecordEntryContent from '@/components/record-entry/RecordEntryContent';
import { Record } from '@/types';
import { useState, useEffect } from 'react';

const RecordEntry = () => {
  const [initialRecords, setInitialRecords] = useState<Record[]>([]);
  
  // Load any existing records from localStorage on component mount
  useEffect(() => {
    try {
      const savedRecords = localStorage.getItem('clinic_records');
      if (savedRecords) {
        const parsedRecords = JSON.parse(savedRecords);
        setInitialRecords(parsedRecords);
      }
    } catch (error) {
      console.error('Error loading saved records:', error);
    }
  }, []);

  return (
    <MatchingConfigProvider>
      <RecordDataProvider initialRecords={initialRecords}>
        <RecordEntryContent />
      </RecordDataProvider>
    </MatchingConfigProvider>
  );
};

export default RecordEntry;

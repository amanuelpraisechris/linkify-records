
import { RecordDataProvider } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import RecordEntryContent from '@/components/record-entry/RecordEntryContent';
import { Record } from '@/types';
import { useState, useEffect } from 'react';
import RecordEntryHeader from '@/components/record-entry/RecordEntryHeader';

const RecordEntry = () => {
  const [initialRecords, setInitialRecords] = useState<Record[]>([]);
  
  // Load any existing records from localStorage on component mount
  useEffect(() => {
    try {
      // Load clinic records
      const savedRecords = localStorage.getItem('clinic_records');
      if (savedRecords) {
        const parsedRecords = JSON.parse(savedRecords);
        setInitialRecords(parsedRecords);
      }
      
      // Create search attempts array if it doesn't exist
      if (!localStorage.getItem('searchAttempts')) {
        localStorage.setItem('searchAttempts', JSON.stringify([]));
      }
      
      // Create failed linkages array if it doesn't exist
      if (!localStorage.getItem('failedLinkages')) {
        localStorage.setItem('failedLinkages', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading saved records:', error);
    }
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <RecordEntryHeader />
      
      <MatchingConfigProvider>
        <RecordDataProvider initialRecords={initialRecords}>
          <RecordEntryContent />
        </RecordDataProvider>
      </MatchingConfigProvider>
    </div>
  );
};

export default RecordEntry;

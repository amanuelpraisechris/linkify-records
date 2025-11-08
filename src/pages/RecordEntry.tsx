import { RecordDataProvider } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import SimplifiedRecordEntry from '@/components/SimplifiedRecordEntry';
import { Record } from '@/types';
import { useState, useEffect } from 'react';
import { GOLD_STANDARD_CONFIG } from '@/utils/matchingConfigDefaults';

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
    <MatchingConfigProvider initialConfig={GOLD_STANDARD_CONFIG}>
      <RecordDataProvider initialRecords={initialRecords}>
        <SimplifiedRecordEntry />
      </RecordDataProvider>
    </MatchingConfigProvider>
  );
};

export default RecordEntry;

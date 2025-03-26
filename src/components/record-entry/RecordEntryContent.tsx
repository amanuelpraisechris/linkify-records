
import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import RecordEntryTabs from './RecordEntryTabs';
import { useMatchesState } from '@/hooks/useMatchesState';

interface RecordEntryContentProps {
  onRecordCreated?: () => void;
}

const RecordEntryContent = ({ onRecordCreated }: RecordEntryContentProps) => {
  const { records, matchResults } = useRecordData();
  const { toast } = useToast();
  
  const {
    potentialMatches,
    submittedRecord,
    activeTab,
    setActiveTab,
    handleRecordSubmit,
    handleSaveForSearch,
    handleMatchComplete
  } = useMatchesState();

  const handleSubmit = () => {
    if (records) {
      console.log('Record Data:', records);
      toast({
        title: "Success!",
        description: "Record submitted successfully.",
      })
      if (onRecordCreated) {
        onRecordCreated();
      }
    } else {
      console.error('No record data to submit.');
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Failed to submit record.",
      })
    }
  };

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Enter New Record
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Fill in the details below to search for and link patient records.
        </p>
      </div>

      {!records && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please fill out the form to search for existing records.
          </AlertDescription>
        </Alert>
      )}

      <RecordEntryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        clinicRecords={records || []}
        communityRecords={[]}
        submittedRecord={submittedRecord}
        potentialMatches={potentialMatches}
        matchResults={matchResults || []}
        onRecordSubmit={handleRecordSubmit}
        onSaveForSearch={handleSaveForSearch}
        onMatchComplete={handleMatchComplete}
      />
    </div>
  );
};

export default RecordEntryContent;


import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Shield } from 'lucide-react';
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
    consentData,
    handleConsentComplete,
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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-blue-600" />
          Patient Record Linkage
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Secure patient consent and record matching system
        </p>
      </div>

      {activeTab === 'consent' && (
        <Alert className="mb-6 bg-blue-50 border-blue-300 dark:bg-blue-950/20">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 dark:text-blue-300">
            <strong>Step 1:</strong> Patient consent must be obtained before collecting any personal data.
          </AlertDescription>
        </Alert>
      )}

      {activeTab === 'entry' && !consentData?.consentGiven && (
        <Alert variant="destructive" className="mb-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            Please obtain patient consent first before entering record data.
          </AlertDescription>
        </Alert>
      )}

      {consentData?.consentGiven && activeTab === 'entry' && (
        <Alert className="mb-6 bg-green-50 border-green-300 dark:bg-green-950/20">
          <Info className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700 dark:text-green-300">
            <strong>Consent Confirmed:</strong> {consentData.consentType} consent obtained on {new Date(consentData.consentDate).toLocaleDateString()}
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
        consentData={consentData}
        onConsentComplete={handleConsentComplete}
      />
    </div>
  );
};

export default RecordEntryContent;

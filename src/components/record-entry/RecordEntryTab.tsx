
import { useState } from 'react';
import { Record } from '@/types';
import RecordEntryForm from '@/components/RecordEntryForm';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface RecordEntryTabProps {
  clinicRecords: Record[];
  communityRecords: Record[];
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch: (record: Record) => void;
  consentData?: {
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  };
}

const RecordEntryTab = ({
  clinicRecords,
  communityRecords,
  onRecordSubmit,
  onSaveForSearch,
  consentData
}: RecordEntryTabProps) => {
  if (!consentData?.consentGiven) {
    return (
      <Alert variant="destructive" className="mb-6">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Please obtain patient consent first before entering record data. Go back to the Consent tab to complete this step.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <Alert className="bg-green-50 border-green-300 dark:bg-green-950/20">
        <Info className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-700 dark:text-green-300">
          <strong>Consent Confirmed:</strong> {consentData.consentType} consent obtained on {new Date(consentData.consentDate).toLocaleDateString()}
        </AlertDescription>
      </Alert>

      <RecordEntryForm
        onRecordSubmit={onRecordSubmit}
        onSaveForSearch={onSaveForSearch}
      />
    </div>
  );
};

export default RecordEntryTab;

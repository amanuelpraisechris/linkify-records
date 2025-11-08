/**
 * Batch Matching Page
 * Automated record matching for large datasets
 */

import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { useMatchingConfig } from '@/contexts/matching-config/MatchingConfigContext';
import { BatchMatchingInterface } from '@/components/batch-matching/BatchMatchingInterface';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function BatchMatching() {
  const { matchingConfig, algorithmType } = useMatchingConfig();
  const [sourceRecords, setSourceRecords] = useState<Record[]>([]);
  const [targetRecords, setTargetRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load records from storage
    const loadRecords = () => {
      try {
        // Load clinic records (source)
        const clinicRecordsStr = localStorage.getItem('clinic_records');
        const clinicRecords = clinicRecordsStr ? JSON.parse(clinicRecordsStr) : [];

        // Load community records (target)
        const communityRecordsStr = localStorage.getItem('community_records');
        const communityRecords = communityRecordsStr ? JSON.parse(communityRecordsStr) : [];

        setSourceRecords(clinicRecords);
        setTargetRecords(communityRecords);
      } catch (error) {
        console.error('Error loading records:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading records...</p>
        </div>
      </div>
    );
  }

  if (sourceRecords.length === 0 || targetRecords.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Batch Matching</h1>
          <p className="text-muted-foreground mt-2">
            Automated record matching for large datasets
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {sourceRecords.length === 0 && targetRecords.length === 0 ? (
              <>
                No records available for matching. Please load both clinic records (source) and
                community records (target) from the Data Management page.
              </>
            ) : sourceRecords.length === 0 ? (
              <>
                No clinic records (source) available. Please load clinic records from the Data
                Management page.
              </>
            ) : (
              <>
                No community records (target) available. Please load community records from the
                Data Management page.
              </>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Batch Matching</h1>
        <p className="text-muted-foreground mt-2">
          Automated record matching for large datasets
        </p>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Dataset Summary</CardTitle>
            <CardDescription>Records available for batch matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Source Records (Clinic)</p>
                <p className="text-2xl font-bold">{sourceRecords.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Records (Community)</p>
                <p className="text-2xl font-bold">{targetRecords.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BatchMatchingInterface
        sourceRecords={sourceRecords}
        targetRecords={targetRecords}
        matchingConfig={matchingConfig}
        algorithmType={algorithmType}
        onComplete={(summary) => {
          console.log('Batch matching completed:', summary);
          // You can add navigation to results or show a success message
        }}
      />
    </div>
  );
}

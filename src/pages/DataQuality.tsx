/**
 * Data Quality Page
 * Pre-match data validation and cleaning
 */

import { useState, useEffect } from 'react';
import { Record } from '@/types';
import { DataQualityDashboard } from '@/components/data-quality/DataQualityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function DataQuality() {
  const [clinicRecords, setClinicRecords] = useState<Record[]>([]);
  const [communityRecords, setCommunityRecords] = useState<Record[]>([]);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = () => {
    try {
      const clinicStr = localStorage.getItem('clinic_records');
      const communityStr = localStorage.getItem('community_records');

      if (clinicStr) {
        setClinicRecords(JSON.parse(clinicStr));
      }

      if (communityStr) {
        setCommunityRecords(JSON.parse(communityStr));
      }
    } catch (error) {
      console.error('Error loading records:', error);
    }
  };

  const handleClinicRecordsUpdated = (updatedRecords: Record[]) => {
    setClinicRecords(updatedRecords);
    localStorage.setItem('clinic_records', JSON.stringify(updatedRecords));
  };

  const handleCommunityRecordsUpdated = (updatedRecords: Record[]) => {
    setCommunityRecords(updatedRecords);
    localStorage.setItem('community_records', JSON.stringify(updatedRecords));
  };

  if (clinicRecords.length === 0 && communityRecords.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Data Quality</h1>
          <p className="text-muted-foreground mt-2">
            Validate and clean your data before matching
          </p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No records found. Please load data from the Data Management page first.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Data Quality</h1>
        <p className="text-muted-foreground mt-2">
          Validate and clean your data before matching
        </p>
      </div>

      <Tabs defaultValue="clinic" className="w-full">
        <TabsList>
          <TabsTrigger value="clinic">
            Clinic Records ({clinicRecords.length})
          </TabsTrigger>
          <TabsTrigger value="community">
            Community Records ({communityRecords.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinic" className="mt-6">
          <DataQualityDashboard
            records={clinicRecords}
            useCase="healthcare"
            onRecordsUpdated={handleClinicRecordsUpdated}
          />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <DataQualityDashboard
            records={communityRecords}
            useCase="census"
            onRecordsUpdated={handleCommunityRecordsUpdated}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/**
 * Import Clinic Records Component
 * Upload clinic records (source data) for matching against community database
 */

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataLoader from './DataLoader';
import { Record } from '@/types';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { Building2, Upload, RefreshCw, X, CheckCircle2, FileUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface ImportClinicRecordsProps {
  onDataImport?: (records: Record[]) => void;
}

const ImportClinicRecords = ({ onDataImport }: ImportClinicRecordsProps) => {
  const { clinicRecords, addImportedRecords, clearImportedRecords } = useRecordData();
  const [showDataLoader, setShowDataLoader] = useState(false);
  const { toast } = useToast();

  // Count only clinic records (not manually entered ones)
  const uploadedClinicRecords = clinicRecords.filter(r =>
    r.metadata?.source === 'Clinic Import' ||
    r.metadata?.source === 'Imported Data'
  );

  const handleDataLoaded = (data: Record[]) => {
    if (data.length > 0) {
      // Mark as clinic records
      const markedData = data.map(record => ({
        ...record,
        metadata: {
          ...record.metadata,
          source: 'Clinic Import',
          recordType: 'clinic'
        }
      }));

      // Add as clinic records (not community data)
      addImportedRecords(markedData, false);

      if (onDataImport) {
        onDataImport(markedData);
      }

      setShowDataLoader(false);

      toast({
        title: "Clinic Records Imported",
        description: `${data.length} clinic records imported successfully. Ready for matching.`,
      });
    }
  };

  const handleClearClinicRecords = () => {
    if (!confirm(`Clear ${uploadedClinicRecords.length} imported clinic records?`)) {
      return;
    }

    clearImportedRecords();
    toast({
      title: "Clinic Records Cleared",
      description: "Imported clinic records have been cleared.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <div>
              <CardTitle>Import Clinic Records</CardTitle>
              <CardDescription>
                Upload clinic patient records to match against the community database
              </CardDescription>
            </div>
          </div>

          {uploadedClinicRecords.length > 0 && !showDataLoader && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearClinicRecords}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {uploadedClinicRecords.length > 0 && !showDataLoader ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 dark:bg-green-950 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                <strong>{uploadedClinicRecords.length}</strong> clinic records loaded and ready for matching
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                onClick={() => setShowDataLoader(true)}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Replace with New File
              </Button>

              <Button
                onClick={() => setShowDataLoader(true)}
                variant="outline"
                className="flex-1"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Additional Records
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              These clinic records will be matched against the community database.
              Use the Search page for individual matching or Batch Match for bulk processing.
            </p>
          </div>
        ) : showDataLoader ? (
          <div className="space-y-4">
            <Button
              onClick={() => setShowDataLoader(false)}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>

            <DataLoader
              onDataLoaded={handleDataLoaded}
              dataSource={{
                id: 'clinic-import',
                name: 'Clinic Records',
                recordCount: uploadedClinicRecords.length,
                lastUpdated: new Date().toISOString(),
                type: 'clinic'
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Import clinic patient records from CSV or JSON files.
              These will be used as source records for matching against the community database.
            </p>

            <Button
              onClick={() => setShowDataLoader(true)}
              className="w-full"
              size="lg"
            >
              <FileUp className="w-5 h-5 mr-2" />
              Import Clinic Records
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg text-sm space-y-2">
              <p className="font-medium">Before importing:</p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Ensure the community database is loaded in the Database module</li>
                <li>Prepare your clinic records in CSV or JSON format</li>
                <li>Include key fields: firstName, lastName, birthDate, sex, village</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImportClinicRecords;


import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Record } from '@/types';
import ImportClinicRecords from '@/components/ImportClinicRecords';
import RecordList from '@/components/RecordList';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Building2, Database as DatabaseIcon, AlertCircle, ArrowRight } from 'lucide-react';

const DataManagementContent = () => {
  const {
    clinicRecords,
    communityRecords,
    addRecord
  } = useRecordData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDataImport = (newRecords: Record[]) => {
    console.log(`Imported ${newRecords.length} clinic records`);
  };

  const handleRecordCreation = async (newRecord: Record) => {
    try {
      await addRecord(newRecord);
      toast({
        title: "Record Created",
        description: "A new clinic record has been successfully created.",
      });
    } catch (error) {
      console.error('Error creating record:', error);
      toast({
        title: "Creation Error",
        description: "Failed to create record.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3 flex items-center gap-2">
          <Building2 className="w-8 h-8" />
          Clinic Records Management
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Import and manage clinic patient records (source data) for matching against the community database.
          For database management, visit the Database module.
        </p>
      </div>

      {/* Alert if community database not loaded */}
      {communityRecords.length === 0 && (
        <Alert className="mb-6 border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-200">Community Database Not Loaded</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-300 flex items-center justify-between">
            <span>
              You need to load the community database before matching clinic records.
            </span>
            <Button
              onClick={() => navigate('/database')}
              variant="outline"
              size="sm"
              className="ml-4"
            >
              Go to Database
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Import Clinic Records */}
        <div>
          <ImportClinicRecords onDataImport={handleDataImport} />
        </div>

        {/* Clinic Records List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Clinic Records ({clinicRecords.length})</CardTitle>
              <CardDescription>
                All clinic patient records available for matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-h-[500px] overflow-y-auto">
                <RecordList
                  records={clinicRecords}
                  emptyMessage="No clinic records available. Import patient data to get started."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Clinic Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clinicRecords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for matching</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DatabaseIcon className="w-4 h-4" />
              Community Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{communityRecords.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Target records</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Match Readiness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${clinicRecords.length > 0 && communityRecords.length > 0 ? 'text-green-600' : 'text-yellow-600'}`}>
              {clinicRecords.length > 0 && communityRecords.length > 0 ? 'Ready' : 'Not Ready'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {clinicRecords.length > 0 && communityRecords.length > 0
                ? 'Both datasets loaded'
                : 'Load both datasets to begin'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="footer mt-12 text-center text-muted-foreground">
        <p>Record Linkage Application • Powered by Medical Informatics & Supabase</p>
      </div>
    </div>
  );
};

const DataManagement = () => {
  return (
    <MatchingConfigProvider>
      <RecordDataProvider>
        <DataManagementContent />
      </RecordDataProvider>
    </MatchingConfigProvider>
  );
};

export default DataManagement;

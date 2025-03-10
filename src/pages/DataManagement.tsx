
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import DataLoader from '@/components/DataLoader';
import { Record, DataSource } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Database, FileUp, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RecordDataProvider, useRecordData } from '@/contexts/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const DataManagementContent = () => {
  const { addImportedRecords, communityRecords, importedRecords } = useRecordData();
  const { toast } = useToast();
  
  const handleDataLoaded = (data: Record[], sourceId?: string) => {
    console.log('Data loaded:', data.length, 'records');
    
    // Add to record data context for matching - set as community database
    const isCommunityDb = true; // Always set imported data as community database
    addImportedRecords(data, isCommunityDb);
    
    toast({
      title: "Data Imported Successfully",
      description: `${data.length} records have been imported as the main HDSS community database.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Management</h1>
          <p className="text-lg text-muted-foreground">
            Import external databases for record matching
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-8">
              <div className="flex items-center mb-4">
                <FileUp className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Import HDSS Community Database</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Upload your HDSS community database or health facility records for patient matching.
                The data will be set as the main reference database for finding matches.
              </p>
              
              {communityRecords.length > 0 && (
                <Alert className="mb-6 bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/50">
                  <Users className="h-4 w-4" />
                  <AlertTitle>Community Database Loaded</AlertTitle>
                  <AlertDescription>
                    {communityRecords.length} records have been imported as the main HDSS community database and are ready for matching.
                  </AlertDescription>
                </Alert>
              )}
              
              <DataLoader onDataLoaded={handleDataLoaded} />
            </div>
            
            {communityRecords.length > 0 && (
              <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-8">
                <div className="flex items-center mb-4">
                  <Database className="w-5 h-5 mr-2 text-primary" />
                  <h2 className="text-xl font-semibold">Next Steps</h2>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  Your HDSS community database has been successfully imported with {communityRecords.length} records.
                </p>
                
                <div className="p-4 bg-muted/30 rounded-lg mb-4">
                  <h3 className="font-medium mb-2">What to do next:</h3>
                  <ol className="list-decimal list-inside text-muted-foreground text-sm space-y-2">
                    <li>Go to the <Link to="/record-entry" className="text-primary hover:underline">Search</Link> page</li>
                    <li>Enter patient information to search for in the HDSS database</li>
                    <li>Review potential matches that are found</li>
                  </ol>
                </div>
                
                <Link 
                  to="/record-entry" 
                  className="w-full bg-primary text-white py-2 px-4 rounded-md inline-block text-center hover:bg-primary/90"
                >
                  Go to Search Page
                </Link>
              </div>
            )}
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Data Tips</h2>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Required Fields</h3>
                  <p className="text-muted-foreground">
                    For optimal matching, ensure your data includes at minimum:
                    name, gender, date of birth, and location information.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Data Format</h3>
                  <p className="text-muted-foreground mb-2">
                    CSV files should include headers as the first row. JSON files should contain an array of record objects.
                  </p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {`[
  {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1985-07-15",
    "gender": "Male",
    "village": "Maputo"
  }
]`}
                  </pre>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Matching Process</h3>
                  <p className="text-muted-foreground">
                    The system uses probabilistic matching to identify potential matches based on
                    similarity scores. Fields like names, birth dates, and locations are compared for potential matches.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
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

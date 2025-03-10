
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import RecordEntryForm from '@/components/RecordEntryForm';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordList from '@/components/RecordList';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Mock data to initialize the page with some clinic records
const initialRecords: Record[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    gender: 'Male',
    birthDate: '1985-03-15',
    village: 'Central',
    subVillage: 'Downtown',
    identifiers: [
      { type: 'Health ID', value: 'H12345' }
    ],
    metadata: {
      createdAt: '2023-05-10T09:30:00Z',
      updatedAt: '2023-05-10T09:30:00Z',
      source: 'Clinical Entry'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'Female',
    birthDate: '1990-07-22',
    village: 'Eastern',
    subVillage: 'Riverside',
    identifiers: [
      { type: 'Health ID', value: 'H54321' }
    ],
    metadata: {
      createdAt: '2023-05-11T14:15:00Z',
      updatedAt: '2023-05-11T14:15:00Z',
      source: 'Clinical Entry'
    }
  }
];

const RecordEntryContent = () => {
  const { addRecord, findMatchesForRecord, communityRecords } = useRecordData();
  const [potentialMatches, setPotentialMatches] = useState<Array<{record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number};}>>([]);
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const { toast } = useToast();

  const handleRecordSubmit = (record: Record) => {
    // Add the clinic record
    addRecord(record, 'clinic');
    
    // Find potential matches in the community database
    const matches = findMatchesForRecord(record);
    setPotentialMatches(matches);
    setSubmittedRecord(record);
    
    toast({
      title: "Record Submitted",
      description: `Found ${matches.length} potential matches for this record.`,
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
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Clinic Record Entry</h1>
          <p className="text-lg text-muted-foreground">
            Add new clinic records and match them with the HDSS community database
          </p>
        </div>
        
        {communityRecords.length === 0 && (
          <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900/50">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Community Database Loaded</AlertTitle>
            <AlertDescription>
              Please import a community database to enable probabilistic matching of clinic records.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ImportDataForMatching />
            <RecordEntryForm onRecordSubmit={handleRecordSubmit} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Potential Matches in HDSS Database</h2>
              
              {submittedRecord && potentialMatches.length > 0 ? (
                <RecordList 
                  records={potentialMatches.map(match => ({
                    ...match.record,
                    fuzzyScore: match.score,
                    matchedOn: match.matchedOn,
                    metadata: {
                      ...match.record.metadata,
                      matchScore: match.score
                    }
                  }))} 
                  showMatchDetail={true} 
                />
              ) : submittedRecord ? (
                <div className="text-center py-8 text-muted-foreground">
                  No potential matches found for the submitted record in the HDSS database.
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Submit a clinic record to see potential matches in the HDSS database.
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">Recently Added Clinic Records</h2>
              <RecordList 
                records={initialRecords} 
                showMatchDetail={false} 
                emptyMessage="No clinic records have been added yet."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const RecordEntry = () => {
  return (
    <MatchingConfigProvider>
      <RecordDataProvider initialRecords={initialRecords}>
        <RecordEntryContent />
      </RecordDataProvider>
    </MatchingConfigProvider>
  );
};

export default RecordEntry;

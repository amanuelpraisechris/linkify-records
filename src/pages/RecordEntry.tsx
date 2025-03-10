
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import RecordEntryForm from '@/components/RecordEntryForm';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordList from '@/components/RecordList';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data to initialize the page
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
      source: 'Manual Entry'
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
      source: 'Health Facility'
    }
  }
];

const RecordEntryContent = () => {
  const { addRecord, findMatchesForRecord } = useRecordData();
  const [potentialMatches, setPotentialMatches] = useState<Array<{record: Record; score: number; matchedOn: string[]}>>([]);
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const { toast } = useToast();

  const handleRecordSubmit = (record: Record) => {
    // Find potential matches for the submitted record
    const matches = findMatchesForRecord(record);
    setPotentialMatches(matches);
    setSubmittedRecord(record);
    
    // Add the record to our list
    addRecord(record);
    
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
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Record Entry</h1>
          <p className="text-lg text-muted-foreground">
            Add new records and find potential matches
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <ImportDataForMatching />
            <RecordEntryForm onRecordSubmit={handleRecordSubmit} />
          </div>
          
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Potential Matches</h2>
              
              {submittedRecord && potentialMatches.length > 0 ? (
                <RecordList 
                  records={potentialMatches.map(match => ({
                    ...match.record,
                    fuzzyScore: match.score,
                    metadata: {
                      ...match.record.metadata,
                      matchScore: match.score
                    }
                  }))} 
                  showMatchDetail={true} 
                />
              ) : submittedRecord ? (
                <div className="text-center py-8 text-muted-foreground">
                  No potential matches found for the submitted record.
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Submit a record to see potential matches.
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">All Records</h2>
              <RecordList records={[]} showMatchDetail={false} />
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


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRecordData } from '@/contexts/RecordDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Navbar from '@/components/Navbar';
import { Record, MatchResult } from '@/types';
import RecordEntryTab from './RecordEntryTab';
import MatchesTab from './MatchesTab';
import ProgressReportTab from './ProgressReportTab';

const RecordEntryContent = () => {
  const { 
    addRecord, 
    findMatchesForRecord, 
    communityRecords, 
    clinicRecords, 
    matchResults, 
    saveMatchResult 
  } = useRecordData();
  
  const [potentialMatches, setPotentialMatches] = useState<Array<{
    record: Record; 
    score: number; 
    matchedOn: string[]; 
    fieldScores?: {[key: string]: number};
  }>>([]);
  
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const [activeTab, setActiveTab] = useState('entry');
  const { toast } = useToast();

  const handleRecordSubmit = (record: Record) => {
    try {
      // Add the clinic record
      const recordWithSource = {
        ...record,
        sourceId: record.id, // Keep track of the source record ID for matching
      };
      
      addRecord(recordWithSource, 'clinic');
      
      // Check if community database is loaded
      if (communityRecords.length === 0) {
        setPotentialMatches([]);
        setSubmittedRecord(recordWithSource);
        
        toast({
          title: "No Community Database",
          description: "Please import the HDSS community database to enable matching.",
          variant: "destructive"
        });
        return;
      }
      
      // Find potential matches in the community database
      const matches = findMatchesForRecord(recordWithSource);
      
      // Add source ID to potential matches
      const matchesWithSource = matches.map(match => ({
        ...match,
        record: {
          ...match.record,
          sourceId: record.id
        }
      }));
      
      setPotentialMatches(matchesWithSource);
      setSubmittedRecord(recordWithSource);
      
      toast({
        title: "Record Submitted",
        description: `Found ${matches.length} potential matches in the HDSS database.`,
      });
      
      // Switch to the matches tab automatically if matches found
      if (matches.length > 0) {
        setActiveTab('matches');
      }
    } catch (error) {
      console.error("Error in handleRecordSubmit:", error);
      toast({
        title: "Error Processing Record",
        description: "An error occurred while processing your record.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveForSearch = (record: Record) => {
    try {
      console.log("Save for search called with record:", record);
      
      // Check if community database is loaded
      if (communityRecords.length === 0) {
        setPotentialMatches([]);
        setSubmittedRecord(record);
        
        toast({
          title: "No Community Database",
          description: "Please import the HDSS community database to enable matching.",
          variant: "destructive"
        });
        return;
      }
      
      // Find potential matches in the community database
      const matches = findMatchesForRecord(record);
      
      // Add source ID to potential matches
      const matchesWithSource = matches.map(match => ({
        ...match,
        record: {
          ...match.record,
          sourceId: record.id
        }
      }));
      
      setPotentialMatches(matchesWithSource);
      setSubmittedRecord(record);
      
      toast({
        title: "Search Complete",
        description: `Found ${matches.length} potential matches in the HDSS database.`,
      });
      
      // Make sure we're in the matches tab
      setActiveTab('matches');
      
      console.log("Search results:", matchesWithSource);
    } catch (error) {
      console.error("Error in handleSaveForSearch:", error);
      toast({
        title: "Error Processing Search",
        description: "An error occurred while searching for matches.",
        variant: "destructive"
      });
    }
  };
  
  const handleMatchComplete = (result: MatchResult) => {
    console.log("Match complete callback with result:", result);
    saveMatchResult(result);
    
    toast({
      title: "Match Saved",
      description: "The match has been saved successfully and added to your progress report.",
      duration: 3000,
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
            <AlertDescription className="flex flex-col gap-2">
              <p>Please import a community database to enable probabilistic matching of clinic records.</p>
              <p className="text-sm"><strong>Important:</strong> Click "Import Community Database" below and set it as the main HDSS database to enable matching functionality.</p>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="entry">Record Entry</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="progress-report">
              <FileText className="w-4 h-4 mr-2" />
              Progress Report
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry">
            <RecordEntryTab 
              clinicRecords={clinicRecords}
              communityRecords={communityRecords}
              onRecordSubmit={handleRecordSubmit}
              onSaveForSearch={handleSaveForSearch}
            />
          </TabsContent>
          
          <TabsContent value="matches">
            <MatchesTab 
              submittedRecord={submittedRecord}
              potentialMatches={potentialMatches}
              communityRecords={communityRecords}
              onMatchComplete={handleMatchComplete}
            />
          </TabsContent>
          
          <TabsContent value="progress-report">
            <ProgressReportTab 
              matchResults={matchResults}
              clinicRecords={clinicRecords}
              communityRecords={communityRecords}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default RecordEntryContent;

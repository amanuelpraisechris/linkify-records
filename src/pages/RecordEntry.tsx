
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import RecordEntryForm from '@/components/RecordEntryForm';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordList from '@/components/RecordList';
import { Record, MatchResult } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { ArrowLeft, AlertCircle, Database, Info, FileText, CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import MatchingInterface from '@/components/MatchingInterface';

const initialRecords: Record[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    sex: 'Male', // Changed from gender to sex
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
    sex: 'Female', // Changed from gender to sex
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
  const { addRecord, findMatchesForRecord, communityRecords, clinicRecords, matchResults, saveMatchResult } = useRecordData();
  const [potentialMatches, setPotentialMatches] = useState<Array<{record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number};}>>([]);
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const [activeTab, setActiveTab] = useState('entry');
  const [searchTabActive, setSearchTabActive] = useState<'patient-registry' | 'linkage-with-dss'>('patient-registry');
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
  
  const renderMatchStatusBadge = (status: string) => {
    switch(status) {
      case 'matched':
        return <Badge className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Matched</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      case 'manual-review':
        return <Badge className="bg-amber-500"><HelpCircle className="w-3 h-3 mr-1" /> For Review</Badge>;
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <ImportDataForMatching />
                <RecordEntryForm 
                  onRecordSubmit={handleRecordSubmit} 
                  onSaveForSearch={handleSaveForSearch}
                />
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">Recently Added Clinic Records</h2>
                  <RecordList 
                    records={clinicRecords} 
                    showMatchDetail={false} 
                    emptyMessage="No clinic records have been added yet."
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="matches">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-3">
                <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
                  <h2 className="text-xl font-semibold mb-4">Potential Matches in HDSS Database</h2>
                  
                  {submittedRecord && potentialMatches.length > 0 ? (
                    <MatchingInterface 
                      matchData={[{
                        sourceRecord: submittedRecord,
                        potentialMatches: potentialMatches
                      }]}
                      onMatchComplete={handleMatchComplete}
                    />
                  ) : submittedRecord ? (
                    <div className="bg-muted/30 p-6 rounded-lg border border-muted">
                      <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-5 w-5" />
                        <h3 className="text-lg font-medium">No potential matches found</h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        No potential matches were found for the submitted record in the HDSS database.
                      </p>
                      
                      {communityRecords.length === 0 ? (
                        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                          <Database className="h-4 w-4" />
                          <AlertTitle>Community Database Required</AlertTitle>
                          <AlertDescription>
                            You need to import the community HDSS database first to enable matching functionality.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Try refining your search</AlertTitle>
                          <AlertDescription>
                            Consider checking the spelling of names, verify date of birth, or try including additional identifiers such as village or household information.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      Submit a clinic record to see potential matches in the HDSS database.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="progress-report">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-6">Matching Progress Report</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/40 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-400 mb-1">Matched Records</h3>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-500">
                    {matchResults.filter(r => r.status === 'matched').length}
                  </p>
                </div>
                
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/40 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1">Under Review</h3>
                  <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">
                    {matchResults.filter(r => r.status === 'manual-review').length}
                  </p>
                </div>
                
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-400 mb-1">Rejected Matches</h3>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                    {matchResults.filter(r => r.status === 'rejected').length}
                  </p>
                </div>
              </div>
              
              {matchResults.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-muted">
                    <thead className="bg-muted/30">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Source Record
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Matched Record
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Confidence
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-black divide-y divide-muted">
                      {matchResults.map((result, idx) => {
                        const sourceRecord = clinicRecords.find(r => r.id === result.sourceId);
                        const matchedRecord = result.matchId 
                          ? communityRecords.find(r => r.id === result.matchId) 
                          : null;
                          
                        return (
                          <tr key={idx} className="hover:bg-muted/10">
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {sourceRecord ? (
                                <div>
                                  <div className="font-medium">{sourceRecord.firstName} {sourceRecord.lastName}</div>
                                  <div className="text-xs text-muted-foreground">ID: {sourceRecord.id.substring(0, 8)}</div>
                                </div>
                              ) : 'Unknown Record'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {matchedRecord ? (
                                <div>
                                  <div className="font-medium">{matchedRecord.firstName} {matchedRecord.lastName}</div>
                                  <div className="text-xs text-muted-foreground">ID: {matchedRecord.id.substring(0, 8)}</div>
                                </div>
                              ) : 'No Match Assigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {renderMatchStatusBadge(result.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {result.confidence}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {new Date(result.matchedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              {result.notes ? (
                                <div className="max-w-xs truncate" title={result.notes}>
                                  {result.notes}
                                </div>
                              ) : (
                                <span className="text-muted-foreground italic">No notes</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No match history available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Match records will appear here after you process matches from the Matches tab.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
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

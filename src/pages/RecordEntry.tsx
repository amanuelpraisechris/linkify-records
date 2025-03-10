
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import RecordEntryForm from '@/components/RecordEntryForm';
import MatchingInterface from '@/components/MatchingInterface';
import MatchingConfigPanel from '@/components/MatchingConfigPanel';
import { MatchingConfigProvider, useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Record, RecordMatch, MatchResult } from '@/types';
import { exampleRecords } from '@/utils/mockData';
import { ArrowLeft, Search, AlertCircle, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { findPotentialMatches } from '@/utils/matchingAlgorithms';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RecordEntryContent = () => {
  const [submittedRecord, setSubmittedRecord] = useState<Record | null>(null);
  const [matchResults, setMatchResults] = useState<RecordMatch | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { config } = useMatchingConfig();
  const { toast } = useToast();
  
  const handleRecordSubmit = (record: Record) => {
    setSubmittedRecord(record);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      // Use our new matching algorithm
      const potentialMatches = findPotentialMatches(record, exampleRecords, config);
      
      const matchData: RecordMatch = {
        sourceRecord: record,
        potentialMatches: potentialMatches.slice(0, 5) // Get top 5 matches
      };
      
      setMatchResults(matchData);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${potentialMatches.length} potential matching records.`,
      });
    }, 2000);
  };
  
  const handleMatchComplete = (result: MatchResult) => {
    // In a real app, this would save the match result to a database
    console.log('Match completed:', result);
    
    toast({
      title: result.status === 'matched' ? "Records Linked" : "Match Processed",
      description: result.status === 'matched' 
        ? "The records have been successfully linked." 
        : "The record has been processed.",
      duration: 3000,
    });
    
    // Reset state after a delay
    setTimeout(() => {
      setSubmittedRecord(null);
      setMatchResults(null);
    }, 1500);
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
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Record Entry & Matching</h1>
          <p className="text-lg text-muted-foreground">
            Submit new patient records and find potential matches
          </p>
        </div>
        
        <Tabs defaultValue="entry">
          <TabsList className="mb-6">
            <TabsTrigger value="entry" className="flex items-center">
              <Search className="w-4 h-4 mr-2" />
              Record Entry
            </TabsTrigger>
            <TabsTrigger value="config" className="flex items-center">
              <Settings className="w-4 h-4 mr-2" />
              Matching Configuration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="entry">
            {!submittedRecord ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <RecordEntryForm onRecordSubmit={handleRecordSubmit} />
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-black border rounded-xl shadow-subtle p-6">
                    <div className="flex items-center mb-4">
                      <Search className="w-5 h-5 mr-2 text-primary" />
                      <h2 className="text-xl font-semibold">How Matching Works</h2>
                    </div>
                    
                    <div className="space-y-4 text-sm">
                      <p className="text-muted-foreground">
                        This system uses both deterministic and probabilistic record linkage 
                        to identify potential matches in the community database.
                      </p>
                      
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium mb-2">Current Match Weights</h3>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {Object.entries(config.fieldWeights)
                            .sort(([, a], [, b]) => b - a)
                            .map(([field, weight]) => (
                              <li key={field} className="flex justify-between">
                                <span className="capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span>{weight}</span>
                              </li>
                            ))
                          }
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h3 className="font-medium mb-2">Match Thresholds</h3>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li className="flex justify-between">
                            <span>High Confidence</span>
                            <span>{config.threshold.high}%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Medium Confidence</span>
                            <span>{config.threshold.medium}%</span>
                          </li>
                          <li className="flex justify-between">
                            <span>Low Confidence</span>
                            <span>{config.threshold.low}%</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="flex items-center p-3 bg-primary/10 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mr-2" />
                        <p className="text-xs text-primary">
                          You can adjust matching weights and thresholds in the Matching Configuration tab.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
                {isSearching ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-primary/10">
                      <Search className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Searching for Matches</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      We're searching the community database for potential matches. 
                      This may take a moment...
                    </p>
                    <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden mx-auto mt-6">
                      <div className="h-full bg-primary rounded-full animate-progress"></div>
                    </div>
                  </div>
                ) : (
                  <MatchingInterface 
                    matchData={matchResults ? [matchResults] : []}
                    onMatchComplete={handleMatchComplete}
                  />
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="config">
            <MatchingConfigPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

// Wrap the component with the MatchingConfigProvider
const RecordEntry = () => {
  return (
    <MatchingConfigProvider>
      <RecordEntryContent />
    </MatchingConfigProvider>
  );
};

export default RecordEntry;

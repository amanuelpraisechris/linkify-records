
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Record, MatchResult } from '@/types';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';

export const useMatchesState = () => {
  const { 
    findMatchesForRecord, 
    communityRecords,
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

  return {
    potentialMatches,
    submittedRecord,
    activeTab,
    setActiveTab,
    handleRecordSubmit,
    handleSaveForSearch,
    handleMatchComplete
  };
};

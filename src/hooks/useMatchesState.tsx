
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Record, MatchResult } from '@/types';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { databaseService } from '@/services/database';

export const useMatchesState = () => {
  const { 
    records,
    clinicRecords,
    communityRecords,
    addRecord,
    findMatchesForRecord,
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

  // Update search attempts status in database when matches are found
  useEffect(() => {
    const updateSearchAttempts = async () => {
      if (submittedRecord && potentialMatches.length > 0) {
        try {
          const query = `${submittedRecord.firstName} ${submittedRecord.lastName}`;
          await databaseService.saveMatchAttempt(query, true, potentialMatches.length);
        } catch (error) {
          console.error('Error updating search attempts in database:', error);
          // Fallback to localStorage
          try {
            const savedAttempts = localStorage.getItem('searchAttempts');
            if (savedAttempts) {
              const attempts = JSON.parse(savedAttempts);
              const query = `${submittedRecord.firstName} ${submittedRecord.lastName}`;
              const updatedAttempts = attempts.map((attempt: any) => {
                if (attempt.query === query && !attempt.success) {
                  return { ...attempt, success: true };
                }
                return attempt;
              });
              localStorage.setItem('searchAttempts', JSON.stringify(updatedAttempts));
            }
          } catch (localError) {
            console.error('Error updating search attempts in localStorage:', localError);
          }
        }
      }
    };

    updateSearchAttempts();
  }, [submittedRecord, potentialMatches]);

  const handleRecordSubmit = async (record: Record) => {
    try {
      console.log("Record submitted:", record);
      
      // Add the clinic record to our records list
      await addRecord(record, 'clinic');
      
      // Prepare record with source ID for matching
      const recordWithSource = {
        ...record,
        sourceId: record.id,
      };
      
      setSubmittedRecord(recordWithSource);
      
      // If community database is missing, show warning but still proceed
      if (communityRecords.length === 0) {
        toast({
          title: "Warning: No Community Database",
          description: "HDSS community database is not loaded. Matching will be limited.",
          variant: "destructive"
        });
      }
      
      // Find potential matches
      const matches = findMatchesForRecord(recordWithSource);
      console.log(`Found ${matches.length} potential matches for submitted record`);
      
      // Add source ID to potential matches
      const matchesWithSource = matches.map(match => ({
        ...match,
        record: {
          ...match.record,
          sourceId: record.id
        }
      }));
      
      setPotentialMatches(matchesWithSource);
      
      // Log search attempt to database
      try {
        const query = `${record.firstName} ${record.lastName}`;
        await databaseService.saveMatchAttempt(query, matches.length > 0, matches.length);
      } catch (error) {
        console.error('Error logging search attempt to database:', error);
        // Fallback to localStorage
        try {
          const searchAttempt = {
            timestamp: new Date().toISOString(),
            query: `${record.firstName} ${record.lastName}`,
            success: matches.length > 0
          };
          
          const savedAttempts = localStorage.getItem('searchAttempts');
          let attempts = savedAttempts ? JSON.parse(savedAttempts) : [];
          attempts = [searchAttempt, ...attempts];
          localStorage.setItem('searchAttempts', JSON.stringify(attempts));
        } catch (localError) {
          console.error('Error logging search attempt to localStorage:', localError);
        }
      }
      
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
  
  const handleSaveForSearch = async (record: Record) => {
    try {
      console.log("Save for search called with record:", record);
      
      // Prepare record with ID for matching if it doesn't have one
      const recordWithId = {
        ...record,
        id: record.id || `search-${Date.now()}`,
      };
      
      setSubmittedRecord(recordWithId);
      
      // If community database is missing, show warning but still proceed
      if (communityRecords.length === 0) {
        toast({
          title: "Warning: No Community Database",
          description: "HDSS community database is not loaded. Matching will be limited.",
          variant: "destructive"
        });
      }
      
      // Find potential matches
      const matches = findMatchesForRecord(recordWithId);
      console.log(`Found ${matches.length} potential matches for search record`);
      
      setPotentialMatches(matches);
      
      // Log search attempt to database
      try {
        const query = `${record.firstName} ${record.lastName}`;
        await databaseService.saveMatchAttempt(query, matches.length > 0, matches.length);
      } catch (error) {
        console.error('Error logging search attempt to database:', error);
        // Fallback to localStorage
        try {
          const searchAttempt = {
            timestamp: new Date().toISOString(),
            query: `${record.firstName} ${record.lastName}`,
            success: matches.length > 0
          };
          
          const savedAttempts = localStorage.getItem('searchAttempts');
          let attempts = savedAttempts ? JSON.parse(savedAttempts) : [];
          attempts = [searchAttempt, ...attempts];
          localStorage.setItem('searchAttempts', JSON.stringify(attempts));
        } catch (localError) {
          console.error('Error logging search attempt to localStorage:', localError);
        }
      }
      
      toast({
        title: "Search Complete",
        description: `Found ${matches.length} potential matches in the HDSS database.`,
      });
      
      // Make sure we're in the matches tab
      setActiveTab('matches');
    } catch (error) {
      console.error("Error in handleSaveForSearch:", error);
      toast({
        title: "Error Processing Search",
        description: "An error occurred while searching for matches.",
        variant: "destructive"
      });
    }
  };
  
  const handleMatchComplete = async (result: MatchResult) => {
    console.log("Match complete callback with result:", result);
    await saveMatchResult(result);
    
    toast({
      title: "Match Saved",
      description: "The match has been saved successfully and added to your progress report.",
      duration: 3000,
    });
    
    // Return to the entry tab to process the next record
    setActiveTab('entry');
    setSubmittedRecord(null);
    setPotentialMatches([]);
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

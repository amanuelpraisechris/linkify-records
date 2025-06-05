
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
  const [activeTab, setActiveTab] = useState('consent');
  const [consentData, setConsentData] = useState<{
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  } | null>(null);
  const [matchingThresholds, setMatchingThresholds] = useState({
    noMatchThreshold: 0.3,
    lowConfidenceThreshold: 0.6,
    autoMatchThreshold: 0.8
  });
  
  const { toast } = useToast();

  // Load matching thresholds on component mount
  useEffect(() => {
    const loadThresholds = async () => {
      try {
        const thresholds = await databaseService.getMatchingThresholds();
        setMatchingThresholds(thresholds);
      } catch (error) {
        console.error('Error loading matching thresholds:', error);
      }
    };
    loadThresholds();
  }, []);

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

  const handleConsentComplete = (consent: {
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  }) => {
    setConsentData(consent);
    toast({
      title: "Consent Recorded",
      description: "Patient consent has been recorded. You can now proceed with data entry.",
    });
  };

  const determineMatchStatus = (matches: Array<{ score: number }>) => {
    if (matches.length === 0) {
      return 'no_suitable_match';
    }
    
    const highestScore = Math.max(...matches.map(m => m.score));
    
    if (highestScore < matchingThresholds.noMatchThreshold) {
      return 'no_suitable_match';
    } else if (highestScore < matchingThresholds.lowConfidenceThreshold) {
      return 'low_confidence';
    } else if (matches.length > 3 && highestScore < matchingThresholds.autoMatchThreshold) {
      return 'manual_review_required';
    }
    
    return 'good_matches';
  };

  const handleRecordSubmit = async (record: Record) => {
    if (!consentData?.consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please obtain patient consent before submitting the record.",
        variant: "destructive"
      });
      setActiveTab('consent');
      return;
    }

    try {
      console.log("Record submitted:", record);
      
      // Add consent data to the record
      const recordWithConsent = {
        ...record,
        consentObtained: consentData.consentGiven,
        consentDate: consentData.consentDate,
        consentType: consentData.consentType
      };
      
      // Add the clinic record to our records list
      await addRecord(recordWithConsent, 'clinic');
      
      // Prepare record with source ID for matching
      const recordWithSource = {
        ...recordWithConsent,
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
      
      // Determine match status based on thresholds
      const matchStatus = determineMatchStatus(matches);
      
      if (matchStatus === 'no_suitable_match' || matchStatus === 'low_confidence' || matchStatus === 'manual_review_required') {
        // Handle no match scenario
        toast({
          title: "No Suitable Matches Found",
          description: "No matching records found. Please save this record for manual review.",
          variant: "destructive"
        });
        
        // Save as unmatched record
        try {
          await databaseService.saveUnmatchedRecord(record.id, recordWithConsent, matchStatus);
        } catch (error) {
          console.error('Error saving unmatched record:', error);
        }
        
        setPotentialMatches([]);
        setActiveTab('matches'); // Show the no-match handler
        return;
      }
      
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
    if (!consentData?.consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please obtain patient consent before searching.",
        variant: "destructive"
      });
      setActiveTab('consent');
      return;
    }

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
      
      // Determine match status
      const matchStatus = determineMatchStatus(matches);
      
      if (matchStatus === 'no_suitable_match' || matchStatus === 'low_confidence') {
        toast({
          title: "No Suitable Matches Found",
          description: "No matching records found in the HDSS database.",
          variant: "destructive"
        });
      }
      
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
    
    // Add consent data to match result
    const resultWithConsent = {
      ...result,
      consentObtained: consentData?.consentGiven || false,
      consentDate: consentData?.consentDate
    };
    
    await saveMatchResult(resultWithConsent);
    
    toast({
      title: "Match Saved",
      description: "The match has been saved successfully and added to your progress report.",
      duration: 3000,
    });
    
    // Return to the consent tab to process the next record
    setActiveTab('consent');
    setSubmittedRecord(null);
    setPotentialMatches([]);
    setConsentData(null);
  };

  return {
    potentialMatches,
    submittedRecord,
    activeTab,
    setActiveTab,
    consentData,
    handleConsentComplete,
    handleRecordSubmit,
    handleSaveForSearch,
    handleMatchComplete
  };
};

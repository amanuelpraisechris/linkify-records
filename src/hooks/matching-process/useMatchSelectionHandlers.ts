
import { useState } from 'react';
import { RecordMatch, MatchResult } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { MatchSelectionHandlers } from './types';

interface UseMatchSelectionHandlersProps {
  currentMatch: RecordMatch | null;
  currentIndex: number;
  matchData: RecordMatch[];
  results: MatchResult[];
  setResults: React.Dispatch<React.SetStateAction<MatchResult[]>>;
  setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedMatchId: string | null;
  setSelectedMatchId: React.Dispatch<React.SetStateAction<string | null>>;
  matchNotes: string;
  setMatchNotes: React.Dispatch<React.SetStateAction<string>>;
  consentGiven: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  onMatchComplete?: (result: MatchResult) => void;
}

export function useMatchSelectionHandlers({
  currentMatch,
  currentIndex,
  matchData,
  results,
  setResults,
  setCurrentIndex,
  setIsLoading,
  selectedMatchId,
  setSelectedMatchId,
  matchNotes,
  setMatchNotes,
  consentGiven,
  setActiveTab,
  onMatchComplete
}: UseMatchSelectionHandlersProps): MatchSelectionHandlers {
  const { toast } = useToast();

  const handleSelectMatch = (matchId: string) => {
    console.log("Match selected:", matchId);
    setSelectedMatchId(matchId === selectedMatchId ? null : matchId);
  };

  const handleSaveSelectedMatch = () => {
    console.log("Saving selected match:", selectedMatchId);
    console.log("Consent given:", consentGiven);
    
    if (!selectedMatchId) {
      toast({
        title: "No Match Selected",
        description: "Please select a match record before saving.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please confirm that the patient has consented to link their records before saving a match.",
        variant: "destructive",
        duration: 5000,
      });
      setActiveTab('consent');
      return;
    }
    
    // Make sure currentMatch is available before proceeding
    if (!currentMatch) {
      console.error("currentMatch is not available");
      toast({
        title: "Error",
        description: "Match data is not available.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Get the selected match details
    const selectedMatch = currentMatch.potentialMatches.find(m => m.record.id === selectedMatchId);
    
    if (!selectedMatch) {
      setIsLoading(false);
      console.error("Selected match not found in potentialMatches");
      toast({
        title: "Error",
        description: "Could not find the selected match details.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    console.log("Selected match found:", selectedMatch);
    
    // Create the match result
    const result: MatchResult = {
      sourceId: currentMatch.sourceRecord.id,
      matchId: selectedMatchId,
      status: 'matched',
      confidence: selectedMatch.score,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
      notes: matchNotes,
      fieldScores: selectedMatch.fieldScores,
      consentObtained: consentGiven,
      consentDate: new Date().toISOString()
    };
    
    console.log("Created result object:", result);
    
    // Save the result
    setTimeout(() => {
      setResults([...results, result]);
      
      if (onMatchComplete) {
        console.log("Calling onMatchComplete with result");
        onMatchComplete(result);
      } else {
        console.warn("onMatchComplete callback is not defined");
      }
      
      toast({
        title: "Match Saved",
        description: `The selected match has been saved successfully with a ${selectedMatch.score}% confidence score.`,
        duration: 3000,
      });
      
      // Reset for next match
      setMatchNotes('');
      setSelectedMatchId(null);
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
      setIsLoading(false);
      setActiveTab('matching');
    }, 600);
  };

  const handleMatch = (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => {
    if (!consentGiven && status === 'matched') {
      toast({
        title: "Consent Required",
        description: "Please confirm that the patient has consented to link their records before assigning a match.",
        variant: "destructive",
        duration: 5000,
      });
      setActiveTab('consent');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result: MatchResult = {
        sourceId: currentMatch?.sourceRecord.id || '',
        matchId,
        status,
        confidence,
        matchedBy: 'user',
        matchedAt: new Date().toISOString(),
        notes: matchNotes,
        fieldScores: matchId && currentMatch ? 
          currentMatch.potentialMatches.find(m => m.record.id === matchId)?.fieldScores : 
          undefined,
        consentObtained: consentGiven,
        consentDate: new Date().toISOString()
      };
      
      setResults([...results, result]);
      
      if (onMatchComplete) {
        onMatchComplete(result);
      }
      
      toast({
        title: status === 'matched' ? "Records Linked" : status === 'rejected' ? "Match Rejected" : "Sent for Review",
        description: status === 'matched' 
          ? "Records have been successfully linked." 
          : status === 'rejected' 
            ? "The match has been rejected."
            : "The records have been sent for manual review.",
        duration: 3000,
      });
      
      // Reset notes for next match
      setMatchNotes('');
      setSelectedMatchId(null);
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
      setIsLoading(false);
      
      // Switch back to matching tab
      setActiveTab('matching');
    }, 600);
  };

  return {
    handleSelectMatch,
    handleSaveSelectedMatch,
    handleMatch
  };
}

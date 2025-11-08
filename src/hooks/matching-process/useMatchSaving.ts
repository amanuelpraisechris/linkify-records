
import { useState } from 'react';
import { RecordMatch, MatchResult } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { logAudit } from '@/services/auditService';

interface UseMatchSavingProps {
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

export function useMatchSaving({
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
  onMatchComplete
}: UseMatchSavingProps) {
  const { toast } = useToast();

  const createMatchResult = (
    matchId: string | null, 
    status: 'matched' | 'rejected' | 'manual-review', 
    confidence: number
  ): MatchResult | null => {
    if (!currentMatch) {
      console.error("currentMatch is not available");
      toast({
        title: "Error",
        description: "Match data is not available.",
        variant: "destructive",
        duration: 3000,
      });
      return null;
    }

    let fieldScores;
    if (matchId && status === 'matched') {
      const selectedMatch = currentMatch.potentialMatches.find(m => m.record.id === matchId);
      if (!selectedMatch) {
        console.error("Selected match not found in potentialMatches");
        toast({
          title: "Error",
          description: "Could not find the selected match details.",
          variant: "destructive",
          duration: 3000,
        });
        return null;
      }
      fieldScores = selectedMatch.fieldScores;
      confidence = selectedMatch.score;
    }

    // Create the match result
    return {
      sourceId: currentMatch.sourceRecord.id,
      matchId,
      status,
      confidence,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
      notes: matchNotes,
      fieldScores,
      consentObtained: consentGiven,
      consentDate: new Date().toISOString()
    };
  };

  const saveMatchResult = async (result: MatchResult) => {
    setIsLoading(true);

    try {
      // Save to database using the database service
      const { databaseService } = await import('@/services/database');
      await databaseService.saveMatchResult(result);

      // Log audit trail based on match status
      if (result.status === 'matched') {
        logAudit({
          actionType: 'MATCH_ACCEPT',
          description: `Matched record ${result.sourceId} with ${result.matchId} (confidence: ${result.confidence}%)`,
          severity: 'info',
          entityType: 'match',
          entityId: result.sourceId,
          metadata: {
            matchId: result.matchId,
            confidence: result.confidence,
            consentObtained: result.consentObtained,
            notes: result.notes,
          },
        });
      } else if (result.status === 'rejected') {
        logAudit({
          actionType: 'MATCH_REJECT',
          description: `Rejected match for record ${result.sourceId}`,
          severity: 'info',
          entityType: 'match',
          entityId: result.sourceId,
          metadata: {
            notes: result.notes,
          },
        });
      } else if (result.status === 'manual-review') {
        logAudit({
          actionType: 'MATCH_MANUAL_REVIEW',
          description: `Sent record ${result.sourceId} for manual review`,
          severity: 'warning',
          entityType: 'match',
          entityId: result.sourceId,
          metadata: {
            notes: result.notes,
          },
        });
      }

      // Also save unmatched records if status indicates it
      if (result.status === 'manual-review' && currentMatch) {
        await databaseService.saveUnmatchedRecord(
          currentMatch.sourceRecord.id,
          currentMatch.sourceRecord,
          'manual_review_required'
        );
      }

      // Update local state
      setResults([...results, result]);
      
      if (onMatchComplete) {
        console.log("Calling onMatchComplete with result");
        onMatchComplete(result);
      } else {
        console.warn("onMatchComplete callback is not defined");
      }
      
      let toastMessage = "";
      if (result.status === 'matched') {
        toastMessage = "The selected match has been saved successfully to the database" + 
          (result.confidence ? ` with a ${result.confidence}% confidence score.` : ".");
      } else if (result.status === 'rejected') {
        toastMessage = "The match has been rejected and saved to the database.";
      } else {
        toastMessage = "The records have been sent for manual review and saved to the database.";  
      }
      
      toast({
        title: result.status === 'matched' ? "Match Saved" : 
               result.status === 'rejected' ? "Match Rejected" : 
               "Sent for Review",
        description: toastMessage,
        duration: 3000,
      });
      
      // Reset for next match
      setMatchNotes('');
      setSelectedMatchId(null);
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
    } catch (error) {
      console.error('Error saving match result:', error);

      // Log error to audit trail
      logAudit({
        actionType: 'SYSTEM_ERROR',
        description: `Failed to save match result for record ${result.sourceId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
        entityType: 'match',
        entityId: result.sourceId,
        stackTrace: error instanceof Error ? error.stack : undefined,
      });

      toast({
        title: "Error",
        description: "Failed to save match result to database. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createMatchResult,
    saveMatchResult
  };
}

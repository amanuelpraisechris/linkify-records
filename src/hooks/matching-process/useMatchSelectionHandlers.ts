
import { RecordMatch, MatchResult } from '@/types';
import { MatchSelectionHandlers } from './types';
import { useMatchSelection } from './useMatchSelection';
import { useMatchValidation } from './useMatchValidation';
import { useMatchSaving } from './useMatchSaving';

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
  // Use the refactored hooks
  const { handleSelectMatch } = useMatchSelection({
    selectedMatchId,
    setSelectedMatchId
  });

  const { validateMatchSelection, validateConsent } = useMatchValidation({
    selectedMatchId,
    consentGiven,
    setActiveTab
  });

  const { createMatchResult, saveMatchResult } = useMatchSaving({
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
  });

  const handleSaveSelectedMatch = () => {
    console.log("Saving selected match:", selectedMatchId);
    console.log("Consent given:", consentGiven);
    
    if (!validateMatchSelection() || !validateConsent()) {
      return;
    }
    
    const result = createMatchResult(selectedMatchId, 'matched', 0);
    if (result) {
      saveMatchResult(result);
      setActiveTab('matching');
    }
  };

  const handleMatch = (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => {
    if (status === 'matched' && !validateConsent()) {
      return;
    }
    
    const result = createMatchResult(matchId, status, confidence);
    if (result) {
      saveMatchResult(result);
      setActiveTab('matching');
    }
  };

  return {
    handleSelectMatch,
    handleSaveSelectedMatch,
    handleMatch
  };
}


import { RecordMatch, MatchResult } from '@/types';

export interface UseMatchingProcessProps {
  matchData: RecordMatch[];
  onMatchComplete?: (result: MatchResult) => void;
}

export interface UseMatchingProcessState {
  currentIndex: number;
  results: MatchResult[];
  isLoading: boolean;
  matchNotes: string;
  consentGiven: boolean;
  activeTab: string;
  selectedMatchId: string | null;
}

export interface MatchSelectionHandlers {
  handleSelectMatch: (matchId: string) => void;
  handleSaveSelectedMatch: () => void;
  handleMatch: (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => void;
}


import { useState } from 'react';
import { RecordMatch, MatchResult } from '@/types';
import { UseMatchingProcessProps } from './types';
import { useMatchSelectionHandlers } from './useMatchSelectionHandlers';

export function useMatchingProcess({ matchData, onMatchComplete }: UseMatchingProcessProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchNotes, setMatchNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [activeTab, setActiveTab] = useState('matching');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  
  // Make sure we have access to the current match
  const currentMatch = matchData && matchData.length > 0 && currentIndex < matchData.length 
    ? matchData[currentIndex] 
    : null;

  const {
    handleSelectMatch,
    handleSaveSelectedMatch,
    handleMatch
  } = useMatchSelectionHandlers({
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

  return {
    currentIndex,
    results,
    isLoading,
    matchNotes,
    setMatchNotes,
    consentGiven,
    setConsentGiven,
    activeTab,
    setActiveTab,
    selectedMatchId,
    currentMatch,
    handleSelectMatch,
    handleSaveSelectedMatch,
    handleMatch
  };
}

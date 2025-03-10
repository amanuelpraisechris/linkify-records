
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { RecordMatch } from '@/types';

interface UseMatchSelectionProps {
  selectedMatchId: string | null;
  setSelectedMatchId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useMatchSelection({
  selectedMatchId,
  setSelectedMatchId,
}: UseMatchSelectionProps) {
  const { toast } = useToast();

  const handleSelectMatch = (matchId: string) => {
    console.log("Match selected:", matchId);
    setSelectedMatchId(matchId === selectedMatchId ? null : matchId);
  };

  return {
    handleSelectMatch
  };
}

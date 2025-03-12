
import { useToast } from '@/components/ui/use-toast';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';

interface UseMatchValidationProps {
  selectedMatchId: string | null;
  consentGiven: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  sourceRecordId?: string;
}

export function useMatchValidation({
  selectedMatchId,
  consentGiven,
  setActiveTab,
  sourceRecordId
}: UseMatchValidationProps) {
  const { toast } = useToast();
  const { matchResults } = useRecordData();

  const validateMatchSelection = () => {
    if (!selectedMatchId) {
      toast({
        title: "No Match Selected",
        description: "Please select a match record before saving.",
        variant: "destructive",
        duration: 3000,
      });
      return false;
    }
    return true;
  };

  const validateConsent = () => {
    if (!consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please confirm that the patient has consented to link their records before saving a match.",
        variant: "destructive",
        duration: 5000,
      });
      setActiveTab('consent');
      return false;
    }
    return true;
  };

  const checkPreviousConsent = (patientId: string): boolean => {
    // Check if this patient has any previous match results with consent
    const previousConsents = matchResults.filter(
      match => 
        (match.sourceId === patientId || match.matchId === patientId) && 
        match.consentObtained === true
    );
    
    return previousConsents.length > 0;
  };

  return {
    validateMatchSelection,
    validateConsent,
    checkPreviousConsent
  };
}

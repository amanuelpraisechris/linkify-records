
import { useToast } from '@/components/ui/use-toast';

interface UseMatchValidationProps {
  selectedMatchId: string | null;
  consentGiven: boolean;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

export function useMatchValidation({
  selectedMatchId,
  consentGiven,
  setActiveTab
}: UseMatchValidationProps) {
  const { toast } = useToast();

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

  return {
    validateMatchSelection,
    validateConsent
  };
}

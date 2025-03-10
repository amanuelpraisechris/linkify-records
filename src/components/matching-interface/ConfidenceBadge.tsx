
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface ConfidenceBadgeProps {
  score: number;
}

const ConfidenceBadge = ({ score }: ConfidenceBadgeProps) => {
  const { config } = useMatchingConfig();
  
  const getConfidenceLevel = (score: number) => {
    if (score >= config.threshold.high) return 'high';
    if (score >= config.threshold.medium) return 'medium';
    return 'low';
  };

  const level = getConfidenceLevel(score);
  
  if (level === 'high') {
    return (
      <Badge className="bg-green-500 hover:bg-green-600">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        High Confidence ({score}%)
      </Badge>
    );
  } else if (level === 'medium') {
    return (
      <Badge className="bg-amber-500 hover:bg-amber-600">
        <HelpCircle className="w-3 h-3 mr-1" />
        Medium Confidence ({score}%)
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-500 hover:bg-red-600">
        <AlertCircle className="w-3 h-3 mr-1" />
        Low Confidence ({score}%)
      </Badge>
    );
  }
};

export default ConfidenceBadge;


import { Badge } from '@/components/ui/badge';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';

interface MatchScoreDisplayProps {
  score?: number;
}

const MatchScoreDisplay = ({ score }: MatchScoreDisplayProps) => {
  const { config } = useMatchingConfig();
  
  if (score === undefined) return <span>--</span>;
  
  if (score >= config.threshold.high) {
    return (
      <Badge variant="default" className="bg-green-500 text-white font-normal">High Match ({score}%)</Badge>
    );
  } else if (score >= config.threshold.medium) {
    return (
      <Badge variant="default" className="bg-amber-500 text-white font-normal">Medium Match ({score}%)</Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="font-normal text-muted-foreground">Low Match ({score}%)</Badge>
    );
  }
};

export default MatchScoreDisplay;

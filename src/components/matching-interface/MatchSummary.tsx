
import { RecordMatch } from '@/types';

interface MatchSummaryProps {
  currentIndex: number;
  matchDataLength: number;
}

const MatchSummary = ({ currentIndex, matchDataLength }: MatchSummaryProps) => {
  return (
    <span className="text-sm text-muted-foreground">
      Match {currentIndex + 1} of {matchDataLength}
    </span>
  );
};

export default MatchSummary;

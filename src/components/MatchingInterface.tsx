
import { useState, useEffect } from 'react';
import { RecordMatch, MatchResult } from '@/types';
import RecordCard from './RecordCard';
import { useToast } from '@/components/ui/use-toast';

interface MatchingInterfaceProps {
  matchData: RecordMatch[];
  onMatchComplete?: (result: MatchResult) => void;
}

const MatchingInterface = ({ matchData, onMatchComplete }: MatchingInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentMatch = matchData[currentIndex];

  const handleMatch = (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => {
    setIsLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const result: MatchResult = {
        sourceId: currentMatch.sourceRecord.id,
        matchId,
        status,
        confidence,
        matchedBy: 'user',
        matchedAt: new Date().toISOString(),
      };
      
      setResults([...results, result]);
      
      if (onMatchComplete) {
        onMatchComplete(result);
      }
      
      toast({
        title: status === 'matched' ? "Records Linked" : status === 'rejected' ? "Match Rejected" : "Sent for Review",
        description: status === 'matched' 
          ? "Records have been successfully linked." 
          : status === 'rejected' 
            ? "The match has been rejected."
            : "The records have been sent for manual review.",
        duration: 3000,
      });
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
      setIsLoading(false);
    }, 600);
  };

  if (!currentMatch) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">No Matches to Process</h3>
        <p className="text-muted-foreground">There are no more potential matches to review.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-primary rounded-full"></div>
        <h3 className="text-lg font-medium mb-1">Source Record</h3>
        <p className="text-sm text-muted-foreground mb-3">
          This is the new record that needs to be linked.
        </p>
        
        <div className="animate-slide-up">
          <RecordCard record={currentMatch.sourceRecord} isHighlighted />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-1">Potential Matches</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Select the matching record or reject if no match is found.
        </p>
        
        <div className="space-y-4 animate-slide-up">
          {currentMatch.potentialMatches.length > 0 ? (
            currentMatch.potentialMatches.map((match, idx) => (
              <div key={match.record.id} className="relative animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <RecordCard 
                  record={match.record}
                  showActions={!isLoading}
                  onMatch={() => handleMatch(match.record.id, match.score, 'matched')}
                  onReject={() => handleMatch(null, 0, 'rejected')}
                  matchScore={match.score}
                  matchedOn={match.matchedOn}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-muted/30 rounded-lg">
              <p className="text-muted-foreground">No potential matches found for this record.</p>
              <button
                onClick={() => handleMatch(null, 0, 'manual-review')}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all-medium"
                disabled={isLoading}
              >
                Send for Manual Review
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Match {currentIndex + 1} of {matchData.length}
        </div>
        
        <button
          onClick={() => handleMatch(null, 0, 'manual-review')}
          className="text-sm text-primary font-medium hover:underline"
          disabled={isLoading}
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
};

export default MatchingInterface;

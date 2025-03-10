
import { RecordMatch, MatchResult } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface HistoryTabProps {
  results: MatchResult[];
  matchData: RecordMatch[];
  setActiveTab: (tab: string) => void;
}

const HistoryTab = ({ results, matchData, setActiveTab }: HistoryTabProps) => {
  return (
    <div className="bg-white dark:bg-black border rounded-xl p-6 shadow-subtle">
      <h3 className="text-xl font-semibold mb-4">Match History</h3>
      {results.length > 0 ? (
        <div className="space-y-4">
          {results.map((result, index) => {
            const matchedRecord = result.matchId 
              ? matchData.flatMap(m => m.potentialMatches).find(m => m.record.id === result.matchId)?.record 
              : null;
            
            return (
              <div key={index} className="border rounded-lg p-4 bg-muted/5">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    {result.status === 'matched' 
                      ? 'Matched Record' 
                      : result.status === 'rejected' 
                        ? 'Rejected Match' 
                        : 'Sent for Review'}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(result.matchedAt).toLocaleString()}
                  </span>
                </div>
                
                {matchedRecord && (
                  <div className="mb-2">
                    <span className="text-sm font-medium">Matched to: </span>
                    <span>{matchedRecord.firstName} {matchedRecord.lastName} ({matchedRecord.id})</span>
                    <Badge className="ml-2">
                      {result.confidence}% match
                    </Badge>
                  </div>
                )}
                
                {result.notes && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium">Notes:</p>
                    <p className="bg-muted/20 p-2 rounded mt-1">{result.notes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No match history available for this session.
        </div>
      )}
      
      <Button 
        variant="outline" 
        onClick={() => setActiveTab('matching')} 
        className="mt-4"
      >
        Back to Matching
      </Button>
    </div>
  );
};

export default HistoryTab;

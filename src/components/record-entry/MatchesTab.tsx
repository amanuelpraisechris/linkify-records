
import { Record, MatchResult } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FileX, AlertTriangle, Users } from 'lucide-react';
import MatchingInterface from '@/components/MatchingInterface';
// For premium experience, you can also use:
// import PremiumMatchingInterface from '@/components/matching-interface/PremiumMatchingInterface';
import NoMatchHandler from './NoMatchHandler';
import { useState } from 'react';

interface MatchesTabProps {
  submittedRecord: Record | null;
  potentialMatches: Array<{
    record: Record; 
    score: number; 
    matchedOn: string[];
    fieldScores?: {[key: string]: number};
  }>;
  communityRecords: Record[];
  onMatchComplete: (result: MatchResult) => void;
}

const MatchesTab = ({
  submittedRecord,
  potentialMatches,
  communityRecords,
  onMatchComplete
}: MatchesTabProps) => {
  const [showNoMatchHandler, setShowNoMatchHandler] = useState(false);

  if (!submittedRecord) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Record Submitted
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Please complete the record entry form first.
        </p>
      </div>
    );
  }

  // Check if we should show no match handler
  if (potentialMatches.length === 0 || showNoMatchHandler) {
    return (
      <NoMatchHandler
        record={submittedRecord}
        reason="no_suitable_match"
        onSaveComplete={() => {
          onMatchComplete({
            sourceId: submittedRecord.id,
            matchId: null,
            status: 'rejected',
            confidence: 0,
            matchedBy: 'system',
            matchedAt: new Date().toISOString(),
            notes: 'No suitable matches found - saved for manual review'
          });
        }}
        onReturnToEntry={() => setShowNoMatchHandler(false)}
      />
    );
  }

  // Check for low confidence matches
  const highestScore = Math.max(...potentialMatches.map(m => m.score));
  const isLowConfidence = highestScore < 0.6;

  if (isLowConfidence) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-700 dark:text-yellow-300">
            <strong>Low Confidence Matches:</strong> The system found potential matches but with low confidence scores. Please review carefully or save for manual review.
          </AlertDescription>
        </Alert>

        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Potential Matches (Low Confidence)</h3>
          <Button 
            variant="outline" 
            onClick={() => setShowNoMatchHandler(true)}
            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
          >
            Save for Manual Review
          </Button>
        </div>

        <MatchingInterface
          matchData={[{
            sourceRecord: submittedRecord,
            potentialMatches
          }]}
          onMatchComplete={onMatchComplete}
        />
      </div>
    );
  }

  // Show normal matching interface for good matches
  return (
    <div className="space-y-6">
      {communityRecords.length === 0 && (
        <Alert className="bg-amber-50 border-amber-300 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            <strong>Limited Matching:</strong> No community HDSS database loaded. Matching capabilities are limited.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Potential Matches Found</h3>
        <div className="text-sm text-gray-500">
          {potentialMatches.length} potential matches for review
        </div>
      </div>

      <MatchingInterface
        matchData={[{
          sourceRecord: submittedRecord,
          potentialMatches
        }]}
        onMatchComplete={onMatchComplete}
      />
    </div>
  );
};

export default MatchesTab;

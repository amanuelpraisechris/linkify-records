
import { Record } from '@/types';
import { AlertCircle, Database, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import MatchingInterface from '@/components/MatchingInterface';

interface MatchesTabProps {
  submittedRecord: Record | null;
  potentialMatches: Array<{
    record: Record;
    score: number;
    matchedOn: string[];
    fieldScores?: {[key: string]: number};
  }>;
  communityRecords: Record[];
  onMatchComplete: (result: any) => void;
}

const MatchesTab = ({
  submittedRecord,
  potentialMatches,
  communityRecords,
  onMatchComplete
}: MatchesTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-3">
        <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Potential Matches in HDSS Database</h2>
          
          {submittedRecord && potentialMatches.length > 0 ? (
            <MatchingInterface 
              matchData={[{
                sourceRecord: submittedRecord,
                potentialMatches: potentialMatches
              }]}
              onMatchComplete={onMatchComplete}
            />
          ) : submittedRecord ? (
            <div className="bg-muted/30 p-6 rounded-lg border border-muted">
              <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-5 w-5" />
                <h3 className="text-lg font-medium">No potential matches found</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                No potential matches were found for the submitted record in the HDSS database.
              </p>
              
              {communityRecords.length === 0 ? (
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                  <Database className="h-4 w-4" />
                  <AlertTitle>Community Database Required</AlertTitle>
                  <AlertDescription>
                    You need to import the community HDSS database first to enable matching functionality.
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900/50">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Try refining your search</AlertTitle>
                  <AlertDescription>
                    Consider checking the spelling of names, verify date of birth, or try including additional identifiers such as village or household information.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Submit a clinic record to see potential matches in the HDSS database.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesTab;

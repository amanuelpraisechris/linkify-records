
import { Record } from '@/types';
import { AlertCircle, Database, Info } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import MatchingInterface from '@/components/MatchingInterface';
import RecordTableView from '@/components/RecordTableView';
import { useState } from 'react';
import RecordNotes from '../record-table/RecordNotes';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';

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
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Record | null>(null);
  const [matchNotes, setMatchNotes] = useState<string>('');
  const { toast } = useToast();

  const toggleRecordDetails = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const handleAssignMatch = (record: Record) => {
    setSelectedMatch(record);
  };

  const handleSaveNotes = (record: Record, notes: string) => {
    if (submittedRecord) {
      const result = {
        sourceId: submittedRecord.id,
        matchId: record.id,
        status: 'matched',
        confidence: record.fuzzyScore || record.metadata?.matchScore || 0,
        matchedBy: 'manual-selection',
        matchedAt: new Date().toISOString(),
        notes: notes,
        fieldScores: record.fieldScores
      };
      
      onMatchComplete(result);
      
      toast({
        title: "Match Saved",
        description: "The selected match and notes have been saved successfully.",
      });
      
      setSelectedMatch(null);
      setMatchNotes('');
    }
  };

  // Get top 20 matches sorted by score
  const topMatches = [...potentialMatches]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(match => ({
      ...match.record,
      fuzzyScore: match.score,
      matchedOn: match.matchedOn,
      fieldScores: match.fieldScores
    }));

  return (
    <div className="grid grid-cols-1 gap-8">
      <div>
        <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
          <h2 className="text-xl font-semibold mb-4">Potential Matches in HDSS Database</h2>
          
          {submittedRecord && potentialMatches.length > 0 ? (
            <div className="space-y-6">
              <div className="bg-muted/30 p-4 rounded-lg border">
                <h3 className="text-lg font-medium mb-2">Source Record</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <p className="font-medium">{submittedRecord.firstName} {submittedRecord.middleName || ''} {submittedRecord.lastName}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gender:</span>
                    <p className="font-medium">{submittedRecord.sex}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Birth Date:</span>
                    <p className="font-medium">{submittedRecord.birthDate}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Village:</span>
                    <p className="font-medium">{submittedRecord.village || '-'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sub-Village:</span>
                    <p className="font-medium">{submittedRecord.subVillage || '-'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">Top 20 Potential Matches</h3>
                  <p className="text-sm text-muted-foreground">Select the best match record</p>
                </div>
                
                {topMatches.length > 0 ? (
                  <RecordTableView 
                    records={topMatches}
                    expandedRecord={expandedRecord}
                    toggleRecordDetails={toggleRecordDetails}
                    showMatchDetail={true}
                    onAssignMatch={handleAssignMatch}
                    onSaveNotes={handleSaveNotes}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No potential matches found.
                  </div>
                )}
              </div>
              
              {selectedMatch && (
                <div className="border p-4 rounded-lg bg-muted/20 mt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Selected Match: {selectedMatch.firstName} {selectedMatch.lastName}</h4>
                    <div className="flex items-center gap-2">
                      <Checkbox 
                        id="confirm-match" 
                        checked={true} 
                      />
                      <label 
                        htmlFor="confirm-match"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Confirm Selection
                      </label>
                    </div>
                  </div>
                  
                  <RecordNotes 
                    record={selectedMatch}
                    noteText={matchNotes}
                    onNoteChange={setMatchNotes}
                    onSaveNotes={() => handleSaveNotes(selectedMatch, matchNotes)}
                  />
                </div>
              )}
            </div>
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

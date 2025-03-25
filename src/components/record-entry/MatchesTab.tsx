
import { Record, MatchResult } from '@/types';
import { AlertCircle, Database, Info, Download } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import RecordTableView from '@/components/RecordTableView';
import { useState, useEffect } from 'react';
import RecordNotes from '../record-table/RecordNotes';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Record | null>(null);
  const [matchNotes, setMatchNotes] = useState<string>('');
  const [failedLinkages, setFailedLinkages] = useState<Array<{
    timestamp: string;
    sourceRecord: any;
    reason: string;
  }>>([]);
  const { toast } = useToast();

  // Load failed linkages from localStorage on component mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('failedLinkages');
      if (saved) {
        setFailedLinkages(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading failed linkages:', error);
    }
    
    // Update search attempts status if matches are found
    if (submittedRecord && potentialMatches.length > 0) {
      try {
        const savedAttempts = localStorage.getItem('searchAttempts');
        if (savedAttempts) {
          const attempts = JSON.parse(savedAttempts);
          // Find the most recent attempt for this record
          const updatedAttempts = attempts.map((attempt: any) => {
            if (attempt.query === `${submittedRecord.firstName} ${submittedRecord.lastName}` && !attempt.success) {
              return { ...attempt, success: true };
            }
            return attempt;
          });
          localStorage.setItem('searchAttempts', JSON.stringify(updatedAttempts));
        }
      } catch (error) {
        console.error('Error updating search attempts:', error);
      }
    }
  }, [submittedRecord, potentialMatches]);

  // Save failed linkages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('failedLinkages', JSON.stringify(failedLinkages));
  }, [failedLinkages]);

  const toggleRecordDetails = (recordId: string) => {
    setExpandedRecord(expandedRecord === recordId ? null : recordId);
  };

  const handleAssignMatch = (record: Record) => {
    setSelectedMatch(record);
  };

  const handleSaveNotes = (record: Record, notes: string) => {
    if (submittedRecord) {
      const result: MatchResult = {
        sourceId: submittedRecord.id,
        matchId: record.id,
        status: 'matched', // Using the correct union type value
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

  const handleNoMatchFound = () => {
    if (submittedRecord) {
      // Log the failed linkage
      const newFailure = {
        timestamp: new Date().toISOString(),
        sourceRecord: {
          id: submittedRecord.id,
          firstName: submittedRecord.firstName,
          lastName: submittedRecord.lastName,
          birthDate: submittedRecord.birthDate,
          gender: submittedRecord.sex || submittedRecord.gender
        },
        reason: "No suitable match found in HDSS database"
      };
      
      setFailedLinkages(prev => [newFailure, ...prev]);
      
      // Create a match result with status 'manual-review' instead of 'no-match'
      const result: MatchResult = {
        sourceId: submittedRecord.id,
        matchId: null,
        status: 'manual-review', // Changed from 'no-match' to an allowed value
        confidence: 0,
        matchedBy: 'manual-review',
        matchedAt: new Date().toISOString(),
        notes: "No suitable match found in HDSS database",
        fieldScores: {}
      };
      
      onMatchComplete(result);
      
      toast({
        title: "Record Processed",
        description: "The record has been marked as having no suitable match.",
      });
    }
  };

  const exportFailedLinkages = () => {
    if (failedLinkages.length === 0) {
      toast({
        title: "Export Failed",
        description: "No failed linkages to export.",
        variant: "destructive"
      });
      return;
    }
    
    const worksheet = XLSX.utils.json_to_sheet(failedLinkages);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Linkages");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(dataBlob, `failed-linkages-${new Date().toISOString().slice(0, 10)}.xlsx`);
    
    toast({
      title: "Export Successful",
      description: `Exported ${failedLinkages.length} failed linkage records.`,
    });
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
    <div className="grid grid-cols-1 gap-6">
      <div>
        <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Potential Matches in HDSS Database</h2>
            
            {failedLinkages.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportFailedLinkages}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export Failed Linkages ({failedLinkages.length})
              </Button>
            )}
          </div>
          
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
              
              <div className="flex justify-between items-center">
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
                
                <Button
                  variant="secondary"
                  onClick={handleNoMatchFound}
                  className="ml-4"
                >
                  Save as No Match Found
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Submit a clinic record to see potential matches in the HDSS database.
            </div>
          )}
          
          {failedLinkages.length > 0 && (
            <div className="mt-6 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium">Recent Failed Linkages</h3>
                <span className="text-xs text-muted-foreground">
                  Total: {failedLinkages.length}
                </span>
              </div>
              
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Timestamp</th>
                      <th className="px-3 py-2 text-left">Patient</th>
                      <th className="px-3 py-2 text-left">Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {failedLinkages.slice(0, 5).map((failure, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2">
                          {new Date(failure.timestamp).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">
                          {failure.sourceRecord.firstName} {failure.sourceRecord.lastName}
                        </td>
                        <td className="px-3 py-2">
                          {failure.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchesTab;

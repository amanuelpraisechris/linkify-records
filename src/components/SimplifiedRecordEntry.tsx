/**
 * Simplified Record Entry - PIRL Workflow
 * Linear workflow: Consent → Enter Data → Match → Save
 */

import { useState } from 'react';
import { Record, MatchResult } from '@/types';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  User,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Database
} from 'lucide-react';
import ConsentWorkflowTab from './record-entry/ConsentWorkflowTab';
import RecordEntryForm from './RecordEntryForm';
import PIRLMatchingView from './matching-interface/PIRLMatchingView';
import MatchedRecordsViewer from './MatchedRecordsViewer';
import { useMatchesState } from '@/hooks/useMatchesState';

const SimplifiedRecordEntry = () => {
  const { communityRecords, clinicRecords, matchResults } = useRecordData();
  const { toast } = useToast();
  const [consentCollapsed, setConsentCollapsed] = useState(false);
  const [currentStep, setCurrentStep] = useState<'consent' | 'entry' | 'matching'>('consent');

  const {
    potentialMatches,
    submittedRecord,
    consentData,
    handleConsentComplete,
    handleRecordSubmit,
    handleMatchComplete
  } = useMatchesState();

  // Matching state
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const [matchNotes, setMatchNotes] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const handleConsentGiven = (consent: any) => {
    handleConsentComplete(consent);
    setConsentCollapsed(true);
    setCurrentStep('entry');
    toast({
      title: "Consent Obtained",
      description: "You can now enter patient data.",
    });
  };

  const handlePatientDataSubmit = (record: Record) => {
    if (communityRecords.length === 0) {
      toast({
        title: "No Database Loaded",
        description: "Please load the community database first.",
        variant: "destructive"
      });
      return;
    }

    handleRecordSubmit(record);
    setCurrentStep('matching');
    toast({
      title: "Searching Database",
      description: `Searching ${communityRecords.length} HDSS records for matches...`,
    });
  };

  const handleSelectMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
  };

  const handleSaveMatch = () => {
    if (!selectedMatchId || !submittedRecord) return;

    setIsMatching(true);
    const selectedMatch = potentialMatches.find(m => m.record.id === selectedMatchId);

    const result: MatchResult = {
      sourceId: submittedRecord.id,
      matchId: selectedMatchId,
      status: 'matched',
      confidence: selectedMatch?.score || 0,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
      notes: matchNotes
    };

    handleMatchComplete(result);

    setTimeout(() => {
      setIsMatching(false);
      setSelectedMatchId(null);
      setMatchNotes('');
      setCurrentStep('entry');

      toast({
        title: "Match Saved Successfully",
        description: "Record has been linked and saved with timestamp.",
      });
    }, 500);
  };

  const handleNoMatch = () => {
    if (!submittedRecord) return;

    const result: MatchResult = {
      sourceId: submittedRecord.id,
      matchId: null,
      status: 'rejected',
      confidence: 0,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
      notes: matchNotes || 'No suitable match found - saved for manual review'
    };

    handleMatchComplete(result);
    setCurrentStep('entry');

    toast({
      title: "No Match Recorded",
      description: "Record saved for manual review.",
      variant: "destructive"
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <Search className="w-8 h-8 text-primary" />
          Interactive Record Linkage
        </h1>
        <p className="text-muted-foreground">
          Simple workflow: Obtain consent → Enter patient data → Match with HDSS → Save
        </p>
      </div>

      {/* Database Status */}
      {communityRecords.length === 0 && (
        <Alert className="mb-6 border-yellow-600 bg-yellow-50 dark:bg-yellow-950">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800 dark:text-yellow-300">
            <strong>Warning:</strong> Community database not loaded. Please load the HDSS database before matching records.
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Consent */}
      <Card className="mb-6">
        <CardHeader
          className="cursor-pointer"
          onClick={() => currentStep !== 'consent' && setConsentCollapsed(!consentCollapsed)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                consentData?.consentGiven ? 'bg-green-600' : 'bg-primary'
              }`}>
                {consentData?.consentGiven ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white font-bold">1</span>
                )}
              </div>
              <div>
                <CardTitle>Patient Consent</CardTitle>
                <CardDescription>
                  {consentData?.consentGiven
                    ? `✓ ${consentData.consentType} consent obtained on ${new Date(consentData.consentDate).toLocaleDateString()}`
                    : 'Obtain patient consent before proceeding'}
                </CardDescription>
              </div>
            </div>
            {consentData?.consentGiven && currentStep !== 'consent' && (
              <Button variant="ghost" size="sm">
                {consentCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
        {(!consentCollapsed || currentStep === 'consent') && (
          <CardContent>
            <ConsentWorkflowTab
              inputLanguage="latin"
              onConsentComplete={handleConsentGiven}
              onProceedToEntry={() => setCurrentStep('entry')}
            />
          </CardContent>
        )}
      </Card>

      {/* Step 2: Patient Data Entry */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              submittedRecord ? 'bg-green-600' : currentStep === 'entry' ? 'bg-primary' : 'bg-muted'
            }`}>
              {submittedRecord ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white font-bold">2</span>
              )}
            </div>
            <div>
              <CardTitle>Enter Patient Data</CardTitle>
              <CardDescription>
                {submittedRecord
                  ? `✓ Patient data entered - ${potentialMatches.length} potential matches found`
                  : 'Enter clinic patient information'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!consentData?.consentGiven ? (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Please obtain patient consent first (Step 1 above).
              </AlertDescription>
            </Alert>
          ) : (
            <RecordEntryForm
              onRecordSubmit={handlePatientDataSubmit}
            />
          )}
        </CardContent>
      </Card>

      {/* Step 3: Matching Results */}
      {currentStep === 'matching' && submittedRecord && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">3</span>
              </div>
              <div>
                <CardTitle>Match with HDSS Database</CardTitle>
                <CardDescription>
                  {potentialMatches.length > 0
                    ? `Found ${Math.min(potentialMatches.length, 20)} potential matches - select the best match`
                    : 'No matches found in the database'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {potentialMatches.length > 0 ? (
              <PIRLMatchingView
                currentMatch={{
                  sourceRecord: submittedRecord,
                  potentialMatches
                }}
                selectedMatchId={selectedMatchId}
                handleSelectMatch={handleSelectMatch}
                handleSaveSelectedMatch={handleSaveMatch}
                matchNotes={matchNotes}
                setMatchNotes={setMatchNotes}
                isLoading={isMatching}
                handleMatch={(matchId, confidence, status) => {
                  if (status === 'rejected') {
                    handleNoMatch();
                  }
                }}
              />
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                <Database className="w-16 h-16 mx-auto mb-4 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
                <p className="text-muted-foreground mb-6">
                  No records in the HDSS database match this patient's information.
                </p>
                <Button
                  onClick={handleNoMatch}
                  variant="destructive"
                >
                  Save for Manual Review
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Matched Records Section */}
      <MatchedRecordsViewer
        matchResults={matchResults || []}
        sourceRecords={clinicRecords || []}
        targetRecords={communityRecords || []}
      />
    </div>
  );
};

export default SimplifiedRecordEntry;


import { useState } from 'react';
import { RecordMatch, MatchResult } from '@/types';
import RecordCard from './RecordCard';
import { useToast } from '@/components/ui/use-toast';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, HelpCircle, ClipboardList, FileText, Save } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MatchingInterfaceProps {
  matchData: RecordMatch[];
  onMatchComplete?: (result: MatchResult) => void;
}

const MatchingInterface = ({ matchData, onMatchComplete }: MatchingInterfaceProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [matchNotes, setMatchNotes] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [activeTab, setActiveTab] = useState('matching');
  const [selectedMatchId, setSelectedMatchId] = useState<string | null>(null);
  const { toast } = useToast();
  const { config } = useMatchingConfig();

  // Make sure we have access to the current match
  const currentMatch = matchData && matchData.length > 0 && currentIndex < matchData.length 
    ? matchData[currentIndex] 
    : null;

  const getConfidenceLevel = (score: number) => {
    if (score >= config.threshold.high) return 'high';
    if (score >= config.threshold.medium) return 'medium';
    return 'low';
  };

  const renderConfidenceBadge = (score: number) => {
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

  const handleSelectMatch = (matchId: string) => {
    console.log("Match selected:", matchId);
    setSelectedMatchId(matchId === selectedMatchId ? null : matchId);
  };

  const handleSaveSelectedMatch = () => {
    console.log("Saving selected match:", selectedMatchId);
    console.log("Consent given:", consentGiven);
    
    if (!selectedMatchId) {
      toast({
        title: "No Match Selected",
        description: "Please select a match record before saving.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (!consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please confirm that the patient has consented to link their records before saving a match.",
        variant: "destructive",
        duration: 5000,
      });
      setActiveTab('consent');
      return;
    }
    
    // Make sure currentMatch is available before proceeding
    if (!currentMatch) {
      console.error("currentMatch is not available");
      toast({
        title: "Error",
        description: "Match data is not available.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    // Get the selected match details
    const selectedMatch = currentMatch.potentialMatches.find(m => m.record.id === selectedMatchId);
    
    if (!selectedMatch) {
      setIsLoading(false);
      console.error("Selected match not found in potentialMatches");
      toast({
        title: "Error",
        description: "Could not find the selected match details.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    console.log("Selected match found:", selectedMatch);
    
    // Create the match result
    const result: MatchResult = {
      sourceId: currentMatch.sourceRecord.id,
      matchId: selectedMatchId,
      status: 'matched',
      confidence: selectedMatch.score,
      matchedBy: 'user',
      matchedAt: new Date().toISOString(),
      notes: matchNotes,
      fieldScores: selectedMatch.fieldScores,
      consentObtained: consentGiven,
      consentDate: new Date().toISOString()
    };
    
    console.log("Created result object:", result);
    
    // Save the result
    setTimeout(() => {
      setResults([...results, result]);
      
      if (onMatchComplete) {
        console.log("Calling onMatchComplete with result");
        onMatchComplete(result);
      } else {
        console.warn("onMatchComplete callback is not defined");
      }
      
      toast({
        title: "Match Saved",
        description: `The selected match has been saved successfully with a ${selectedMatch.score}% confidence score.`,
        duration: 3000,
      });
      
      // Reset for next match
      setMatchNotes('');
      setSelectedMatchId(null);
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
      setIsLoading(false);
      setActiveTab('matching');
    }, 600);
  };

  const handleMatch = (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => {
    if (!consentGiven && status === 'matched') {
      toast({
        title: "Consent Required",
        description: "Please confirm that the patient has consented to link their records before assigning a match.",
        variant: "destructive",
        duration: 5000,
      });
      setActiveTab('consent');
      return;
    }
    
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
        notes: matchNotes,
        fieldScores: matchId ? currentMatch.potentialMatches.find(m => m.record.id === matchId)?.fieldScores : undefined,
        consentObtained: consentGiven,
        consentDate: new Date().toISOString()
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
      
      // Reset notes for next match
      setMatchNotes('');
      setSelectedMatchId(null);
      
      // Move to the next match if available
      if (currentIndex < matchData.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
      
      setIsLoading(false);
      
      // Switch back to matching tab
      setActiveTab('matching');
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="matching">Match Records</TabsTrigger>
          <TabsTrigger value="consent">Patient Consent</TabsTrigger>
          <TabsTrigger value="history">
            <ClipboardList className="w-4 h-4 mr-2" />
            Match History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matching" className="space-y-6">
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
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Potential Matches</h3>
              <span className="text-sm text-muted-foreground">
                Match {currentIndex + 1} of {matchData.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Select a matching record below and click "Save Selected Match" to save it.
            </p>
            
            <div className="space-y-4 animate-slide-up">
              {currentMatch.potentialMatches.length > 0 ? (
                currentMatch.potentialMatches.map((match, idx) => (
                  <div key={match.record.id} className="relative animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
                    <div className="absolute right-4 top-4 z-10">
                      {renderConfidenceBadge(match.score)}
                    </div>
                    
                    <div 
                      className={`border-2 rounded-lg cursor-pointer transition-all ${
                        selectedMatchId === match.record.id 
                          ? 'border-primary shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleSelectMatch(match.record.id)}
                    >
                      <RecordCard 
                        record={match.record}
                        showActions={false}
                        matchScore={match.score}
                        matchedOn={match.matchedOn}
                      />
                    </div>
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
            
            {currentMatch.potentialMatches.length > 0 && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="default"
                  onClick={handleSaveSelectedMatch}
                  disabled={isLoading || !selectedMatchId}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Selected Match
                </Button>
              </div>
            )}
          </div>
          
          <div className="bg-muted/20 p-4 rounded-lg border border-border">
            <h4 className="font-medium mb-2 flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Match Notes
            </h4>
            <Textarea
              placeholder="Enter any notes about this match (e.g., discrepancies in names, confirmation method, etc.)"
              value={matchNotes}
              onChange={(e) => setMatchNotes(e.target.value)}
              className="min-h-[100px] mb-2"
            />
            <p className="text-xs text-muted-foreground">
              These notes will be saved with the match record and can be referenced later.
            </p>
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => handleMatch(null, 0, 'manual-review')}
              disabled={isLoading}
            >
              Skip for Now
            </Button>
            
            <Button
              onClick={() => setActiveTab('consent')}
              disabled={isLoading}
              variant="default"
            >
              Proceed to Consent
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="consent">
          <div className="bg-white dark:bg-black border rounded-xl p-6 shadow-subtle space-y-4">
            <h3 className="text-xl font-semibold mb-2">Patient Consent for Record Linkage</h3>
            <p className="text-muted-foreground">
              Before linking patient records, you must obtain and document the patient's consent to link their clinical data with their HDSS record.
            </p>
            
            <div className="border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/20 p-4 text-amber-800 dark:text-amber-300">
              <h4 className="font-semibold mb-1">Consent Process</h4>
              <p className="text-sm">
                Please read the following to the patient:
              </p>
              <p className="text-sm mt-2 italic">
                "We would like to link your clinical records with your community demographic records to improve healthcare coordination. This will help us better understand health patterns in your community and improve services. Your information will remain confidential and only authorized personnel will have access. Do you consent to this linkage?"
              </p>
            </div>
            
            <div className="flex items-start space-x-2 pt-4">
              <Checkbox 
                id="consent" 
                checked={consentGiven} 
                onCheckedChange={(checked) => setConsentGiven(checked === true)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="consent" className="font-medium">
                  I confirm that the patient has given verbal consent for record linkage
                </Label>
                <p className="text-sm text-muted-foreground">
                  By checking this box, you are confirming that you have explained the purpose of record linkage to the patient and they have consented.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={() => setActiveTab('matching')}>
                Back to Matching
              </Button>
              <Button 
                onClick={() => setActiveTab('matching')}
                disabled={!consentGiven}
              >
                Confirm Consent
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchingInterface;

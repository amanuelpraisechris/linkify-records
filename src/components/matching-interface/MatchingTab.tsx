
import { useState } from 'react';
import { RecordMatch } from '@/types';
import RecordCard from '../RecordCard';
import { Save, FileText, UserCheck, Users, BarChart3, LayoutList, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PIRLMatchingView from './PIRLMatchingView';

interface MatchingTabProps {
  currentMatch: RecordMatch;
  selectedMatchId: string | null;
  handleSelectMatch: (matchId: string) => void;
  handleSaveSelectedMatch: () => void;
  matchNotes: string;
  setMatchNotes: (notes: string) => void;
  isLoading: boolean;
  handleMatch: (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => void;
  setActiveTab: (tab: string) => void;
}

const MatchingTab = ({
  currentMatch,
  selectedMatchId,
  handleSelectMatch,
  handleSaveSelectedMatch,
  matchNotes,
  setMatchNotes,
  isLoading,
  handleMatch,
  setActiveTab
}: MatchingTabProps) => {
  const [interfaceMode, setInterfaceMode] = useState<'pirl' | 'standard'>('pirl');

  return (
    <div className="space-y-6">
      {/* Interface Mode Toggle */}
      <Alert className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-blue-200">
        <AlertDescription className="flex items-center justify-between">
          <span className="text-sm font-medium">
            Choose your preferred matching interface:
          </span>
          <div className="flex gap-2">
            <Button
              variant={interfaceMode === 'pirl' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInterfaceMode('pirl')}
              className="gap-2"
            >
              <GitCompare className="w-4 h-4" />
              PIRL View (Recommended)
            </Button>
            <Button
              variant={interfaceMode === 'standard' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInterfaceMode('standard')}
              className="gap-2"
            >
              <LayoutList className="w-4 h-4" />
              Standard View
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Render Selected Interface */}
      {interfaceMode === 'pirl' ? (
        <PIRLMatchingView
          currentMatch={currentMatch}
          selectedMatchId={selectedMatchId}
          handleSelectMatch={handleSelectMatch}
          handleSaveSelectedMatch={handleSaveSelectedMatch}
          matchNotes={matchNotes}
          setMatchNotes={setMatchNotes}
          isLoading={isLoading}
          handleMatch={handleMatch}
        />
      ) : (
        <StandardMatchingView
          currentMatch={currentMatch}
          selectedMatchId={selectedMatchId}
          handleSelectMatch={handleSelectMatch}
          handleSaveSelectedMatch={handleSaveSelectedMatch}
          matchNotes={matchNotes}
          setMatchNotes={setMatchNotes}
          isLoading={isLoading}
          handleMatch={handleMatch}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
};

// Original Standard Matching View (moved from main component)
const StandardMatchingView = ({
  currentMatch,
  selectedMatchId,
  handleSelectMatch,
  handleSaveSelectedMatch,
  matchNotes,
  setMatchNotes,
  isLoading,
  handleMatch,
  setActiveTab
}: MatchingTabProps) => {
  return (
    <div className="space-y-8">
      {/* Premium Header with Status Indicator */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-xl border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <h2 className="text-xl font-semibold text-foreground">Interactive Record Linkage Session</h2>
          </div>
          <div className="bg-primary/20 px-3 py-1 rounded-full">
            <span className="text-sm font-medium text-primary">Active Matching</span>
          </div>
        </div>
        <p className="text-muted-foreground">
          Review potential matches below and select the best match, or proceed with manual review if no suitable match is found.
        </p>
      </div>

      {/* Source Record Section */}
      <div className="relative bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-primary rounded-full shadow-lg shadow-primary/20"></div>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Source Record</h3>
            <p className="text-sm text-muted-foreground">New patient record requiring linkage</p>
          </div>
        </div>
        
        <div className="animate-fade-in">
          <RecordCard record={currentMatch.sourceRecord} isHighlighted />
        </div>
      </div>
      
      {/* Potential Matches Section */}
      <div className="bg-card/30 p-6 rounded-xl border border-border/50">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Potential Matches</h3>
              <p className="text-sm text-muted-foreground">
                {currentMatch.potentialMatches.length} candidate record(s) found
              </p>
            </div>
          </div>
          {currentMatch.potentialMatches.length > 0 && (
            <div className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Click to select • Confidence scores shown
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          {currentMatch.potentialMatches.length > 0 ? (
            currentMatch.potentialMatches.map((match, idx) => (
              <div 
                key={match.record.id} 
                className="relative group animate-fade-in" 
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div 
                  className={`border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedMatchId === match.record.id 
                      ? 'border-primary shadow-xl shadow-primary/10 bg-primary/5 ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50 hover:bg-card/50'
                  }`}
                  onClick={() => handleSelectMatch(match.record.id)}
                >
                  {/* Premium Match Indicator */}
                  {selectedMatchId === match.record.id && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium shadow-lg">
                      ✓ Selected
                    </div>
                  )}
                  
                  {/* Confidence Score Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      match.score >= 80 ? 'bg-green-100 text-green-800 border border-green-200' :
                      match.score >= 60 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                      'bg-orange-100 text-orange-800 border border-orange-200'
                    }`}>
                      {match.score}% match
                    </div>
                  </div>

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
            <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-muted/40 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
              <h4 className="text-lg font-medium mb-2">No Potential Matches Found</h4>
              <p className="text-muted-foreground mb-6">
                No existing records meet the matching criteria for this patient.
              </p>
              <Button
                onClick={() => handleMatch(null, 0, 'manual-review')}
                disabled={isLoading}
                className="bg-secondary hover:bg-secondary/90"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Send for Manual Review
              </Button>
            </div>
          )}
        </div>
        
        {currentMatch.potentialMatches.length > 0 && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleSaveSelectedMatch}
              disabled={isLoading || !selectedMatchId}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Save className="w-5 h-5 mr-2" />
              Confirm Selected Match
            </Button>
          </div>
        )}
      </div>
      
      {/* Premium Notes Section */}
      <div className="bg-gradient-to-r from-muted/10 to-muted/5 p-6 rounded-xl border border-border/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-muted/20 rounded-lg">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h4 className="font-semibold">Clinical Notes & Documentation</h4>
            <p className="text-sm text-muted-foreground">Record any observations or verification details</p>
          </div>
        </div>
        <Textarea
          placeholder="Enter clinical notes, verification details, or any discrepancies observed during the matching process..."
          value={matchNotes}
          onChange={(e) => setMatchNotes(e.target.value)}
          className="min-h-[120px] mb-3 bg-background/80 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            ✓ Notes are automatically saved and can be referenced in audit trails
          </p>
          <div className="text-xs text-muted-foreground">
            {matchNotes.length}/500 characters
          </div>
        </div>
      </div>
      
      {/* Premium Action Bar */}
      <div className="bg-card/50 p-6 rounded-xl border border-border/50 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => handleMatch(null, 0, 'manual-review')}
              disabled={isLoading}
              className="border-border/50 hover:border-secondary/50 hover:bg-secondary/10"
            >
              <FileText className="w-4 h-4 mr-2" />
              Manual Review
            </Button>
            
            <Button
              variant="outline"
              onClick={() => handleMatch(null, 0, 'rejected')}
              disabled={isLoading}
              className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50"
            >
              No Match Found
            </Button>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => setActiveTab('consent')}
              className="bg-secondary/20 hover:bg-secondary/30 border border-secondary/30"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Patient Consent
            </Button>
            
            <Button
              onClick={() => setActiveTab('history')}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              View History
            </Button>
          </div>
        </div>
        
        {isLoading && (
          <div className="mt-4 flex items-center justify-center space-x-2 text-muted-foreground">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span>Processing match result...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingTab;

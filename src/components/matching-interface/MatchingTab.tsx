
import { useState } from 'react';
import { RecordMatch } from '@/types';
import RecordCard from '../RecordCard';
import { Save, FileText, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Potential Matches</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Select a matching record below and click "Save Selected Match" to save it.
        </p>
        
        <div className="space-y-4 animate-slide-up">
          {currentMatch.potentialMatches.length > 0 ? (
            currentMatch.potentialMatches.map((match, idx) => (
              <div key={match.record.id} className="relative animate-fade-in" style={{ animationDelay: `${idx * 100}ms` }}>
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
        
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={() => setActiveTab('consent')}
            className="flex items-center"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            End Session / Check Consent / New Patient
          </Button>
          
          <Button
            onClick={() => setActiveTab('consent')}
            disabled={isLoading}
            variant="default"
          >
            Proceed to Consent
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchingTab;

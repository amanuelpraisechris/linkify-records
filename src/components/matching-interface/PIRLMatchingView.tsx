/**
 * PIRL-Style Matching View
 * Inspired by Point-of-contact Interactive Record Linkage (PIRL) interface design
 * Features: Side-by-side comparison, ranked matches, clear status indicators
 */

import { useState } from 'react';
import { RecordMatch } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import SideBySideComparison from './SideBySideComparison';
import RecordCard from '../RecordCard';
import {
  CheckCircle2,
  XCircle,
  FileX,
  Eye,
  List,
  GitCompare,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

interface PIRLMatchingViewProps {
  currentMatch: RecordMatch;
  selectedMatchId: string | null;
  handleSelectMatch: (matchId: string) => void;
  handleSaveSelectedMatch: () => void;
  matchNotes: string;
  setMatchNotes: (notes: string) => void;
  isLoading: boolean;
  handleMatch: (matchId: string | null, confidence: number, status: 'matched' | 'rejected' | 'manual-review') => void;
}

const PIRLMatchingView = ({
  currentMatch,
  selectedMatchId,
  handleSelectMatch,
  handleSaveSelectedMatch,
  matchNotes,
  setMatchNotes,
  isLoading,
  handleMatch
}: PIRLMatchingViewProps) => {
  const [viewMode, setViewMode] = useState<'list' | 'comparison'>('list');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const selectedMatch = currentMatch.potentialMatches.find(m => m.record.id === selectedMatchId);

  // Get top 20 matches (PIRL spec)
  const top20Matches = currentMatch.potentialMatches.slice(0, 20);

  return (
    <div className="space-y-6">
      {/* PIRL Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-2">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                Point-of-Contact Record Linkage
              </h2>
              <p className="text-muted-foreground mt-1">
                Interactive matching session • Top {Math.min(top20Matches.length, 20)} candidates displayed
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-base px-3 py-1">
                Session Active
              </Badge>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Matches Found</div>
                <div className="text-2xl font-bold">{top20Matches.length}</div>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-background/50 p-1 rounded-lg w-fit">
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              List View
            </Button>
            <Button
              variant={viewMode === 'comparison' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('comparison')}
              disabled={!selectedMatchId}
              className="gap-2"
            >
              <GitCompare className="w-4 h-4" />
              Side-by-Side
            </Button>
          </div>
        </div>
      </Card>

      {/* Patient Record (Source) */}
      <Card className="border-l-4 border-l-blue-600">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <h3 className="text-lg font-semibold">Patient Record (Source)</h3>
            <Badge variant="secondary">New Visit</Badge>
          </div>
          <RecordCard record={currentMatch.sourceRecord} isHighlighted />
        </div>
      </Card>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        // List View - Show all ranked matches
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <h3 className="text-lg font-semibold">Ranked Matches from HDSS Database</h3>
              </div>
              {top20Matches.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Click to select • {top20Matches.length} candidates
                </span>
              )}
            </div>

            <div className="space-y-3">
              {top20Matches.length > 0 ? (
                top20Matches.map((match, idx) => (
                  <div
                    key={match.record.id}
                    className={`relative border-2 rounded-xl transition-all ${
                      selectedMatchId === match.record.id
                        ? 'border-green-600 shadow-lg bg-green-50/50 dark:bg-green-950/20'
                        : 'border-border hover:border-green-300 hover:shadow-md cursor-pointer'
                    }`}
                    onClick={() => handleSelectMatch(match.record.id)}
                  >
                    {/* Rank Badge */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      #{idx + 1}
                    </div>

                    {/* Selected Indicator */}
                    {selectedMatchId === match.record.id && (
                      <div className="absolute -top-2 -right-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        SELECTED
                      </div>
                    )}

                    {/* Confidence Score */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        variant={match.score >= 80 ? 'default' : match.score >= 60 ? 'secondary' : 'destructive'}
                        className="text-base font-bold px-3 py-1"
                      >
                        {match.score}% Match
                      </Badge>
                    </div>

                    {/* Record Content */}
                    <div className="p-4 pt-6">
                      <RecordCard
                        record={match.record}
                        showActions={false}
                        matchScore={match.score}
                        matchedOn={match.matchedOn}
                      />
                    </div>

                    {/* Quick Actions for Selected */}
                    {selectedMatchId === match.record.id && (
                      <div className="border-t bg-green-50/50 dark:bg-green-950/30 p-3 flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewMode('comparison');
                          }}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Compare Details
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSaveSelectedMatch();
                          }}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Confirm Match
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-muted-foreground/20 rounded-xl">
                  <FileX className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                  <h4 className="text-lg font-medium mb-2">No Matches Found</h4>
                  <p className="text-muted-foreground mb-6">
                    No records in the HDSS database meet the matching criteria
                  </p>
                  <Button
                    onClick={() => handleMatch(null, 0, 'rejected')}
                    disabled={isLoading}
                    variant="destructive"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    No Match - Create New Record
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : (
        // Comparison View - Side-by-side comparison
        selectedMatch && (
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Detailed Comparison</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  Back to List
                </Button>
              </div>

              <SideBySideComparison
                sourceRecord={currentMatch.sourceRecord}
                matchedRecord={selectedMatch.record}
                matchScore={selectedMatch.score}
                matchedFields={selectedMatch.matchedOn}
              />
            </div>
          </Card>
        )
      )}

      {/* Match Notes */}
      <Card>
        <div className="p-6">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            Clinical Notes & Observations
          </h4>
          <Textarea
            placeholder="Document any discrepancies, verification steps, or important observations..."
            value={matchNotes}
            onChange={(e) => setMatchNotes(e.target.value)}
            className="min-h-[100px]"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Notes are saved with the match result and included in audit logs
          </p>
        </div>
      </Card>

      {/* Action Bar */}
      <Card className="bg-muted/30">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleMatch(null, 0, 'manual-review')}
                disabled={isLoading}
              >
                Manual Review Required
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleMatch(null, 0, 'rejected')}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                No Match Found
              </Button>
            </div>

            <Button
              onClick={handleSaveSelectedMatch}
              disabled={!selectedMatchId || isLoading}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 text-base gap-2"
              size="lg"
            >
              <CheckCircle2 className="w-5 h-5" />
              Confirm Match & Continue
            </Button>
          </div>

          {isLoading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span>Saving match result...</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PIRLMatchingView;

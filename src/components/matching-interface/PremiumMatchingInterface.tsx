import React from 'react';
import { RecordMatch, MatchResult } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Shield, Users, TrendingUp, Database } from 'lucide-react';
import { useMatchingProcess } from '@/hooks/matching-process';
import MatchingTab from './MatchingTab';
import ConsentTab from './ConsentTab';
import HistoryTab from './HistoryTab';
import MatchSummary from './MatchSummary';
import NoMatchesMessage from './NoMatchesMessage';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PremiumMatchingInterfaceProps {
  matchData: RecordMatch[];
  onMatchComplete?: (result: MatchResult) => void;
}

const PremiumMatchingInterface = ({ matchData, onMatchComplete }: PremiumMatchingInterfaceProps) => {
  const {
    currentIndex,
    results,
    isLoading,
    matchNotes,
    setMatchNotes,
    consentGiven,
    setConsentGiven,
    activeTab,
    setActiveTab,
    selectedMatchId,
    currentMatch,
    handleSelectMatch,
    handleSaveSelectedMatch,
    handleMatch
  } = useMatchingProcess({ matchData, onMatchComplete });

  if (!currentMatch) {
    return <NoMatchesMessage onManualReview={undefined} isLoading={isLoading} />;
  }

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-background via-background/95 to-background/90 rounded-xl border border-border/50 backdrop-blur-sm">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 p-6 rounded-xl border border-primary/20 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary/20 rounded-full">
              <Database className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PIRL Interactive Record Linkage
              </h1>
              <p className="text-muted-foreground">
                Point-of-contact Interactive Record Linkage System • Clinical-grade matching
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Session Status</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <MatchSummary 
          currentIndex={currentIndex} 
          matchDataLength={matchData.length}
          completedMatches={results.length}
        />
      </div>

      {/* Algorithm Status Alert */}
      <Alert className="border-blue-200 bg-blue-50/50">
        <TrendingUp className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-700 font-medium">
          Using Fellegi-Sunter probabilistic matching algorithm with Jaro-Winkler string comparison for optimal linkage accuracy.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6 h-12 bg-muted/30 rounded-xl p-1">
          <TabsTrigger 
            value="matching" 
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
          >
            <Users className="w-4 h-4 mr-2" />
            Match Records
          </TabsTrigger>
          <TabsTrigger 
            value="consent"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
          >
            <Shield className="w-4 h-4 mr-2" />
            Patient Consent
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium"
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Match History
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matching" className="space-y-6">
          <MatchingTab 
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
        </TabsContent>
        
        <TabsContent value="consent">
          <ConsentTab 
            consentGiven={consentGiven}
            setConsentGiven={setConsentGiven}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryTab 
            results={results}
            matchData={matchData}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumMatchingInterface;
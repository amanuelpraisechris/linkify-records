
import { RecordMatch, MatchResult } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList } from 'lucide-react';
import { useMatchingProcess } from '@/hooks/useMatchingProcess';
import MatchingTab from './matching-interface/MatchingTab';
import ConsentTab from './matching-interface/ConsentTab';
import HistoryTab from './matching-interface/HistoryTab';
import MatchSummary from './matching-interface/MatchSummary';
import NoMatchesMessage from './matching-interface/NoMatchesMessage';

interface MatchingInterfaceProps {
  matchData: RecordMatch[];
  onMatchComplete?: (result: MatchResult) => void;
}

const MatchingInterface = ({ matchData, onMatchComplete }: MatchingInterfaceProps) => {
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
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium">Potential Matches</h3>
            <MatchSummary 
              currentIndex={currentIndex} 
              matchDataLength={matchData.length} 
            />
          </div>
          
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

export default MatchingInterface;

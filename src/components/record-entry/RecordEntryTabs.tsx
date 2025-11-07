
import { FileText, Shield, Users, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Record, MatchResult } from '@/types';
import ConsentWorkflowTab from './ConsentWorkflowTab';
import RecordEntryTab from './RecordEntryTab';
import MatchesTab from './MatchesTab';
import ProgressReportTab from './ProgressReportTab';
import { SupportedLanguage } from '@/utils/languageUtils';

interface RecordEntryTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  clinicRecords: Record[];
  communityRecords: Record[];
  submittedRecord: Record | null;
  potentialMatches: Array<{
    record: Record; 
    score: number; 
    matchedOn: string[];
    fieldScores?: {[key: string]: number};
  }>;
  matchResults: MatchResult[];
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch: (record: Record) => void;
  onMatchComplete: (result: MatchResult) => void;
  inputLanguage?: SupportedLanguage;
  consentData?: {
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  };
  onConsentComplete?: (consentData: {
    consentGiven: boolean;
    consentType: 'written' | 'verbal' | 'previous';
    consentDate: string;
  }) => void;
}

const RecordEntryTabs = ({
  activeTab,
  setActiveTab,
  clinicRecords,
  communityRecords,
  submittedRecord,
  potentialMatches,
  matchResults,
  onRecordSubmit,
  onSaveForSearch,
  onMatchComplete,
  inputLanguage = 'latin',
  consentData,
  onConsentComplete
}: RecordEntryTabsProps) => {
  const getLocalizedText = (key: string) => {
    const texts = {
      latin: {
        consent: 'Patient Consent',
        entry: 'Record Entry',
        matches: 'Matches',
        progress: 'Progress Report'
      },
      amharic: {
        consent: 'የታካሚ ፈቃድ',
        entry: 'መዝገብ ግቤት',
        matches: 'ተዛማጅ',
        progress: 'የሂደት ሪፖርት'
      },
      tigrinya: {
        consent: 'ፍቓድ ሕሙም',
        entry: 'ምእታው መዝገብ',
        matches: 'ምትእስሳር',
        progress: 'ሪፖርት ሂደት'
      }
    };
    
    return texts[inputLanguage][key] || texts.latin[key];
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 grid grid-cols-4">
        <TabsTrigger value="consent" className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          {getLocalizedText('consent')}
        </TabsTrigger>
        <TabsTrigger 
          value="entry" 
          disabled={!consentData?.consentGiven}
          className="flex items-center gap-2"
        >
          <Users className="w-4 h-4" />
          {getLocalizedText('entry')}
        </TabsTrigger>
        <TabsTrigger value="matches" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {getLocalizedText('matches')}
        </TabsTrigger>
        <TabsTrigger value="progress-report" className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {getLocalizedText('progress')}
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="consent">
        <ConsentWorkflowTab 
          inputLanguage={inputLanguage}
          onConsentComplete={onConsentComplete || (() => {})}
          onProceedToEntry={() => setActiveTab('entry')}
        />
      </TabsContent>
      
      <TabsContent value="entry">
        <RecordEntryTab 
          clinicRecords={clinicRecords}
          communityRecords={communityRecords}
          onRecordSubmit={onRecordSubmit}
          onSaveForSearch={onSaveForSearch}
          consentData={consentData}
        />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchesTab
          submittedRecord={submittedRecord}
          potentialMatches={potentialMatches}
          communityRecords={communityRecords}
          onMatchComplete={onMatchComplete}
          consentData={consentData}
        />
      </TabsContent>
      
      <TabsContent value="progress-report">
        <ProgressReportTab 
          matchResults={matchResults}
          clinicRecords={clinicRecords}
          communityRecords={communityRecords}
        />
      </TabsContent>
    </Tabs>
  );
};

export default RecordEntryTabs;

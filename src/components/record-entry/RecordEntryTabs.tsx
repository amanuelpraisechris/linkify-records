
import { FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Record, MatchResult } from '@/types';
import RecordEntryTab from './RecordEntryTab';
import MatchesTab from './MatchesTab';
import ProgressReportTab from './ProgressReportTab';

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
  onMatchComplete
}: RecordEntryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6">
        <TabsTrigger value="entry">Record Entry</TabsTrigger>
        <TabsTrigger value="matches">Matches</TabsTrigger>
        <TabsTrigger value="progress-report">
          <FileText className="w-4 h-4 mr-2" />
          Progress Report
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="entry">
        <RecordEntryTab 
          clinicRecords={clinicRecords}
          communityRecords={communityRecords}
          onRecordSubmit={onRecordSubmit}
          onSaveForSearch={onSaveForSearch}
        />
      </TabsContent>
      
      <TabsContent value="matches">
        <MatchesTab 
          submittedRecord={submittedRecord}
          potentialMatches={potentialMatches}
          communityRecords={communityRecords}
          onMatchComplete={onMatchComplete}
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

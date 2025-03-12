
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { useMatchesState } from '@/hooks/useMatchesState';
import Navbar from '@/components/Navbar';
import RecordEntryHeader from './RecordEntryHeader';
import NoCommunityDatabaseAlert from './NoCommunityDatabaseAlert';
import RecordEntryTabs from './RecordEntryTabs';

const RecordEntryContent = () => {
  const { 
    communityRecords, 
    clinicRecords, 
    matchResults
  } = useRecordData();
  
  const {
    potentialMatches,
    submittedRecord,
    activeTab,
    setActiveTab,
    handleRecordSubmit,
    handleSaveForSearch,
    handleMatchComplete
  } = useMatchesState();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <RecordEntryHeader />
        
        {communityRecords.length === 0 && <NoCommunityDatabaseAlert />}
        
        <RecordEntryTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          clinicRecords={clinicRecords}
          communityRecords={communityRecords}
          submittedRecord={submittedRecord}
          potentialMatches={potentialMatches}
          matchResults={matchResults}
          onRecordSubmit={handleRecordSubmit}
          onSaveForSearch={handleSaveForSearch}
          onMatchComplete={handleMatchComplete}
        />
      </main>
    </div>
  );
};

export default RecordEntryContent;

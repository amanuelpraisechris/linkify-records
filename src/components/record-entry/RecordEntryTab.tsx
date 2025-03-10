
import { Record } from '@/types';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordEntryForm from '@/components/RecordEntryForm';
import RecordList from '@/components/RecordList';

interface RecordEntryTabProps {
  clinicRecords: Record[];
  communityRecords: Record[];
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch: (record: Record) => void;
}

const RecordEntryTab = ({
  clinicRecords,
  communityRecords,
  onRecordSubmit,
  onSaveForSearch
}: RecordEntryTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <ImportDataForMatching />
        <RecordEntryForm 
          onRecordSubmit={onRecordSubmit} 
          onSaveForSearch={onSaveForSearch}
        />
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Recently Added Clinic Records</h2>
          <RecordList 
            records={clinicRecords} 
            showMatchDetail={false} 
            emptyMessage="No clinic records have been added yet."
          />
        </div>
      </div>
    </div>
  );
};

export default RecordEntryTab;

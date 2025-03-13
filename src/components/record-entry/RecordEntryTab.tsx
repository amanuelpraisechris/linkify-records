
import { Record } from '@/types';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordEntryForm from '@/components/RecordEntryForm';
import RecordList from '@/components/RecordList';
import { useToast } from '@/components/ui/use-toast';
import DataLoader from '@/components/DataLoader';

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
  const { toast } = useToast();

  const handleDataImport = (records: Record[]) => {
    toast({
      title: "Data Import",
      description: `${records.length} records were imported successfully.`,
    });
    // We could handle imported data further here if needed
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <div className="mb-8">
          <DataLoader 
            onDataLoaded={handleDataImport} 
            dataSource={{ 
              name: "Patient Records", 
              recordCount: clinicRecords.length 
            }} 
          />
        </div>
        <RecordEntryForm 
          onRecordSubmit={onRecordSubmit} 
          onSaveForSearch={onSaveForSearch}
        />
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Recently Added Clinic Records</h2>
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

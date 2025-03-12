import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Record } from '@/types';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordList from '@/components/RecordList';
import DataManagementControls from '@/components/admin/DataManagementControls';

const DataManagement = () => {
  const { 
    records, 
    communityRecords, 
    clinicRecords, 
    importedRecords, 
    addRecord, 
    addImportedRecords, 
    clearImportedRecords 
  } = useRecordData();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isMainCommunityData, setIsMainCommunityData] = useState(false);

  const handleDataImport = (newRecords: Record[]) => {
    addImportedRecords(newRecords, isMainCommunityData);
    toast({
      title: "Data Imported",
      description: `Successfully imported ${newRecords.length} records.`,
    });
  };

  const handleClearImportedData = () => {
    clearImportedRecords();
    toast({
      title: "Imported Data Cleared",
      description: "All imported records have been cleared.",
    });
  };

  const handleRecordCreation = (newRecord: Record) => {
    addRecord(newRecord);
    toast({
      title: "Record Created",
      description: "A new record has been successfully created.",
    });
  };

  const handleNavigateToRecordEntry = () => {
    navigate('/record-entry');
  };

  return (
    <MatchingConfigProvider>
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Data Management</h1>

        <DataManagementControls 
          onClearImportedData={handleClearImportedData}
          onNavigateToRecordEntry={handleNavigateToRecordEntry}
          setIsMainCommunityData={setIsMainCommunityData}
          isMainCommunityData={isMainCommunityData}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImportDataForMatching onDataImport={handleDataImport} />
          </div>

          <div>
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">All Records</h2>
              <RecordList records={records} emptyMessage="No records available." />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">Community Records</h2>
              <RecordList records={communityRecords} emptyMessage="No community records available." />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">Clinic Records</h2>
              <RecordList records={clinicRecords} emptyMessage="No clinic records available." />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <h2 className="text-xl font-semibold mb-4">Imported Records</h2>
              <RecordList records={importedRecords} emptyMessage="No imported records available." />
            </div>
          </div>
        </div>
      </div>
    </MatchingConfigProvider>
  );
};

export default DataManagement;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { RecordDataProvider, useRecordData } from '@/contexts/record-data/RecordDataContext';
import { MatchingConfigProvider } from '@/contexts/MatchingConfigContext';
import { Record } from '@/types';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordList from '@/components/RecordList';
import DataManagementControls from '@/components/admin/DataManagementControls';
import { Button } from '@/components/ui/button';

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
      <div className="container mx-auto py-10 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-3 text-white">Data Management</h1>
          <p className="text-white/80 max-w-2xl mx-auto">
            Import, manage, and organize your records for matching and analysis. 
            Use this interface to prepare your data for the record linkage process.
          </p>
        </div>

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
            <div className="card-pinkish p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">All Records</h2>
              <RecordList records={records} emptyMessage="No records available." />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-1">
            <div className="card-pinkish p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Community Records</h2>
              <RecordList records={communityRecords} emptyMessage="No community records available." />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="card-pinkish p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Clinic Records</h2>
              <RecordList records={clinicRecords} emptyMessage="No clinic records available." />
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="card-pinkish p-6 rounded-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Imported Records</h2>
              <RecordList records={importedRecords} emptyMessage="No imported records available." />
            </div>
          </div>
        </div>
        
        <div className="footer mt-12 text-center">
          <p>Record Linkage Application • Powered by Medical Informatics</p>
        </div>
      </div>
    </MatchingConfigProvider>
  );
};

export default DataManagement;

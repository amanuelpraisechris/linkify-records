
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import DataLoader from './DataLoader';
import { Record } from '@/types';
import { useRecordData } from '@/contexts/RecordDataContext';
import { Database, FileUp, RefreshCw, X } from 'lucide-react';

const ImportDataForMatching = () => {
  const { importedRecords, addImportedRecords, clearImportedRecords } = useRecordData();
  const [showDataLoader, setShowDataLoader] = useState(false);
  const { toast } = useToast();

  const handleDataLoaded = (data: Record[]) => {
    if (data.length > 0) {
      addImportedRecords(data);
      setShowDataLoader(false);
      toast({
        title: "Data Imported for Matching",
        description: `${data.length} records have been imported and are now available for matching.`,
      });
    }
  };

  return (
    <div className="border rounded-xl shadow-card p-6 bg-white dark:bg-black mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <FileUp className="w-5 h-5 mr-2 text-primary" />
          <h2 className="text-xl font-semibold">External Data for Matching</h2>
        </div>
        
        {importedRecords.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearImportedRecords}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear Imported Data
          </Button>
        )}
      </div>
      
      {importedRecords.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">Imported Dataset</div>
              <div className="text-sm text-muted-foreground">
                {importedRecords.length} records available for matching
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowDataLoader(true)}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Import Different Data
            </Button>
          </div>
          
          <div className="text-sm">
            These records will be included when searching for potential matches. 
            The imported data is temporary and will be cleared when you refresh the page.
          </div>
        </div>
      ) : showDataLoader ? (
        <DataLoader onDataLoaded={handleDataLoaded} />
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import external data from CSV or JSON files to use for matching against your records.
            The imported data will be available for matching but won't be permanently stored.
          </p>
          
          <Button onClick={() => setShowDataLoader(true)}>
            <Database className="w-4 h-4 mr-2" />
            Import External Data
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImportDataForMatching;

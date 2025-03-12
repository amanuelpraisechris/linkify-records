
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import DataLoader from './DataLoader';
import { Record } from '@/types';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { Database, FileUp, RefreshCw, X, Users, Building, CheckCircle } from 'lucide-react';

const ImportDataForMatching = () => {
  const { importedRecords, communityRecords, addImportedRecords, clearImportedRecords } = useRecordData();
  const [showDataLoader, setShowDataLoader] = useState(false);
  const [importMode, setImportMode] = useState<'matching' | 'community'>('matching');
  const [dataLoaded, setDataLoaded] = useState(false);
  const { toast } = useToast();

  // Check if data is already loaded
  useEffect(() => {
    if (communityRecords.length > 0 || importedRecords.length > 0) {
      setDataLoaded(true);
      console.log(`Data already loaded: ${communityRecords.length} community records, ${importedRecords.length} imported records`);
    }
  }, [communityRecords.length, importedRecords.length]);

  const handleDataLoaded = (data: Record[]) => {
    if (data.length > 0) {
      // Mark the source appropriately based on the import mode
      const markedData = data.map(record => ({
        ...record,
        metadata: {
          ...record.metadata,
          source: importMode === 'community' ? 'HDSS Database' : 'Imported Data'
        }
      }));
      
      // Add to the appropriate data store
      addImportedRecords(markedData, importMode === 'community');
      
      setShowDataLoader(false);
      setDataLoaded(true);
      
      toast({
        title: importMode === 'community' 
          ? "Community Database Imported" 
          : "Data Imported for Matching",
        description: importMode === 'community'
          ? `${data.length} records have been imported as the main community database and will persist between pages.`
          : `${data.length} records have been imported and are now available for matching.`,
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
        
        {(importedRecords.length > 0 || communityRecords.length > 0) && (
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
      
      {communityRecords.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg flex items-center justify-between border border-green-200 dark:border-green-900">
            <div>
              <div className="font-medium text-green-800 dark:text-green-300 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Community Database Loaded
              </div>
              <div className="text-sm text-green-700 dark:text-green-400">
                {communityRecords.length} records available for matching (persisted between pages)
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setImportMode('community');
                setShowDataLoader(true);
              }}
              className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/40"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Update Community Database
            </Button>
          </div>
          
          {importedRecords.length > 0 && (
            <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-medium">Additional Imported Data</div>
                <div className="text-sm text-muted-foreground">
                  {importedRecords.length} additional records available for matching
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setImportMode('matching');
                  setShowDataLoader(true);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Import More Data
              </Button>
            </div>
          )}
          
          <div className="text-sm">
            The community database will be used as the main source for matching clinical records.
            Additional imported data can supplement the matching process.
          </div>
        </div>
      ) : importedRecords.length > 0 ? (
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
            <div>
              <div className="font-medium">Imported Dataset</div>
              <div className="text-sm text-muted-foreground">
                {importedRecords.length} records available for matching
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setImportMode('community');
                  setShowDataLoader(true);
                }}
                className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/40"
              >
                <Users className="w-4 h-4 mr-1" />
                Set as Community Database
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setImportMode('matching');
                  setShowDataLoader(true);
                }}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Import Different Data
              </Button>
            </div>
          </div>
          
          <div className="text-sm">
            These records will be included when searching for potential matches. 
            You can also set this data as your main community database for matching clinic records.
          </div>
        </div>
      ) : showDataLoader ? (
        <>
          <div className="mb-4 flex justify-center space-x-4">
            <Button
              variant={importMode === 'community' ? 'default' : 'outline'}
              onClick={() => setImportMode('community')}
              className="flex-1"
            >
              <Users className="w-4 h-4 mr-2" />
              Import Community Database
            </Button>
            <Button
              variant={importMode === 'matching' ? 'default' : 'outline'}
              onClick={() => setImportMode('matching')}
              className="flex-1"
            >
              <Building className="w-4 h-4 mr-2" />
              Import Additional Data
            </Button>
          </div>
          
          <DataLoader 
            onDataLoaded={handleDataLoaded} 
            dataSource={{
              id: importMode,
              name: importMode === 'community' ? 'Community Database' : 'Additional Records',
              recordCount: importMode === 'community' ? communityRecords.length : importedRecords.length,
              lastUpdated: new Date().toISOString(),
              type: importMode === 'community' ? 'community' : 'imported'
            }}
          />
        </>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Import external data from CSV or JSON files for record matching.
            You can import the main community database or additional records for matching.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => {
                setImportMode('community');
                setShowDataLoader(true);
              }}
              className="flex items-center justify-center py-6 bg-green-600 hover:bg-green-700 text-white"
            >
              <Users className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Import Community Database</div>
                <div className="text-xs opacity-90">HDSS database as main data source</div>
              </div>
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => {
                setImportMode('matching');
                setShowDataLoader(true);
              }}
              className="flex items-center justify-center py-6"
            >
              <Database className="w-5 h-5 mr-2" />
              <div className="text-left">
                <div className="font-medium">Import Additional Data</div>
                <div className="text-xs text-muted-foreground">Supplementary records for matching</div>
              </div>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportDataForMatching;

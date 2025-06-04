
import { Record } from '@/types';
import ImportDataForMatching from '@/components/ImportDataForMatching';
import RecordEntryForm from '@/components/RecordEntryForm';
import RecordList from '@/components/RecordList';
import { useToast } from '@/components/ui/use-toast';
import DataLoader from '@/components/DataLoader';
import { useEffect, useState } from 'react';
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { databaseService } from '@/services/database';

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
  const { addImportedRecords } = useRecordData();
  const [searchAttempts, setSearchAttempts] = useState<Array<{
    timestamp: string;
    query: string;
    success: boolean;
  }>>([]);

  // Load search attempts from database on component mount
  useEffect(() => {
    const loadSearchAttempts = async () => {
      try {
        const attempts = await databaseService.getMatchAttempts();
        setSearchAttempts(attempts);
      } catch (error) {
        console.error('Error loading search attempts:', error);
        // Fallback to localStorage if database fails
        const savedAttempts = localStorage.getItem('searchAttempts');
        if (savedAttempts) {
          setSearchAttempts(JSON.parse(savedAttempts));
        }
      }
    };

    loadSearchAttempts();
  }, []);

  const handleDataImport = (records: Record[]) => {
    addImportedRecords(records, true);
    toast({
      title: "Data Import",
      description: `${records.length} HDSS records were imported successfully.`,
    });
  };

  const handleSaveForSearch = async (record: Record) => {
    try {
      // Log search attempt to database
      const query = `${record.firstName} ${record.lastName}`;
      await databaseService.saveMatchAttempt(query, false, 0);
      
      // Refresh search attempts
      const attempts = await databaseService.getMatchAttempts();
      setSearchAttempts(attempts);
      
      // Call the original onSaveForSearch handler
      onSaveForSearch(record);
    } catch (error) {
      console.error('Error saving search attempt:', error);
      // Fallback to localStorage
      const newAttempt = {
        timestamp: new Date().toISOString(),
        query: `${record.firstName} ${record.lastName}`,
        success: false
      };
      setSearchAttempts(prev => [newAttempt, ...prev]);
      localStorage.setItem('searchAttempts', JSON.stringify([newAttempt, ...searchAttempts]));
      
      onSaveForSearch(record);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="mb-6">
          <DataLoader 
            onDataLoaded={handleDataImport} 
            dataSource={{ 
              id: "hdss-database",
              name: "HDSS Database", 
              recordCount: communityRecords.length,
              type: "community", 
              lastUpdated: new Date().toISOString()
            }} 
          />
        </div>
        <RecordEntryForm 
          onRecordSubmit={onRecordSubmit} 
          onSaveForSearch={handleSaveForSearch}
        />
      </div>
      
      <div className="lg:col-span-2">
        <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm border border-white/20 rounded-xl shadow-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Search History & Records</h2>
          {searchAttempts.length > 0 ? (
            <div className="mb-6 border rounded-lg p-3 bg-gray-50 dark:bg-gray-900">
              <h3 className="text-md font-medium mb-2">Recent Search Attempts</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-3 py-2 text-left">Timestamp</th>
                      <th className="px-3 py-2 text-left">Search Query</th>
                      <th className="px-3 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchAttempts.map((attempt, idx) => (
                      <tr key={idx} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="px-3 py-2">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </td>
                        <td className="px-3 py-2">{attempt.query}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            attempt.success 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {attempt.success ? 'Match Found' : 'No Match'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
          
          <RecordList 
            records={clinicRecords} 
            showMatchDetail={false} 
            emptyMessage="No records found. Import HDSS data and enter a new record to see potential matches."
          />
        </div>
      </div>
    </div>
  );
};

export default RecordEntryTab;

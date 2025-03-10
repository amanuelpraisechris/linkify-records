
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import DataLoader from '@/components/DataLoader';
import { Record, DataSource } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { Database, FileUp, Users, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DataManagement = () => {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    {
      id: 'community-db',
      name: 'Community Database',
      description: 'Main database with community-collected demographic data',
      recordCount: 1250,
      lastUpdated: '2023-10-15T14:30:00Z',
      type: 'community'
    },
    {
      id: 'facility-data',
      name: 'Health Facility Records',
      description: 'Patient records from local health facilities',
      recordCount: 325,
      lastUpdated: '2023-11-02T09:15:00Z',
      type: 'facility'
    }
  ]);
  
  const { toast } = useToast();
  
  const handleDataLoaded = (data: any[], sourceId?: string) => {
    console.log('Data loaded:', data.length, 'records');
    
    // Update record count in the data source
    if (sourceId) {
      setDataSources(sources => sources.map(source => 
        source.id === sourceId 
          ? { 
              ...source, 
              recordCount: source.recordCount + data.length,
              lastUpdated: new Date().toISOString()
            } 
          : source
      ));
    } else {
      // Add new data source
      const newSource: DataSource = {
        id: `imported-${Date.now()}`,
        name: `Imported Data (${new Date().toLocaleDateString()})`,
        recordCount: data.length,
        lastUpdated: new Date().toISOString(),
        type: 'imported'
      };
      
      setDataSources([...dataSources, newSource]);
    }
    
    toast({
      title: "Data Imported Successfully",
      description: `${data.length} records have been added to the database.`,
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Data Management</h1>
          <p className="text-lg text-muted-foreground">
            Import, manage, and update record databases
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6 mb-8">
              <div className="flex items-center mb-4">
                <FileUp className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Import New Data</h2>
              </div>
              
              <p className="text-sm text-muted-foreground mb-6">
                Upload a new database of community records or add to an existing one.
                Supported formats include CSV and JSON.
              </p>
              
              <DataLoader onDataLoaded={handleDataLoaded} />
            </div>
            
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <div className="flex items-center mb-4">
                <Database className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Existing Data Sources</h2>
              </div>
              
              <div className="space-y-4">
                {dataSources.map((source) => (
                  <div key={source.id} className="border rounded-lg p-4 hover:shadow-subtle transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-foreground">{source.name}</h3>
                        {source.description && (
                          <p className="text-sm text-muted-foreground mt-1">{source.description}</p>
                        )}
                      </div>
                      <div className="bg-primary/10 text-primary text-sm px-2 py-1 rounded-full">
                        {source.recordCount} records
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Last updated: {new Date(source.lastUpdated).toLocaleDateString()} at {new Date(source.lastUpdated).toLocaleTimeString()}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          className="text-xs text-primary hover:underline"
                          onClick={() => {
                            // View data functionality would go here
                            toast({
                              title: "View Data",
                              description: `Viewing ${source.name} data would be implemented in a full version.`,
                            });
                          }}
                        >
                          View
                        </button>
                        <button 
                          className="text-xs text-primary hover:underline"
                          onClick={() => {
                            // Update data functionality would go here
                            toast({
                              title: "Update Data",
                              description: `Updating ${source.name} would be implemented in a full version.`,
                            });
                          }}
                        >
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-black border rounded-xl shadow-card p-6">
              <div className="flex items-center mb-4">
                <Users className="w-5 h-5 mr-2 text-primary" />
                <h2 className="text-xl font-semibold">Data Tips</h2>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Required Fields</h3>
                  <p className="text-muted-foreground">
                    For optimal matching, ensure your data includes at minimum:
                    name, gender, date of birth, and location information.
                  </p>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Data Format</h3>
                  <p className="text-muted-foreground mb-2">
                    CSV files should include headers as the first row. JSON files should contain an array of record objects.
                  </p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {`[
  {
    "firstName": "John",
    "lastName": "Doe",
    "birthDate": "1985-07-15",
    "gender": "Male",
    "village": "Maputo"
  }
]`}
                  </pre>
                </div>
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Matching Process</h3>
                  <p className="text-muted-foreground">
                    The system uses probabilistic matching to identify potential duplicates based on
                    similarity scores. Phonetic algorithms help match names with spelling variations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DataManagement;

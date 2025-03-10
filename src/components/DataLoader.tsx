
import { useState } from 'react';
import { Upload, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataSource } from '@/types';

interface DataLoaderProps {
  onDataLoaded: (data: any[]) => void;
  dataSource?: DataSource;
}

const DataLoader = ({ onDataLoaded, dataSource }: DataLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: "Invalid File Format",
        description: "Please upload a CSV or JSON file.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate file reading with progress
    const reader = new FileReader();
    const totalSize = file.size;
    
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };
    
    reader.onload = (e) => {
      try {
        let data;
        if (file.name.endsWith('.json')) {
          data = JSON.parse(e.target?.result as string);
        } else {
          // Basic CSV parsing (in a real app, use a CSV parsing library)
          const csv = e.target?.result as string;
          const lines = csv.split('\n');
          const headers = lines[0].split(',');
          data = lines.slice(1).map(line => {
            const values = line.split(',');
            return headers.reduce((obj, header, i) => {
              obj[header.trim()] = values[i]?.trim();
              return obj;
            }, {} as any);
          });
        }
        
        setTimeout(() => {
          onDataLoaded(data);
          setIsLoading(false);
          setUploadProgress(0);
          toast({
            title: "Data Loaded Successfully",
            description: `Loaded ${data.length} records from ${file.name}`,
          });
        }, 1000);
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: "The file format is invalid or corrupted.",
          variant: "destructive",
        });
        setIsLoading(false);
        setUploadProgress(0);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error Reading File",
        description: "There was an error reading the file.",
        variant: "destructive",
      });
      setIsLoading(false);
      setUploadProgress(0);
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="border rounded-xl shadow-subtle p-6 bg-white dark:bg-black">
      <div className="flex items-center mb-4">
        <Database className="w-5 h-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">
          {dataSource ? `Upload to ${dataSource.name}` : 'Load Database Records'}
        </h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Upload a CSV or JSON file containing records for the community database.
        Each record should include identifiers like name, date of birth, and location.
      </p>
      
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center hover:bg-muted/20 transition-all-medium">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".csv,.json"
          onChange={handleFileUpload}
          disabled={isLoading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center justify-center"
        >
          <Upload className="w-10 h-10 text-muted-foreground mb-2" />
          <span className="text-sm font-medium mb-1">
            {isLoading ? "Processing File..." : "Drag & Drop File or Click to Browse"}
          </span>
          <span className="text-xs text-muted-foreground">
            Supports CSV and JSON formats
          </span>
          
          {isLoading && (
            <div className="w-full mt-4">
              <div className="h-1.5 bg-muted rounded-full w-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {uploadProgress}% Complete
              </div>
            </div>
          )}
        </label>
      </div>
      
      {dataSource && (
        <div className="mt-4 bg-muted/30 p-3 rounded-md flex items-center">
          <AlertCircle className="w-4 h-4 text-muted-foreground mr-2" />
          <span className="text-xs text-muted-foreground">
            This will append new records to the existing {dataSource.name} 
            ({dataSource.recordCount} records).
          </span>
        </div>
      )}
    </div>
  );
};

export default DataLoader;

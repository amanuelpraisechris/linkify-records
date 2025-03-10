import { useState } from 'react';
import { Upload, Database, AlertCircle, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DataSource, Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';

interface DataLoaderProps {
  onDataLoaded: (data: Record[]) => void;
  dataSource?: DataSource;
}

const DataLoader = ({ onDataLoaded, dataSource }: DataLoaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [interfaceLanguage, setInterfaceLanguage] = useState<SupportedLanguage>('latin');
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: interfaceLanguage === 'latin' ? "Invalid File Format" :
               interfaceLanguage === 'amharic' ? "ልክ ያልሆነ የፋይል ቅርጸት" :
               "ዘይቅቡል ናይ ፋይል ቅርጺ",
        description: interfaceLanguage === 'latin' ? "Please upload a CSV or JSON file." :
                     interfaceLanguage === 'amharic' ? "እባክዎ የCSV ወይም JSON ፋይል ይጫኑ።" :
                     "ብኽብረትካ CSV ወይ JSON ፋይል ጸዓን።",
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
        let data: Record[] = [];
        if (file.name.endsWith('.json')) {
          const parsedData = JSON.parse(e.target?.result as string);
          // Ensure the data conforms to our Record type
          data = parsedData.map((item: any, index: number) => ({
            id: item.id || `imported-${Date.now()}-${index}`,
            firstName: item.firstName || '',
            lastName: item.lastName || '',
            middleName: item.middleName || '',
            gender: item.gender || '',
            birthDate: item.birthDate || '',
            village: item.village || '',
            subVillage: item.subVillage || '',
            district: item.district || '',
            householdHead: item.householdHead || '',
            motherName: item.motherName || '',
            identifiers: item.identifiers || [],
            metadata: {
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              source: dataSource?.name || 'Imported Data'
            }
          }));
        } else {
          // Improved CSV parsing
          const csv = e.target?.result as string;
          const lines = csv.split('\n').filter(line => line.trim() !== ''); // Skip empty lines
          
          // Extract headers from the first row
          const headers = lines[0].split(',').map(header => header.trim());
          console.log("CSV headers detected:", headers);
          
          // Process all rows except the header row
          data = lines.slice(1).map((line, index) => {
            // Handle quoted values in CSV
            let matches = [];
            let pos = 0;
            const values: string[] = [];
            const regex = /(?:^|,)(?:"([^"]*(?:""[^"]*)*)"|([^,]*))/g;
            
            while ((matches = regex.exec(line)) !== null) {
              if (matches[1] !== undefined) {
                values.push(matches[1].replace(/""/g, '"')); // Handle escaped quotes
              } else {
                values.push(matches[2] || '');
              }
            }
            
            // If regex approach didn't work, fallback to simple split
            if (values.length === 0) {
              const simpleSplit = line.split(',');
              for (let i = 0; i < simpleSplit.length; i++) {
                values.push(simpleSplit[i].trim());
              }
            }
            
            const record: any = {
              id: `imported-${Date.now()}-${index}`,
              metadata: {
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: dataSource?.name || 'Imported Data'
              }
            };
            
            // Map CSV columns to record fields, normalizing field names
            headers.forEach((header, i) => {
              if (i < values.length && values[i]) {
                // Convert header to camelCase for standard fields
                let fieldName = header;
                
                // Map common variations to standard field names
                if (/first.?name/i.test(header)) fieldName = 'firstName';
                if (/last.?name/i.test(header)) fieldName = 'lastName';
                if (/middle.?name/i.test(header)) fieldName = 'middleName';
                if (/birth.?date/i.test(header)) fieldName = 'birthDate';
                if (/dob/i.test(header)) fieldName = 'birthDate';
                if (/village/i.test(header)) fieldName = 'village';
                if (/gender|sex/i.test(header)) fieldName = 'gender';
                
                record[fieldName] = values[i].trim();
                
                // Also store the original column name with quotes for backward compatibility
                record[`"${header}"`] = values[i].trim();
              }
            });
            
            console.log(`Processed record ${index}:`, record);
            
            // Ensure required fields for Record type
            return {
              firstName: record.firstName || record["FirstName"] || '',
              lastName: record.lastName || record["LastName"] || '',
              gender: record.gender || record["Sex"] || '',
              birthDate: record.birthDate || record["dob"] || '',
              ...record
            } as Record;
          });
          
          console.log(`Successfully processed ${data.length} records from CSV (excluding header row)`);
        }
        
        setTimeout(() => {
          onDataLoaded(data);
          setIsLoading(false);
          setUploadProgress(0);
          toast({
            title: interfaceLanguage === 'latin' ? "Data Loaded Successfully" :
                   interfaceLanguage === 'amharic' ? "ውሂብ በተሳካ ሁኔታ ተጭኗል" :
                   "ዳታ ብዕዉት ተጻዒኑ",
            description: interfaceLanguage === 'latin' 
              ? `Loaded ${data.length} records from ${file.name}` 
              : interfaceLanguage === 'amharic'
                ? `${data.length} መዝገቦችን ከ ${file.name} ጭኗል`
                : `${data.length} መዛግብቲ ካብ ${file.name} ተጻዒኖም`,
          });
        }, 1000);
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: interfaceLanguage === 'latin' ? "Error Loading Data" :
                 interfaceLanguage === 'amharic' ? "ውሂብ በመጫን ላይ ስህተት" :
                 "ጌጋ ኣብ ምጽዓን ዳታ",
          description: interfaceLanguage === 'latin' 
            ? "The file format is invalid or corrupted." 
            : interfaceLanguage === 'amharic'
              ? "የፋይሉ ቅርጸት ልክ ያልሆነ ወይም የተበላሸ ነው።"
              : "ቅርጺ ናይቲ ፋይል ዘይቅቡል ወይ ዝተበላሸወ እዩ።",
          variant: "destructive",
        });
        setIsLoading(false);
        setUploadProgress(0);
      }
    };
    
    reader.onerror = () => {
      toast({
        title: interfaceLanguage === 'latin' ? "Error Reading File" :
               interfaceLanguage === 'amharic' ? "ፋይል በማንበብ ላይ ስህተት" :
               "ጌጋ ኣብ ምንባብ ፋይል",
        description: interfaceLanguage === 'latin' 
          ? "There was an error reading the file." 
          : interfaceLanguage === 'amharic'
            ? "ፋይሉን በማንበብ ላይ ስህተት ተፈጥሯል።"
            : "ጌጋ ኣብ ምንባብ ናይቲ ፋይል ተፈጢሩ።",
        variant: "destructive",
      });
      setIsLoading(false);
      setUploadProgress(0);
    };
    
    reader.readAsText(file);
  };
  
  const getTranslatedText = (
    latinText: string, 
    amharicText: string, 
    tigrinyaText: string
  ): string => {
    switch (interfaceLanguage) {
      case 'amharic':
        return amharicText;
      case 'tigrinya':
        return tigrinyaText;
      default:
        return latinText;
    }
  };
  
  return (
    <div className="border rounded-xl shadow-subtle p-6 bg-white dark:bg-black">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Database className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">
            {dataSource 
              ? getTranslatedText(
                  `Upload to ${dataSource.name}`,
                  `ወደ ${dataSource.name} ይጫኑ`,
                  `ናብ ${dataSource.name} ጸዓን`
                )
              : getTranslatedText(
                  'Load Database Records',
                  'የዳታቤዝ መዝገቦችን ይጫኑ',
                  'መዛግብቲ ዳታቤዝ ጸዓን'
                )
            }
          </h3>
        </div>
        
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-1 text-muted-foreground" />
          <select
            value={interfaceLanguage}
            onChange={(e) => setInterfaceLanguage(e.target.value as SupportedLanguage)}
            className="text-sm bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="latin">English</option>
            <option value="amharic">አማርኛ</option>
            <option value="tigrinya">ትግርኛ</option>
          </select>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4" dir={interfaceLanguage === 'latin' ? 'ltr' : 'rtl'}>
        {getTranslatedText(
          'Upload a CSV or JSON file containing records for the community database. Each record should include identifiers like name, date of birth, and location.',
          'ለማህበረሰብ ዳታቤዝ መዝገቦችን የያዘ የCSV ወይም JSON ፋይል ይጫኑ። እያንዳንዱ መዝገብ እንደ ስም፣ የትውልድ ቀን እና ቦታ ያሉ መለያዎችን ማካተት አለበት።',
          'CSV ወይ JSON ፋይል ዝሓዘ መዛግብቲ ንማሕበረሰብ ዳታቤዝ ጸዓን። ነፍሲ ወከፍ መዝገብ ከም ሽም፣ ዕለተ ልደት፣ ከምኡውን ቦታ ዝኣመሰሉ መለለይታት ክሕዝ ኣለዎ።'
        )}
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
            {isLoading 
              ? getTranslatedText('Processing File...', 'ፋይል በማስኬድ ላይ...', 'ፋይል ይሰራሕ ኣሎ...')
              : getTranslatedText('Drag & Drop File or Click to Browse', 'ፋይል ይጎትቱ እና ይጣሉ ወይም ለማሰስ ይጫኑ', 'ፋይል ጎተት ከምኡውን ድርብዮ ወይ ክትፍትሽ ጠውቕ')}
          </span>
          <span className="text-xs text-muted-foreground">
            {getTranslatedText('Supports CSV and JSON formats', 'የCSV እና JSON ቅርጸቶችን ይደግፋል', 'CSV ከምኡውን JSON ቅርጽታት ይድግፍ')}
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
                {uploadProgress}% {getTranslatedText('Complete', 'ተጠናቋል', 'ተዛዚሙ')}
              </div>
            </div>
          )}
        </label>
      </div>
      
      {dataSource && (
        <div className="mt-4 bg-muted/30 p-3 rounded-md flex items-center" dir={interfaceLanguage === 'latin' ? 'ltr' : 'rtl'}>
          <AlertCircle className="w-4 h-4 text-muted-foreground mr-2 flex-shrink-0" />
          <span className="text-xs text-muted-foreground">
            {getTranslatedText(
              `This will append new records to the existing ${dataSource.name} (${dataSource.recordCount} records).`,
              `ይህ አዳዲስ መዝገቦችን ወደ ነባሩ ${dataSource.name} (${dataSource.recordCount} መዝገቦች) ይጨምራል።`,
              `እዚ ሓደስቲ መዛግብቲ ናብቲ ዘሎ ${dataSource.name} (${dataSource.recordCount} መዛግብቲ) ክውስኽ እዩ።`
            )}
          </span>
        </div>
      )}
    </div>
  );
};

export default DataLoader;

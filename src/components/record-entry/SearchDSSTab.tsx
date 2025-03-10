
import { Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Record } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Badge } from '@/components/ui/badge';

interface SearchDSSTabProps {
  inputLanguage: SupportedLanguage;
  formData: Partial<Record>;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  identifiers: Array<{ type: string; value: string }>;
  clinicIds: Array<{ type: string; value: string }>;
  onSaveForSearch?: (record: Record) => void;
}

const SearchDSSTab = ({
  inputLanguage,
  formData,
  birthYear,
  birthMonth,
  birthDay,
  identifiers,
  clinicIds,
  onSaveForSearch
}: SearchDSSTabProps) => {
  const { config, loadConfigProfile, availableProfiles } = useMatchingConfig();
  
  const handleSearch = () => {
    if (onSaveForSearch) {
      const searchRecord: Record = {
        id: `search-${Date.now()}`,
        ...formData as Record,
        birthDate: birthYear ? `${birthYear}-${birthMonth || '01'}-${birthDay || '01'}` : '',
        identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'Health Facility Entry'
        }
      };
      onSaveForSearch(searchRecord);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium">
          {inputLanguage === 'latin' ? 'DSS Database Search' : 
           inputLanguage === 'amharic' ? 'የDSS ውሂብ ቋት ፍለጋ' : 'ምድላይ ዋህዮ ሓበሬታ DSS'}
        </h4>
        
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-muted-foreground" />
            <Select 
              defaultValue=""
              onValueChange={loadConfigProfile}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Matching Profile" />
              </SelectTrigger>
              <SelectContent>
                {availableProfiles.map(profile => (
                  <SelectItem key={profile} value={profile}>{profile}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            type="button"
            onClick={handleSearch}
            className="inline-flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            {inputLanguage === 'latin' ? 'Search DSS' : 
             inputLanguage === 'amharic' ? 'DSS ይፈልጉ' : 'DSS ድለ'}
          </Button>
        </div>
      </div>
      
      <div className="border-2 border-dashed rounded-md p-8 text-center">
        {inputLanguage === 'latin' ? 
          'Click "Search DSS" to find potential matches in the HDSS database. Results will appear here.' : 
         inputLanguage === 'amharic' ? 
          'በHDSS ውሂብ ቋት ውስጥ ሊገኙ የሚችሉ ተዛማጅዎችን ለማግኘት "DSS ይፈልጉ" የሚለውን ጠቅ ያድርጉ። ውጤቶች እዚህ ይታያሉ።' : 
          'ኣብ ውሽጢ ዋህዮ ሓበሬታ HDSS ዝርከቡ ተዛመድቲ ንምድላይ "DSS ድለ" ዝብል ጠውቕ። ውጽኢታት ኣብዚ ክርአዩ ኢዮም።'}
      </div>
      
      <div className="bg-muted p-4 rounded-md text-sm">
        <div className="font-medium mb-2 flex items-center">
          <Settings className="w-4 h-4 mr-2" />
          Current Matching Configuration
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-muted-foreground">Match Thresholds:</span>
            <div className="flex space-x-2 mt-1">
              <Badge variant="default" className="bg-green-500">High: {config.threshold.high}%</Badge>
              <Badge variant="default" className="bg-amber-500">Medium: {config.threshold.medium}%</Badge>
              <Badge variant="outline">Low: {config.threshold.low}%</Badge>
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Top Weight Fields:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(config.fieldWeights)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([field, weight]) => (
                  <Badge key={field} variant="secondary" className="font-normal">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: {weight}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDSSTab;

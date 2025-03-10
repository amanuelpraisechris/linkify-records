
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Record } from '@/types';

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
      <div className="flex justify-between">
        <h4 className="text-lg font-medium">
          {inputLanguage === 'latin' ? 'DSS Database Search' : 
           inputLanguage === 'amharic' ? 'የDSS ውሂብ ቋት ፍለጋ' : 'ምድላይ ዋህዮ ሓበሬታ DSS'}
        </h4>
        
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
      
      <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">
        {inputLanguage === 'latin' ? 
          'Click "Search DSS" to find potential matches in the HDSS database. Results will appear here.' : 
         inputLanguage === 'amharic' ? 
          'በHDSS ውሂብ ቋት ውስጥ ሊገኙ የሚችሉ ተዛማጅዎችን ለማግኘት "DSS ይፈልጉ" የሚለውን ጠቅ ያድርጉ። ውጤቶች እዚህ ይታያሉ።' : 
          'ኣብ ውሽጢ ዋህዮ ሓበሬታ HDSS ዝርከቡ ተዛመድቲ ንምድላይ "DSS ድለ" ዝብል ጠውቕ። ውጽኢታት ኣብዚ ክርአዩ ኢዮም።'}
      </div>
    </div>
  );
};

export default SearchDSSTab;


import { Search, Settings, Hospital } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Record } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMatchingConfig } from '@/contexts/MatchingConfigContext';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import ConsentSection from './ConsentSection';

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
  const [selectedFacility, setSelectedFacility] = useState('');
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentAlert, setShowConsentAlert] = useState(false);
  
  const handleSearch = () => {
    if (!consentGiven) {
      // Show consent alert and prevent search
      setShowConsentAlert(true);
      return;
    }
    
    setShowConsentAlert(false);
    
    if (onSaveForSearch) {
      const searchRecord: Record = {
        id: `search-${Date.now()}`,
        ...formData as Record,
        birthDate: birthYear ? `${birthYear}-${birthMonth || '01'}-${birthDay || '01'}` : '',
        identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'Health Facility Entry',
          facility: selectedFacility || 'Not Specified'
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
              defaultValue="Gold Standard"
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
            disabled={!consentGiven}
          >
            <Search className="w-4 h-4 mr-2" />
            {inputLanguage === 'latin' ? 'Search DSS' : 
             inputLanguage === 'amharic' ? 'DSS ይፈልጉ' : 'DSS ድለ'}
          </Button>
        </div>
      </div>
      
      <div className="bg-muted/20 backdrop-blur-sm p-4 rounded-md mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Hospital className="h-4 w-4" />
          <h5 className="font-medium">
            {inputLanguage === 'latin' ? 'Health Facility' : 
             inputLanguage === 'amharic' ? 'የጤና ተቋም' : 'ትካል ጥዕና'}
          </h5>
        </div>
        <Select
          value={selectedFacility}
          onValueChange={setSelectedFacility}
        >
          <SelectTrigger className="w-full backdrop-blur-sm bg-white/10">
            <SelectValue placeholder={
              inputLanguage === 'latin' ? 'Select health facility' : 
              inputLanguage === 'amharic' ? 'የጤና ተቋም ይምረጡ' : 'ትካል ጥዕና ምረጽ'
            } />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            <SelectItem value="central-hospital">Central Hospital</SelectItem>
            <SelectItem value="community-clinic">Community Clinic</SelectItem>
            <SelectItem value="rural-health-center">Rural Health Center</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Make the consent section more prominent */}
      <div className="border-2 border-primary/20 rounded-md p-6 bg-primary/5">
        <h4 className="font-semibold text-lg mb-4">
          {inputLanguage === 'latin' ? 'Consent for Data Linkage' : 
           inputLanguage === 'amharic' ? 'ለዳታ ማገናኘት ፈቃድ' : 'ፍቓድ ንምትእስሳር ሓበሬታ'}
        </h4>
        
        <p className="text-sm mb-5 text-muted-foreground">
          {inputLanguage === 'latin' ? 
            'Before searching in the DSS database, you must confirm that the patient has consented to have their clinical data linked with the DSS database for research purposes.' : 
           inputLanguage === 'amharic' ? 
            'በDSS ውሂብ ቋት ውስጥ ከመፈለግዎ በፊት፣ ታካሚው የእሱን የሕክምና ዳታ ከDSS ውሂብ ቋት ጋር ለምርምር ዓላማ እንዲያገናኙ ፈቃድ ሰጥቷል የሚለውን ማረጋገጥ አለብዎት።' : 
            'ቅድሚ ኣብ ዋህዮ ሓበሬታ DSS ምድላይካ፣ እቲ ሕሙም ክሊኒካዊ ሓበሬታኡ ንዕላማ መጽናዕቲ ምስ ዋህዮ ሓበሬታ DSS ንኽተኣሳሰር ፍቓድ ከም ዝሃበ ከተረጋግጽ ኣለካ።'}
        </p>
        
        <ConsentSection 
          inputLanguage={inputLanguage}
          consentGiven={consentGiven}
          setConsentGiven={setConsentGiven}
        />
        
        {showConsentAlert && !consentGiven && (
          <div className="mt-4 p-3 border border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 rounded-md">
            <p className="text-sm font-medium">
              {inputLanguage === 'latin' ? 
                'Patient consent is required before searching the DSS database.' : 
               inputLanguage === 'amharic' ? 
                'DSS ውሂብ ቋትን ከመፈለግዎ በፊት የታካሚው ፈቃድ ያስፈልጋል።' : 
                'ቅድሚ ዋህዮ ሓበሬታ DSS ምድላይካ ፍቓድ ሕሙም የድሊ ኢዩ።'}
            </p>
          </div>
        )}
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
        <div className="mt-2">
          <span className="text-muted-foreground">Algorithm Type:</span>
          <Badge variant="outline" className="ml-2">
            {config.algorithmType === 'probabilistic' ? 'Probabilistic (Fellegi-Sunter)' : 'Deterministic'}
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default SearchDSSTab;

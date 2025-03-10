
import { useState } from 'react';
import { ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PlusCircle, Trash2, Calendar } from 'lucide-react';

interface ResidencyTimelineSectionProps {
  residencyPeriods: ResidencyPeriod[];
  onResidencyPeriodsChange: (periods: ResidencyPeriod[]) => void;
  inputLanguage: SupportedLanguage;
}

const ResidencyTimelineSection = ({
  residencyPeriods,
  onResidencyPeriodsChange,
  inputLanguage
}: ResidencyTimelineSectionProps) => {
  // Village Options (mock data - would come from backend in real app)
  const villageOptions = ['Kisesa', 'Kanyama', 'Kitumba', 'Ihayabuyaga', 'Igekemaja', 'Welamasonga', 'Bukandwe'];
  
  // Subvillage Options (would be dynamic based on village selected in real app)
  const subVillageOptions = {
    'Kisesa': ['Kisesa Kati', 'Kitongoji A', 'Kitongoji B', 'Kitongoji C'],
    'Kanyama': ['Kanyama A', 'Kanyama B', 'Kanyama Centre'],
    'Kitumba': ['Kitumba Main', 'Kitumba East', 'Kitumba West'],
    'Ihayabuyaga': ['Ihayabuyaga Centre', 'Ihayabuyaga North', 'Ihayabuyaga South'],
    'Igekemaja': ['Igekemaja Main', 'Igekemaja East', 'Igekemaja West'],
    'Welamasonga': ['Welamasonga Main', 'Welamasonga East', 'Welamasonga West'],
    'Bukandwe': ['Bukandwe Main', 'Bukandwe North', 'Bukandwe South']
  };
  
  // Generate years (1994 to current year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1993 }, (_, i) => (1994 + i).toString());
  
  const handleAddPeriod = () => {
    onResidencyPeriodsChange([
      ...residencyPeriods,
      {
        village: '',
        subVillage: '',
        startYear: '',
        balozi: {
          firstName: '',
          middleName: '',
          lastName: ''
        },
        oldestMember: {
          firstName: '',
          middleName: '',
          lastName: ''
        }
      }
    ]);
  };
  
  const handleRemovePeriod = (index: number) => {
    const newPeriods = [...residencyPeriods];
    newPeriods.splice(index, 1);
    onResidencyPeriodsChange(newPeriods);
  };
  
  const handlePeriodChange = (index: number, field: string, value: string) => {
    const newPeriods = [...residencyPeriods];
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newPeriods[index] = {
        ...newPeriods[index],
        [parent]: {
          ...newPeriods[index][parent as keyof ResidencyPeriod] as Record<string, unknown>,
          [child]: value
        }
      };
    } else {
      // Reset subVillage if village changes
      if (field === 'village') {
        newPeriods[index] = {
          ...newPeriods[index],
          village: value,
          subVillage: ''
        };
      } else {
        newPeriods[index] = {
          ...newPeriods[index],
          [field]: value
        };
      }
    }
    
    onResidencyPeriodsChange(newPeriods);
  };
  
  return (
    <div className="bg-muted/20 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-md font-medium text-primary flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {inputLanguage === 'latin' ? 'Residency Timeline' : 
           inputLanguage === 'amharic' ? 'የመኖሪያ ጊዜ መስመር' : 'መደብ ግዜ መንበሪ'}
        </h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddPeriod}
          className="text-xs"
        >
          <PlusCircle className="w-3 h-3 mr-1" />
          {inputLanguage === 'latin' ? 'Add Residency Period' : 
           inputLanguage === 'amharic' ? 'የመኖሪያ ጊዜ ጨምር' : 'ግዜ መንበሪ ወስኽ'}
        </Button>
      </div>
      
      {residencyPeriods.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground border border-dashed rounded-md">
          {inputLanguage === 'latin' ? 'No residency periods added yet. Click the button above to add one.' : 
           inputLanguage === 'amharic' ? 'እስካሁን ምንም የመኖሪያ ጊዜ አልተጨመረም። አንድ ለመጨመር ከላይ ያለውን አዝራር ጠቅ ያድርጉ።' : 
           'ክሳብ ሕጂ ዝኾነ ግዜ መንበሪ ኣይተወሰኸን። ሓደ ንምውሳኽ ኣብ ላዕሊ ዘሎ መልጎም ጠውቕ።'}
        </div>
      ) : (
        residencyPeriods.map((period, index) => (
          <div key={index} className="border rounded-md p-3 mb-3">
            <div className="flex justify-between mb-2">
              <h5 className="font-medium">
                {inputLanguage === 'latin' ? `Residency Period ${index + 1}` : 
                 inputLanguage === 'amharic' ? `የመኖሪያ ጊዜ ${index + 1}` : 
                 `ግዜ መንበሪ ${index + 1}`}
              </h5>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePeriod(index)}
                className="h-6 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {inputLanguage === 'latin' ? 'Village' : 
                   inputLanguage === 'amharic' ? 'መንደር' : 'ዓዲ'}
                </label>
                <Select 
                  value={period.village} 
                  onValueChange={(value) => handlePeriodChange(index, 'village', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      inputLanguage === 'latin' ? 'Select Village' : 
                      inputLanguage === 'amharic' ? 'መንደር ይምረጡ' : 'ዓዲ ምረጽ'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {villageOptions.map(village => (
                      <SelectItem key={village} value={village}>{village}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {inputLanguage === 'latin' ? 'Subvillage' : 
                   inputLanguage === 'amharic' ? 'ንዑስ መንደር' : 'ንኡስ ዓዲ'}
                </label>
                <Select 
                  value={period.subVillage} 
                  onValueChange={(value) => handlePeriodChange(index, 'subVillage', value)}
                  disabled={!period.village}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      inputLanguage === 'latin' ? 'Select Subvillage' : 
                      inputLanguage === 'amharic' ? 'ንዑስ መንደር ይምረጡ' : 'ንኡስ ዓዲ ምረጽ'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {period.village && (subVillageOptions[period.village as keyof typeof subVillageOptions] || []).map(subVillage => (
                      <SelectItem key={subVillage} value={subVillage}>{subVillage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {inputLanguage === 'latin' ? 'Year Moved In' : 
                   inputLanguage === 'amharic' ? 'የገቡበት ዓመት' : 'ዓመት ምምጻእ'}
                </label>
                <Select 
                  value={period.startYear} 
                  onValueChange={(value) => handlePeriodChange(index, 'startYear', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={
                      inputLanguage === 'latin' ? 'Select Year' : 
                      inputLanguage === 'amharic' ? 'ዓመት ይምረጡ' : 'ዓመት ምረጽ'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-3">
              <h6 className="text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Ten Cell Leader/Balozi' : 
                 inputLanguage === 'amharic' ? 'የአስር ቤት መሪ/ባሎዚ' : 'ዓሰርተ ስድራ መራሒ/ባሎዚ'}
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'First Name' : 
                    inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'
                  } 
                  value={period.balozi?.firstName || ''}
                  onChange={(e) => handlePeriodChange(index, 'balozi.firstName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'Middle Name' : 
                    inputLanguage === 'amharic' ? 'የአባት ስም' : 'ማእከላይ ሽም'
                  } 
                  value={period.balozi?.middleName || ''}
                  onChange={(e) => handlePeriodChange(index, 'balozi.middleName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'Last Name' : 
                    inputLanguage === 'amharic' ? 'የአያት ስም' : 'ዳሓራይ ሽም'
                  } 
                  value={period.balozi?.lastName || ''}
                  onChange={(e) => handlePeriodChange(index, 'balozi.lastName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
              </div>
            </div>
            
            <div>
              <h6 className="text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Oldest Household Member' : 
                 inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል' : 'ዓበይ ኣባል ስድራ'}
              </h6>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'First Name' : 
                    inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'
                  } 
                  value={period.oldestMember?.firstName || ''}
                  onChange={(e) => handlePeriodChange(index, 'oldestMember.firstName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'Middle Name' : 
                    inputLanguage === 'amharic' ? 'የአባት ስም' : 'ማእከላይ ሽም'
                  } 
                  value={period.oldestMember?.middleName || ''}
                  onChange={(e) => handlePeriodChange(index, 'oldestMember.middleName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
                <Input 
                  placeholder={
                    inputLanguage === 'latin' ? 'Last Name' : 
                    inputLanguage === 'amharic' ? 'የአያት ስም' : 'ዳሓራይ ሽም'
                  } 
                  value={period.oldestMember?.lastName || ''}
                  onChange={(e) => handlePeriodChange(index, 'oldestMember.lastName', e.target.value)}
                  dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResidencyTimelineSection;

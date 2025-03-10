
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { SupportedLanguage } from '@/utils/languageUtils';

interface YearMovedInSectionProps {
  formData: {
    yearMovedIn?: string;
    neverInDSS?: boolean;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  inputLanguage: SupportedLanguage;
}

const YearMovedInSection = ({
  formData,
  handleChange,
  handleCheckboxChange,
  inputLanguage
}: YearMovedInSectionProps) => {
  // Generate years for "Year moved in" (from current year back to 30 years ago)
  const currentYear = new Date().getFullYear();
  const movedInYears = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {inputLanguage === 'latin' ? 'Year moved in' : 
        inputLanguage === 'amharic' ? 'የገቡበት ዓመት' : 'ዓመት ምምጻእ'}
      </label>
      <div className="flex items-center space-x-2">
        <div className="w-1/2">
          <Select 
            value={formData.yearMovedIn} 
            onValueChange={(value) => 
              handleChange({ target: { name: 'yearMovedIn', value } } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                inputLanguage === 'latin' ? 'Select Year' : 
                inputLanguage === 'amharic' ? 'ዓመት ይምረጡ' : 'ዓመት ምረጽ'
              } />
            </SelectTrigger>
            <SelectContent>
              {movedInYears.map(year => (
                <SelectItem key={year} value={year}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">OR</div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="neverInDSS" 
              checked={formData.neverInDSS as boolean} 
              onCheckedChange={(checked) => 
                handleCheckboxChange('neverInDSS', checked as boolean)
              }
            />
            <Label htmlFor="neverInDSS" className="text-sm font-normal">
              {inputLanguage === 'latin' ? 'Never in DSS Area' : 
              inputLanguage === 'amharic' ? 'በDSS አካባቢ አልነበረም' : 'ኣብ DSS ከባቢ ፈጺሙ የለን'}
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YearMovedInSection;

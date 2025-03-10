import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface ResidenceDetailsSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  inputLanguage: SupportedLanguage;
}

const ResidenceDetailsSection = ({
  formData,
  handleChange,
  handleCheckboxChange,
  inputLanguage
}: ResidenceDetailsSectionProps) => {
  // Generate years for "Year moved in" (from current year back to 30 years ago)
  const currentYear = new Date().getFullYear();
  const movedInYears = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h4 className="text-md font-medium mb-3 text-primary">
        {inputLanguage === 'latin' ? 'Residence Details' : 
        inputLanguage === 'amharic' ? 'የመኖሪያ ዝርዝሮች' : 'ዝርዝር ናይ መንበሪ'}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Village' : 
            inputLanguage === 'amharic' ? 'መንደር' : 'ዓዲ'}
          </label>
          <Select value={formData.village} onValueChange={(value) => handleChange({ target: { name: 'village', value } } as React.ChangeEvent<HTMLSelectElement>)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                inputLanguage === 'latin' ? '(none)' : 
                inputLanguage === 'amharic' ? '(የለም)' : '(የለን)'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">
                {inputLanguage === 'latin' ? '(none)' : 
                inputLanguage === 'amharic' ? '(የለም)' : '(የለን)'}
              </SelectItem>
              <SelectItem value="Village1">Village 1</SelectItem>
              <SelectItem value="Village2">Village 2</SelectItem>
              <SelectItem value="Village3">Village 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Subvillage' : 
            inputLanguage === 'amharic' ? 'ንዑስ መንደር' : 'ንኡስ ዓዲ'}
          </label>
          <Select value={formData.subVillage} onValueChange={(value) => handleChange({ target: { name: 'subVillage', value } } as React.ChangeEvent<HTMLSelectElement>)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                inputLanguage === 'latin' ? 'Select Subvillage' : 
                inputLanguage === 'amharic' ? 'ንዑስ መንደር ይምረጡ' : 'ንኡስ ዓዲ ምረጽ'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Subvillage1">Subvillage 1</SelectItem>
              <SelectItem value="Subvillage2">Subvillage 2</SelectItem>
              <SelectItem value="Subvillage3">Subvillage 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Year moved in' : 
              inputLanguage === 'amharic' ? 'የገቡበት ዓመት' : 'ዓመት ምምጻእ'}
            </label>
            <Select value={formData.yearMovedIn} onValueChange={(value) => handleChange({ target: { name: 'yearMovedIn', value } } as React.ChangeEvent<HTMLSelectElement>)}>
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
          
          <div className="flex items-center space-x-2 pb-2">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Ten Cell Leader First Name' : 
            inputLanguage === 'amharic' ? 'የአስር ቤት መሪ መጠሪያ ስም' : 'ዓሰርተ ስድራ መራሒ ቀዳማይ ሽም'}
          </label>
          <Input
            type="text"
            name="cellLeaderFirstName"
            value={formData.cellLeaderFirstName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Ten Cell Leader Middle Name' : 
            inputLanguage === 'amharic' ? 'የአስር ቤት መሪ የአባት ስም' : 'ዓሰርተ ስድራ መራሒ ማእከላይ ሽም'}
          </label>
          <Input
            type="text"
            name="cellLeaderMiddleName"
            value={formData.cellLeaderMiddleName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Ten Cell Leader Last Name' : 
            inputLanguage === 'amharic' ? 'የአስር ቤት መሪ የአያት ስም' : 'ዓሰርተ ስድራ መራሒ ዳሓራይ ሽም'}
          </label>
          <Input
            type="text"
            name="cellLeaderLastName"
            value={formData.cellLeaderLastName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Oldest Household Member First Name' : 
            inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል መጠሪያ ስም' : 'ዓበይ ኣባል ስድራ ቀዳማይ ሽም'}
          </label>
          <Input
            type="text"
            name="oldestHouseholdMemberFirstName"
            value={formData.oldestHouseholdMemberFirstName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Oldest Household Member Middle Name' : 
            inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል የአባት ስም' : 'ዓበይ ኣባል ስድራ ማእከላይ ሽም'}
          </label>
          <Input
            type="text"
            name="oldestHouseholdMemberMiddleName"
            value={formData.oldestHouseholdMemberMiddleName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Oldest Household Member Last Name' : 
            inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል የአያት ስም' : 'ዓበይ ኣባል ስድራ ዳሓራይ ሽም'}
          </label>
          <Input
            type="text"
            name="oldestHouseholdMemberLastName"
            value={formData.oldestHouseholdMemberLastName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
      </div>
    </div>
  );
};

export default ResidenceDetailsSection;

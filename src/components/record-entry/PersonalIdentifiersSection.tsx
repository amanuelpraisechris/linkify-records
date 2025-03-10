
import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PersonalIdentifiersSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const PersonalIdentifiersSection = ({
  formData,
  handleChange,
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  inputLanguage
}: PersonalIdentifiersSectionProps) => {
  // Generate years for the dropdown (from current year back to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  
  // Generate months 1-12
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h4 className="text-md font-medium mb-3 text-primary">
        {inputLanguage === 'latin' ? 'Personal Identifiers' : 
        inputLanguage === 'amharic' ? 'የግል መለያዎች' : 'ውልቃዊ መለለይታት'}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'First name' : 
            inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'} 
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName || ''}
            onChange={handleChange}
            className="w-full"
            required
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Middle name' : 
            inputLanguage === 'amharic' ? 'የአባት ስም' : 'ማእከላይ ሽም'}
          </label>
          <Input
            type="text"
            name="middleName"
            value={formData.middleName || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Last name' : 
            inputLanguage === 'amharic' ? 'የአያት ስም' : 'ዳሓራይ ሽም'} 
            <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName || ''}
            onChange={handleChange}
            className="w-full"
            required
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Sex' : 
            inputLanguage === 'amharic' ? 'ፆታ' : 'ጾታ'}
          </label>
          <Select value={formData.gender} onValueChange={(value) => handleChange({ target: { name: 'gender', value } } as React.ChangeEvent<HTMLSelectElement>)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={
                inputLanguage === 'latin' ? 'Select Gender' : 
                inputLanguage === 'amharic' ? 'ፆታ ይምረጡ' : 'ጾታ ምረጽ'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">
                {inputLanguage === 'latin' ? 'Male' : 
                inputLanguage === 'amharic' ? 'ወንድ' : 'ተባዕታይ'}
              </SelectItem>
              <SelectItem value="Female">
                {inputLanguage === 'latin' ? 'Female' : 
                inputLanguage === 'amharic' ? 'ሴት' : 'ኣንስታይ'}
              </SelectItem>
              <SelectItem value="Other">
                {inputLanguage === 'latin' ? 'Other' : 
                inputLanguage === 'amharic' ? 'ሌላ' : 'ካልእ'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Date of birth' : 
            inputLanguage === 'amharic' ? 'የትውልድ ቀን' : 'ዕለተ ልደት'} 
          </label>
          <div className="grid grid-cols-3 gap-2">
            {/* Year dropdown - required */}
            <div>
              <Select value={birthYear} onValueChange={setBirthYear}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? 'YYYY' : 
                    inputLanguage === 'amharic' ? 'ዓመት' : 'ዓመት'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Month dropdown - optional */}
            <div>
              <Select value={birthMonth} onValueChange={setBirthMonth}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? 'MM' : 
                    inputLanguage === 'amharic' ? 'ወር' : 'ወርሒ'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Day dropdown - optional */}
            <div>
              <Select value={birthDay} onValueChange={setBirthDay} disabled={!birthMonth}>
                <SelectTrigger className="w-full text-xs h-9">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? 'DD' : 
                    inputLanguage === 'amharic' ? 'ቀን' : 'መዓልቲ'
                  } />
                </SelectTrigger>
                <SelectContent>
                  {days.map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Telephone' : 
            inputLanguage === 'amharic' ? 'ስልክ' : 'ተሌፎን'}
          </label>
          <Input
            type="tel"
            name="telephone"
            value={formData.telephone || ''}
            onChange={handleChange}
            className="w-full"
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalIdentifiersSection;

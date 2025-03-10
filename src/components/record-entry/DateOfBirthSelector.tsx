
import { SupportedLanguage } from '@/utils/languageUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface DateOfBirthSelectorProps {
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const DateOfBirthSelector = ({
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  inputLanguage
}: DateOfBirthSelectorProps) => {
  // Generate years for the dropdown (from current year back to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  
  // Generate months 1-12 with month names
  const months = [
    { value: '01', label: '01 (Jan)' },
    { value: '02', label: '02 (Feb)' },
    { value: '03', label: '03 (Mar)' },
    { value: '04', label: '04 (Apr)' },
    { value: '05', label: '05 (May)' },
    { value: '06', label: '06 (Jun)' },
    { value: '07', label: '07 (Jul)' },
    { value: '08', label: '08 (Aug)' },
    { value: '09', label: '09 (Sep)' },
    { value: '10', label: '10 (Oct)' },
    { value: '11', label: '11 (Nov)' },
    { value: '12', label: '12 (Dec)' }
  ];
  
  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {inputLanguage === 'latin' ? 'Date of birth' : 
        inputLanguage === 'amharic' ? 'የትውልድ ቀን' : 'ዕለተ ልደት'} 
      </label>
      <div className="grid grid-cols-3 gap-2">
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
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
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
  );
};

export default DateOfBirthSelector;


import { SupportedLanguage } from '@/utils/languageUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SexSelectorProps {
  value: string | undefined;
  onChange: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const SexSelector = ({
  value,
  onChange,
  inputLanguage
}: SexSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {inputLanguage === 'latin' ? 'Sex' : 
        inputLanguage === 'amharic' ? 'ፆታ' : 'ጾታ'}
      </label>
      <Select 
        value={value} 
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            inputLanguage === 'latin' ? 'Select Sex' : 
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
  );
};

export default SexSelector;

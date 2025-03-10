
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';

interface TelephoneFieldProps {
  value: string | undefined;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputLanguage: SupportedLanguage;
}

const TelephoneField = ({
  value,
  onChange,
  inputLanguage
}: TelephoneFieldProps) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {inputLanguage === 'latin' ? 'Telephone' : 
        inputLanguage === 'amharic' ? 'ስልክ' : 'ተሌፎን'}
      </label>
      <Input
        type="tel"
        name="telephone"
        value={value || ''}
        onChange={onChange}
        className="w-full"
        dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
      />
    </div>
  );
};

export default TelephoneField;

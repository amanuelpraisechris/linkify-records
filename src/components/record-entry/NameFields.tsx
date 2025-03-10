
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Record } from '@/types';

interface NameFieldsProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

const NameFields = ({
  formData,
  handleChange,
  inputLanguage
}: NameFieldsProps) => {
  return (
    <div className="grid grid-cols-6 gap-3">
      <div className="col-span-2">
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
      
      <div className="col-span-2">
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
      
      <div className="col-span-2">
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
  );
};

export default NameFields;

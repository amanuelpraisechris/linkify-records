
import React from 'react';
import { Input } from '@/components/ui/input';
import { SupportedLanguage } from '@/utils/languageUtils';

interface NameInputGroupProps {
  prefix: string;
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

const NameInputGroup = ({ 
  prefix, 
  formData, 
  handleChange, 
  inputLanguage 
}: NameInputGroupProps) => {
  const firstName = `${prefix}_first_name`;
  const middleName = `${prefix}_middle_name`;
  const lastName = `${prefix}_last_name`;
  
  return (
    <div className="grid grid-cols-3 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputLanguage === 'latin' ? 'First Name' : 
          inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'}
        </label>
        <Input
          type="text"
          name={firstName}
          value={formData[firstName] || ''}
          onChange={handleChange}
          className="w-full"
          dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputLanguage === 'latin' ? 'Middle Name' : 
          inputLanguage === 'amharic' ? 'የአባት ስም' : 'ማእከላይ ሽም'}
        </label>
        <Input
          type="text"
          name={middleName}
          value={formData[middleName] || ''}
          onChange={handleChange}
          className="w-full"
          dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputLanguage === 'latin' ? 'Last Name' : 
          inputLanguage === 'amharic' ? 'የአያት ስም' : 'ዳሓራይ ሽም'}
        </label>
        <Input
          type="text"
          name={lastName}
          value={formData[lastName] || ''}
          onChange={handleChange}
          className="w-full"
          dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
        />
      </div>
    </div>
  );
};

export default NameInputGroup;

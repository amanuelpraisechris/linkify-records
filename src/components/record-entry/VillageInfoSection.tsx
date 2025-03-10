
import React from 'react';
import { Input } from '@/components/ui/input';
import { SupportedLanguage } from '@/utils/languageUtils';

interface VillageInfoSectionProps {
  formData: {
    village?: string;
    subVillage?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

const VillageInfoSection = ({ 
  formData, 
  handleChange, 
  inputLanguage 
}: VillageInfoSectionProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputLanguage === 'latin' ? 'Village' : 
          inputLanguage === 'amharic' ? 'መንደር' : 'ዓዲ'}
        </label>
        <Input
          type="text"
          name="village"
          value={formData.village || ''}
          onChange={handleChange}
          className="w-full"
          placeholder={
            inputLanguage === 'latin' ? 'Enter village name' : 
            inputLanguage === 'amharic' ? 'የመንደር ስም ያስገቡ' : 'ሽም ዓዲ የእቱ'
          }
          dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {inputLanguage === 'latin' ? 'Subvillage' : 
          inputLanguage === 'amharic' ? 'ንዑስ መንደር' : 'ንኡስ ዓዲ'}
        </label>
        <Input
          type="text"
          name="subVillage"
          value={formData.subVillage || ''}
          onChange={handleChange}
          className="w-full"
          placeholder={
            inputLanguage === 'latin' ? 'Enter subvillage name' : 
            inputLanguage === 'amharic' ? 'የንዑስ መንደር ስም ያስገቡ' : 'ሽም ንኡስ ዓዲ የእቱ'
          }
          dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
        />
      </div>
    </div>
  );
};

export default VillageInfoSection;

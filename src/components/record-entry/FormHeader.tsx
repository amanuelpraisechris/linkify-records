
import { Globe, UserPlus } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';

interface FormHeaderProps {
  isRepeatPatient: boolean;
  inputLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

const FormHeader = ({ isRepeatPatient, inputLanguage, onLanguageChange }: FormHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <UserPlus className="w-5 h-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">
          {isRepeatPatient ? 
            (inputLanguage === 'latin' ? 'Repeat Patient' : 
             inputLanguage === 'amharic' ? 'ድጋሚ ታካሚ' : 'ዳግማይ ሕሙም') : 
            (inputLanguage === 'latin' ? 'New Patient Record' : 
             inputLanguage === 'amharic' ? 'አዲስ የታካሚ መዝገብ' : 'ሓድሽ መዝገብ ሕሙም')}
        </h3>
      </div>
      
      <div className="flex items-center">
        <Globe className="w-4 h-4 mr-1 text-muted-foreground" />
        <select
          value={inputLanguage}
          onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
          className="text-sm bg-transparent border-none outline-none cursor-pointer"
        >
          <option value="latin">Latin</option>
          <option value="amharic">አማርኛ (Amharic)</option>
          <option value="tigrinya">ትግርኛ (Tigrinya)</option>
        </select>
      </div>
    </div>
  );
};

export default FormHeader;

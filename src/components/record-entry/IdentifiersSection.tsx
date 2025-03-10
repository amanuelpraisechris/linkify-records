
import { SupportedLanguage } from '@/utils/languageUtils';
import { X } from 'lucide-react';

interface IdentifiersSectionProps {
  identifiers: Array<{ type: string; value: string }>;
  handleIdentifierChange: (index: number, field: 'type' | 'value', value: string) => void;
  addIdentifier: () => void;
  removeIdentifier: (index: number) => void;
  inputLanguage: SupportedLanguage;
}

const IdentifiersSection = ({
  identifiers,
  handleIdentifierChange,
  addIdentifier,
  removeIdentifier,
  inputLanguage
}: IdentifiersSectionProps) => {
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium">
          {inputLanguage === 'latin' ? 'Identifiers' : 
          inputLanguage === 'amharic' ? 'መለያዎች' : 'መለለይታት'}
        </label>
        <button
          type="button"
          onClick={addIdentifier}
          className="text-xs text-primary hover:underline"
        >
          + {inputLanguage === 'latin' ? 'Add Another' : 
            inputLanguage === 'amharic' ? 'ሌላ ጨምር' : 'ካልእ ወስኽ'}
        </button>
      </div>
      
      {identifiers.map((id, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <select
            value={id.type}
            onChange={(e) => handleIdentifierChange(index, 'type', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-primary/30 w-1/3"
          >
            <option value="none">
              {inputLanguage === 'latin' ? 'Select Type' : 
              inputLanguage === 'amharic' ? 'ዓይነት ይምረጡ' : 'ዓይነት ምረጽ'}
            </option>
            <option value="Health ID">
              {inputLanguage === 'latin' ? 'Health ID' : 
              inputLanguage === 'amharic' ? 'የጤና መታወቂያ' : 'ናይ ጥዕና መለለዪ'}
            </option>
            <option value="National ID">
              {inputLanguage === 'latin' ? 'National ID' : 
              inputLanguage === 'amharic' ? 'ብሔራዊ መታወቂያ' : 'ሃገራዊ መለለዪ'}
            </option>
            <option value="Voter ID">
              {inputLanguage === 'latin' ? 'Voter ID' : 
              inputLanguage === 'amharic' ? 'የመራጮች መታወቂያ' : 'ናይ መራጺ መለለዪ'}
            </option>
            <option value="Community ID">
              {inputLanguage === 'latin' ? 'Community ID' : 
              inputLanguage === 'amharic' ? 'የማህበረሰብ መታወቂያ' : 'ናይ ማሕበረሰብ መለለዪ'}
            </option>
            <option value="Study ID">
              {inputLanguage === 'latin' ? 'Study ID' : 
              inputLanguage === 'amharic' ? 'የጥናት መታወቂያ' : 'ናይ መጽናዕቲ መለለዪ'}
            </option>
          </select>
          <input
            type="text"
            value={id.value}
            onChange={(e) => handleIdentifierChange(index, 'value', e.target.value)}
            className="p-2 border rounded-md focus:ring-2 focus:ring-primary/30 flex-1"
            placeholder={
              inputLanguage === 'latin' ? 'Enter identifier value' : 
              inputLanguage === 'amharic' ? 'የመለያ እሴት ያስገቡ' : 'ዋጋ መለለዪ ኣእቱ'
            }
            dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
          />
          {identifiers.length > 1 && (
            <button
              type="button"
              onClick={() => removeIdentifier(index)}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default IdentifiersSection;

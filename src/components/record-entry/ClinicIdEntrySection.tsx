// Update import for RecordDataContext
import { useRecordData } from '@/contexts/record-data/RecordDataContext';
import { SupportedLanguage } from '@/utils/languageUtils';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ClinicIdEntrySectionProps {
  clinicIds: Array<{ type: string; value: string }>;
  handleClinicIdChange: (index: number, field: 'type' | 'value', value: string) => void;
  addClinicId: () => void;
  removeClinicId: (index: number) => void;
  inputLanguage: SupportedLanguage;
}

const ClinicIdEntrySection = ({
  clinicIds,
  handleClinicIdChange,
  addClinicId,
  removeClinicId,
  inputLanguage
}: ClinicIdEntrySectionProps) => {
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium">
          {inputLanguage === 'latin' ? 'Clinic Identifiers' : 
           inputLanguage === 'amharic' ? 'የክሊኒክ መለያዎች' : 'መለለዪ ክሊኒክ'}
        </label>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={addClinicId}
          className="text-xs text-primary"
        >
          + {inputLanguage === 'latin' ? 'Add Another' : 
            inputLanguage === 'amharic' ? 'ሌላ ጨምር' : 'ካልእ ወስኽ'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {clinicIds.map((id, index) => (
          <div key={index} className="flex space-x-2">
            <Input
              type="text"
              placeholder={
                inputLanguage === 'latin' ? 'Identifier Type' : 
                inputLanguage === 'amharic' ? 'የመለያ አይነት' : 'ዓይነት መለለዪ'
              }
              value={id.type}
              onChange={(e) => handleClinicIdChange(index, 'type', e.target.value)}
              className="w-24"
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
            
            <Input
              type="text"
              value={id.value}
              onChange={(e) => handleClinicIdChange(index, 'value', e.target.value)}
              className="flex-1"
              placeholder={
                inputLanguage === 'latin' ? 'Enter identifier value' : 
                inputLanguage === 'amharic' ? 'የመለያ እሴት ያስገቡ' : 'ዋጋ መለለዪ ኣእቱ'
              }
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
            
            {clinicIds.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeClinicId(index)}
                className="text-destructive hover:bg-destructive/10 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClinicIdEntrySection;

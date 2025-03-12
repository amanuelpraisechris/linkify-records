
import { SupportedLanguage } from '@/utils/languageUtils';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

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
  const identifierTypes = [
    {value: 'Health ID', label: {
      latin: 'Health ID',
      amharic: 'የጤና መታወቂያ',
      tigrinya: 'ናይ ጥዕና መለለዪ'
    }},
    {value: 'National ID', label: {
      latin: 'National ID',
      amharic: 'ብሔራዊ መታወቂያ',
      tigrinya: 'ሃገራዊ መለለዪ'
    }},
    {value: 'Voter ID', label: {
      latin: 'Voter ID',
      amharic: 'የመራጮች መታወቂያ',
      tigrinya: 'ናይ መራጺ መለለዪ'
    }},
    {value: 'Community ID', label: {
      latin: 'Community ID',
      amharic: 'የማህበረሰብ መታወቂያ',
      tigrinya: 'ናይ ማሕበረሰብ መለለዪ'
    }},
    {value: 'Study ID', label: {
      latin: 'Study ID',
      amharic: 'የጥናት መታወቂያ',
      tigrinya: 'ናይ መጽናዕቲ መለለዪ'
    }},
    // Add the new identifier types
    {value: 'Tabia Name', label: {
      latin: 'Tabia Name',
      amharic: 'የጣቢያ ስም',
      tigrinya: 'ስም ጣብያ'
    }},
    {value: 'Kushet Name', label: {
      latin: 'Kushet Name',
      amharic: 'የኩሸት ስም',
      tigrinya: 'ስም ኩሸት'
    }},
    {value: 'Got Name', label: {
      latin: 'Got Name',
      amharic: 'የጎት ስም',
      tigrinya: 'ስም ጎት'
    }},
    {value: 'House Number', label: {
      latin: 'House Number',
      amharic: 'የቤት ቁጥር',
      tigrinya: 'ቁጽሪ ገዛ'
    }}
  ];

  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium">
          {inputLanguage === 'latin' ? 'Identifiers' : 
          inputLanguage === 'amharic' ? 'መለያዎች' : 'መለለይታት'}
        </label>
        <Button
          type="button"
          variant="link"
          size="sm"
          onClick={addIdentifier}
          className="text-xs text-primary"
        >
          + {inputLanguage === 'latin' ? 'Add Another' : 
            inputLanguage === 'amharic' ? 'ሌላ ጨምር' : 'ካልእ ወስኽ'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {identifiers.map((id, index) => (
          <div key={index} className="flex space-x-2">
            <Select
              value={id.type}
              onValueChange={(value) => handleIdentifierChange(index, 'type', value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder={
                  inputLanguage === 'latin' ? 'Select Type' : 
                  inputLanguage === 'amharic' ? 'ዓይነት ይምረጡ' : 'ዓይነት ምረጽ'
                } />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">
                  {inputLanguage === 'latin' ? 'Select Type' : 
                  inputLanguage === 'amharic' ? 'ዓይነት ይምረጡ' : 'ዓይነት ምረጽ'}
                </SelectItem>
                {identifierTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label[inputLanguage]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="text"
              value={id.value}
              onChange={(e) => handleIdentifierChange(index, 'value', e.target.value)}
              className="flex-1"
              placeholder={
                inputLanguage === 'latin' ? 'Enter identifier value' : 
                inputLanguage === 'amharic' ? 'የመለያ እሴት ያስገቡ' : 'ዋጋ መለለዪ ኣእቱ'
              }
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
            
            {identifiers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeIdentifier(index)}
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

export default IdentifiersSection;

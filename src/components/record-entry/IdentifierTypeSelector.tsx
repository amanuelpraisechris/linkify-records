
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SupportedLanguage } from '@/utils/languageUtils';

interface IdentifierTypeSelectorProps {
  identifierType: 'patient' | 'otherPerson';
  onValueChange: (value: 'patient' | 'otherPerson') => void;
  inputLanguage: SupportedLanguage;
  neverInDss?: boolean;
  onNeverInDssChange?: (checked: boolean) => void;
}

const IdentifierTypeSelector = ({
  identifierType,
  onValueChange,
  inputLanguage,
  neverInDss = false,
  onNeverInDssChange
}: IdentifierTypeSelectorProps) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
      <RadioGroup 
        value={identifierType}
        className="flex space-x-4"
        onValueChange={(value) => onValueChange(value as 'patient' | 'otherPerson')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="patient" id="patient" />
          <Label htmlFor="patient" className="font-medium">
            {inputLanguage === 'latin' ? 'Patient' : 
            inputLanguage === 'amharic' ? 'ታካሚ' : 'ሕሙም'}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="otherPerson" id="otherPerson" />
          <Label htmlFor="otherPerson" className="font-medium">
            {inputLanguage === 'latin' ? 'Other Person' : 
            inputLanguage === 'amharic' ? 'ሌላ ሰው' : 'ካልእ ሰብ'}
          </Label>
        </div>
      </RadioGroup>
      
      {onNeverInDssChange && (
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Checkbox 
            id="neverInDss" 
            checked={neverInDss}
            onCheckedChange={(checked) => onNeverInDssChange(checked as boolean)}
          />
          <Label htmlFor="neverInDss" className="font-medium">
            {inputLanguage === 'latin' ? 'Never in DSS Area' : 
            inputLanguage === 'amharic' ? 'በDSS አካባቢ አልነበረም' : 'ኣብ DSS ከባቢ ኣይነበረን'}
          </Label>
        </div>
      )}
    </div>
  );
};

export default IdentifierTypeSelector;


import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { SupportedLanguage } from '@/utils/languageUtils';

interface IdentifierTypeSelectorProps {
  identifierType: 'patient' | 'otherPerson';
  onValueChange: (value: 'patient' | 'otherPerson') => void;
  inputLanguage: SupportedLanguage;
}

const IdentifierTypeSelector = ({
  identifierType,
  onValueChange,
  inputLanguage
}: IdentifierTypeSelectorProps) => {
  return (
    <div className="mb-4">
      <RadioGroup 
        value={identifierType}
        className="flex space-x-4"
        onValueChange={(value) => onValueChange(value as 'patient' | 'otherPerson')}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="patient" id="patient" />
          <Label htmlFor="patient">
            {inputLanguage === 'latin' ? 'Patient' : 
            inputLanguage === 'amharic' ? 'ታካሚ' : 'ሕሙም'}
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="otherPerson" id="otherPerson" />
          <Label htmlFor="otherPerson">
            {inputLanguage === 'latin' ? 'Other Person' : 
            inputLanguage === 'amharic' ? 'ሌላ ሰው' : 'ካልእ ሰብ'}
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default IdentifierTypeSelector;

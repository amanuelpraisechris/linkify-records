
import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import NameFields from './NameFields';
import SexSelector from './SexSelector';
import DateOfBirthSelector from './DateOfBirthSelector';
import TelephoneField from './TelephoneField';

interface PersonalIdentifiersSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const PersonalIdentifiersSection = ({
  formData,
  handleChange,
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  inputLanguage
}: PersonalIdentifiersSectionProps) => {
  // Handler for sex selection
  const handleSexChange = (value: string) => {
    handleChange({ target: { name: 'sex', value } } as React.ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h4 className="text-md font-medium mb-3 text-primary">
        {inputLanguage === 'latin' ? 'Personal Identifiers' : 
        inputLanguage === 'amharic' ? 'የግል መለያዎች' : 'ውልቃዊ መለለይታት'}
      </h4>
      
      <NameFields 
        formData={formData}
        handleChange={handleChange}
        inputLanguage={inputLanguage}
      />
      
      <div className="grid grid-cols-6 gap-3 mt-3">
        <div className="col-span-1">
          <SexSelector 
            value={formData.sex}
            onChange={handleSexChange}
            inputLanguage={inputLanguage}
          />
        </div>
        
        <div className="col-span-3">
          <DateOfBirthSelector 
            birthYear={birthYear}
            setBirthYear={setBirthYear}
            birthMonth={birthMonth}
            setBirthMonth={setBirthMonth}
            birthDay={birthDay}
            setBirthDay={setBirthDay}
            inputLanguage={inputLanguage}
          />
        </div>
        
        <div className="col-span-2">
          <TelephoneField 
            value={formData.telephone}
            onChange={handleChange}
            inputLanguage={inputLanguage}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalIdentifiersSection;


import { useState } from 'react';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Save, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';
import PersonalIdentifiersSection from './record-entry/PersonalIdentifiersSection';
import ResidenceDetailsSection from './record-entry/ResidenceDetailsSection';
import IdentifiersSection from './record-entry/IdentifiersSection';
import IdentifierTypeSelector from './record-entry/IdentifierTypeSelector';

interface RecordEntryFormProps {
  onRecordSubmit: (record: Record) => void;
}

const RecordEntryForm = ({ onRecordSubmit }: RecordEntryFormProps) => {
  const [formData, setFormData] = useState<Partial<Record>>({
    firstName: '',
    lastName: '',
    middleName: '',
    gender: '',
    birthDate: '',
    village: '',
    subVillage: '',
    telephone: '',
    yearMovedIn: '',
    neverInDSS: false,
    cellLeaderFirstName: '',
    cellLeaderMiddleName: '',
    cellLeaderLastName: '',
    oldestHouseholdMemberFirstName: '',
    oldestHouseholdMemberMiddleName: '',
    oldestHouseholdMemberLastName: '',
  });
  
  // Separate state for birth date components
  const [birthYear, setBirthYear] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  
  const [identifiers, setIdentifiers] = useState<Array<{ type: string; value: string }>>([
    { type: 'Health ID', value: '' }
  ]);
  
  const [identifierType, setIdentifierType] = useState<'patient' | 'otherPerson'>('patient');
  const [inputLanguage, setInputLanguage] = useState<SupportedLanguage>('latin');
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handleIdentifierChange = (index: number, field: 'type' | 'value', value: string) => {
    const newIdentifiers = [...identifiers];
    newIdentifiers[index][field] = value;
    setIdentifiers(newIdentifiers);
  };
  
  const addIdentifier = () => {
    setIdentifiers([...identifiers, { type: '', value: '' }]);
  };
  
  const removeIdentifier = (index: number) => {
    setIdentifiers(identifiers.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.firstName || !formData.lastName || !birthYear) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Construct birthDate string based on available components
    let birthDateStr = birthYear;
    if (birthMonth) {
      birthDateStr = `${birthDateStr}-${birthMonth}`;
      if (birthDay) {
        birthDateStr = `${birthDateStr}-${birthDay}`;
      } else {
        birthDateStr = `${birthDateStr}-01`; // Default to first day if only month is provided
      }
    } else {
      birthDateStr = `${birthDateStr}-01-01`; // Default to January 1st if only year is provided
    }
    
    // Create a new record
    const newRecord: Record = {
      id: `new-${Date.now()}`,
      ...formData as Record,
      birthDate: birthDateStr,
      identifiers: identifiers.filter(id => id.type && id.value),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'Health Facility Entry'
      }
    };
    
    onRecordSubmit(newRecord);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      middleName: '',
      gender: '',
      birthDate: '',
      village: '',
      subVillage: '',
      telephone: '',
      yearMovedIn: '',
      neverInDSS: false,
      cellLeaderFirstName: '',
      cellLeaderMiddleName: '',
      cellLeaderLastName: '',
      oldestHouseholdMemberFirstName: '',
      oldestHouseholdMemberMiddleName: '',
      oldestHouseholdMemberLastName: '',
    });
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setIdentifiers([{ type: 'Health ID', value: '' }]);
    setIdentifierType('patient');
    
    toast({
      title: "Record Submitted",
      description: "The record has been submitted for matching.",
    });
  };
  
  return (
    <div className="border rounded-xl shadow-subtle p-6 bg-white dark:bg-black">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <UserPlus className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-lg font-medium">New Patient Record</h3>
        </div>
        
        <div className="flex items-center">
          <Globe className="w-4 h-4 mr-1 text-muted-foreground" />
          <select
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value as SupportedLanguage)}
            className="text-sm bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="latin">Latin</option>
            <option value="amharic">አማርኛ (Amharic)</option>
            <option value="tigrinya">ትግርኛ (Tigrinya)</option>
          </select>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Identifiers Section */}
        <IdentifierTypeSelector 
          identifierType={identifierType}
          onValueChange={setIdentifierType}
          inputLanguage={inputLanguage}
        />
        
        <PersonalIdentifiersSection
          formData={formData}
          handleChange={handleChange}
          birthYear={birthYear}
          setBirthYear={setBirthYear}
          birthMonth={birthMonth}
          setBirthMonth={setBirthMonth}
          birthDay={birthDay}
          setBirthDay={setBirthDay}
          inputLanguage={inputLanguage}
        />
        
        {/* Residence Details Section */}
        <ResidenceDetailsSection
          formData={formData}
          handleChange={handleChange}
          handleCheckboxChange={handleCheckboxChange}
          inputLanguage={inputLanguage}
        />
        
        {/* Identifiers Section */}
        <IdentifiersSection
          identifiers={identifiers}
          handleIdentifierChange={handleIdentifierChange}
          addIdentifier={addIdentifier}
          removeIdentifier={removeIdentifier}
          inputLanguage={inputLanguage}
        />
        
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-all-medium"
          >
            <Save className="w-4 h-4 mr-2" />
            {inputLanguage === 'latin' ? 'Submit & Find Matches' : 
             inputLanguage === 'amharic' ? 'አስገባ እና ተመሳሳዮችን ፈልግ' : 'ኣቕርብ ከምኡውን ተመሳሰልቲ ድለ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordEntryForm;

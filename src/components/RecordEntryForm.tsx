import { useState, useEffect } from 'react';
import { Record, Visit, ResidencyPeriod } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Save, Globe, ArrowRightCircle, Search } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';
import PersonalIdentifiersSection from './record-entry/PersonalIdentifiersSection';
import ResidenceDetailsSection from './record-entry/ResidenceDetailsSection';
import IdentifiersSection from './record-entry/IdentifiersSection';
import IdentifierTypeSelector from './record-entry/IdentifierTypeSelector';
import ClinicIdEntrySection from './record-entry/ClinicIdEntrySection';
import ResidencyTimelineSection from './record-entry/ResidencyTimelineSection';
import VisitDetailsSection from './record-entry/VisitDetailsSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  
  const [clinicIds, setClinicIds] = useState<Array<{ type: string; value: string }>>([
    { type: 'CTC ID', value: '' }
  ]);
  
  const [visit, setVisit] = useState<Visit>({
    date: new Date().toISOString().split('T')[0],
    visitBy: 'PATIENT'
  });
  
  const [residencyPeriods, setResidencyPeriods] = useState<ResidencyPeriod[]>([]);
  
  const [activeTab, setActiveTab] = useState('patient-registry');
  const [identifierType, setIdentifierType] = useState<'patient' | 'otherPerson'>('patient');
  const [inputLanguage, setInputLanguage] = useState<SupportedLanguage>('latin');
  const [isRepeatPatient, setIsRepeatPatient] = useState(false);
  
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
  
  const handleClinicIdChange = (index: number, field: 'type' | 'value', value: string) => {
    const newClinicIds = [...clinicIds];
    newClinicIds[index][field] = value;
    setClinicIds(newClinicIds);
  };
  
  const addClinicId = () => {
    setClinicIds([...clinicIds, { type: '', value: '' }]);
  };
  
  const removeClinicId = (index: number) => {
    setClinicIds(clinicIds.filter((_, i) => i !== index));
  };
  
  const handleVisitChange = (newVisit: Visit) => {
    setVisit(newVisit);
  };
  
  const handleVisitSave = () => {
    toast({
      title: "Visit Information Saved",
      description: `Visit recorded for ${visit.date} by ${visit.visitBy}.`,
    });
  };
  
  const handlePatientFound = (record: Record) => {
    // Set form data with the found patient information
    setFormData({
      ...record,
    });
    
    // Set birth date components
    if (record.birthDate) {
      const parts = record.birthDate.split('-');
      if (parts.length >= 1) setBirthYear(parts[0]);
      if (parts.length >= 2) setBirthMonth(parts[1]);
      if (parts.length >= 3) setBirthDay(parts[2]);
    }
    
    // Set identifiers
    if (record.identifiers && record.identifiers.length > 0) {
      setIdentifiers(record.identifiers);
    }
    
    // Mark as repeat patient
    setIsRepeatPatient(true);
    
    toast({
      title: "Repeat Patient Found",
      description: "Personal identifiers have been automatically filled in.",
    });
  };
  
  const handleNextToLinkage = () => {
    setActiveTab('linkage-with-dss');
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
      identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
      visits: [{...visit}],
      residencyTimeline: [...residencyPeriods],
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
    setClinicIds([{ type: 'CTC ID', value: '' }]);
    setResidencyPeriods([]);
    setIdentifierType('patient');
    setIsRepeatPatient(false);
    setActiveTab('patient-registry');
    
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
            onChange={(e) => setInputLanguage(e.target.value as SupportedLanguage)}
            className="text-sm bg-transparent border-none outline-none cursor-pointer"
          >
            <option value="latin">Latin</option>
            <option value="amharic">አማርኛ (Amharic)</option>
            <option value="tigrinya">ትግርኛ (Tigrinya)</option>
          </select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="patient-registry">
            {inputLanguage === 'latin' ? 'Patient Registry' : 
             inputLanguage === 'amharic' ? 'የታካሚ መዝገብ' : 'መዝገብ ሕሙም'}
          </TabsTrigger>
          <TabsTrigger value="linkage-with-dss">
            {inputLanguage === 'latin' ? 'Linkage with DSS' : 
             inputLanguage === 'amharic' ? 'ከDSS ጋር ማገናኘት' : 'ምትእስሳር ምስ DSS'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient-registry">
          <form className="space-y-6">
            {/* Clinic IDs Section */}
            <ClinicIdEntrySection 
              clinicIds={clinicIds}
              handleClinicIdChange={handleClinicIdChange}
              addClinicId={addClinicId}
              removeClinicId={removeClinicId}
              onPatientFound={handlePatientFound}
              inputLanguage={inputLanguage}
            />
            
            {/* Visit Details Section */}
            <VisitDetailsSection
              visit={visit}
              onVisitChange={handleVisitChange}
              onVisitSave={handleVisitSave}
              inputLanguage={inputLanguage}
            />
            
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
            
            {/* Residency Timeline Section */}
            <ResidencyTimelineSection
              residencyPeriods={residencyPeriods}
              onResidencyPeriodsChange={setResidencyPeriods}
              inputLanguage={inputLanguage}
            />
            
            {/* Residence Details Section (for current residence) */}
            <ResidenceDetailsSection
              formData={formData}
              handleChange={handleChange}
              handleCheckboxChange={handleCheckboxChange}
              inputLanguage={inputLanguage}
            />
            
            {/* Other Identifiers Section */}
            <IdentifiersSection
              identifiers={identifiers}
              handleIdentifierChange={handleIdentifierChange}
              addIdentifier={addIdentifier}
              removeIdentifier={removeIdentifier}
              inputLanguage={inputLanguage}
            />
            
            <div className="flex justify-end pt-4 space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleNextToLinkage}
                className="inline-flex items-center"
              >
                {inputLanguage === 'latin' ? 'Save for Search' : 
                 inputLanguage === 'amharic' ? 'ለፍለጋ ያስቀምጡ' : 'ንምድላይ ኣቐምጥ'}
                <ArrowRightCircle className="w-4 h-4 ml-2" />
              </Button>
              
              <Button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center bg-primary text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" />
                {inputLanguage === 'latin' ? 'Submit & Find Matches' : 
                 inputLanguage === 'amharic' ? 'አስገባ እና ተመሳሳዮችን ፈልግ' : 'ኣቕርብ ከምኡውን ተመሳሰልቲ ድለ'}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="linkage-with-dss">
          <div className="space-y-6">
            <div className="flex justify-between">
              <h4 className="text-lg font-medium">
                {inputLanguage === 'latin' ? 'DSS Database Search' : 
                 inputLanguage === 'amharic' ? 'የDSS ውሂብ ቋት ፍለጋ' : 'ምድላይ ዋህዮ ሓበሬታ DSS'}
              </h4>
              
              <Button
                type="button"
                onClick={() => {/* Implement search DSS functionality */}}
                className="inline-flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                {inputLanguage === 'latin' ? 'Search DSS' : 
                 inputLanguage === 'amharic' ? 'DSS ይፈልጉ' : 'DSS ድለ'}
              </Button>
            </div>
            
            <div className="border-2 border-dashed rounded-md p-8 text-center text-muted-foreground">
              {inputLanguage === 'latin' ? 
                'Click "Search DSS" to find potential matches in the HDSS database. Results will appear here.' : 
               inputLanguage === 'amharic' ? 
                'በHDSS ውሂብ ቋት ውስጥ ሊገኙ የሚችሉ ተዛማጅዎችን ለማግኘት "DSS ይፈልጉ" የሚለውን ጠቅ ያድርጉ። ውጤቶች እዚህ ይታያሉ።' : 
                'ኣብ ውሽጢ ዋህዮ ሓበሬታ HDSS ዝርከቡ ተዛመድቲ ንምድላይ "DSS ድለ" ዝብል ጠውቕ። ውጽኢታት ኣብዚ ክርአዩ ኢዮም።'}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordEntryForm;

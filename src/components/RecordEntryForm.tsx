
import { useState } from 'react';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Save, X, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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

  // Generate years for the dropdown (from current year back to 100 years ago)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
  
  // Generate months 1-12
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  
  // Generate days 1-31
  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  // Generate years for "Year moved in" (from current year back to 30 years ago)
  const movedInYears = Array.from({ length: 30 }, (_, i) => (currentYear - i).toString());
  
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
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-md font-medium mb-3 text-primary">
            {inputLanguage === 'latin' ? 'Personal Identifiers' : 
            inputLanguage === 'amharic' ? 'የግል መለያዎች' : 'ውልቃዊ መለለይታት'}
          </h4>
          
          <div className="mb-4">
            <RadioGroup 
              defaultValue="patient" 
              className="flex space-x-4"
              onValueChange={(value) => setIdentifierType(value as 'patient' | 'otherPerson')}
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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'First name' : 
                inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'} 
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName || ''}
                onChange={handleChange}
                className="w-full"
                required
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Middle name' : 
                inputLanguage === 'amharic' ? 'የአባት ስም' : 'ማእከላይ ሽም'}
              </label>
              <Input
                type="text"
                name="middleName"
                value={formData.middleName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Last name' : 
                inputLanguage === 'amharic' ? 'የአያት ስም' : 'ዳሓራይ ሽም'} 
                <span className="text-destructive">*</span>
              </label>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName || ''}
                onChange={handleChange}
                className="w-full"
                required
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Sex' : 
                inputLanguage === 'amharic' ? 'ፆታ' : 'ጾታ'}
              </label>
              <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? 'Select Gender' : 
                    inputLanguage === 'amharic' ? 'ፆታ ይምረጡ' : 'ጾታ ምረጽ'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">
                    {inputLanguage === 'latin' ? 'Male' : 
                    inputLanguage === 'amharic' ? 'ወንድ' : 'ተባዕታይ'}
                  </SelectItem>
                  <SelectItem value="Female">
                    {inputLanguage === 'latin' ? 'Female' : 
                    inputLanguage === 'amharic' ? 'ሴት' : 'ኣንስታይ'}
                  </SelectItem>
                  <SelectItem value="Other">
                    {inputLanguage === 'latin' ? 'Other' : 
                    inputLanguage === 'amharic' ? 'ሌላ' : 'ካልእ'}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Date of birth' : 
                inputLanguage === 'amharic' ? 'የትውልድ ቀን' : 'ዕለተ ልደት'} 
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Year dropdown - required */}
                <div>
                  <Select value={birthYear} onValueChange={setBirthYear}>
                    <SelectTrigger className="w-full text-xs h-9">
                      <SelectValue placeholder={
                        inputLanguage === 'latin' ? 'YYYY' : 
                        inputLanguage === 'amharic' ? 'ዓመት' : 'ዓመት'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map(year => (
                        <SelectItem key={year} value={year}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Month dropdown - optional */}
                <div>
                  <Select value={birthMonth} onValueChange={setBirthMonth}>
                    <SelectTrigger className="w-full text-xs h-9">
                      <SelectValue placeholder={
                        inputLanguage === 'latin' ? 'MM' : 
                        inputLanguage === 'amharic' ? 'ወር' : 'ወርሒ'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Day dropdown - optional */}
                <div>
                  <Select value={birthDay} onValueChange={setBirthDay} disabled={!birthMonth}>
                    <SelectTrigger className="w-full text-xs h-9">
                      <SelectValue placeholder={
                        inputLanguage === 'latin' ? 'DD' : 
                        inputLanguage === 'amharic' ? 'ቀን' : 'መዓልቲ'
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map(day => (
                        <SelectItem key={day} value={day}>{day}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Telephone' : 
                inputLanguage === 'amharic' ? 'ስልክ' : 'ተሌፎን'}
              </label>
              <Input
                type="tel"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
          </div>
        </div>
        
        {/* Residence Details Section */}
        <div className="bg-muted/20 p-4 rounded-lg">
          <h4 className="text-md font-medium mb-3 text-primary">
            {inputLanguage === 'latin' ? 'Residence Details' : 
            inputLanguage === 'amharic' ? 'የመኖሪያ ዝርዝሮች' : 'ዝርዝር ናይ መንበሪ'}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Village' : 
                inputLanguage === 'amharic' ? 'መንደር' : 'ዓዲ'}
              </label>
              <Select value={formData.village} onValueChange={(value) => setFormData({ ...formData, village: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? '(none)' : 
                    inputLanguage === 'amharic' ? '(የለም)' : '(የለን)'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {inputLanguage === 'latin' ? '(none)' : 
                    inputLanguage === 'amharic' ? '(የለም)' : '(የለን)'}
                  </SelectItem>
                  <SelectItem value="Village1">Village 1</SelectItem>
                  <SelectItem value="Village2">Village 2</SelectItem>
                  <SelectItem value="Village3">Village 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Subvillage' : 
                inputLanguage === 'amharic' ? 'ንዑስ መንደር' : 'ንኡስ ዓዲ'}
              </label>
              <Select value={formData.subVillage} onValueChange={(value) => setFormData({ ...formData, subVillage: value })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={
                    inputLanguage === 'latin' ? 'Select Subvillage' : 
                    inputLanguage === 'amharic' ? 'ንዑስ መንደር ይምረጡ' : 'ንኡስ ዓዲ ምረጽ'
                  } />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Subvillage1">Subvillage 1</SelectItem>
                  <SelectItem value="Subvillage2">Subvillage 2</SelectItem>
                  <SelectItem value="Subvillage3">Subvillage 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {inputLanguage === 'latin' ? 'Year moved in' : 
                  inputLanguage === 'amharic' ? 'የገቡበት ዓመት' : 'ዓመት ምምጻእ'}
                </label>
                <Select value={formData.yearMovedIn} onValueChange={(value) => setFormData({ ...formData, yearMovedIn: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={
                      inputLanguage === 'latin' ? 'Select Year' : 
                      inputLanguage === 'amharic' ? 'ዓመት ይምረጡ' : 'ዓመት ምረጽ'
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {movedInYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pb-2">
                <div className="text-sm font-medium">OR</div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="neverInDSS" 
                    checked={formData.neverInDSS as boolean} 
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('neverInDSS', checked as boolean)
                    }
                  />
                  <Label htmlFor="neverInDSS" className="text-sm font-normal">
                    {inputLanguage === 'latin' ? 'Never in DSS Area' : 
                    inputLanguage === 'amharic' ? 'በDSS አካባቢ አልነበረም' : 'ኣብ DSS ከባቢ ፈጺሙ የለን'}
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Ten Cell Leader First Name' : 
                inputLanguage === 'amharic' ? 'የአስር ቤት መሪ መጠሪያ ስም' : 'ዓሰርተ ስድራ መራሒ ቀዳማይ ሽም'}
              </label>
              <Input
                type="text"
                name="cellLeaderFirstName"
                value={formData.cellLeaderFirstName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Ten Cell Leader Middle Name' : 
                inputLanguage === 'amharic' ? 'የአስር ቤት መሪ የአባት ስም' : 'ዓሰርተ ስድራ መራሒ ማእከላይ ሽም'}
              </label>
              <Input
                type="text"
                name="cellLeaderMiddleName"
                value={formData.cellLeaderMiddleName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Ten Cell Leader Last Name' : 
                inputLanguage === 'amharic' ? 'የአስር ቤት መሪ የአያት ስም' : 'ዓሰርተ ስድራ መራሒ ዳሓራይ ሽም'}
              </label>
              <Input
                type="text"
                name="cellLeaderLastName"
                value={formData.cellLeaderLastName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Oldest Household Member First Name' : 
                inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል መጠሪያ ስም' : 'ዓበይ ኣባል ስድራ ቀዳማይ ሽም'}
              </label>
              <Input
                type="text"
                name="oldestHouseholdMemberFirstName"
                value={formData.oldestHouseholdMemberFirstName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Oldest Household Member Middle Name' : 
                inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል የአባት ስም' : 'ዓበይ ኣባል ስድራ ማእከላይ ሽም'}
              </label>
              <Input
                type="text"
                name="oldestHouseholdMemberMiddleName"
                value={formData.oldestHouseholdMemberMiddleName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">
                {inputLanguage === 'latin' ? 'Oldest Household Member Last Name' : 
                inputLanguage === 'amharic' ? 'የቤተሰብ ታላቅ አባል የአያት ስም' : 'ዓበይ ኣባል ስድራ ዳሓራይ ሽም'}
              </label>
              <Input
                type="text"
                name="oldestHouseholdMemberLastName"
                value={formData.oldestHouseholdMemberLastName || ''}
                onChange={handleChange}
                className="w-full"
                dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
              />
            </div>
          </div>
        </div>
        
        {/* Identifiers Section */}
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
                <option value="">
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


import { useState } from 'react';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Save, X, Globe } from 'lucide-react';
import { SupportedLanguage } from '@/utils/languageUtils';

interface RecordEntryFormProps {
  onRecordSubmit: (record: Record) => void;
}

const RecordEntryForm = ({ onRecordSubmit }: RecordEntryFormProps) => {
  const [formData, setFormData] = useState<Partial<Record>>({
    firstName: '',
    lastName: '',
    gender: '',
    birthDate: '',
    village: '',
    district: '',
    householdHead: '',
    motherName: '',
  });
  
  const [identifiers, setIdentifiers] = useState<Array<{ type: string; value: string }>>([
    { type: 'Health ID', value: '' }
  ]);
  
  const [inputLanguage, setInputLanguage] = useState<SupportedLanguage>('latin');
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!formData.firstName || !formData.lastName || !formData.birthDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a new record
    const newRecord: Record = {
      id: `new-${Date.now()}`,
      ...formData as Record,
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
      gender: '',
      birthDate: '',
      village: '',
      district: '',
      householdHead: '',
      motherName: '',
    });
    setIdentifiers([{ type: 'Health ID', value: '' }]);
    
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
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'First Name' : 
               inputLanguage === 'amharic' ? 'መጠሪያ ስም' : 'ቀዳማይ ሽም'} 
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Last Name' : 
               inputLanguage === 'amharic' ? 'የአባት ስም' : 'ዳሓራይ ሽም'} 
              <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Gender' : 
               inputLanguage === 'amharic' ? 'ፆታ' : 'ጾታ'} 
              <span className="text-destructive">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
            >
              <option value="">
                {inputLanguage === 'latin' ? 'Select Gender' : 
                 inputLanguage === 'amharic' ? 'ፆታ ይምረጡ' : 'ጾታ ምረጽ'}
              </option>
              <option value="Male">
                {inputLanguage === 'latin' ? 'Male' : 
                 inputLanguage === 'amharic' ? 'ወንድ' : 'ተባዕታይ'}
              </option>
              <option value="Female">
                {inputLanguage === 'latin' ? 'Female' : 
                 inputLanguage === 'amharic' ? 'ሴት' : 'ኣንስታይ'}
              </option>
              <option value="Other">
                {inputLanguage === 'latin' ? 'Other' : 
                 inputLanguage === 'amharic' ? 'ሌላ' : 'ካልእ'}
              </option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Date of Birth' : 
               inputLanguage === 'amharic' ? 'የትውልድ ቀን' : 'ዕለተ ልደት'} 
              <span className="text-destructive">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Village/Location' : 
               inputLanguage === 'amharic' ? 'መንደር/ቦታ' : 'ዓዲ/ቦታ'}
            </label>
            <input
              type="text"
              name="village"
              value={formData.village || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'District' : 
               inputLanguage === 'amharic' ? 'ወረዳ' : 'ዞባ'}
            </label>
            <input
              type="text"
              name="district"
              value={formData.district || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Household Head' : 
               inputLanguage === 'amharic' ? 'የቤተሰብ ኃላፊ' : 'ሓላፊ ስድራ'}
            </label>
            <input
              type="text"
              name="householdHead"
              value={formData.householdHead || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {inputLanguage === 'latin' ? 'Mother\'s Name' : 
               inputLanguage === 'amharic' ? 'የእናት ስም' : 'ሽም ኣደ'}
            </label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              dir={inputLanguage === 'latin' ? 'ltr' : 'rtl'}
            />
          </div>
        </div>
        
        <div>
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
             inputLanguage === 'amharic' ? 'አስገባ እና ተመሳሳዮችን ፈልግ' : 'ኣቕርብ ከምኡ'ውን ተመሳሰልቲ ድለ'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordEntryForm;

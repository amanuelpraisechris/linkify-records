
import { useState } from 'react';
import { Record } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { UserPlus, Save, X } from 'lucide-react';

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
      <div className="flex items-center mb-4">
        <UserPlus className="w-5 h-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">New Patient Record</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Gender <span className="text-destructive">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth <span className="text-destructive">*</span>
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
            <label className="block text-sm font-medium mb-1">Village/Location</label>
            <input
              type="text"
              name="village"
              value={formData.village || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">District</label>
            <input
              type="text"
              name="district"
              value={formData.district || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Household Head</label>
            <input
              type="text"
              name="householdHead"
              value={formData.householdHead || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Mother's Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Identifiers</label>
            <button
              type="button"
              onClick={addIdentifier}
              className="text-xs text-primary hover:underline"
            >
              + Add Another
            </button>
          </div>
          
          {identifiers.map((id, index) => (
            <div key={index} className="flex space-x-2 mb-2">
              <select
                value={id.type}
                onChange={(e) => handleIdentifierChange(index, 'type', e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-primary/30 w-1/3"
              >
                <option value="">Select Type</option>
                <option value="Health ID">Health ID</option>
                <option value="National ID">National ID</option>
                <option value="Voter ID">Voter ID</option>
                <option value="Community ID">Community ID</option>
                <option value="Study ID">Study ID</option>
              </select>
              <input
                type="text"
                value={id.value}
                onChange={(e) => handleIdentifierChange(index, 'value', e.target.value)}
                className="p-2 border rounded-md focus:ring-2 focus:ring-primary/30 flex-1"
                placeholder="Enter identifier value"
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
            Submit & Find Matches
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordEntryForm;

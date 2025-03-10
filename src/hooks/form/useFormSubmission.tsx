
import { Record, Visit, ResidencyPeriod } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { buildDateString } from '@/utils/dateUtils';

interface UseFormSubmissionProps {
  formData: Partial<Record>;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Record>>>;
  setBirthYear: React.Dispatch<React.SetStateAction<string>>;
  setBirthMonth: React.Dispatch<React.SetStateAction<string>>;
  setBirthDay: React.Dispatch<React.SetStateAction<string>>;
  setIdentifiers: React.Dispatch<React.SetStateAction<Array<{ type: string; value: string }>>>;
  setClinicIds: React.Dispatch<React.SetStateAction<Array<{ type: string; value: string }>>>;
  setResidencyPeriods: React.Dispatch<React.SetStateAction<ResidencyPeriod[]>>;
  setIdentifierType: React.Dispatch<React.SetStateAction<'patient' | 'otherPerson'>>;
  setIsRepeatPatient: React.Dispatch<React.SetStateAction<boolean>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  visit: Visit;
  identifiers: Array<{ type: string; value: string }>;
  clinicIds: Array<{ type: string; value: string }>;
  residencyPeriods: ResidencyPeriod[];
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch?: (record: Record) => void;
}

export const useFormSubmission = ({
  formData,
  birthYear,
  birthMonth,
  birthDay,
  setFormData,
  setBirthYear,
  setBirthMonth,
  setBirthDay,
  setIdentifiers,
  setClinicIds,
  setResidencyPeriods,
  setIdentifierType,
  setIsRepeatPatient,
  setActiveTab,
  visit,
  identifiers,
  clinicIds,
  residencyPeriods,
  onRecordSubmit,
  onSaveForSearch
}: UseFormSubmissionProps) => {
  const { toast } = useToast();
  
  const handleNextToLinkage = () => {
    if (!formData.firstName || !formData.lastName || !birthYear) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least first name, last name, and birth year before saving for search.",
        variant: "destructive",
      });
      return;
    }
    
    const birthDateStr = buildDateString(birthYear, birthMonth, birthDay);
    console.log("Generated birth date string:", birthDateStr);
    
    const searchRecord: Record = {
      id: `search-${Date.now()}`,
      ...formData as Record,
      birthDate: birthDateStr,
      identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'Health Facility Entry'
      }
    };
    
    console.log("Saving record for search:", searchRecord);
    
    if (onSaveForSearch) {
      onSaveForSearch(searchRecord);
    }
    
    setActiveTab('linkage-with-dss');
    
    toast({
      title: "Record Saved for Search",
      description: "The record has been saved. You can now search for matches in the DSS database.",
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !birthYear) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    const birthDateStr = buildDateString(birthYear, birthMonth, birthDay);
    console.log("Generated birth date string for submission:", birthDateStr);
    
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
    
    // Reset form data
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
      balozi_first_name: '',
      balozi_middle_name: '',
      balozi_last_name: '',
      oldest_member_first_name: '',
      oldest_member_middle_name: '',
      oldest_member_last_name: '',
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
  
  return {
    handleNextToLinkage,
    handleSubmit
  };
};


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
  setHealthFacility?: React.Dispatch<React.SetStateAction<string>>;
  visit: Visit;
  identifiers: Array<{ type: string; value: string }>;
  clinicIds: Array<{ type: string; value: string }>;
  residencyPeriods: ResidencyPeriod[];
  healthFacility?: string;
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
  setHealthFacility,
  visit,
  identifiers,
  clinicIds,
  residencyPeriods,
  healthFacility,
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
    
    if (!birthDateStr) {
      console.warn("Failed to generate a valid birth date from inputs:", { birthYear, birthMonth, birthDay });
      toast({
        title: "Invalid Birth Date",
        description: "Please provide at least a birth year.",
        variant: "destructive",
      });
      return;
    }
    
    const searchRecord: Record = {
      id: `search-${Date.now()}`,
      ...formData as Record,
      birthDate: birthDateStr,
      healthFacility: healthFacility || '',
      identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'Health Facility Entry',
        facility: healthFacility
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
    console.log("Generated birth date string for submission:", birthDateStr, typeof birthDateStr);
    
    if (!birthDateStr) {
      console.warn("Failed to generate a valid birth date from inputs:", { birthYear, birthMonth, birthDay });
      toast({
        title: "Invalid Birth Date",
        description: "Please check the birth date information.",
        variant: "destructive",
      });
      return;
    }
    
    const newRecord: Record = {
      id: `new-${Date.now()}`,
      ...formData as Record,
      birthDate: birthDateStr,
      healthFacility: healthFacility || '',
      identifiers: [...clinicIds, ...identifiers].filter(id => id.type && id.value),
      visits: [{...visit}],
      residencyTimeline: [...residencyPeriods],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'Health Facility Entry',
        facility: healthFacility
      }
    };
    
    // Log the record we're submitting for debugging
    console.log("Submitting record:", newRecord);
    console.log("Birth date in record:", newRecord.birthDate, typeof newRecord.birthDate);
    
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
      healthFacility: '',
    });
    setBirthYear('');
    setBirthMonth('');
    setBirthDay('');
    setIdentifiers([{ type: 'Health ID', value: '' }]);
    setClinicIds([{ type: 'CTC ID', value: '' }]);
    setResidencyPeriods([]);
    setIdentifierType('patient');
    setIsRepeatPatient(false);
    if (setHealthFacility) {
      setHealthFacility('');
    }
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

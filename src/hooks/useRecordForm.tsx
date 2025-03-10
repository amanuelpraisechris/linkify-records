
import { useState } from 'react';
import { Record, Visit, ResidencyPeriod } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { SupportedLanguage } from '@/utils/languageUtils';

interface UseRecordFormProps {
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch?: (record: Record) => void;
}

export const useRecordForm = ({ onRecordSubmit, onSaveForSearch }: UseRecordFormProps) => {
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
    setFormData({
      ...record,
    });
    
    if (record.birthDate) {
      const parts = record.birthDate.split('-');
      if (parts.length >= 1) setBirthYear(parts[0]);
      if (parts.length >= 2) setBirthMonth(parts[1]);
      if (parts.length >= 3) setBirthDay(parts[2]);
    }
    
    if (record.identifiers && record.identifiers.length > 0) {
      setIdentifiers(record.identifiers);
    }
    
    setIsRepeatPatient(true);
    
    toast({
      title: "Repeat Patient Found",
      description: "Personal identifiers have been automatically filled in.",
    });
  };
  
  const buildDateString = (): string => {
    let birthDateStr = birthYear;
    if (birthMonth) {
      birthDateStr = `${birthDateStr}-${birthMonth}`;
      if (birthDay) {
        birthDateStr = `${birthDateStr}-${birthDay}`;
      } else {
        birthDateStr = `${birthDateStr}-01`;
      }
    } else {
      birthDateStr = `${birthDateStr}-01-01`;
    }
    return birthDateStr;
  };
  
  const handleNextToLinkage = () => {
    if (!formData.firstName || !formData.lastName || !birthYear) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least first name, last name, and birth year before saving for search.",
        variant: "destructive",
      });
      return;
    }
    
    const birthDateStr = buildDateString();
    
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
    
    const birthDateStr = buildDateString();
    
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
  
  return {
    formData,
    birthYear,
    birthMonth,
    birthDay,
    identifiers,
    clinicIds,
    visit,
    residencyPeriods,
    activeTab,
    identifierType,
    inputLanguage,
    isRepeatPatient,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    setResidencyPeriods,
    setActiveTab,
    setIdentifierType,
    setInputLanguage,
    handleChange,
    handleCheckboxChange,
    handleIdentifierChange,
    addIdentifier,
    removeIdentifier,
    handleClinicIdChange,
    addClinicId,
    removeClinicId,
    handleVisitChange,
    handleVisitSave,
    handlePatientFound,
    handleNextToLinkage,
    handleSubmit
  };
};

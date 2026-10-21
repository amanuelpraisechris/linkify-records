
import { useState } from 'react';
import { Record, ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';

export const useFormState = () => {
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
    woreda: 'Kilte Awlaelo',
    tabia: '',
    kushet: '',
    houseNumber: '',
    motherName: '',
    householdHead: '',
    visitType: '',
    oldest_member_first_name: '',
    oldest_member_middle_name: '',
    oldest_member_last_name: '',
    healthFacility: '',
  });
  
  const [birthYear, setBirthYear] = useState<string>('');
  const [birthMonth, setBirthMonth] = useState<string>('');
  const [birthDay, setBirthDay] = useState<string>('');
  
  const [identifiers, setIdentifiers] = useState<Array<{ type: string; value: string }>>([
    { type: 'HDSS individual ID', value: '' }
  ]);
  
  const [clinicIds, setClinicIds] = useState<Array<{ type: string; value: string }>>([
    { type: 'MRN / Card no.', value: '' }
  ]);
  
  const [activeTab, setActiveTab] = useState('patient-registry');
  const [identifierType, setIdentifierType] = useState<'patient' | 'otherPerson'>('patient');
  const [inputLanguage, setInputLanguage] = useState<SupportedLanguage>('tigrinya');
  const [isRepeatPatient, setIsRepeatPatient] = useState(false);
  const [healthFacility, setHealthFacility] = useState<string>('');
  
  return {
    formData,
    setFormData,
    birthYear,
    setBirthYear,
    birthMonth,
    setBirthMonth,
    birthDay,
    setBirthDay,
    identifiers,
    setIdentifiers,
    clinicIds,
    setClinicIds,
    activeTab,
    setActiveTab,
    identifierType,
    setIdentifierType,
    inputLanguage,
    setInputLanguage,
    isRepeatPatient,
    setIsRepeatPatient,
    healthFacility,
    setHealthFacility
  };
};

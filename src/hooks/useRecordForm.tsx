
import { Record, Visit, ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { useFormState } from './form/useFormState';
import { useVisitHandlers } from './form/useVisitHandlers';
import { useIdentifierHandlers } from './form/useIdentifierHandlers';
import { useClinicIdHandlers } from './form/useClinicIdHandlers';
import { useResidencyPeriods } from './form/useResidencyPeriods';
import { useFormHandlers } from './form/useFormHandlers';
import { useFormSubmission } from './form/useFormSubmission';

interface UseRecordFormProps {
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch?: (record: Record) => void;
}

export const useRecordForm = ({ onRecordSubmit, onSaveForSearch }: UseRecordFormProps) => {
  // Initialize state
  const {
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
  } = useFormState();
  
  // Visit handlers
  const {
    visit,
    handleVisitChange,
    handleVisitSave
  } = useVisitHandlers();
  
  // Residency periods
  const {
    residencyPeriods,
    setResidencyPeriods
  } = useResidencyPeriods();
  
  // Identifier handlers
  const {
    handleIdentifierChange,
    addIdentifier,
    removeIdentifier
  } = useIdentifierHandlers(identifiers, setIdentifiers);
  
  // Clinic ID handlers
  const {
    handleClinicIdChange,
    addClinicId,
    removeClinicId
  } = useClinicIdHandlers(clinicIds, setClinicIds);
  
  // Health facility handler
  const handleHealthFacilityChange = (value: string) => {
    setHealthFacility(value);
    setFormData(prev => ({
      ...prev,
      healthFacility: value
    }));
  };
  
  // Form handlers
  const {
    handleChange,
    handleCheckboxChange,
    handlePatientFound
  } = useFormHandlers({
    formData, 
    setFormData, 
    setActiveTab, 
    setIsRepeatPatient,
    setBirthYear,
    setBirthMonth,
    setBirthDay,
    birthYear,
    birthMonth,
    birthDay,
    onSaveForSearch
  });
  
  // Form submission
  const {
    handleNextToLinkage,
    handleSubmit
  } = useFormSubmission({
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
  });
  
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
    healthFacility,
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
    handleSubmit,
    handleHealthFacilityChange
  };
};

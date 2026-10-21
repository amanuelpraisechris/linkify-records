
import { Record } from '@/types';
import { useRecordForm } from '@/hooks/useRecordForm';
import FormHeader from './record-entry/FormHeader';
import PatientRegistryTab from './record-entry/PatientRegistryTab';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

interface RecordEntryFormProps {
  onRecordSubmit: (record: Record) => void;
  onSaveForSearch?: (record: Record) => void;
}

const RecordEntryForm = ({ onRecordSubmit, onSaveForSearch }: RecordEntryFormProps) => {
  const {
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
  } = useRecordForm({ onRecordSubmit, onSaveForSearch });
  
  return (
    <div className="rounded-xl p-1 bg-background">
      <FormHeader 
        isRepeatPatient={isRepeatPatient}
        inputLanguage={inputLanguage}
        onLanguageChange={(lang: SupportedLanguage) => setInputLanguage(lang)}
      />
      
      <Alert className="mb-4 border-primary/30 bg-primary/5">
        <InfoIcon className="h-4 w-4 text-primary" />
        <AlertDescription className="text-foreground">
          Personal identifiers are used only to find this person in the HDSS register.
        </AlertDescription>
      </Alert>
      
      <PatientRegistryTab 
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        birthYear={birthYear}
        setBirthYear={setBirthYear}
        birthMonth={birthMonth}
        setBirthMonth={setBirthMonth}
        birthDay={birthDay}
        setBirthDay={setBirthDay}
        identifiers={identifiers}
        handleIdentifierChange={handleIdentifierChange}
        addIdentifier={addIdentifier}
        removeIdentifier={removeIdentifier}
        clinicIds={clinicIds}
        handleClinicIdChange={handleClinicIdChange}
        addClinicId={addClinicId}
        removeClinicId={removeClinicId}
        visit={visit}
        handleVisitChange={handleVisitChange}
        handleVisitSave={handleVisitSave}
        residencyPeriods={residencyPeriods}
        setResidencyPeriods={setResidencyPeriods}
        identifierType={identifierType}
        setIdentifierType={setIdentifierType}
        inputLanguage={inputLanguage}
        handlePatientFound={handlePatientFound}
        handleNextToLinkage={handleNextToLinkage}
        showSaveForLater={!!onSaveForSearch}
        handleSubmit={handleSubmit}
        healthFacility={healthFacility}
        handleHealthFacilityChange={handleHealthFacilityChange}
      />
    </div>
  );
};

export default RecordEntryForm;

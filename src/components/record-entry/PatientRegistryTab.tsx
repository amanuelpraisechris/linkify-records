
import { Record, Visit, ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import ClinicIdEntrySection from './ClinicIdEntrySection';
import VisitDetailsSection from './VisitDetailsSection';
import IdentifierTypeSelector from './IdentifierTypeSelector';
import PersonalIdentifiersSection from './PersonalIdentifiersSection';
import ResidencyTimelineSection from './ResidencyTimelineSection';
import ResidenceDetailsSection from './ResidenceDetailsSection';
import IdentifiersSection from './IdentifiersSection';
import FormActions from './FormActions';

interface PatientRegistryTabProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  identifiers: Array<{ type: string; value: string }>;
  handleIdentifierChange: (index: number, field: 'type' | 'value', value: string) => void;
  addIdentifier: () => void;
  removeIdentifier: (index: number) => void;
  clinicIds: Array<{ type: string; value: string }>;
  handleClinicIdChange: (index: number, field: 'type' | 'value', value: string) => void;
  addClinicId: () => void;
  removeClinicId: (index: number) => void;
  visit: Visit;
  handleVisitChange: (visit: Visit) => void;
  handleVisitSave: () => void;
  residencyPeriods: ResidencyPeriod[];
  setResidencyPeriods: (periods: ResidencyPeriod[]) => void;
  identifierType: 'patient' | 'otherPerson';
  setIdentifierType: (type: 'patient' | 'otherPerson') => void;
  inputLanguage: SupportedLanguage;
  handlePatientFound: (record: Record) => void;
  handleNextToLinkage: () => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const PatientRegistryTab = ({
  formData,
  handleChange,
  handleCheckboxChange,
  birthYear,
  setBirthYear,
  birthMonth,
  setBirthMonth,
  birthDay,
  setBirthDay,
  identifiers,
  handleIdentifierChange,
  addIdentifier,
  removeIdentifier,
  clinicIds,
  handleClinicIdChange,
  addClinicId,
  removeClinicId,
  visit,
  handleVisitChange,
  handleVisitSave,
  residencyPeriods,
  setResidencyPeriods,
  identifierType,
  setIdentifierType,
  inputLanguage,
  handlePatientFound,
  handleNextToLinkage,
  handleSubmit
}: PatientRegistryTabProps) => {
  return (
    <form className="space-y-6">
      <ClinicIdEntrySection 
        clinicIds={clinicIds}
        handleClinicIdChange={handleClinicIdChange}
        addClinicId={addClinicId}
        removeClinicId={removeClinicId}
        onPatientFound={handlePatientFound}
        inputLanguage={inputLanguage}
      />
      
      <VisitDetailsSection
        visit={visit}
        onVisitChange={handleVisitChange}
        onVisitSave={handleVisitSave}
        inputLanguage={inputLanguage}
      />
      
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
      
      <ResidencyTimelineSection
        residencyPeriods={residencyPeriods}
        onResidencyPeriodsChange={setResidencyPeriods}
        inputLanguage={inputLanguage}
      />
      
      <ResidenceDetailsSection
        formData={formData}
        handleChange={handleChange}
        handleCheckboxChange={handleCheckboxChange}
        inputLanguage={inputLanguage}
      />
      
      <IdentifiersSection
        identifiers={identifiers}
        handleIdentifierChange={handleIdentifierChange}
        addIdentifier={addIdentifier}
        removeIdentifier={removeIdentifier}
        inputLanguage={inputLanguage}
      />
      
      <FormActions 
        onNextToLinkage={handleNextToLinkage}
        onSubmit={handleSubmit}
        inputLanguage={inputLanguage}
      />
    </form>
  );
};

export default PatientRegistryTab;

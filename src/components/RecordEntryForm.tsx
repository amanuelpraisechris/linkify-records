
import { Record } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRecordForm } from '@/hooks/useRecordForm';
import FormHeader from './record-entry/FormHeader';
import PatientRegistryTab from './record-entry/PatientRegistryTab';
import SearchDSSTab from './record-entry/SearchDSSTab';
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
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="patient-registry">
            {inputLanguage === 'latin' ? 'Patient Registry' : 
             inputLanguage === 'amharic' ? 'የታካሚ መዝገብ' : 'መዝገብ ሕሙም'}
          </TabsTrigger>
          <TabsTrigger value="linkage-with-dss">
            {inputLanguage === 'latin' ? 'Linkage with DSS' : 
             inputLanguage === 'amharic' ? 'ከDSS ጋር ማገናኘት' : 'ምትእስሳር ምስ DSS'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="patient-registry">
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
            handleSubmit={handleSubmit}
            healthFacility={healthFacility}
            handleHealthFacilityChange={handleHealthFacilityChange}
          />
        </TabsContent>
        
        <TabsContent value="linkage-with-dss">
          <SearchDSSTab 
            inputLanguage={inputLanguage}
            formData={formData}
            birthYear={birthYear}
            birthMonth={birthMonth}
            birthDay={birthDay}
            identifiers={identifiers}
            clinicIds={clinicIds}
            onSaveForSearch={onSaveForSearch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RecordEntryForm;

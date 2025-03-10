
import React from 'react';
import { SupportedLanguage } from '@/utils/languageUtils';
import NameInputGroup from './NameInputGroup';
import ResidenceDetailsHeader from './ResidenceDetailsHeader';

interface BaloziBioSectionProps {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

const BaloziBioSection = ({ 
  formData, 
  handleChange, 
  inputLanguage 
}: BaloziBioSectionProps) => {
  return (
    <div className="mt-4">
      <ResidenceDetailsHeader 
        title="Balozi Information" 
        inputLanguage={inputLanguage} 
      />
      <NameInputGroup 
        prefix="balozi"
        formData={formData}
        handleChange={handleChange}
        inputLanguage={inputLanguage}
      />
    </div>
  );
};

export default BaloziBioSection;

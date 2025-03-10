
import React from 'react';
import { SupportedLanguage } from '@/utils/languageUtils';
import NameInputGroup from './NameInputGroup';
import ResidenceDetailsHeader from './ResidenceDetailsHeader';

interface OldestMemberSectionProps {
  formData: Record<string, any>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

const OldestMemberSection = ({ 
  formData, 
  handleChange, 
  inputLanguage 
}: OldestMemberSectionProps) => {
  return (
    <div className="mt-4">
      <ResidenceDetailsHeader 
        title={inputLanguage === 'latin' ? 'Oldest Household Member' : 
               inputLanguage === 'amharic' ? 'የቤት ውስጥ ታላቅ አባል' : 
               'ዓብዪ ኣባል ቤተሰብ'}
        inputLanguage={inputLanguage} 
      />
      <NameInputGroup 
        prefix="oldest_member"
        formData={formData}
        handleChange={handleChange}
        inputLanguage={inputLanguage}
      />
    </div>
  );
};

export default OldestMemberSection;

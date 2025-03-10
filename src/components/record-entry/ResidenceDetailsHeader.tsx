
import React from 'react';
import { SupportedLanguage } from '@/utils/languageUtils';

interface ResidenceDetailsHeaderProps {
  title: string;
  inputLanguage: SupportedLanguage;
}

const ResidenceDetailsHeader = ({ title, inputLanguage }: ResidenceDetailsHeaderProps) => {
  return (
    <h4 className="text-md font-medium mb-3 text-primary">
      {inputLanguage === 'latin' ? title : 
       inputLanguage === 'amharic' ? (title === 'Residence Details' ? 'የመኖሪያ ዝርዝሮች' : 
                                      title === 'Balozi Information' ? 'የባሎዚ መረጃ' : 
                                      'የቤተሰብ ታላቅ አባል') : 
       (title === 'Residence Details' ? 'ዝርዝር ናይ መንበሪ' : 
        title === 'Balozi Information' ? 'ሓበሬታ ባሎዚ' : 
        'ዓበይ ኣባል ስድራ')}
    </h4>
  );
};

export default ResidenceDetailsHeader;

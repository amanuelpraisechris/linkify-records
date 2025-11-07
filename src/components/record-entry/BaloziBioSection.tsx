
import React from 'react';
import { SupportedLanguage } from '@/utils/languageUtils';
import NameInputGroup from './NameInputGroup';
import ResidenceDetailsHeader from './ResidenceDetailsHeader';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, XCircleIcon } from 'lucide-react';

interface BaloziBioSectionProps {
  formData: Record<string, unknown>;
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
      
      <Alert className="mb-4 bg-muted/40 border-amber-300">
        <XCircleIcon className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-700 font-medium">
          Balozi information is collected for administrative purposes only and is excluded from record matching and search results.
        </AlertDescription>
      </Alert>
      
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

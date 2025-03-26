
import { AlertCircle, Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { SupportedLanguage } from '@/utils/languageUtils';

interface ConsentSectionProps {
  inputLanguage: SupportedLanguage;
  consentGiven: boolean;
  setConsentGiven: (value: boolean) => void;
}

const ConsentSection = ({
  inputLanguage,
  consentGiven,
  setConsentGiven
}: ConsentSectionProps) => {
  const [showConsentAlert, setShowConsentAlert] = useState(false);
  
  const handleConsentChange = (checked: boolean) => {
    setConsentGiven(checked);
    setShowConsentAlert(false);
  };
  
  return (
    <div className="bg-muted/20 p-4 rounded-md border my-4">
      <h4 className="font-medium mb-2">
        {inputLanguage === 'latin' ? 'Patient Consent Information' : 
         inputLanguage === 'amharic' ? 'የታካሚ ፈቃድ መረጃ' : 'ሓበሬታ ፍቓድ ሕሙም'}
      </h4>
      
      <p className="text-sm mb-3 text-muted-foreground">
        {inputLanguage === 'latin' ? 
          'Consent must be obtained before linking patient data with the HDSS database.' : 
         inputLanguage === 'amharic' ? 
          'የታካሚ ዳታን ከHDSS ዳታቤዝ ጋር ከማገናኘት በፊት ፈቃድ መገኘት አለበት።' : 
          'ቅድሚ ምትእስሳር ሓበሬታ ሕሙም ምስ ዋህዮ ሓበሬታ HDSS ፍቓድ ክርከብ ኣለዎ።'}
      </p>
      
      {showConsentAlert && (
        <Alert variant="destructive" className="mb-3">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Consent Required</AlertTitle>
          <AlertDescription>
            Patient consent is required before proceeding with data linkage.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="patient-consent" 
          checked={consentGiven}
          onCheckedChange={(checked) => handleConsentChange(checked as boolean)}
        />
        <label
          htmlFor="patient-consent"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          {inputLanguage === 'latin' ? 
            'I confirm that patient consent has been obtained for data linkage' : 
           inputLanguage === 'amharic' ? 
            'ለዳታ ማገናኘት የታካሚ ፈቃድ መገኘቱን አረጋግጣለሁ' : 
            'ንምትእስሳር ሓበሬታ ፍቓድ ሕሙም ተረኺቡ ምህላዉ የረጋግጽ እየ'}
        </label>
      </div>
      
      {consentGiven && (
        <div className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
          <Check className="w-4 h-4 mr-1" />
          {inputLanguage === 'latin' ? 
            'Consent confirmed' : 
           inputLanguage === 'amharic' ? 
            'ፈቃድ ተረጋግጧል' : 
            'ፍቓድ ተረጋጊጹ'}
        </div>
      )}
    </div>
  );
};

export default ConsentSection;

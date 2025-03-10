
import { ArrowRightCircle, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SupportedLanguage } from '@/utils/languageUtils';

interface FormActionsProps {
  onNextToLinkage: () => void;
  onSubmit: (e: React.FormEvent) => void;
  inputLanguage: SupportedLanguage;
}

const FormActions = ({ onNextToLinkage, onSubmit, inputLanguage }: FormActionsProps) => {
  return (
    <div className="flex justify-end pt-4 space-x-3">
      <Button
        type="button"
        variant="outline"
        onClick={onNextToLinkage}
        className="inline-flex items-center"
      >
        {inputLanguage === 'latin' ? 'Save for Search' : 
         inputLanguage === 'amharic' ? 'ለፍለጋ ያስቀምጡ' : 'ንምድላይ ኣቐምጥ'}
        <ArrowRightCircle className="w-4 h-4 ml-2" />
      </Button>
      
      <Button
        type="button"
        onClick={onSubmit}
        className="inline-flex items-center bg-primary text-primary-foreground"
      >
        <Save className="w-4 h-4 mr-2" />
        {inputLanguage === 'latin' ? 'Submit & Find Matches' : 
         inputLanguage === 'amharic' ? 'አስገባ እና ተመሳሳዮችን ፈልግ' : 'ኣቕርብ ከምኡውን ተመሳሰልቲ ድለ'}
      </Button>
    </div>
  );
};

export default FormActions;

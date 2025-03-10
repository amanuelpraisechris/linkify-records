
import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import ResidenceDetailsHeader from './ResidenceDetailsHeader';
import VillageInfoSection from './VillageInfoSection';
import YearMovedInSection from './YearMovedInSection';
import BaloziBioSection from './BaloziBioSection';
import OldestMemberSection from './OldestMemberSection';

interface ResidenceDetailsSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  inputLanguage: SupportedLanguage;
}

const ResidenceDetailsSection = ({
  formData,
  handleChange,
  handleCheckboxChange,
  inputLanguage
}: ResidenceDetailsSectionProps) => {
  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <ResidenceDetailsHeader title="Residence Details" inputLanguage={inputLanguage} />
      
      <div className="grid grid-cols-6 gap-3 mb-4">
        <div className="col-span-4">
          <VillageInfoSection 
            formData={formData}
            handleChange={handleChange}
            inputLanguage={inputLanguage}
          />
        </div>
        
        <div className="col-span-2">
          <YearMovedInSection 
            formData={formData}
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            inputLanguage={inputLanguage}
          />
        </div>
      </div>
      
      <BaloziBioSection 
        formData={formData}
        handleChange={handleChange}
        inputLanguage={inputLanguage}
      />
      
      <OldestMemberSection 
        formData={formData}
        handleChange={handleChange}
        inputLanguage={inputLanguage}
      />
    </div>
  );
};

export default ResidenceDetailsSection;

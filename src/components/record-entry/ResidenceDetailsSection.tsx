import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { t } from '@/utils/tigrayLabels';
import VillageInfoSection from './VillageInfoSection';
import YearMovedInSection from './YearMovedInSection';
import OldestMemberSection from './OldestMemberSection';

interface ResidenceDetailsSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  inputLanguage: SupportedLanguage;
}

const ResidenceDetailsSection = ({ formData, handleChange, handleCheckboxChange, inputLanguage }: ResidenceDetailsSectionProps) => (
  <div className="space-y-5">
    <VillageInfoSection formData={formData} handleChange={handleChange} inputLanguage={inputLanguage} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="householdHead">{t('householdHead', inputLanguage)}</label>
        <Input id="householdHead" name="householdHead" value={formData.householdHead || ''} onChange={handleChange} className="h-11" />
      </div>
      <YearMovedInSection formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} inputLanguage={inputLanguage} />
    </div>
    <OldestMemberSection formData={formData} handleChange={handleChange} inputLanguage={inputLanguage} />
  </div>
);

export default ResidenceDetailsSection;

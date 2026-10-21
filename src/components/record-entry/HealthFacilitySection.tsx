import { SupportedLanguage } from '@/utils/languageUtils';
import { t } from '@/utils/tigrayLabels';
import { useLocations } from '@/hooks/useLocations';
import { locationsService } from '@/services/locationsService';
import { useToast } from '@/hooks/use-toast';
import SearchablePicker from './SearchablePicker';

interface HealthFacilitySectionProps {
  healthFacility: string;
  handleHealthFacilityChange: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const HealthFacilitySection = ({ healthFacility, handleHealthFacilityChange, inputLanguage: l }: HealthFacilitySectionProps) => {
  const { facilities, isAdmin, refresh } = useLocations();
  const { toast } = useToast();

  const addNew = async (name: string) => {
    try {
      await locationsService.addFacility({ name, woreda: 'Kilte Awlaelo' }, isAdmin);
      refresh();
      handleHealthFacilityChange(name);
      if (!isAdmin) toast({ title: 'Facility added', description: 'Saved for this record; an admin will approve it for the list.' });
    } catch (e: any) {
      toast({ title: 'Could not add facility', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{t('facility', l)}</label>
      <SearchablePicker
        ariaLabel={t('facility', l)}
        value={healthFacility}
        onChange={handleHealthFacilityChange}
        onAddNew={addNew}
        options={facilities.map(f => ({ value: f.name, label: l === 'latin' || !f.name_ti ? f.name : f.name_ti, hint: f.facility_type, pending: f.status === 'pending' }))}
        placeholder={t('select', l)} searchPlaceholder={t('search', l)} addLabel={t('addNew', l)} pendingLabel={t('pending', l)}
      />
    </div>
  );
};

export default HealthFacilitySection;

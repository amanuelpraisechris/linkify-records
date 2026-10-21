import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SupportedLanguage } from '@/utils/languageUtils';
import { t, MCH_VISIT_TYPES } from '@/utils/tigrayLabels';

interface Props {
  formData: { [key: string]: any };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

/** MCH/ANC visit context: visit type, LMP for ANC, and mother's ID for child visits. */
const MchVisitFields = ({ formData, handleChange, inputLanguage: l }: Props) => {
  const set = (name: string, value: string) => handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);
  const isAnc = (formData.visitType || '').startsWith('ANC');
  const isChild = ['Child immunization', 'Growth monitoring'].includes(formData.visitType);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">{t('visitType', l)}</label>
        <Select value={formData.visitType || ''} onValueChange={v => set('visitType', v)}>
          <SelectTrigger aria-label={t('visitType', l)} className="h-11"><SelectValue placeholder={t('select', l)} /></SelectTrigger>
          <SelectContent>{MCH_VISIT_TYPES.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent>
        </Select>
      </div>
      {isAnc && (
        <div>
          <label htmlFor="lmp" className="block text-sm font-medium mb-1.5">{t('lmp', l)}</label>
          <Input id="lmp" type="date" name="lmp" value={formData.lmp || ''} onChange={handleChange} className="h-11" />
        </div>
      )}
      {isChild && (
        <div>
          <label htmlFor="motherRecordId" className="block text-sm font-medium mb-1.5">{t('motherRecordId', l)}</label>
          <Input id="motherRecordId" name="motherRecordId" value={formData.motherRecordId || ''} onChange={handleChange} className="h-11" />
        </div>
      )}
    </div>
  );
};

export default MchVisitFields;

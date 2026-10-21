import React from 'react';
import { Input } from '@/components/ui/input';
import { SupportedLanguage } from '@/utils/languageUtils';
import { t } from '@/utils/tigrayLabels';
import { useLocations } from '@/hooks/useLocations';
import { locationsService, AdminArea } from '@/services/locationsService';
import { useToast } from '@/hooks/use-toast';
import SearchablePicker from './SearchablePicker';

interface VillageInfoSectionProps {
  formData: { [key: string]: any };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

/** Woreda → Tabia → Kushet pickers. Tabia/Kushet also fill village/subVillage so matching keeps working. */
const VillageInfoSection = ({ formData, handleChange, inputLanguage: l }: VillageInfoSectionProps) => {
  const { areas, isAdmin, refresh } = useLocations();
  const { toast } = useToast();
  const set = (name: string, value: string) =>
    handleChange({ target: { name, value } } as React.ChangeEvent<HTMLInputElement>);

  const label = (a: AdminArea) => (l !== 'latin' && a.name_ti ? a.name_ti : a.name_en);
  const woredas = areas.filter(a => a.level === 'woreda');
  const woreda = woredas.find(w => w.name_en === (formData.woreda || 'Kilte Awlaelo'));
  const tabias = areas.filter(a => a.level === 'tabia' && (!woreda || a.parent_id === woreda.id));
  const tabia = tabias.find(a => a.name_en === (formData.tabia || formData.village));
  const kushets = areas.filter(a => a.level === 'kushet' && tabia && a.parent_id === tabia.id);

  const add = (level: 'woreda' | 'tabia' | 'kushet', parent: AdminArea | undefined, after: (n: string) => void) => async (name: string) => {
    try {
      await locationsService.addArea({ level, parent_id: parent?.id ?? null, name_en: name }, isAdmin);
      refresh();
      after(name);
      if (!isAdmin) toast({ title: 'Name added', description: 'Saved for this record; an admin will approve it for the list.' });
    } catch (e: any) {
      toast({ title: 'Could not add name', description: e.message, variant: 'destructive' });
    }
  };
  const pick = (opts: AdminArea[]) => opts.map(a => ({ value: a.name_en, label: label(a), pending: a.status === 'pending' }));
  const common = { placeholder: t('select', l), searchPlaceholder: t('search', l), addLabel: t('addNew', l), pendingLabel: t('pending', l) };
  const setTabia = (v: string) => { set('tabia', v); set('village', v); set('kushet', ''); set('subVillage', ''); };
  const setKushet = (v: string) => { set('kushet', v); set('subVillage', v); };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-1.5">{t('woreda', l)}</label>
        <SearchablePicker ariaLabel={t('woreda', l)} value={formData.woreda || 'Kilte Awlaelo'} options={pick(woredas)}
          onChange={v => set('woreda', v)} onAddNew={add('woreda', undefined, v => set('woreda', v))} {...common} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">{t('tabia', l)}</label>
        <SearchablePicker ariaLabel={t('tabia', l)} value={formData.tabia || formData.village} options={pick(tabias)}
          onChange={setTabia} onAddNew={add('tabia', woreda, setTabia)} {...common} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5">{t('kushet', l)}</label>
        <SearchablePicker ariaLabel={t('kushet', l)} value={formData.kushet || formData.subVillage} options={pick(kushets)}
          disabled={!tabia && !formData.tabia} onChange={setKushet} onAddNew={add('kushet', tabia, setKushet)} {...common} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1.5" htmlFor="houseNumber">{t('houseNumber', l)}</label>
        <Input id="houseNumber" name="houseNumber" value={formData.houseNumber || ''} onChange={handleChange} className="h-11" />
      </div>
    </div>
  );
};

export default VillageInfoSection;

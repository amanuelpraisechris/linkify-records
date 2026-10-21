import { useMemo } from 'react';
import { ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Trash2, Calendar } from 'lucide-react';
import { useLocations } from '@/hooks/useLocations';
import SearchablePicker from './SearchablePicker';
import { toGregorian } from '@/utils/ethiopianCalendar';

interface Props {
  residencyPeriods: ResidencyPeriod[];
  onResidencyPeriodsChange: (periods: ResidencyPeriod[]) => void;
  inputLanguage: SupportedLanguage;
}

type L = SupportedLanguage;
const t = (lang: L, en: string, am: string, ti: string) => (lang === 'latin' ? en : lang === 'amharic' ? am : ti);

const REASONS = [
  { v: 'birth', en: 'Born here', ti: 'ኣብዚ ዝተወለደት' },
  { v: 'marriage', en: 'Marriage', ti: 'መርዓ' },
  { v: 'maternal_home', en: 'Returned to maternal home (pregnancy/delivery)', ti: 'ናብ ገዛ ስድራ (ጥንሲ/ሕርሲ)' },
  { v: 'work', en: 'Work / seasonal', ti: 'ስራሕ' },
  { v: 'education', en: 'Education', ti: 'ትምህርቲ' },
  { v: 'displacement', en: 'Displacement', ti: 'ምፍንቓል' },
  { v: 'other', en: 'Other', ti: 'ካልእ' },
];

const ResidencyTimelineSection = ({ residencyPeriods, onResidencyPeriodsChange, inputLanguage: lang }: Props) => {
  const { areas } = useLocations();
  const tabias = useMemo(() => areas.filter(a => a.level === 'tabia'), [areas]);
  const now = new Date().getFullYear();
  const gcYears = Array.from({ length: now - 1949 }, (_, i) => String(now - i));
  const ecYears = Array.from({ length: now - 1957 }, (_, i) => String(now - 8 - i));

  const update = (i: number, patch: Partial<ResidencyPeriod>) =>
    onResidencyPeriodsChange(residencyPeriods.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  const add = () => onResidencyPeriodsChange([...residencyPeriods, {
    woreda: 'Kilte Awlaelo', village: '', subVillage: '', tabia: '', kushet: '', startYear: '',
    current: residencyPeriods.length === 0, insideHdss: true, calendar: 'EC',
  }]);

  // Store Gregorian year; E.C. year Y begins Sept of Y+7.
  const toGc = (y: string, cal?: string) => (cal === 'EC' && y ? String(toGregorian(Number(y), 1, 1).year) : y);

  const yearSelect = (p: ResidencyPeriod, i: number, field: 'startYear' | 'endYear', label: string) => {
    const display = p.calendar === 'EC' ? (p as any)[`${field}Ec`] : p[field];
    return (
      <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <Select value={display || ''} onValueChange={v => update(i, { [field]: toGc(v, p.calendar), [`${field}Ec`]: p.calendar === 'EC' ? v : undefined } as any)}>
          <SelectTrigger className="h-11"><SelectValue placeholder={t(lang, 'Year', 'ዓመት', 'ዓመት')} /></SelectTrigger>
          <SelectContent>{(p.calendar === 'EC' ? ecYears : gcYears).map(y => <SelectItem key={y} value={y}>{y}</SelectItem>)}</SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="bg-muted/20 p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-1 gap-2">
        <h4 className="font-medium text-primary flex items-center">
          <Calendar className="w-4 h-4 mr-2" />{t(lang, 'Residency history', 'የመኖሪያ ታሪክ', 'ታሪኽ መንበሪ')}
        </h4>
        <Button type="button" variant="outline" size="sm" onClick={add} className="text-xs">
          <PlusCircle className="w-3 h-3 mr-1" />{t(lang, 'Add place', 'ቦታ ጨምር', 'ቦታ ወስኽ')}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {t(lang, 'Add every tabia/kushet she has lived in, newest first. Include her parents’ home if she came back for ANC or delivery.',
          'የኖረችባቸውን ጣብያዎች ሁሉ ይጨምሩ።', 'ዝነበረትሉ ጣብያታት ኩሎም ወስኽ፣ ሓድሽ ቅድሚ።')}
      </p>

      {residencyPeriods.length === 0 ? (
        <div className="text-center py-6 text-sm text-muted-foreground border border-dashed rounded-md">
          {t(lang, 'No places added yet.', 'ገና ቦታ አልተጨመረም።', 'ገና ቦታ ኣይተወሰኸን።')}
        </div>
      ) : residencyPeriods.map((p, i) => {
        const tabia = tabias.find(a => a.name_en === (p.tabia || p.village));
        const kushets = tabia ? areas.filter(a => a.level === 'kushet' && a.parent_id === tabia.id) : [];
        const inside = p.insideHdss !== false;
        return (
          <div key={i} className="border rounded-md p-3 mb-3 bg-card space-y-3">
            <div className="flex justify-between items-center">
              <h5 className="font-medium text-sm">{t(lang, `Place ${i + 1}`, `ቦታ ${i + 1}`, `ቦታ ${i + 1}`)}</h5>
              <Button type="button" variant="ghost" size="sm" onClick={() => onResidencyPeriodsChange(residencyPeriods.filter((_, x) => x !== i))}
                className="h-7 text-destructive hover:bg-destructive/10" aria-label="Remove place"><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <label className="flex items-center gap-2"><Switch checked={inside} onCheckedChange={v => update(i, { insideHdss: v })} />
                {t(lang, 'Inside HDSS area', 'በHDSS ክልል ውስጥ', 'ኣብ ውሽጢ HDSS')}</label>
              <label className="flex items-center gap-2"><Switch checked={!!p.current} onCheckedChange={v => update(i, { current: v, endYear: v ? '' : p.endYear })} />
                {t(lang, 'Lives here now', 'አሁን እዚህ ትኖራለች', 'ሕጂ ኣብዚ ትነብር')}</label>
              <label className="flex items-center gap-2"><Switch checked={p.calendar === 'EC'} onCheckedChange={v => update(i, { calendar: v ? 'EC' : 'GC', startYear: '', endYear: '' })} />
                {t(lang, 'Years in E.C.', 'ዓመት በዓ.ም.', 'ዓመት ብዓ.ም.')}</label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {inside ? (<>
                <div>
                  <label className="block text-sm font-medium mb-1">{t(lang, 'Tabia', 'ቀበሌ', 'ጣብያ')}</label>
                  <SearchablePicker value={p.tabia || p.village} ariaLabel="Tabia"
                    options={tabias.map(a => ({ value: a.name_en, label: a.name_ti ? `${a.name_en} · ${a.name_ti}` : a.name_en, pending: a.status === 'pending' }))}
                    onChange={v => update(i, { tabia: v, village: v, kushet: '', subVillage: '' })}
                    onAddNew={v => update(i, { tabia: v, village: v, kushet: '', subVillage: '' })}
                    placeholder={t(lang, 'Select tabia', 'ቀበሌ ይምረጡ', 'ጣብያ ምረጽ')} searchPlaceholder="Search…" addLabel="Use" pendingLabel="pending" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t(lang, 'Kushet / Got', 'ጎጥ', 'ቁሸት / ጎጥ')}</label>
                  <SearchablePicker value={p.kushet || p.subVillage} ariaLabel="Kushet" disabled={!(p.tabia || p.village)}
                    options={kushets.map(a => ({ value: a.name_en, label: a.name_en }))}
                    onChange={v => update(i, { kushet: v, subVillage: v })}
                    onAddNew={v => update(i, { kushet: v, subVillage: v })}
                    placeholder={t(lang, 'Select kushet', 'ጎጥ ይምረጡ', 'ቁሸት ምረጽ')} searchPlaceholder="Search…" addLabel="Use" pendingLabel="pending" />
                </div>
              </>) : (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">{t(lang, 'Place outside HDSS (woreda / town / region)', 'ቦታ', 'ቦታ ካብ HDSS ወጻኢ')}</label>
                  <Input className="h-11" value={p.outsidePlace || ''} placeholder="e.g. Mekelle, Adigrat, Addis Ababa"
                    onChange={e => update(i, { outsidePlace: e.target.value, village: e.target.value })} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium mb-1">{t(lang, 'House no.', 'የቤት ቁ.', 'ቁ. ገዛ')}</label>
                <Input className="h-11" value={p.houseNumber || ''} onChange={e => update(i, { houseNumber: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {yearSelect(p, i, 'startYear', t(lang, 'Year moved in', 'የገባችበት ዓመት', 'ዝኣተወትሉ ዓመት'))}
              {!p.current && yearSelect(p, i, 'endYear', t(lang, 'Year moved out', 'የወጣችበት ዓመት', 'ዝወጸትሉ ዓመት'))}
              <div>
                <label className="block text-sm font-medium mb-1">{t(lang, 'Reason for move', 'የመዛወር ምክንያት', 'ምኽንያት ምግዓዝ')}</label>
                <Select value={p.moveReason || ''} onValueChange={v => update(i, { moveReason: v })}>
                  <SelectTrigger className="h-11"><SelectValue placeholder={t(lang, 'Optional', 'አማራጭ', 'ኣማራጺ')} /></SelectTrigger>
                  <SelectContent>{REASONS.map(r => <SelectItem key={r.v} value={r.v}>{lang === 'latin' ? r.en : r.ti}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">{t(lang, 'Household head (ሓላፊ ስድራ)', 'የቤተሰብ ኃላፊ', 'ሓላፊ ስድራ')}</label>
                <Input className="h-11" value={p.householdHead || ''} placeholder={t(lang, 'Full name', 'ሙሉ ስም', 'ምሉእ ሽም')}
                  onChange={e => update(i, { householdHead: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t(lang, 'Got / development group leader', 'የልማት ቡድን መሪ', 'ሓላፊ ጎጥ / ጉጅለ ልምዓት')}</label>
                <Input className="h-11" value={p.gotLeader || ''} placeholder={t(lang, 'Optional', 'አማራጭ', 'ኣማራጺ')}
                  onChange={e => update(i, { gotLeader: e.target.value })} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ResidencyTimelineSection;

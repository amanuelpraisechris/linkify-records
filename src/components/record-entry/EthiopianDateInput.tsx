import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ETHIOPIAN_MONTHS, ethiopianToGregorian, ethiopianYearToGregorian, isValidEthiopian } from '@/utils/ethiopianCalendar';

interface Props {
  onGregorian: (year: string, month: string, day: string) => void;
  showTigrinya: boolean;
}

/** Enter a date in the Ethiopian calendar; the Gregorian date is computed and stored. */
const EthiopianDateInput = ({ onGregorian, showTigrinya }: Props) => {
  const [y, setY] = useState('');
  const [m, setM] = useState('');
  const [d, setD] = useState('');
  const [preview, setPreview] = useState('');

  const update = (ny: string, nm: string, nd: string) => {
    setY(ny); setM(nm); setD(nd);
    const year = parseInt(ny), month = parseInt(nm), day = parseInt(nd);
    if (!year || ny.length !== 4) { setPreview(''); return; }
    if (month && day && isValidEthiopian({ year, month, day })) {
      const g = ethiopianToGregorian({ year, month, day });
      onGregorian(String(g.year), String(g.month).padStart(2, '0'), String(g.day).padStart(2, '0'));
      setPreview(`${g.day}/${g.month}/${g.year} G.C.`);
    } else {
      const gy = ethiopianYearToGregorian(year);
      onGregorian(String(gy), '', '');
      setPreview(`≈ ${gy} G.C.`);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2">
        <Input aria-label="E.C. year" placeholder="YYYY" inputMode="numeric" value={y} onChange={e => update(e.target.value, m, d)} className="h-11" />
        <Select value={m} onValueChange={v => update(y, v, d)}>
          <SelectTrigger aria-label="E.C. month" className="h-11"><SelectValue placeholder="Month" /></SelectTrigger>
          <SelectContent>
            {ETHIOPIAN_MONTHS.map((mo, i) => (
              <SelectItem key={mo.en} value={String(i + 1)}>{showTigrinya ? mo.ti : mo.en}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input aria-label="E.C. day" placeholder="DD" inputMode="numeric" value={d} onChange={e => update(y, m, e.target.value)} className="h-11" />
      </div>
      {preview && <p className="text-xs text-muted-foreground">Saved as {preview}</p>}
    </div>
  );
};

export default EthiopianDateInput;

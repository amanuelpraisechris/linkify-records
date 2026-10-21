import { useState } from 'react';
import { Record } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { gregorianToEthiopian, formatEthiopian } from '@/utils/ethiopianCalendar';
import NameFields from './NameFields';
import SexSelector from './SexSelector';
import DateOfBirthSelector from './DateOfBirthSelector';
import TelephoneField from './TelephoneField';
import EthiopianDateInput from './EthiopianDateInput';

interface PersonalIdentifiersSectionProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const PersonalIdentifiersSection = ({
  formData, handleChange, birthYear, setBirthYear, birthMonth, setBirthMonth, birthDay, setBirthDay, inputLanguage,
}: PersonalIdentifiersSectionProps) => {
  const [calendar, setCalendar] = useState<'ec' | 'gc'>('ec');
  const handleSexChange = (value: string) =>
    handleChange({ target: { name: 'sex', value } } as React.ChangeEvent<HTMLSelectElement>);

  const ecEquivalent = birthYear && birthMonth && birthDay
    ? formatEthiopian(gregorianToEthiopian({ year: +birthYear, month: +birthMonth, day: +birthDay }), inputLanguage === 'latin' ? 'en' : 'ti')
    : '';

  return (
    <div className="space-y-5">
      <NameFields formData={formData} handleChange={handleChange} inputLanguage={inputLanguage} />
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4">
        <SexSelector value={formData.sex} onChange={handleSexChange} inputLanguage={inputLanguage} />
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">Date of birth <span className="text-destructive">*</span></span>
            <ToggleGroup type="single" size="sm" value={calendar} onValueChange={v => v && setCalendar(v as 'ec' | 'gc')}>
              <ToggleGroupItem value="ec" aria-label="Ethiopian calendar">E.C.</ToggleGroupItem>
              <ToggleGroupItem value="gc" aria-label="Gregorian calendar">G.C.</ToggleGroupItem>
            </ToggleGroup>
          </div>
          {calendar === 'ec' ? (
            <EthiopianDateInput showTigrinya={inputLanguage !== 'latin'}
              onGregorian={(y, m, d) => { setBirthYear(y); setBirthMonth(m); setBirthDay(d); }} />
          ) : (
            <>
              <DateOfBirthSelector birthYear={birthYear} setBirthYear={setBirthYear} birthMonth={birthMonth}
                setBirthMonth={setBirthMonth} birthDay={birthDay} setBirthDay={setBirthDay} inputLanguage={inputLanguage} />
              {ecEquivalent && <p className="text-xs text-muted-foreground mt-1">= {ecEquivalent}</p>}
            </>
          )}
        </div>
      </div>
      <TelephoneField value={formData.telephone} onChange={handleChange} inputLanguage={inputLanguage} />
    </div>
  );
};

export default PersonalIdentifiersSection;

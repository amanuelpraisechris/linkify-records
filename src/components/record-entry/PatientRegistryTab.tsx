import { useState } from 'react';
import { Record, Visit, ResidencyPeriod } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Check, Search } from 'lucide-react';
import { HDSS_ID_TYPES } from '@/utils/tigrayLabels';
import ClinicIdEntrySection from './ClinicIdEntrySection';
import HealthFacilitySection from './HealthFacilitySection';
import VisitDetailsSection from './VisitDetailsSection';
import PersonalIdentifiersSection from './PersonalIdentifiersSection';
import ResidencyTimelineSection from './ResidencyTimelineSection';
import ResidenceDetailsSection from './ResidenceDetailsSection';
import MchVisitFields from './MchVisitFields';
import EntrySummaryPanel from './EntrySummaryPanel';

interface PatientRegistryTabProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  birthYear: string;
  setBirthYear: (value: string) => void;
  birthMonth: string;
  setBirthMonth: (value: string) => void;
  birthDay: string;
  setBirthDay: (value: string) => void;
  identifiers: Array<{ type: string; value: string }>;
  handleIdentifierChange: (index: number, field: 'type' | 'value', value: string) => void;
  addIdentifier: () => void;
  removeIdentifier: (index: number) => void;
  clinicIds: Array<{ type: string; value: string }>;
  handleClinicIdChange: (index: number, field: 'type' | 'value', value: string) => void;
  addClinicId: () => void;
  removeClinicId: (index: number) => void;
  visit: Visit;
  handleVisitChange: (visit: Visit) => void;
  handleVisitSave: () => void;
  residencyPeriods: ResidencyPeriod[];
  setResidencyPeriods: (periods: ResidencyPeriod[]) => void;
  identifierType: 'patient' | 'otherPerson';
  setIdentifierType: (type: 'patient' | 'otherPerson') => void;
  inputLanguage: SupportedLanguage;
  handlePatientFound: (record: Record) => void;
  handleNextToLinkage: () => void;
  showSaveForLater?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  healthFacility: string;
  handleHealthFacilityChange: (value: string) => void;
}

const STEPS = [
  { id: 'identify', title: 'Identify', hint: 'Facility and card numbers' },
  { id: 'person', title: 'Person', hint: 'Names, sex, birth date' },
  { id: 'residence', title: 'Residence', hint: 'Woreda, tabia, kushet' },
  { id: 'visit', title: 'Visit', hint: 'MCH / ANC visit' },
] as const;

const PatientRegistryTab = (p: PatientRegistryTabProps) => {
  const [step, setStep] = useState(0);
  const last = step === STEPS.length - 1;
  const personMissing = step === 1 && (!p.formData.firstName || !p.formData.middleName || !p.birthYear);

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const el = e.target as HTMLElement;
    if (e.key !== 'Enter' || el.tagName !== 'INPUT') return;
    e.preventDefault();
    const inputs = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('input:not([disabled]), button[role="combobox"]'));
    const i = inputs.indexOf(el);
    if (i >= 0 && i < inputs.length - 1) inputs[i + 1].focus();
    else if (!last && !personMissing) next();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
      <form className="space-y-6" onKeyDown={onKeyDown} onSubmit={e => e.preventDefault()}>
        <div className="sm:hidden space-y-2">
          <p className="text-sm font-medium"><span className="text-muted-foreground">Step {step + 1} of {STEPS.length} · </span>{STEPS[step].title}</p>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>
        <ol className="hidden sm:grid grid-cols-4 gap-2" aria-label="Entry steps">
          {STEPS.map((s, i) => (
            <li key={s.id}>
              <button type="button" onClick={() => setStep(i)} aria-current={i === step ? 'step' : undefined}
                className={cn('w-full text-left rounded-lg border p-3 transition-colors',
                  i === step ? 'border-primary bg-primary/5' : i < step ? 'border-primary/30' : 'border-border hover:bg-muted/50')}>
                <span className={cn('flex items-center gap-2 text-sm font-semibold', i <= step ? 'text-primary' : 'text-muted-foreground')}>
                  <span className={cn('flex h-6 w-6 items-center justify-center rounded-full text-xs',
                    i < step ? 'bg-primary text-primary-foreground' : i === step ? 'border-2 border-primary' : 'border')}>
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  {s.title}
                </span>
                <span className="hidden md:block text-xs text-muted-foreground mt-1">{s.hint}</span>
              </button>
            </li>
          ))}
        </ol>

        <section className="rounded-xl border bg-card p-4 sm:p-5 space-y-5 shadow-soft">
          {step === 0 && (
            <>
              <HealthFacilitySection healthFacility={p.healthFacility} handleHealthFacilityChange={p.handleHealthFacilityChange} inputLanguage={p.inputLanguage} />
              <ClinicIdEntrySection clinicIds={p.clinicIds} handleClinicIdChange={p.handleClinicIdChange} addClinicId={p.addClinicId}
                removeClinicId={p.removeClinicId} onPatientFound={p.handlePatientFound} inputLanguage={p.inputLanguage} />
              <ClinicIdEntrySection title="HDSS identifiers (if known)" types={HDSS_ID_TYPES} clinicIds={p.identifiers}
                handleClinicIdChange={p.handleIdentifierChange} addClinicId={p.addIdentifier} removeClinicId={p.removeIdentifier}
                onPatientFound={p.handlePatientFound} inputLanguage={p.inputLanguage} />
            </>
          )}
          {step === 1 && (
            <PersonalIdentifiersSection formData={p.formData} handleChange={p.handleChange} birthYear={p.birthYear} setBirthYear={p.setBirthYear}
              birthMonth={p.birthMonth} setBirthMonth={p.setBirthMonth} birthDay={p.birthDay} setBirthDay={p.setBirthDay} inputLanguage={p.inputLanguage} />
          )}
          {step === 2 && (
            <>
              <ResidenceDetailsSection formData={p.formData} handleChange={p.handleChange} handleCheckboxChange={p.handleCheckboxChange} inputLanguage={p.inputLanguage} />
              <ResidencyTimelineSection residencyPeriods={p.residencyPeriods} onResidencyPeriodsChange={p.setResidencyPeriods} inputLanguage={p.inputLanguage} />
            </>
          )}
          {step === 3 && (
            <>
              <MchVisitFields formData={p.formData} handleChange={p.handleChange} inputLanguage={p.inputLanguage} />
              <VisitDetailsSection visit={p.visit} onVisitChange={p.handleVisitChange} onVisitSave={p.handleVisitSave} inputLanguage={p.inputLanguage} />
            </>
          )}
          {personMissing && (
            <p className="text-sm text-destructive" role="status">Given name, father's name and birth year are needed before continuing.</p>
          )}
        </section>

        <div className="sticky bottom-0 -mx-4 px-4 py-3 bg-background/95 backdrop-blur border-t sm:static sm:mx-0 sm:px-0 sm:py-0 sm:border-0 sm:bg-transparent flex items-center justify-between gap-2">
          <Button type="button" variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div className="flex gap-2">
            {p.showSaveForLater && <Button type="button" variant="outline" className="hidden sm:inline-flex" onClick={p.handleNextToLinkage}>Save for later search</Button>}
            {last ? (
              <Button type="button" size="lg" onClick={p.handleSubmit}>
                <Search className="w-4 h-4 mr-2" /> Find HDSS matches
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={next} disabled={personMissing}>
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </form>
      <EntrySummaryPanel formData={p.formData} birthYear={p.birthYear} healthFacility={p.healthFacility} clinicIds={p.clinicIds} />
    </div>
  );
};

export default PatientRegistryTab;

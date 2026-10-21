import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  formData: { [key: string]: any };
  birthYear: string;
  healthFacility: string;
  clinicIds: Array<{ type: string; value: string }>;
}

/** Live summary of the record and how well-equipped it is for matching. */
export const readinessFields = (f: { [k: string]: any }, birthYear: string) => [
  { label: 'Given name', ok: !!f.firstName },
  { label: "Father's name", ok: !!f.middleName },
  { label: "Grandfather's name", ok: !!f.lastName },
  { label: 'Sex', ok: !!f.sex },
  { label: 'Birth year', ok: !!birthYear },
  { label: 'Tabia', ok: !!(f.tabia || f.village) },
  { label: 'Kushet', ok: !!(f.kushet || f.subVillage) },
  { label: "Mother's name", ok: !!f.motherName },
];

const EntrySummaryPanel = ({ formData, birthYear, healthFacility, clinicIds }: Props) => {
  const fields = readinessFields(formData, birthYear);
  const pct = Math.round((fields.filter(x => x.ok).length / fields.length) * 100);
  const name = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');
  const ids = clinicIds.filter(i => i.value);

  return (
    <aside className="rounded-xl border bg-card p-5 space-y-5 lg:sticky lg:top-20">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Patient</p>
        <p className="text-lg font-semibold leading-tight mt-1">{name || '—'}</p>
        <p className="text-sm text-muted-foreground">
          {[formData.sex, birthYear && `b. ${birthYear}`, formData.tabia || formData.village].filter(Boolean).join(' · ') || 'No details yet'}
        </p>
        {healthFacility && <p className="text-xs text-muted-foreground mt-1">{healthFacility}</p>}
        {ids.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {ids.map((i, k) => <span key={k} className="text-xs font-mono rounded bg-muted px-2 py-0.5">{i.type}: {i.value}</span>)}
          </div>
        )}
      </div>
      <div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="font-medium">Match readiness</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
        <ul className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1">
          {fields.map(x => (
            <li key={x.label} className={cn('flex items-center gap-1.5 text-xs', x.ok ? 'text-foreground' : 'text-muted-foreground')}>
              {x.ok ? <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> : <Circle className="w-3.5 h-3.5" />}
              {x.label}
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground mt-3">More filled fields give more reliable matches. Blank fields don't count against a match.</p>
      </div>
    </aside>
  );
};

export default EntrySummaryPanel;

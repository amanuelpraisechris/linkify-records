import { cn } from '@/lib/utils';
import { Check, X } from 'lucide-react';

const LABELS: { [k: string]: string } = {
  firstName: 'Given name', middleName: "Father's name", lastName: "Grandfather's name", nameSwap: 'Swapped names',
  birthYear: 'Birth year', birthMonth: 'Birth month', birthDay: 'Birth day', gender: 'Sex',
  village: 'Tabia', subVillage: 'Kushet', motherName: "Mother's name", householdMember: 'Household member',
};

interface Props { fieldScores?: { [k: string]: number } }

/** Explains a candidate's score: which fields agreed, disagreed, or were blank (not counted). */
const CandidateReasonPills = ({ fieldScores = {} }: Props) => {
  const entries = Object.entries(fieldScores).filter(([k]) => LABELS[k]);
  const agree = entries.filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
  const disagree = entries.filter(([, v]) => v < 0);
  const blank = entries.filter(([, v]) => v === 0);
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Why this candidate">
      {agree.map(([k]) => (
        <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium">
          <Check className="w-3 h-3" />{LABELS[k]}
        </span>
      ))}
      {disagree.map(([k]) => (
        <span key={k} className="inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-0.5 text-xs font-medium">
          <X className="w-3 h-3" />{LABELS[k]}
        </span>
      ))}
      {blank.length > 0 && (
        <span className={cn('rounded-full border border-dashed px-2 py-0.5 text-xs text-muted-foreground')}>
          Blank, not counted: {blank.map(([k]) => LABELS[k]).join(', ')}
        </span>
      )}
    </div>
  );
};

export default CandidateReasonPills;

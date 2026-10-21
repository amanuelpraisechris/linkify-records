import { SupportedLanguage } from '@/utils/languageUtils';
import { Input } from '@/components/ui/input';
import { Record } from '@/types';
import { t, LabelKey } from '@/utils/tigrayLabels';

interface NameFieldsProps {
  formData: Partial<Record>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  inputLanguage: SupportedLanguage;
}

/** Ethiopian naming: given name, father's name, grandfather's name (+ mother's name for MCH linkage). */
const FIELDS: { name: string; label: LabelKey; required?: boolean }[] = [
  { name: 'firstName', label: 'givenName', required: true },
  { name: 'middleName', label: 'fatherName', required: true },
  { name: 'lastName', label: 'grandfatherName' },
  { name: 'motherName', label: 'motherName' },
];

const NameFields = ({ formData, handleChange, inputLanguage }: NameFieldsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {FIELDS.map(f => (
      <div key={f.name}>
        <label htmlFor={f.name} className="block text-sm font-medium mb-1.5">
          {t(f.label, inputLanguage)} {f.required && <span className="text-destructive">*</span>}
        </label>
        <Input id={f.name} name={f.name} value={(formData as any)[f.name] || ''} onChange={handleChange}
          className="h-11 text-base" required={f.required} autoComplete="off" />
      </div>
    ))}
  </div>
);

export default NameFields;

import { SupportedLanguage } from '@/utils/languageUtils';
import { Record } from '@/types';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MCH_CLINIC_ID_TYPES } from '@/utils/tigrayLabels';

interface ClinicIdEntrySectionProps {
  clinicIds: Array<{ type: string; value: string }>;
  handleClinicIdChange: (index: number, field: 'type' | 'value', value: string) => void;
  addClinicId: () => void;
  removeClinicId: (index: number) => void;
  onPatientFound: (record: Record) => void;
  inputLanguage: SupportedLanguage;
  types?: string[];
  title?: string;
}

const ClinicIdEntrySection = ({
  clinicIds, handleClinicIdChange, addClinicId, removeClinicId, types = MCH_CLINIC_ID_TYPES, title = 'Clinic card numbers',
}: ClinicIdEntrySectionProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <span className="text-sm font-medium">{title}</span>
      <Button type="button" variant="ghost" size="sm" onClick={addClinicId} className="text-primary">
        <Plus className="w-4 h-4 mr-1" /> Add another
      </Button>
    </div>
    {clinicIds.map((id, index) => (
      <div key={index} className="flex gap-2">
        <Select value={types.includes(id.type) ? id.type : ''} onValueChange={v => handleClinicIdChange(index, 'type', v)}>
          <SelectTrigger aria-label="Identifier type" className="w-52 h-11"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>{types.map(tp => <SelectItem key={tp} value={tp}>{tp}</SelectItem>)}</SelectContent>
        </Select>
        <Input aria-label={`${id.type || 'Identifier'} value`} value={id.value} className="flex-1 h-11 font-mono"
          onChange={e => handleClinicIdChange(index, 'value', e.target.value)} placeholder="Number" />
        {clinicIds.length > 1 && (
          <Button type="button" variant="ghost" size="icon" aria-label="Remove identifier" onClick={() => removeClinicId(index)}
            className="text-destructive hover:bg-destructive/10 h-11 w-11">
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    ))}
  </div>
);

export default ClinicIdEntrySection;

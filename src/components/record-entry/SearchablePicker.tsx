import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface PickerOption { value: string; label: string; hint?: string; pending?: boolean }

interface Props {
  value?: string;
  options: PickerOption[];
  onChange: (value: string) => void;
  onAddNew?: (name: string) => Promise<void> | void;
  placeholder: string;
  searchPlaceholder: string;
  addLabel: string;
  pendingLabel: string;
  disabled?: boolean;
  ariaLabel: string;
}

/** Searchable list with an optional "+ Add new" for names not yet on the list. */
const SearchablePicker = ({ value, options, onChange, onAddNew, placeholder, searchPlaceholder, addLabel, pendingLabel, disabled, ariaLabel }: Props) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const selected = options.find(o => o.value === value);
  const exists = options.some(o => o.label.toLowerCase() === query.trim().toLowerCase());

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" role="combobox" aria-label={ariaLabel} disabled={disabled}
          className="w-full h-11 justify-between font-normal">
          <span className={cn('truncate', !value && 'text-muted-foreground')}>{selected?.label || value || placeholder}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>—</CommandEmpty>
            <CommandGroup>
              {options.map(o => (
                <CommandItem key={o.value} value={`${o.label} ${o.hint || ''}`} onSelect={() => { onChange(o.value); setOpen(false); }}>
                  <Check className={cn('mr-2 h-4 w-4', value === o.value ? 'opacity-100' : 'opacity-0')} />
                  <span className="flex-1">{o.label}</span>
                  {o.hint && <span className="text-xs text-muted-foreground ml-2">{o.hint}</span>}
                  {o.pending && <Badge variant="outline" className="ml-2 text-[10px]">{pendingLabel}</Badge>}
                </CommandItem>
              ))}
            </CommandGroup>
            {onAddNew && query.trim() && !exists && (
              <CommandGroup>
                <CommandItem value={`__add__${query}`} onSelect={async () => { await onAddNew(query.trim()); setQuery(''); setOpen(false); }}>
                  <Plus className="mr-2 h-4 w-4 text-primary" />
                  {addLabel}: "{query.trim()}"
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SearchablePicker;

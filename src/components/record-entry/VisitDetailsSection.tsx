
import { useState } from 'react';
import { Visit } from '@/types';
import { SupportedLanguage } from '@/utils/languageUtils';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarCell, CalendarGrid, CalendarHeader, CalendarHeadCell, CalendarMonthSelect, CalendarNavButton, CalendarYearSelect } from '@/components/ui/calendar'; 
import { format } from 'date-fns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save } from 'lucide-react';

interface VisitDetailsSectionProps {
  visit: Visit;
  onVisitChange: (visit: Visit) => void;
  onVisitSave: () => void;
  inputLanguage: SupportedLanguage;
}

const VisitDetailsSection = ({
  visit,
  onVisitChange,
  onVisitSave,
  inputLanguage
}: VisitDetailsSectionProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [visitBy, setVisitBy] = useState<'PATIENT' | 'TREATMENT SUPPORTER'>('PATIENT');
  
  // Initialize with current date
  useState(() => {
    onVisitChange({
      ...visit,
      date: format(new Date(), 'yyyy-MM-dd'),
      visitBy: 'PATIENT'
    });
  });
  
  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onVisitChange({
        ...visit,
        date: format(newDate, 'yyyy-MM-dd')
      });
    }
  };
  
  const handleVisitByChange = (value: 'PATIENT' | 'TREATMENT SUPPORTER') => {
    setVisitBy(value);
    onVisitChange({
      ...visit,
      visitBy: value
    });
  };
  
  return (
    <div className="bg-white dark:bg-black border rounded-md p-4 mb-6">
      <h4 className="text-md font-medium mb-3 text-primary">
        {inputLanguage === 'latin' ? 'Visit Information' : 
         inputLanguage === 'amharic' ? 'የጉብኝት መረጃ' : 'ሓበሬታ ምብጻሕ'}
      </h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Visit Date' : 
             inputLanguage === 'amharic' ? 'የጉብኝት ቀን' : 'ዕለት ምብጻሕ'}
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, 'PPP')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            {inputLanguage === 'latin' ? 'Visit By' : 
             inputLanguage === 'amharic' ? 'በማን' : 'ብመን'}
          </label>
          <Select 
            value={visitBy} 
            onValueChange={(value) => handleVisitByChange(value as 'PATIENT' | 'TREATMENT SUPPORTER')}
          >
            <SelectTrigger>
              <SelectValue placeholder={
                inputLanguage === 'latin' ? 'Select' : 
                inputLanguage === 'amharic' ? 'ይምረጡ' : 'ምረጽ'
              } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PATIENT">
                {inputLanguage === 'latin' ? 'PATIENT' : 
                 inputLanguage === 'amharic' ? 'ታካሚ' : 'ሕሙም'}
              </SelectItem>
              <SelectItem value="TREATMENT SUPPORTER">
                {inputLanguage === 'latin' ? 'TREATMENT SUPPORTER' : 
                 inputLanguage === 'amharic' ? 'የህክምና ደጋፊ' : 'ደጋፊ ሕክምና'}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button
          type="button"
          onClick={onVisitSave}
          className="flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {inputLanguage === 'latin' ? 'Save Visit Information' : 
           inputLanguage === 'amharic' ? 'የጉብኝት መረጃ ያስቀምጡ' : 'ሓበሬታ ምብጻሕ ኣቐምጥ'}
        </Button>
      </div>
    </div>
  );
};

export default VisitDetailsSection;

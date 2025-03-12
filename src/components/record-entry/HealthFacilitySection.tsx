
import { SupportedLanguage } from '@/utils/languageUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface HealthFacilitySectionProps {
  healthFacility: string;
  handleHealthFacilityChange: (value: string) => void;
  inputLanguage: SupportedLanguage;
}

const HealthFacilitySection = ({
  healthFacility,
  handleHealthFacilityChange,
  inputLanguage
}: HealthFacilitySectionProps) => {
  const facilityOptions = [
    {value: 'Central Hospital', label: {
      latin: 'Central Hospital',
      amharic: 'ማዕከላዊ ሆስፒታል',
      tigrinya: 'ማእከላይ ሆስፒታል'
    }},
    {value: 'Community Clinic', label: {
      latin: 'Community Clinic',
      amharic: 'የህብረተሰብ ክሊኒክ',
      tigrinya: 'ናይ ማሕበረሰብ ክሊኒክ'
    }},
    {value: 'Rural Health Center', label: {
      latin: 'Rural Health Center',
      amharic: 'የገጠር ጤና ጣቢያ',
      tigrinya: 'ናይ ገጠር ጥዕና ማእከል'
    }}
  ];

  return (
    <div className="bg-muted/20 p-4 rounded-lg mb-4">
      <label className="block text-sm font-medium mb-2">
        {inputLanguage === 'latin' ? 'Health Facility' : 
         inputLanguage === 'amharic' ? 'የጤና ተቋም' : 'ትካል ጥዕና'}
      </label>
      
      <Select value={healthFacility} onValueChange={handleHealthFacilityChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={
            inputLanguage === 'latin' ? 'Select health facility' : 
            inputLanguage === 'amharic' ? 'የጤና ተቋም ይምረጡ' : 'ትካል ጥዕና ምረጽ'
          } />
        </SelectTrigger>
        <SelectContent>
          {facilityOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label[inputLanguage]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HealthFacilitySection;

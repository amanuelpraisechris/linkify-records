
import { Record } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useFormHandlers = (
  formData: Partial<Record>,
  setFormData: React.Dispatch<React.SetStateAction<Partial<Record>>>,
  setActiveTab: React.Dispatch<React.SetStateAction<string>>,
  setIsRepeatPatient: React.Dispatch<React.SetStateAction<boolean>>,
  setBirthYear: React.Dispatch<React.SetStateAction<string>>,
  setBirthMonth: React.Dispatch<React.SetStateAction<string>>,
  setBirthDay: React.Dispatch<React.SetStateAction<string>>,
  onSaveForSearch?: (record: Record) => void
) => {
  const { toast } = useToast();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked });
  };
  
  const handlePatientFound = (record: Record) => {
    setFormData({
      ...record,
    });
    
    if (record.birthDate) {
      const parts = record.birthDate.split('-');
      if (parts.length >= 1) setBirthYear(parts[0]);
      if (parts.length >= 2) setBirthMonth(parts[1]);
      if (parts.length >= 3) setBirthDay(parts[2]);
    }
    
    setIsRepeatPatient(true);
    
    toast({
      title: "Repeat Patient Found",
      description: "Personal identifiers have been automatically filled in.",
    });
  };
  
  const buildDateString = (): string => {
    let birthDateStr = birthYear;
    if (birthMonth) {
      birthDateStr = `${birthDateStr}-${birthMonth}`;
      if (birthDay) {
        birthDateStr = `${birthDateStr}-${birthDay}`;
      } else {
        birthDateStr = `${birthDateStr}-01`;
      }
    } else {
      birthDateStr = `${birthDateStr}-01-01`;
    }
    return birthDateStr;
  };
  
  return {
    handleChange,
    handleCheckboxChange,
    handlePatientFound,
    buildDateString
  };
};

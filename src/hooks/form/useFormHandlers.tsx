
import React from 'react';
import { Record } from '@/types';
import { buildDateString } from '@/utils/dateUtils';

interface UseFormHandlersProps {
  formData: Partial<Record>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Record>>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  setIsRepeatPatient: React.Dispatch<React.SetStateAction<boolean>>;
  setBirthYear: React.Dispatch<React.SetStateAction<string>>;
  setBirthMonth: React.Dispatch<React.SetStateAction<string>>;
  setBirthDay: React.Dispatch<React.SetStateAction<string>>;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  onSaveForSearch?: (record: Record) => void;
}

export const useFormHandlers = ({
  formData,
  setFormData,
  setActiveTab,
  setIsRepeatPatient,
  setBirthYear,
  setBirthMonth,
  setBirthDay,
  birthYear,
  birthMonth,
  birthDay,
  onSaveForSearch
}: UseFormHandlersProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Modified to accept name and checked directly instead of event
  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handlePatientFound = () => {
    setIsRepeatPatient(true);
    
    if (onSaveForSearch) {
      const dateStr = buildDateString(birthYear, birthMonth, birthDay);
      console.log("Generated birth date string for patient found:", dateStr);
      
      const searchRecord: Record = {
        id: `search-${Date.now()}`,
        ...formData as Record,
        birthDate: dateStr,
        metadata: {
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'Health Facility Entry'
        }
      };
      
      onSaveForSearch(searchRecord);
    }
    
    setActiveTab('linkage-with-dss');
  };
  
  return {
    handleChange,
    handleCheckboxChange,
    handlePatientFound
  };
};

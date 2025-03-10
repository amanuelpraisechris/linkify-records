
import { useState } from 'react';
import { ResidencyPeriod } from '@/types';

export const useResidencyPeriods = () => {
  const [residencyPeriods, setResidencyPeriods] = useState<ResidencyPeriod[]>([]);
  
  const addResidencyPeriod = (period: ResidencyPeriod) => {
    setResidencyPeriods(prev => [...prev, period]);
  };
  
  const removeResidencyPeriod = (index: number) => {
    setResidencyPeriods(prev => prev.filter((_, i) => i !== index));
  };
  
  const updateResidencyPeriod = (index: number, updatedPeriod: Partial<ResidencyPeriod>) => {
    setResidencyPeriods(prev => 
      prev.map((period, i) => 
        i === index ? { ...period, ...updatedPeriod } : period
      )
    );
  };
  
  return {
    residencyPeriods,
    setResidencyPeriods,
    addResidencyPeriod,
    removeResidencyPeriod,
    updateResidencyPeriod
  };
};

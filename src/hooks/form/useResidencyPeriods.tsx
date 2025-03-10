
import { useState } from 'react';
import { ResidencyPeriod } from '@/types';

export const useResidencyPeriods = () => {
  const [residencyPeriods, setResidencyPeriods] = useState<ResidencyPeriod[]>([]);
  
  return {
    residencyPeriods,
    setResidencyPeriods
  };
};


import { useState } from 'react';
import { Visit } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const useVisitHandlers = () => {
  const [visit, setVisit] = useState<Visit>({
    id: `visit_${Date.now()}`, // Add the required id field
    date: new Date().toISOString().split('T')[0],
    visitBy: 'PATIENT'
  });
  
  const { toast } = useToast();
  
  const handleVisitChange = (newVisit: Visit) => {
    setVisit(newVisit);
  };
  
  const handleVisitSave = () => {
    toast({
      title: "Visit Information Saved",
      description: `Visit recorded for ${visit.date} by ${visit.visitBy}.`,
    });
  };
  
  return {
    visit,
    handleVisitChange,
    handleVisitSave
  };
};

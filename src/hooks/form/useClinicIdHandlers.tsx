
export const useClinicIdHandlers = (
  clinicIds: Array<{ type: string; value: string }>,
  setClinicIds: React.Dispatch<React.SetStateAction<Array<{ type: string; value: string }>>>
) => {
  const handleClinicIdChange = (index: number, field: 'type' | 'value', value: string) => {
    const newClinicIds = [...clinicIds];
    newClinicIds[index][field] = value;
    setClinicIds(newClinicIds);
  };
  
  const addClinicId = () => {
    setClinicIds([...clinicIds, { type: '', value: '' }]);
  };
  
  const removeClinicId = (index: number) => {
    setClinicIds(clinicIds.filter((_, i) => i !== index));
  };
  
  return {
    handleClinicIdChange,
    addClinicId,
    removeClinicId
  };
};

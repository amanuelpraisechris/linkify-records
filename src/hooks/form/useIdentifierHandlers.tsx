
export const useIdentifierHandlers = (
  identifiers: Array<{ type: string; value: string }>,
  setIdentifiers: React.Dispatch<React.SetStateAction<Array<{ type: string; value: string }>>>
) => {
  const handleIdentifierChange = (index: number, field: 'type' | 'value', value: string) => {
    const newIdentifiers = [...identifiers];
    newIdentifiers[index][field] = value;
    setIdentifiers(newIdentifiers);
  };
  
  const addIdentifier = () => {
    setIdentifiers([...identifiers, { type: '', value: '' }]);
  };
  
  const removeIdentifier = (index: number) => {
    setIdentifiers(identifiers.filter((_, i) => i !== index));
  };
  
  return {
    handleIdentifierChange,
    addIdentifier,
    removeIdentifier
  };
};

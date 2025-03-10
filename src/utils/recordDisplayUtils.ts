
import { Record } from '@/types';
import { nonPatientNameFields } from './recordConstants';

// Helper function to get display value from various field patterns
export const getDisplayValue = (record: Record, field: string, defaultValue = '-'): string => {
  // Check for standard field names
  if (record[field as keyof Record] !== undefined) {
    return String(record[field as keyof Record]);
  }
  
  // Check for quoted field names
  if (record[`"${field}"` as keyof Record] !== undefined) {
    return String(record[`"${field}"` as keyof Record]).replace(/"/g, '');
  }
  
  // Check for camelCase variation
  const camelCaseField = field.charAt(0).toUpperCase() + field.slice(1);
  if (record[camelCaseField as keyof Record] !== undefined) {
    return String(record[camelCaseField as keyof Record]);
  }
  
  // Check for snake_case variation
  const snakeCaseField = field.replace(/([A-Z])/g, '_$1').toLowerCase();
  if (record[snakeCaseField as keyof Record] !== undefined) {
    return String(record[snakeCaseField as keyof Record]);
  }
  
  // Check for case-insensitive field match
  for (const key in record) {
    if (key.toLowerCase() === field.toLowerCase() && record[key as keyof Record] !== undefined) {
      return String(record[key as keyof Record]);
    }
  }
  
  return defaultValue;
};

export const getGender = (record: Record) => {
  if (record.gender) return record.gender;
  if (record["\"Sex\""]) {
    const sex = record["\"Sex\""].replace(/"/g, '');
    return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
  }
  if (record["Sex"]) {
    const sex = record["Sex"];
    return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
  }
  if (record["sex"]) {
    const sex = record["sex"];
    return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
  }
  if (record["\"sex\""]) {
    const sex = record["\"sex\""].replace(/"/g, '');
    return sex === 'M' ? 'Male' : sex === 'F' ? 'Female' : sex;
  }
  return '-';
};

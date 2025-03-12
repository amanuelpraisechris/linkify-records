
import { Record, Visit } from '@/types';

export const getInitialState = <T extends unknown>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved) as T;
    }
  } catch (err) {
    console.error(`Error retrieving ${key} from localStorage:`, err);
  }
  return defaultValue;
};

export const updateRecordWithVisit = (recordsArray: Record[], recordId: string, visit: Visit): Record[] => {
  return recordsArray.map(record => {
    if (record.id === recordId) {
      const visits = record.visits || [];
      return {
        ...record,
        visits: [...visits, visit],
        lastVisit: visit.date,
        metadata: {
          ...record.metadata,
          updatedAt: new Date().toISOString()
        }
      };
    }
    return record;
  });
};

export const updateRecordWithNotes = (recordsArray: Record[], recordId: string, notes: string): Record[] => {
  return recordsArray.map(record => {
    if (record.id === recordId) {
      return {
        ...record,
        metadata: {
          ...record.metadata,
          matchNotes: notes,
          updatedAt: new Date().toISOString()
        }
      };
    }
    return record;
  });
};

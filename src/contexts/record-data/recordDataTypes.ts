
import { Record, MatchResult, Visit } from '@/types';

export interface RecordDataContextType {
  records: Record[];
  communityRecords: Record[];
  clinicRecords: Record[];
  importedRecords: Record[];
  addRecord: (record: Record, recordType?: 'clinic' | 'community') => void;
  addImportedRecords: (records: Record[], isMainCommunityData?: boolean) => void;
  findMatchesForRecord: (record: Record) => Array<{record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number}}>;
  clearImportedRecords: () => void;
  saveMatchResult: (result: MatchResult) => void;
  matchResults: MatchResult[];
  addVisitToRecord: (recordId: string, visit: Visit) => void;
  saveMatchNotes: (recordId: string, notes: string) => void;
}

export const STORAGE_KEYS = {
  COMMUNITY_RECORDS: 'community_records',
  IMPORTED_RECORDS: 'imported_records',
  CLINIC_RECORDS: 'clinic_records',
  MATCH_RESULTS: 'match_results'
};


import { saveAs } from 'file-saver';
import { MatchResult, Record, Visit } from '@/types';

// Helper to generate session ID in format YYYYMMDDHHMMSS
export const generateSessionId = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');
  const second = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}${second}`;
};

// Generate a 6-digit record number (padded with zeros)
export const generateRecordNumber = (index: number): string => {
  return String(index + 1).padStart(6, '0');
};

// Get machine name (simplified version, uses browser info)
export const getMachineName = (): string => {
  return window.navigator.platform.replace(/\s+/g, '_');
};

interface ExportDataOptions {
  includeRegistry: boolean;
  includeMatches: boolean;
  includeNotes: boolean;
  includeVisits: boolean;
}

// Format Registry data into CSV
export const formatRegistryData = (records: Record[], sessionId: string): string => {
  const headers = [
    'MachineName',
    'SessionID',
    'RecordNumber',
    'FirstName',
    'LastName',
    'MiddleName',
    'Sex',
    'BirthDate',
    'Village',
    'SubVillage',
    'District',
    'IdentifierType',
    'IdentifierValue',
    'PhoneNumber',
    'Email',
    'CreatedAt'
  ].join(',');
  
  const machineName = getMachineName();
  
  const rows = records.map((record, index) => {
    const recordNumber = generateRecordNumber(index);
    const identifierType = record.identifiers && record.identifiers.length > 0 ? record.identifiers[0].type : '';
    const identifierValue = record.identifiers && record.identifiers.length > 0 ? record.identifiers[0].value : '';
    
    return [
      machineName,
      sessionId,
      recordNumber,
      record.firstName || '',
      record.lastName || '',
      record.middleName || '',
      record.sex || '',
      record.birthDate || '',
      record.village || '',
      record.subVillage || '',
      record.district || '',
      identifierType,
      identifierValue,
      record.phoneNumber || '',
      record.email || '',
      record.metadata?.createdAt || new Date().toISOString()
    ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

// Format Matches data into CSV
export const formatMatchesData = (matches: MatchResult[], sessionId: string): string => {
  const headers = [
    'MachineName',
    'SessionID',
    'RecordNumber',
    'HDSSId',
    'MatchScore',
    'MatchRank',
    'MatchStatus',
    'MatchedAt',
    'MatchedBy'
  ].join(',');
  
  const machineName = getMachineName();
  
  const rows = matches.map((match, index) => {
    const recordNumber = generateRecordNumber(index);
    
    return [
      machineName,
      sessionId,
      recordNumber,
      match.matchId || '',
      match.confidence || 0,
      index + 1, // Rank based on array position
      match.status || 'unknown',
      match.matchedAt || new Date().toISOString(),
      match.matchedBy || 'system'
    ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

// Format Notes data into CSV
export const formatNotesData = (matches: MatchResult[], sessionId: string): string => {
  const headers = [
    'MachineName',
    'SessionID',
    'RecordNumber',
    'Note',
    'CreatedAt',
    'CreatedBy'
  ].join(',');
  
  const machineName = getMachineName();
  
  // Filter matches that have notes
  const rows = matches
    .filter(match => match.notes && match.notes.trim() !== '')
    .map((match, index) => {
      const recordNumber = generateRecordNumber(index);
      
      return [
        machineName,
        sessionId,
        recordNumber,
        match.notes || '',
        match.matchedAt || new Date().toISOString(),
        match.matchedBy || 'system'
      ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
    });
  
  return [headers, ...rows].join('\n');
};

// Format Visits data into CSV
export const formatVisitsData = (visits: Visit[], sessionId: string): string => {
  const headers = [
    'MachineName',
    'SessionID',
    'RecordNumber',
    'VisitDate',
    'VisitType',
    'VisitBy',
    'VisitLocation'
  ].join(',');
  
  const machineName = getMachineName();
  
  const rows = visits.map((visit, index) => {
    const recordNumber = generateRecordNumber(index);
    
    return [
      machineName,
      sessionId,
      recordNumber,
      visit.date || new Date().toISOString().split('T')[0],
      visit.type || 'regular',
      visit.visitBy || 'PATIENT',
      visit.location || ''
    ].map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
  });
  
  return [headers, ...rows].join('\n');
};

// Export data as CSV files
export const exportDataToCSV = (
  records: Record[],
  matches: MatchResult[],
  visits: Visit[],
  options: ExportDataOptions
): void => {
  const sessionId = generateSessionId();
  const timestamp = new Date().toISOString().split('T')[0];
  
  if (options.includeRegistry) {
    const registryCSV = formatRegistryData(records, sessionId);
    const registryBlob = new Blob([registryCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(registryBlob, `registry_${timestamp}.csv`);
  }
  
  if (options.includeMatches) {
    const matchesCSV = formatMatchesData(matches, sessionId);
    const matchesBlob = new Blob([matchesCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(matchesBlob, `matches_${timestamp}.csv`);
  }
  
  if (options.includeNotes) {
    const notesCSV = formatNotesData(matches, sessionId);
    const notesBlob = new Blob([notesCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(notesBlob, `notes_${timestamp}.csv`);
  }
  
  if (options.includeVisits) {
    const visitsCSV = formatVisitsData(visits, sessionId);
    const visitsBlob = new Blob([visitsCSV], { type: 'text/csv;charset=utf-8;' });
    saveAs(visitsBlob, `visits_${timestamp}.csv`);
  }
};

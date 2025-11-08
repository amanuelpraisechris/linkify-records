/**
 * Search Session Logging Service
 * Track all search attempts with criteria and outcomes
 */

import { Record } from '@/types';
import { logAudit } from './auditService';

export interface SearchSession {
  id: string;
  timestamp: string;
  searchCriteria: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    birthDate?: string;
    sex?: string;
    village?: string;
    subVillage?: string;
    householdMember?: string;
    balozi?: string;
    [key: string]: any;
  };
  outcome: 'matched' | 'not_matched' | 'manual_review';
  matchCount: number;
  selectedMatchId?: string;
  confidence?: number;
  notes?: string;
  userId: string;
  sessionDuration?: number; // milliseconds
}

export interface FailedMatch {
  id: string;
  timestamp: string;
  sourceRecord: Record;
  searchCriteria: any;
  attemptedMatches: number;
  highestConfidence: number;
  reason: 'no_matches_found' | 'low_confidence' | 'user_rejected';
  notes?: string;
}

const SEARCH_SESSIONS_KEY = 'search_sessions';
const FAILED_MATCHES_KEY = 'failed_matches';

/**
 * Generate unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current user ID
 */
function getCurrentUserId(): string {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return user.id || user.email || 'unknown';
    }
  } catch (error) {
    console.error('Error getting user ID:', error);
  }
  return 'unknown';
}

/**
 * Log a search session
 */
export function logSearchSession(session: Omit<SearchSession, 'id' | 'timestamp' | 'userId'>): SearchSession {
  const fullSession: SearchSession = {
    ...session,
    id: generateSessionId(),
    timestamp: new Date().toISOString(),
    userId: getCurrentUserId()
  };

  // Save to storage
  const sessions = getSearchSessions();
  sessions.push(fullSession);

  // Keep only last 1000 sessions
  const trimmedSessions = sessions.slice(-1000);
  localStorage.setItem(SEARCH_SESSIONS_KEY, JSON.stringify(trimmedSessions));

  // Log to audit trail
  logAudit({
    actionType: 'RECORD_SEARCH',
    description: `Search performed - Outcome: ${session.outcome}, Matches: ${session.matchCount}`,
    severity: 'info',
    metadata: {
      searchCriteria: session.searchCriteria,
      outcome: session.outcome,
      matchCount: session.matchCount
    }
  });

  return fullSession;
}

/**
 * Log a failed match
 */
export function logFailedMatch(failed: Omit<FailedMatch, 'id' | 'timestamp'>): FailedMatch {
  const fullFailed: FailedMatch = {
    ...failed,
    id: generateSessionId(),
    timestamp: new Date().toISOString()
  };

  const failedMatches = getFailedMatches();
  failedMatches.push(fullFailed);

  // Keep only last 500 failed matches
  const trimmedFailed = failedMatches.slice(-500);
  localStorage.setItem(FAILED_MATCHES_KEY, JSON.stringify(trimmedFailed));

  // Log to audit trail
  logAudit({
    actionType: 'RECORD_SEARCH',
    description: `Failed match - Reason: ${failed.reason}`,
    severity: 'warning',
    entityType: 'record',
    entityId: failed.sourceRecord.id,
    metadata: {
      reason: failed.reason,
      highestConfidence: failed.highestConfidence,
      attemptedMatches: failed.attemptedMatches
    }
  });

  return fullFailed;
}

/**
 * Get all search sessions
 */
export function getSearchSessions(limit?: number): SearchSession[] {
  try {
    const sessionsStr = localStorage.getItem(SEARCH_SESSIONS_KEY);
    const sessions: SearchSession[] = sessionsStr ? JSON.parse(sessionsStr) : [];

    // Sort by timestamp descending
    sessions.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return limit ? sessions.slice(0, limit) : sessions;
  } catch (error) {
    console.error('Error loading search sessions:', error);
    return [];
  }
}

/**
 * Get failed matches
 */
export function getFailedMatches(limit?: number): FailedMatch[] {
  try {
    const failedStr = localStorage.getItem(FAILED_MATCHES_KEY);
    const failed: FailedMatch[] = failedStr ? JSON.parse(failedStr) : [];

    // Sort by timestamp descending
    failed.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

    return limit ? failed.slice(0, limit) : failed;
  } catch (error) {
    console.error('Error loading failed matches:', error);
    return [];
  }
}

/**
 * Export failed matches as CSV
 */
export function exportFailedMatches(): string {
  const failed = getFailedMatches();

  if (failed.length === 0) {
    return 'No failed matches to export';
  }

  const headers = [
    'Timestamp',
    'First Name',
    'Last Name',
    'Birth Date',
    'Sex',
    'Village',
    'Attempted Matches',
    'Highest Confidence',
    'Reason',
    'Notes'
  ];

  const rows = failed.map(f => [
    f.timestamp,
    f.sourceRecord.firstName || '',
    f.sourceRecord.lastName || '',
    f.sourceRecord.birthDate || '',
    f.sourceRecord.sex || '',
    f.sourceRecord.village || '',
    f.attemptedMatches.toString(),
    f.highestConfidence.toFixed(1) + '%',
    f.reason,
    f.notes || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  return csvContent;
}

/**
 * Get search statistics
 */
export function getSearchStatistics() {
  const sessions = getSearchSessions();
  const failed = getFailedMatches();

  const totalSearches = sessions.length;
  const matchedCount = sessions.filter(s => s.outcome === 'matched').length;
  const notMatchedCount = sessions.filter(s => s.outcome === 'not_matched').length;
  const manualReviewCount = sessions.filter(s => s.outcome === 'manual_review').length;

  const averageMatchCount = sessions.length > 0
    ? sessions.reduce((sum, s) => sum + s.matchCount, 0) / sessions.length
    : 0;

  const averageConfidence = sessions.filter(s => s.confidence).length > 0
    ? sessions.filter(s => s.confidence).reduce((sum, s) => sum + (s.confidence || 0), 0) / sessions.filter(s => s.confidence).length
    : 0;

  return {
    totalSearches,
    matchedCount,
    notMatchedCount,
    manualReviewCount,
    failedMatchesCount: failed.length,
    matchRate: totalSearches > 0 ? (matchedCount / totalSearches) * 100 : 0,
    averageMatchCount,
    averageConfidence
  };
}

/**
 * Clear old sessions (older than specified days)
 */
export function clearOldSessions(daysToKeep: number = 30): void {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
  const cutoffStr = cutoffDate.toISOString();

  const sessions = getSearchSessions();
  const filteredSessions = sessions.filter(s => s.timestamp >= cutoffStr);
  localStorage.setItem(SEARCH_SESSIONS_KEY, JSON.stringify(filteredSessions));

  const failed = getFailedMatches();
  const filteredFailed = failed.filter(f => f.timestamp >= cutoffStr);
  localStorage.setItem(FAILED_MATCHES_KEY, JSON.stringify(filteredFailed));
}

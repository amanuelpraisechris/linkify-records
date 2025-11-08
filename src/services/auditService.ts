/**
 * Audit Service
 * Handles logging, storage, and retrieval of audit trail entries
 */

import {
  AuditLogEntry,
  AuditActionType,
  AuditSeverity,
  AuditQueryFilter,
  AuditStats,
} from '@/types/audit';

const AUDIT_LOG_STORAGE_KEY = 'audit_logs';
const MAX_LOGS_IN_MEMORY = 10000; // Prevent localStorage overflow

/**
 * Generate unique audit log ID
 */
function generateAuditId(): string {
  return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current user information from auth context
 * This should be enhanced to pull from actual auth context
 */
function getCurrentUserInfo() {
  // TODO: Integrate with actual auth context
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return {
        userId: user.id || 'unknown',
        userName: user.name || user.email || 'Unknown User',
        userRole: user.role || 'user',
      };
    } catch {
      return {
        userId: 'unknown',
        userName: 'Unknown User',
        userRole: 'user',
      };
    }
  }
  return {
    userId: 'system',
    userName: 'System',
    userRole: 'system',
  };
}

/**
 * Get machine/session metadata
 */
function getMetadata() {
  return {
    userAgent: navigator.userAgent,
    machineName: localStorage.getItem('machineName') || 'unknown',
    sessionId: sessionStorage.getItem('sessionId') || generateSessionId(),
  };
}

/**
 * Generate session ID if not exists
 */
function generateSessionId(): string {
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  sessionStorage.setItem('sessionId', sessionId);
  return sessionId;
}

/**
 * Load audit logs from storage
 */
function loadAuditLogs(): AuditLogEntry[] {
  try {
    const logsStr = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!logsStr) return [];
    return JSON.parse(logsStr);
  } catch (error) {
    console.error('Error loading audit logs:', error);
    return [];
  }
}

/**
 * Save audit logs to storage
 */
function saveAuditLogs(logs: AuditLogEntry[]): void {
  try {
    // Keep only the most recent logs to prevent storage overflow
    const trimmedLogs = logs.slice(-MAX_LOGS_IN_MEMORY);
    localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Error saving audit logs:', error);
    // If storage is full, remove oldest logs and retry
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      const reducedLogs = logs.slice(-Math.floor(MAX_LOGS_IN_MEMORY / 2));
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(reducedLogs));
    }
  }
}

/**
 * Log an audit entry
 */
export function logAudit(params: {
  actionType: AuditActionType;
  description: string;
  severity?: AuditSeverity;
  entityType?: AuditLogEntry['entityType'];
  entityId?: string;
  oldValue?: any;
  newValue?: any;
  metadata?: AuditLogEntry['metadata'];
  stackTrace?: string;
}): AuditLogEntry {
  const userInfo = getCurrentUserInfo();
  const baseMetadata = getMetadata();

  const entry: AuditLogEntry = {
    id: generateAuditId(),
    timestamp: new Date().toISOString(),
    ...userInfo,
    actionType: params.actionType,
    severity: params.severity || 'info',
    description: params.description,
    entityType: params.entityType,
    entityId: params.entityId,
    oldValue: params.oldValue,
    newValue: params.newValue,
    metadata: {
      ...baseMetadata,
      ...params.metadata,
    },
    stackTrace: params.stackTrace,
  };

  // Save to storage
  const logs = loadAuditLogs();
  logs.push(entry);
  saveAuditLogs(logs);

  // Log to console for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', entry.actionType, entry.description);
  }

  return entry;
}

/**
 * Query audit logs with filters
 */
export function queryAuditLogs(filter?: AuditQueryFilter): AuditLogEntry[] {
  let logs = loadAuditLogs();

  if (!filter) {
    return logs;
  }

  // Filter by date range
  if (filter.startDate) {
    logs = logs.filter(log => log.timestamp >= filter.startDate!);
  }
  if (filter.endDate) {
    logs = logs.filter(log => log.timestamp <= filter.endDate!);
  }

  // Filter by user
  if (filter.userId) {
    logs = logs.filter(log => log.userId === filter.userId);
  }

  // Filter by action types
  if (filter.actionTypes && filter.actionTypes.length > 0) {
    logs = logs.filter(log => filter.actionTypes!.includes(log.actionType));
  }

  // Filter by entity type
  if (filter.entityType) {
    logs = logs.filter(log => log.entityType === filter.entityType);
  }

  // Filter by entity ID
  if (filter.entityId) {
    logs = logs.filter(log => log.entityId === filter.entityId);
  }

  // Filter by severity
  if (filter.severity && filter.severity.length > 0) {
    logs = logs.filter(log => filter.severity!.includes(log.severity));
  }

  // Search text in description
  if (filter.searchText) {
    const searchLower = filter.searchText.toLowerCase();
    logs = logs.filter(log =>
      log.description.toLowerCase().includes(searchLower) ||
      log.actionType.toLowerCase().includes(searchLower)
    );
  }

  // Sort by timestamp (newest first)
  logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  // Apply pagination
  const offset = filter.offset || 0;
  const limit = filter.limit || logs.length;
  return logs.slice(offset, offset + limit);
}

/**
 * Get audit statistics
 */
export function getAuditStats(): AuditStats {
  const logs = loadAuditLogs();

  // Count by action type
  const logsByAction = logs.reduce((acc, log) => {
    acc[log.actionType] = (acc[log.actionType] || 0) + 1;
    return acc;
  }, {} as Record<AuditActionType, number>);

  // Count by severity
  const logsBySeverity = logs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, {} as Record<AuditSeverity, number>);

  // Count by user
  const logsByUser = logs.reduce((acc, log) => {
    const userName = log.userName || 'Unknown';
    acc[userName] = (acc[userName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Recent activity (last 10)
  const recentActivity = logs
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 10);

  return {
    totalLogs: logs.length,
    logsByAction,
    logsBySeverity,
    logsByUser,
    recentActivity,
  };
}

/**
 * Clear audit logs (admin only)
 */
export function clearAuditLogs(beforeDate?: string): void {
  if (beforeDate) {
    const logs = loadAuditLogs();
    const filteredLogs = logs.filter(log => log.timestamp >= beforeDate);
    saveAuditLogs(filteredLogs);
    logAudit({
      actionType: 'DATA_CLEAR',
      description: `Cleared audit logs before ${beforeDate}`,
      severity: 'warning',
      metadata: { logsRemoved: logs.length - filteredLogs.length },
    });
  } else {
    const logsCount = loadAuditLogs().length;
    localStorage.removeItem(AUDIT_LOG_STORAGE_KEY);
    logAudit({
      actionType: 'DATA_CLEAR',
      description: 'Cleared all audit logs',
      severity: 'warning',
      metadata: { logsRemoved: logsCount },
    });
  }
}

/**
 * Export audit logs
 */
export function exportAuditLogs(
  format: 'json' | 'csv' = 'json',
  filter?: AuditQueryFilter
): string {
  const logs = queryAuditLogs(filter);

  if (format === 'json') {
    return JSON.stringify(logs, null, 2);
  }

  // CSV format
  if (logs.length === 0) {
    return 'No logs found';
  }

  const headers = [
    'Timestamp',
    'User',
    'Role',
    'Action Type',
    'Severity',
    'Description',
    'Entity Type',
    'Entity ID',
    'Session ID',
  ];

  const rows = logs.map(log => [
    log.timestamp,
    log.userName || '',
    log.userRole || '',
    log.actionType,
    log.severity,
    log.description,
    log.entityType || '',
    log.entityId || '',
    log.metadata?.sessionId || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Helper function to log errors with stack trace
 */
export function logError(error: Error, context?: string): void {
  logAudit({
    actionType: 'SYSTEM_ERROR',
    description: context ? `${context}: ${error.message}` : error.message,
    severity: 'error',
    stackTrace: error.stack,
  });
}

/**
 * Helper function to log warnings
 */
export function logWarning(message: string, metadata?: any): void {
  logAudit({
    actionType: 'SYSTEM_WARNING',
    description: message,
    severity: 'warning',
    metadata,
  });
}

/**
 * Helper function to log info messages
 */
export function logInfo(message: string, metadata?: any): void {
  logAudit({
    actionType: 'SYSTEM_INFO',
    description: message,
    severity: 'info',
    metadata,
  });
}

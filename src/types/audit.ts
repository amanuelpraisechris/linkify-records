/**
 * Audit Trail System Types
 * Comprehensive tracking of all user actions and system events
 */

export type AuditActionType =
  // Authentication actions
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'USER_REGISTER'
  | 'USER_PASSWORD_CHANGE'

  // Record management
  | 'RECORD_CREATE'
  | 'RECORD_UPDATE'
  | 'RECORD_DELETE'
  | 'RECORD_VIEW'
  | 'RECORD_SEARCH'

  // Matching actions
  | 'MATCH_ACCEPT'
  | 'MATCH_REJECT'
  | 'MATCH_MANUAL_REVIEW'
  | 'MATCH_UNDO'
  | 'MATCHING_SESSION_START'
  | 'MATCHING_SESSION_END'
  | 'BATCH_MATCH_START'
  | 'BATCH_MATCH_COMPLETE'
  | 'BATCH_MATCH_CANCEL'

  // Data import/export
  | 'DATA_IMPORT'
  | 'DATA_EXPORT'
  | 'DATA_BACKUP'
  | 'DATA_RESTORE'
  | 'DATA_CLEAR'

  // Configuration changes
  | 'CONFIG_FIELD_WEIGHTS_UPDATE'
  | 'CONFIG_THRESHOLDS_UPDATE'
  | 'CONFIG_ALGORITHM_CHANGE'
  | 'CONFIG_LANGUAGE_CHANGE'
  | 'CONFIG_PROFILE_SAVE'
  | 'CONFIG_PROFILE_LOAD'

  // System events
  | 'SYSTEM_ERROR'
  | 'SYSTEM_WARNING'
  | 'SYSTEM_INFO';

export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO 8601 format
  userId?: string;
  userName?: string;
  userRole?: string;
  actionType: AuditActionType;
  severity: AuditSeverity;
  description: string;

  // Context data
  entityType?: 'record' | 'match' | 'config' | 'user' | 'session' | 'batch';
  entityId?: string;

  // Change tracking
  oldValue?: any;
  newValue?: any;

  // Additional metadata
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    machineName?: string;
    duration?: number; // for operations that take time (ms)
    recordsAffected?: number; // for batch operations
    [key: string]: any;
  };

  // Stack trace for errors
  stackTrace?: string;
}

export interface AuditQueryFilter {
  startDate?: string;
  endDate?: string;
  userId?: string;
  actionTypes?: AuditActionType[];
  entityType?: string;
  entityId?: string;
  severity?: AuditSeverity[];
  searchText?: string;
  limit?: number;
  offset?: number;
}

export interface AuditStats {
  totalLogs: number;
  logsByAction: Record<AuditActionType, number>;
  logsBySeverity: Record<AuditSeverity, number>;
  logsByUser: Record<string, number>;
  recentActivity: AuditLogEntry[];
}

export interface AuditExportOptions {
  format: 'csv' | 'json' | 'pdf';
  filter?: AuditQueryFilter;
  includeMetadata?: boolean;
}

/**
 * Data Quality Types
 * Pre-match validation and data cleaning
 */

import { Record } from './index';

export type DataQualityIssueType =
  | 'missing_required_field'
  | 'invalid_format'
  | 'duplicate_record'
  | 'inconsistent_data'
  | 'outlier_value'
  | 'incomplete_record'
  | 'invalid_date'
  | 'standardization_needed';

export type DataQualitySeverity = 'critical' | 'high' | 'medium' | 'low';

export interface DataQualityIssue {
  id: string;
  recordId: string;
  type: DataQualityIssueType;
  severity: DataQualitySeverity;
  field: string;
  currentValue: any;
  expectedValue?: any;
  suggestedFix?: any;
  message: string;
  autoFixable: boolean;
}

export interface DataQualityReport {
  id: string;
  generatedAt: string;
  totalRecords: number;
  recordsWithIssues: number;
  issueCount: number;
  issuesByType: Record<DataQualityIssueType, number>;
  issuesBySeverity: Record<DataQualitySeverity, number>;
  completenessScore: number; // 0-100
  consistencyScore: number; // 0-100
  validityScore: number; // 0-100
  overallQualityScore: number; // 0-100
  issues: DataQualityIssue[];
  recommendations: string[];
}

export interface FieldCompletenessMetric {
  fieldName: string;
  totalRecords: number;
  populatedRecords: number;
  emptyRecords: number;
  completenessRate: number; // percentage
  isRequired: boolean;
  status: 'good' | 'acceptable' | 'poor';
}

export interface DuplicateGroup {
  id: string;
  records: Record[];
  similarityScore: number;
  matchingFields: string[];
  suggestedMaster?: string; // ID of record to keep
  resolution: 'pending' | 'merged' | 'kept_separate' | 'deleted';
}

export interface DataStandardizationRule {
  id: string;
  name: string;
  description: string;
  field: string;
  ruleType:
    | 'case_normalization'
    | 'whitespace_trimming'
    | 'date_formatting'
    | 'phone_formatting'
    | 'name_formatting'
    | 'remove_special_chars'
    | 'custom_regex';
  pattern?: string;
  replacement?: string;
  enabled: boolean;
  autoApply: boolean;
}

export interface CleaningOperation {
  type:
    | 'remove_duplicates'
    | 'fill_missing_values'
    | 'standardize_format'
    | 'fix_invalid_data'
    | 'merge_records';
  recordIds: string[];
  field?: string;
  newValue?: any;
  parameters?: any;
}

export interface DataQualityConfig {
  requiredFields: string[];
  validationRules: ValidationRule[];
  standardizationRules: DataStandardizationRule[];
  duplicateDetectionThreshold: number; // 0-100
  autoFixEnabled: boolean;
  autoFixTypes: DataQualityIssueType[];
}

export interface ValidationRule {
  id: string;
  field: string;
  ruleType:
    | 'required'
    | 'format'
    | 'range'
    | 'length'
    | 'pattern'
    | 'custom';
  parameters: {
    pattern?: string;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    allowedValues?: any[];
    customValidator?: string; // Function name
  };
  errorMessage: string;
  severity: DataQualitySeverity;
}

export interface DataCleaningSession {
  id: string;
  startedAt: string;
  completedAt?: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  operationsPerformed: CleaningOperation[];
  issuesFixed: number;
  recordsAffected: number;
  summary: {
    before: DataQualityReport;
    after?: DataQualityReport;
    improvement: number; // percentage
  };
}

export interface StandardizationResult {
  recordId: string;
  field: string;
  originalValue: any;
  standardizedValue: any;
  ruleApplied: string;
  success: boolean;
  error?: string;
}

// Common standardization patterns
export const STANDARDIZATION_PATTERNS = {
  phone: {
    name: 'Phone Number',
    pattern: /^\+?[\d\s\-\(\)]+$/,
    format: '+XXX XXX XXX XXXX'
  },
  email: {
    name: 'Email Address',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    format: 'lowercase'
  },
  date: {
    name: 'Date (YYYY-MM-DD)',
    pattern: /^\d{4}-\d{2}-\d{2}$/,
    format: 'YYYY-MM-DD'
  },
  name: {
    name: 'Person Name',
    format: 'Title Case, Trimmed'
  }
};

// Required fields by use case
export const REQUIRED_FIELDS_BY_USECASE = {
  healthcare: ['firstName', 'lastName', 'birthDate', 'sex', 'healthFacility'],
  census: ['firstName', 'lastName', 'birthDate', 'sex', 'village'],
  research: ['firstName', 'lastName', 'birthDate', 'sex'],
  custom: ['firstName', 'lastName']
};

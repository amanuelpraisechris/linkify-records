/**
 * Data Quality Service
 * Pre-match validation and data cleaning
 */

import {
  DataQualityReport,
  DataQualityIssue,
  DataQualityIssueType,
  DataQualitySeverity,
  FieldCompletenessMetric,
  DuplicateGroup,
  DataStandardizationRule,
  CleaningOperation,
  StandardizationResult,
  REQUIRED_FIELDS_BY_USECASE,
  STANDARDIZATION_PATTERNS
} from '@/types/dataQuality';
import { Record } from '@/types';
import { calculateMatchScore } from '@/utils/matching/matchingCore';
import { DEFAULT_MATCHING_CONFIG } from '@/utils/matching/defaultConfig';
import { logAudit } from './auditService';

/**
 * Generate data quality report for a set of records
 */
export function generateDataQualityReport(
  records: Record[],
  useCase: 'healthcare' | 'census' | 'research' | 'custom' = 'custom'
): DataQualityReport {
  const issues: DataQualityIssue[] = [];
  const requiredFields = REQUIRED_FIELDS_BY_USECASE[useCase];

  // Check each record for issues
  records.forEach(record => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!record[field as keyof Record] || record[field as keyof Record] === '') {
        issues.push({
          id: `${record.id}_${field}_missing`,
          recordId: record.id,
          type: 'missing_required_field',
          severity: 'critical',
          field,
          currentValue: record[field as keyof Record],
          message: `Required field "${field}" is missing`,
          autoFixable: false
        });
      }
    });

    // Check date format
    if (record.birthDate) {
      const datePattern = /^\d{4}-\d{2}-\d{2}$/;
      if (!datePattern.test(record.birthDate)) {
        issues.push({
          id: `${record.id}_birthDate_invalid`,
          recordId: record.id,
          type: 'invalid_date',
          severity: 'high',
          field: 'birthDate',
          currentValue: record.birthDate,
          message: 'Birth date format is invalid (expected: YYYY-MM-DD)',
          autoFixable: true
        });
      }
    }

    // Check for incomplete records (less than 50% fields populated)
    const totalFields = Object.keys(record).length;
    const populatedFields = Object.values(record).filter(v => v !== null && v !== undefined && v !== '').length;
    const completeness = (populatedFields / totalFields) * 100;

    if (completeness < 50) {
      issues.push({
        id: `${record.id}_incomplete`,
        recordId: record.id,
        type: 'incomplete_record',
        severity: 'medium',
        field: 'overall',
        currentValue: `${completeness.toFixed(0)}% complete`,
        message: 'Record is less than 50% complete',
        autoFixable: false
      });
    }

    // Check for standardization needs
    if (record.firstName && record.firstName !== record.firstName.trim()) {
      issues.push({
        id: `${record.id}_firstName_whitespace`,
        recordId: record.id,
        type: 'standardization_needed',
        severity: 'low',
        field: 'firstName',
        currentValue: record.firstName,
        suggestedFix: record.firstName.trim(),
        message: 'First name has leading/trailing whitespace',
        autoFixable: true
      });
    }

    if (record.lastName && record.lastName !== record.lastName.trim()) {
      issues.push({
        id: `${record.id}_lastName_whitespace`,
        recordId: record.id,
        type: 'standardization_needed',
        severity: 'low',
        field: 'lastName',
        currentValue: record.lastName,
        suggestedFix: record.lastName.trim(),
        message: 'Last name has leading/trailing whitespace',
        autoFixable: true
      });
    }

    // Check email format
    if (record.email && !STANDARDIZATION_PATTERNS.email.pattern.test(record.email)) {
      issues.push({
        id: `${record.id}_email_invalid`,
        recordId: record.id,
        type: 'invalid_format',
        severity: 'medium',
        field: 'email',
        currentValue: record.email,
        message: 'Email format is invalid',
        autoFixable: false
      });
    }
  });

  // Calculate scores
  const recordsWithIssues = new Set(issues.map(i => i.recordId)).size;
  const issuesByType = issues.reduce((acc, issue) => {
    acc[issue.type] = (acc[issue.type] || 0) + 1;
    return acc;
  }, {} as Record<DataQualityIssueType, number>);

  const issuesBySeverity = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<DataQualitySeverity, number>);

  const completenessScore = calculateCompletenessScore(records, requiredFields);
  const consistencyScore = calculateConsistencyScore(records);
  const validityScore = calculateValidityScore(issues, records.length);
  const overallQualityScore = (completenessScore + consistencyScore + validityScore) / 3;

  const recommendations = generateRecommendations(issues, records.length);

  const report: DataQualityReport = {
    id: `dq_report_${Date.now()}`,
    generatedAt: new Date().toISOString(),
    totalRecords: records.length,
    recordsWithIssues,
    issueCount: issues.length,
    issuesByType,
    issuesBySeverity,
    completenessScore,
    consistencyScore,
    validityScore,
    overallQualityScore,
    issues,
    recommendations
  };

  // Log to audit trail
  logAudit({
    actionType: 'SYSTEM_INFO',
    description: `Generated data quality report for ${records.length} records - Quality score: ${overallQualityScore.toFixed(1)}%`,
    severity: 'info',
    metadata: {
      totalRecords: records.length,
      issueCount: issues.length,
      qualityScore: overallQualityScore
    }
  });

  return report;
}

/**
 * Calculate field completeness metrics
 */
export function calculateFieldCompleteness(
  records: Record[],
  requiredFields: string[]
): FieldCompletenessMetric[] {
  const metrics: FieldCompletenessMetric[] = [];

  const allFields = new Set<string>();
  records.forEach(record => {
    Object.keys(record).forEach(key => allFields.add(key));
  });

  allFields.forEach(field => {
    const populatedCount = records.filter(
      r => r[field as keyof Record] && r[field as keyof Record] !== ''
    ).length;

    const completenessRate = (populatedCount / records.length) * 100;
    const isRequired = requiredFields.includes(field);

    let status: 'good' | 'acceptable' | 'poor' = 'good';
    if (isRequired) {
      if (completenessRate < 90) status = 'poor';
      else if (completenessRate < 95) status = 'acceptable';
    } else {
      if (completenessRate < 50) status = 'poor';
      else if (completenessRate < 75) status = 'acceptable';
    }

    metrics.push({
      fieldName: field,
      totalRecords: records.length,
      populatedRecords: populatedCount,
      emptyRecords: records.length - populatedCount,
      completenessRate,
      isRequired,
      status
    });
  });

  return metrics.sort((a, b) => a.completenessRate - b.completenessRate);
}

/**
 * Find duplicate records
 */
export function findDuplicates(
  records: Record[],
  threshold: number = 85
): DuplicateGroup[] {
  const duplicateGroups: DuplicateGroup[] = [];
  const processed = new Set<string>();

  records.forEach(record1 => {
    if (processed.has(record1.id)) return;

    const duplicates: Record[] = [record1];
    const matchingFields: string[] = [];

    records.forEach(record2 => {
      if (record1.id === record2.id || processed.has(record2.id)) return;

      const matchResult = calculateMatchScore(record1, record2, DEFAULT_MATCHING_CONFIG);

      if (matchResult.score >= threshold) {
        duplicates.push(record2);
        matchingFields.push(...matchResult.matchedOn);
      }
    });

    if (duplicates.length > 1) {
      duplicates.forEach(d => processed.add(d.id));

      duplicateGroups.push({
        id: `dup_group_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        records: duplicates,
        similarityScore: threshold,
        matchingFields: [...new Set(matchingFields)],
        suggestedMaster: duplicates[0].id,
        resolution: 'pending'
      });
    }
  });

  return duplicateGroups;
}

/**
 * Apply data standardization
 */
export function applyStandardization(
  records: Record[],
  rules: DataStandardizationRule[]
): StandardizationResult[] {
  const results: StandardizationResult[] = [];

  records.forEach(record => {
    rules.forEach(rule => {
      if (!rule.enabled) return;

      const fieldValue = record[rule.field as keyof Record];
      if (!fieldValue) return;

      let standardizedValue: any;
      let success = true;
      let error: string | undefined;

      try {
        switch (rule.ruleType) {
          case 'whitespace_trimming':
            standardizedValue = String(fieldValue).trim();
            break;

          case 'case_normalization':
            // Title case for names
            standardizedValue = String(fieldValue)
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            break;

          case 'date_formatting':
            // Attempt to parse and reformat date
            const date = new Date(fieldValue as string);
            if (!isNaN(date.getTime())) {
              standardizedValue = date.toISOString().split('T')[0];
            } else {
              success = false;
              error = 'Invalid date';
            }
            break;

          case 'phone_formatting':
            // Remove all non-numeric characters
            standardizedValue = String(fieldValue).replace(/\D/g, '');
            break;

          case 'remove_special_chars':
            standardizedValue = String(fieldValue).replace(/[^a-zA-Z0-9\s]/g, '');
            break;

          case 'custom_regex':
            if (rule.pattern && rule.replacement !== undefined) {
              const regex = new RegExp(rule.pattern, 'g');
              standardizedValue = String(fieldValue).replace(regex, rule.replacement);
            }
            break;

          default:
            standardizedValue = fieldValue;
        }

        if (standardizedValue !== fieldValue) {
          results.push({
            recordId: record.id,
            field: rule.field,
            originalValue: fieldValue,
            standardizedValue,
            ruleApplied: rule.name,
            success,
            error
          });

          // Apply if autoApply is enabled
          if (rule.autoApply && success) {
            (record as any)[rule.field] = standardizedValue;
          }
        }
      } catch (err) {
        results.push({
          recordId: record.id,
          field: rule.field,
          originalValue: fieldValue,
          standardizedValue: fieldValue,
          ruleApplied: rule.name,
          success: false,
          error: err instanceof Error ? err.message : 'Unknown error'
        });
      }
    });
  });

  return results;
}

/**
 * Auto-fix data quality issues
 */
export function autoFixIssues(
  records: Record[],
  issues: DataQualityIssue[]
): { fixed: number; failed: number } {
  let fixed = 0;
  let failed = 0;

  const autoFixableIssues = issues.filter(i => i.autoFixable);

  autoFixableIssues.forEach(issue => {
    const record = records.find(r => r.id === issue.recordId);
    if (!record) {
      failed++;
      return;
    }

    try {
      if (issue.type === 'standardization_needed' && issue.suggestedFix !== undefined) {
        (record as any)[issue.field] = issue.suggestedFix;
        fixed++;
      } else if (issue.type === 'invalid_date' && issue.field === 'birthDate') {
        // Try to parse and fix date format
        const date = new Date(record.birthDate);
        if (!isNaN(date.getTime())) {
          record.birthDate = date.toISOString().split('T')[0];
          fixed++;
        } else {
          failed++;
        }
      }
    } catch (error) {
      failed++;
    }
  });

  return { fixed, failed };
}

// Helper functions

function calculateCompletenessScore(records: Record[], requiredFields: string[]): number {
  if (records.length === 0) return 0;

  const totalRequired = records.length * requiredFields.length;
  let populatedRequired = 0;

  records.forEach(record => {
    requiredFields.forEach(field => {
      if (record[field as keyof Record] && record[field as keyof Record] !== '') {
        populatedRequired++;
      }
    });
  });

  return (populatedRequired / totalRequired) * 100;
}

function calculateConsistencyScore(records: Record[]): number {
  // Simple consistency check based on data format
  // This is a placeholder - can be enhanced
  return 85; // Placeholder
}

function calculateValidityScore(issues: DataQualityIssue[], totalRecords: number): number {
  if (totalRecords === 0) return 100;

  const criticalIssues = issues.filter(i => i.severity === 'critical').length;
  const highIssues = issues.filter(i => i.severity === 'high').length;

  const penaltyPoints = (criticalIssues * 10) + (highIssues * 5);
  const score = Math.max(0, 100 - (penaltyPoints / totalRecords));

  return score;
}

function generateRecommendations(issues: DataQualityIssue[], totalRecords: number): string[] {
  const recommendations: string[] = [];

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const autoFixableCount = issues.filter(i => i.autoFixable).length;
  const missingFieldsCount = issues.filter(i => i.type === 'missing_required_field').length;

  if (criticalCount > 0) {
    recommendations.push(`Address ${criticalCount} critical issues before matching`);
  }

  if (autoFixableCount > 0) {
    recommendations.push(`${autoFixableCount} issues can be automatically fixed`);
  }

  if (missingFieldsCount > totalRecords * 0.1) {
    recommendations.push('Consider improving data collection to reduce missing required fields');
  }

  if (issues.filter(i => i.type === 'standardization_needed').length > 10) {
    recommendations.push('Apply data standardization rules to improve match quality');
  }

  return recommendations;
}

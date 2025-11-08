/**
 * Query Builder Service
 * Execute complex queries with AND/OR logic
 */

import {
  Query,
  QueryGroup,
  QueryCondition,
  QueryResult,
  QueryHistory,
  FieldOperator,
  QueryTemplate,
  QUERY_FIELDS
} from '@/types/queryBuilder';
import { Record } from '@/types';
import { logAudit } from './auditService';

const QUERIES_STORAGE_KEY = 'saved_queries';
const QUERY_HISTORY_STORAGE_KEY = 'query_history';
const QUERY_TEMPLATES_STORAGE_KEY = 'query_templates';

/**
 * Generate unique query ID
 */
function generateQueryId(): string {
  return `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Evaluate a single condition against a record
 */
function evaluateCondition(record: Record, condition: QueryCondition): boolean {
  const fieldValue = record[condition.field as keyof Record];
  const queryValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === queryValue;

    case 'not_equals':
      return fieldValue !== queryValue;

    case 'contains':
      return String(fieldValue || '').toLowerCase().includes(String(queryValue || '').toLowerCase());

    case 'not_contains':
      return !String(fieldValue || '').toLowerCase().includes(String(queryValue || '').toLowerCase());

    case 'starts_with':
      return String(fieldValue || '').toLowerCase().startsWith(String(queryValue || '').toLowerCase());

    case 'ends_with':
      return String(fieldValue || '').toLowerCase().endsWith(String(queryValue || '').toLowerCase());

    case 'greater_than':
      if (condition.fieldType === 'date') {
        return new Date(fieldValue as string) > new Date(queryValue);
      }
      return Number(fieldValue) > Number(queryValue);

    case 'less_than':
      if (condition.fieldType === 'date') {
        return new Date(fieldValue as string) < new Date(queryValue);
      }
      return Number(fieldValue) < Number(queryValue);

    case 'is_empty':
      return !fieldValue || fieldValue === '' || fieldValue === null || fieldValue === undefined;

    case 'is_not_empty':
      return fieldValue && fieldValue !== '' && fieldValue !== null && fieldValue !== undefined;

    case 'in_list':
      if (Array.isArray(queryValue)) {
        return queryValue.includes(fieldValue);
      }
      return false;

    case 'not_in_list':
      if (Array.isArray(queryValue)) {
        return !queryValue.includes(fieldValue);
      }
      return true;

    default:
      return false;
  }
}

/**
 * Evaluate a query group against a record
 */
function evaluateGroup(record: Record, group: QueryGroup): boolean {
  const conditionResults = group.conditions.map(condition =>
    evaluateCondition(record, condition)
  );

  const nestedGroupResults = (group.groups || []).map(nestedGroup =>
    evaluateGroup(record, nestedGroup)
  );

  const allResults = [...conditionResults, ...nestedGroupResults];

  if (group.operator === 'AND') {
    return allResults.every(result => result);
  } else {
    return allResults.some(result => result);
  }
}

/**
 * Execute a query against a set of records
 */
export function executeQuery(
  records: Record[],
  query: Query
): QueryResult {
  const startTime = Date.now();

  const matchingRecords = records.filter(record =>
    evaluateGroup(record, query.rootGroup)
  );

  const executionTime = Date.now() - startTime;

  const result: QueryResult = {
    queryId: query.id,
    records: matchingRecords,
    totalCount: matchingRecords.length,
    executionTime,
    executedAt: new Date().toISOString(),
    filters: query.rootGroup
  };

  // Log to audit trail
  logAudit({
    actionType: 'RECORD_SEARCH',
    description: `Executed query "${query.name}" - found ${matchingRecords.length} records`,
    severity: 'info',
    metadata: {
      queryId: query.id,
      resultCount: matchingRecords.length,
      executionTime
    }
  });

  // Save to query history
  saveToHistory({
    id: generateQueryId(),
    query,
    executedAt: result.executedAt,
    resultCount: matchingRecords.length,
    executionTime
  });

  return result;
}

/**
 * Save a query
 */
export function saveQuery(query: Query): void {
  const queries = getSavedQueries();
  const existingIndex = queries.findIndex(q => q.id === query.id);

  if (existingIndex >= 0) {
    queries[existingIndex] = {
      ...query,
      updatedAt: new Date().toISOString()
    };
  } else {
    queries.push(query);
  }

  localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));

  logAudit({
    actionType: 'CONFIG_PROFILE_SAVE',
    description: `Saved query "${query.name}"`,
    severity: 'info',
    entityType: 'config',
    entityId: query.id
  });
}

/**
 * Get all saved queries
 */
export function getSavedQueries(): Query[] {
  try {
    const queriesStr = localStorage.getItem(QUERIES_STORAGE_KEY);
    return queriesStr ? JSON.parse(queriesStr) : [];
  } catch (error) {
    console.error('Error loading saved queries:', error);
    return [];
  }
}

/**
 * Delete a query
 */
export function deleteQuery(queryId: string): void {
  const queries = getSavedQueries();
  const filtered = queries.filter(q => q.id !== queryId);
  localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Toggle query favorite status
 */
export function toggleQueryFavorite(queryId: string): void {
  const queries = getSavedQueries();
  const query = queries.find(q => q.id === queryId);
  if (query) {
    query.isFavorite = !query.isFavorite;
    query.updatedAt = new Date().toISOString();
    localStorage.setItem(QUERIES_STORAGE_KEY, JSON.stringify(queries));
  }
}

/**
 * Save query execution to history
 */
function saveToHistory(historyEntry: QueryHistory): void {
  try {
    const historyStr = localStorage.getItem(QUERY_HISTORY_STORAGE_KEY);
    const history: QueryHistory[] = historyStr ? JSON.parse(historyStr) : [];

    history.unshift(historyEntry);

    // Keep only last 50 queries
    const trimmedHistory = history.slice(0, 50);

    localStorage.setItem(QUERY_HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error('Error saving query history:', error);
  }
}

/**
 * Get query history
 */
export function getQueryHistory(limit: number = 20): QueryHistory[] {
  try {
    const historyStr = localStorage.getItem(QUERY_HISTORY_STORAGE_KEY);
    const history: QueryHistory[] = historyStr ? JSON.parse(historyStr) : [];
    return history.slice(0, limit);
  } catch (error) {
    console.error('Error loading query history:', error);
    return [];
  }
}

/**
 * Clear query history
 */
export function clearQueryHistory(): void {
  localStorage.removeItem(QUERY_HISTORY_STORAGE_KEY);
}

/**
 * Get query templates
 */
export function getQueryTemplates(): QueryTemplate[] {
  const defaultTemplates: QueryTemplate[] = [
    {
      id: 'all_males',
      name: 'All Male Records',
      description: 'Find all records with male gender',
      category: 'healthcare',
      query: {
        id: generateQueryId(),
        name: 'All Males',
        rootGroup: {
          id: 'root',
          operator: 'AND',
          conditions: [{
            id: 'cond1',
            field: 'sex',
            operator: 'equals',
            value: 'Male',
            fieldType: 'select'
          }]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        category: 'template'
      }
    },
    {
      id: 'recent_patients',
      name: 'Recent Patients',
      description: 'Patients visited in the last 30 days',
      category: 'healthcare',
      query: {
        id: generateQueryId(),
        name: 'Recent Patients',
        rootGroup: {
          id: 'root',
          operator: 'AND',
          conditions: [{
            id: 'cond1',
            field: 'lastVisit',
            operator: 'greater_than',
            value: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            fieldType: 'date'
          }]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        category: 'template'
      }
    },
    {
      id: 'missing_phone',
      name: 'Missing Phone Numbers',
      description: 'Records without phone numbers',
      category: 'custom',
      query: {
        id: generateQueryId(),
        name: 'Missing Phone Numbers',
        rootGroup: {
          id: 'root',
          operator: 'AND',
          conditions: [{
            id: 'cond1',
            field: 'phoneNumber',
            operator: 'is_empty',
            value: null,
            fieldType: 'text'
          }]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        category: 'template'
      }
    },
    {
      id: 'village_search',
      name: 'Specific Village',
      description: 'Records from a specific village',
      category: 'census',
      query: {
        id: generateQueryId(),
        name: 'Village Search',
        rootGroup: {
          id: 'root',
          operator: 'AND',
          conditions: [{
            id: 'cond1',
            field: 'village',
            operator: 'equals',
            value: '',
            fieldType: 'text'
          }]
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        category: 'template'
      }
    }
  ];

  // Try to get custom templates from storage
  try {
    const customTemplatesStr = localStorage.getItem(QUERY_TEMPLATES_STORAGE_KEY);
    const customTemplates: QueryTemplate[] = customTemplatesStr ? JSON.parse(customTemplatesStr) : [];
    return [...defaultTemplates, ...customTemplates];
  } catch (error) {
    console.error('Error loading query templates:', error);
    return defaultTemplates;
  }
}

/**
 * Create a new empty query
 */
export function createNewQuery(): Query {
  return {
    id: generateQueryId(),
    name: 'New Query',
    description: '',
    rootGroup: {
      id: 'root',
      operator: 'AND',
      conditions: []
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'user',
    category: 'saved'
  };
}

/**
 * Duplicate a query
 */
export function duplicateQuery(query: Query): Query {
  return {
    ...query,
    id: generateQueryId(),
    name: `${query.name} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Validate query
 */
export function validateQuery(query: Query): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!query.name || query.name.trim() === '') {
    errors.push('Query name is required');
  }

  if (!query.rootGroup.conditions.length && !(query.rootGroup.groups?.length)) {
    errors.push('Query must have at least one condition');
  }

  // Validate all conditions
  const validateConditions = (group: QueryGroup) => {
    group.conditions.forEach(condition => {
      if (!condition.field) {
        errors.push('All conditions must have a field selected');
      }
      if (!condition.operator) {
        errors.push('All conditions must have an operator selected');
      }
      if (condition.value === null || condition.value === undefined) {
        if (!['is_empty', 'is_not_empty'].includes(condition.operator)) {
          errors.push('All conditions must have a value');
        }
      }
    });

    (group.groups || []).forEach(nestedGroup => {
      validateConditions(nestedGroup);
    });
  };

  validateConditions(query.rootGroup);

  return {
    isValid: errors.length === 0,
    errors
  };
}

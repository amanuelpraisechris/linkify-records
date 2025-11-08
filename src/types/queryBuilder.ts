/**
 * Advanced Query Builder Types
 * Multi-field complex queries with AND/OR logic
 */

import { Record } from './index';

export type QueryOperator = 'AND' | 'OR';

export type FieldOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty'
  | 'in_list'
  | 'not_in_list';

export type QueryFieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'boolean'
  | 'select';

export interface QueryField {
  name: string;
  label: string;
  type: QueryFieldType;
  operators: FieldOperator[];
  options?: { value: string; label: string }[]; // For select fields
}

export interface QueryCondition {
  id: string;
  field: string;
  operator: FieldOperator;
  value: any;
  fieldType: QueryFieldType;
}

export interface QueryGroup {
  id: string;
  operator: QueryOperator;
  conditions: QueryCondition[];
  groups?: QueryGroup[]; // Nested groups for complex queries
}

export interface Query {
  id: string;
  name: string;
  description?: string;
  rootGroup: QueryGroup;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isFavorite?: boolean;
  category?: 'saved' | 'template' | 'history';
  executionCount?: number;
  lastExecuted?: string;
}

export interface QueryTemplate {
  id: string;
  name: string;
  description: string;
  category: 'healthcare' | 'census' | 'matching' | 'custom';
  query: Query;
  icon?: string;
}

export interface QueryResult {
  queryId: string;
  records: Record[];
  totalCount: number;
  executionTime: number; // ms
  executedAt: string;
  filters: QueryGroup;
}

export interface QueryHistory {
  id: string;
  query: Query;
  executedAt: string;
  resultCount: number;
  executionTime: number;
}

export interface BulkOperation {
  type: 'export' | 'delete' | 'update' | 'tag';
  recordIds: string[];
  parameters?: {
    exportFormat?: 'csv' | 'json' | 'excel';
    updateFields?: Record<string, any>;
    tags?: string[];
  };
}

// Available query fields for record searching
export const QUERY_FIELDS: QueryField[] = [
  {
    name: 'firstName',
    label: 'First Name',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty']
  },
  {
    name: 'lastName',
    label: 'Last Name',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'starts_with', 'ends_with', 'is_empty', 'is_not_empty']
  },
  {
    name: 'middleName',
    label: 'Middle Name',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'sex',
    label: 'Gender',
    type: 'select',
    operators: ['equals', 'not_equals', 'is_empty', 'is_not_empty'],
    options: [
      { value: 'Male', label: 'Male' },
      { value: 'Female', label: 'Female' },
      { value: 'Other', label: 'Other' }
    ]
  },
  {
    name: 'birthDate',
    label: 'Birth Date',
    type: 'date',
    operators: ['equals', 'not_equals', 'greater_than', 'less_than', 'is_empty', 'is_not_empty']
  },
  {
    name: 'village',
    label: 'Village',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'subVillage',
    label: 'Sub-Village',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'healthFacility',
    label: 'Health Facility',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'email',
    label: 'Email',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty']
  },
  {
    name: 'patientId',
    label: 'Patient ID',
    type: 'text',
    operators: ['equals', 'not_equals', 'contains', 'is_empty', 'is_not_empty']
  }
];

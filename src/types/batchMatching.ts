/**
 * Batch Matching System Types
 * Automated matching for large datasets with configurable rules
 */

import { MatchResult } from './matching';

export type BatchMatchStatus =
  | 'pending'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'
  | 'error';

export type AutoMatchStrategy =
  | 'high-confidence-only' // Auto-match only high confidence (>= threshold)
  | 'threshold-based'      // Auto-match above custom threshold
  | 'manual-review-all'    // Don't auto-match, queue all for review
  | 'best-match-only';     // Auto-match only the best match per record

export interface BatchMatchConfig {
  // Auto-matching rules
  autoMatchStrategy: AutoMatchStrategy;
  autoMatchThreshold: number; // 0-100, minimum confidence to auto-match
  maxMatchesPerRecord: number; // Maximum matches to consider per source record

  // Review rules
  manualReviewThreshold: number; // Below this, queue for manual review
  skipNoMatches: boolean; // Skip records with no matches above threshold

  // Performance settings
  batchSize: number; // Process records in batches of N
  pauseBetweenBatches: number; // Pause duration in ms between batches

  // Conflict resolution
  handleDuplicates: 'skip' | 'merge' | 'keep-all';
  allowMultipleMatches: boolean; // Allow one source to match multiple targets
}

export interface BatchMatchJob {
  id: string;
  createdAt: string;
  createdBy: string;
  status: BatchMatchStatus;

  // Input data
  sourceRecords: any[]; // Records to be matched
  targetRecords: any[]; // Records to match against
  config: BatchMatchConfig;

  // Progress tracking
  progress: {
    totalRecords: number;
    processedRecords: number;
    autoMatched: number;
    manualReviewQueue: number;
    noMatchFound: number;
    errors: number;
    startTime?: string;
    endTime?: string;
    estimatedTimeRemaining?: number; // in ms
  };

  // Results
  results: BatchMatchResult[];
  errors: BatchMatchError[];
}

export interface BatchMatchResult {
  sourceRecordId: string;
  sourceRecord: any;

  // Matching outcome
  matchStatus: 'auto-matched' | 'manual-review' | 'no-match' | 'error';
  selectedMatch?: MatchResult;
  alternativeMatches?: MatchResult[]; // Other potential matches

  confidence: number;
  processedAt: string;
  processingTime: number; // ms taken to process this record

  // Metadata
  metadata?: {
    algorithmUsed?: 'deterministic' | 'probabilistic';
    fieldScores?: Record<string, number>;
    [key: string]: any;
  };
}

export interface BatchMatchError {
  sourceRecordId: string;
  errorType: 'matching-error' | 'validation-error' | 'system-error';
  errorMessage: string;
  timestamp: string;
  stackTrace?: string;
}

export interface BatchMatchSummary {
  jobId: string;
  status: BatchMatchStatus;

  // Summary statistics
  stats: {
    totalRecords: number;
    autoMatched: number;
    manualReviewNeeded: number;
    noMatchFound: number;
    errors: number;

    // Performance metrics
    totalDuration: number; // ms
    averageTimePerRecord: number; // ms
    recordsPerSecond: number;
  };

  // Quality metrics
  quality: {
    averageConfidence: number;
    confidenceDistribution: {
      high: number; // >= 80%
      medium: number; // 60-79%
      low: number; // < 60%
    };
    fieldMatchRates: Record<string, number>; // % of records where field matched
  };

  // Actions to take
  actions: {
    recordsNeedingReview: string[]; // IDs of records needing manual review
    suggestedConfigChanges?: string[]; // Suggestions for config improvement
  };
}

export interface BatchMatchProgress {
  jobId: string;
  percentComplete: number;
  currentRecord: number;
  totalRecords: number;
  estimatedTimeRemaining: number; // ms
  currentStatus: string;
}

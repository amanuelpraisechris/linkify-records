/**
 * Batch Matching Service
 * Automated matching for large datasets with configurable rules
 */

import {
  BatchMatchJob,
  BatchMatchConfig,
  BatchMatchResult,
  BatchMatchStatus,
  BatchMatchSummary,
  BatchMatchError,
} from '@/types/batchMatching';
import { Record, RecordMatch, MatchResult } from '@/types';
import { calculateMatchScore } from '@/utils/matching/matchingCore';
import { calculateProbabilisticMatch } from '@/utils/matching/probabilistic';
import { MatchingConfig } from '@/types/matchingConfig';
import { logAudit, logError } from './auditService';

const BATCH_JOBS_STORAGE_KEY = 'batch_match_jobs';

/**
 * Generate unique batch job ID
 */
function generateBatchJobId(): string {
  return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current user information
 */
function getCurrentUser(): string {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      return user.id || user.email || 'unknown';
    } catch {
      return 'unknown';
    }
  }
  return 'system';
}

/**
 * Load batch jobs from storage
 */
function loadBatchJobs(): BatchMatchJob[] {
  try {
    const jobsStr = localStorage.getItem(BATCH_JOBS_STORAGE_KEY);
    if (!jobsStr) return [];
    return JSON.parse(jobsStr);
  } catch (error) {
    console.error('Error loading batch jobs:', error);
    return [];
  }
}

/**
 * Save batch jobs to storage
 */
function saveBatchJobs(jobs: BatchMatchJob[]): void {
  try {
    localStorage.setItem(BATCH_JOBS_STORAGE_KEY, JSON.stringify(jobs));
  } catch (error) {
    console.error('Error saving batch jobs:', error);
  }
}

/**
 * Update a specific batch job
 */
function updateBatchJob(jobId: string, updates: Partial<BatchMatchJob>): void {
  const jobs = loadBatchJobs();
  const index = jobs.findIndex(j => j.id === jobId);
  if (index >= 0) {
    jobs[index] = { ...jobs[index], ...updates };
    saveBatchJobs(jobs);
  }
}

/**
 * Find potential matches for a source record
 */
function findPotentialMatches(
  sourceRecord: Record,
  targetRecords: Record[],
  matchingConfig: MatchingConfig,
  algorithmType: 'deterministic' | 'probabilistic'
): Array<{ record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number} }> {
  const matches: Array<{ record: Record; score: number; matchedOn: string[]; fieldScores?: {[key: string]: number} }> = [];

  for (const targetRecord of targetRecords) {
    try {
      let result;

      if (algorithmType === 'probabilistic') {
        result = calculateProbabilisticMatch(sourceRecord, targetRecord, matchingConfig);
      } else {
        result = calculateMatchScore(sourceRecord, targetRecord, matchingConfig);
      }

      if (result.score > 0) {
        matches.push({
          record: targetRecord,
          score: result.score,
          matchedOn: result.matchedOn || [],
          fieldScores: result.fieldScores,
        });
      }
    } catch (error) {
      console.error('Error calculating match score:', error);
    }
  }

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Process a single record in batch
 */
function processSingleRecord(
  sourceRecord: Record,
  targetRecords: Record[],
  config: BatchMatchConfig,
  matchingConfig: MatchingConfig,
  algorithmType: 'deterministic' | 'probabilistic'
): BatchMatchResult {
  const startTime = Date.now();

  try {
    // Find potential matches
    const potentialMatches = findPotentialMatches(
      sourceRecord,
      targetRecords,
      matchingConfig,
      algorithmType
    );

    // Limit to max matches per record
    const limitedMatches = potentialMatches.slice(0, config.maxMatchesPerRecord);

    if (limitedMatches.length === 0) {
      return {
        sourceRecordId: sourceRecord.id,
        sourceRecord,
        matchStatus: 'no-match',
        confidence: 0,
        processedAt: new Date().toISOString(),
        processingTime: Date.now() - startTime,
        metadata: {
          algorithmUsed: algorithmType,
        },
      };
    }

    const bestMatch = limitedMatches[0];
    const alternativeMatches = limitedMatches.slice(1);

    // Determine match status based on strategy and threshold
    let matchStatus: BatchMatchResult['matchStatus'] = 'manual-review';

    switch (config.autoMatchStrategy) {
      case 'high-confidence-only':
        if (bestMatch.score >= config.autoMatchThreshold) {
          matchStatus = 'auto-matched';
        } else if (bestMatch.score >= config.manualReviewThreshold) {
          matchStatus = 'manual-review';
        } else {
          matchStatus = 'no-match';
        }
        break;

      case 'threshold-based':
        if (bestMatch.score >= config.autoMatchThreshold) {
          matchStatus = 'auto-matched';
        } else if (bestMatch.score >= config.manualReviewThreshold) {
          matchStatus = 'manual-review';
        } else {
          matchStatus = 'no-match';
        }
        break;

      case 'manual-review-all':
        matchStatus = 'manual-review';
        break;

      case 'best-match-only':
        if (bestMatch.score >= config.autoMatchThreshold && alternativeMatches.length === 0) {
          matchStatus = 'auto-matched';
        } else {
          matchStatus = 'manual-review';
        }
        break;
    }

    // Skip if configured and no match found
    if (config.skipNoMatches && bestMatch.score < config.manualReviewThreshold) {
      matchStatus = 'no-match';
    }

    return {
      sourceRecordId: sourceRecord.id,
      sourceRecord,
      matchStatus,
      selectedMatch: matchStatus === 'auto-matched' ? {
        record: bestMatch.record,
        score: bestMatch.score,
        matchedOn: bestMatch.matchedOn,
        fieldScores: bestMatch.fieldScores,
      } : undefined,
      alternativeMatches: alternativeMatches.map(m => ({
        record: m.record,
        score: m.score,
        matchedOn: m.matchedOn,
        fieldScores: m.fieldScores,
      })),
      confidence: bestMatch.score,
      processedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
      metadata: {
        algorithmUsed: algorithmType,
        fieldScores: bestMatch.fieldScores,
      },
    };
  } catch (error) {
    const err = error as Error;
    return {
      sourceRecordId: sourceRecord.id,
      sourceRecord,
      matchStatus: 'error',
      confidence: 0,
      processedAt: new Date().toISOString(),
      processingTime: Date.now() - startTime,
    };
  }
}

/**
 * Create a new batch matching job
 */
export function createBatchMatchJob(
  sourceRecords: Record[],
  targetRecords: Record[],
  config: BatchMatchConfig
): BatchMatchJob {
  const jobId = generateBatchJobId();
  const job: BatchMatchJob = {
    id: jobId,
    createdAt: new Date().toISOString(),
    createdBy: getCurrentUser(),
    status: 'pending',
    sourceRecords,
    targetRecords,
    config,
    progress: {
      totalRecords: sourceRecords.length,
      processedRecords: 0,
      autoMatched: 0,
      manualReviewQueue: 0,
      noMatchFound: 0,
      errors: 0,
    },
    results: [],
    errors: [],
  };

  // Save job
  const jobs = loadBatchJobs();
  jobs.push(job);
  saveBatchJobs(jobs);

  // Log audit
  logAudit({
    actionType: 'BATCH_MATCH_START',
    description: `Created batch matching job for ${sourceRecords.length} records`,
    severity: 'info',
    entityType: 'batch',
    entityId: jobId,
    metadata: {
      sourceRecordsCount: sourceRecords.length,
      targetRecordsCount: targetRecords.length,
      strategy: config.autoMatchStrategy,
      threshold: config.autoMatchThreshold,
    },
  });

  return job;
}

/**
 * Run batch matching job
 */
export async function runBatchMatchJob(
  jobId: string,
  matchingConfig: MatchingConfig,
  algorithmType: 'deterministic' | 'probabilistic',
  onProgress?: (progress: number, currentRecord: number) => void,
  onComplete?: (summary: BatchMatchSummary) => void
): Promise<void> {
  const jobs = loadBatchJobs();
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    throw new Error('Batch job not found');
  }

  if (job.status === 'running') {
    throw new Error('Job is already running');
  }

  // Update job status
  job.status = 'running';
  job.progress.startTime = new Date().toISOString();
  updateBatchJob(jobId, job);

  const { sourceRecords, targetRecords, config } = job;
  const batchSize = config.batchSize || 10;

  try {
    for (let i = 0; i < sourceRecords.length; i++) {
      // Check if job was cancelled
      const currentJob = loadBatchJobs().find(j => j.id === jobId);
      if (currentJob?.status === 'cancelled') {
        break;
      }

      const sourceRecord = sourceRecords[i];

      // Process single record
      const result = processSingleRecord(
        sourceRecord,
        targetRecords,
        config,
        matchingConfig,
        algorithmType
      );

      // Update job with result
      job.results.push(result);
      job.progress.processedRecords++;

      // Update statistics
      switch (result.matchStatus) {
        case 'auto-matched':
          job.progress.autoMatched++;
          break;
        case 'manual-review':
          job.progress.manualReviewQueue++;
          break;
        case 'no-match':
          job.progress.noMatchFound++;
          break;
        case 'error':
          job.progress.errors++;
          job.errors.push({
            sourceRecordId: sourceRecord.id,
            errorType: 'matching-error',
            errorMessage: 'Error processing record',
            timestamp: new Date().toISOString(),
          });
          break;
      }

      // Update storage and notify progress
      updateBatchJob(jobId, job);

      if (onProgress) {
        const progress = (job.progress.processedRecords / job.progress.totalRecords) * 100;
        onProgress(progress, job.progress.processedRecords);
      }

      // Pause between batches
      if ((i + 1) % batchSize === 0 && config.pauseBetweenBatches > 0) {
        await new Promise(resolve => setTimeout(resolve, config.pauseBetweenBatches));
      }
    }

    // Complete job
    job.status = 'completed';
    job.progress.endTime = new Date().toISOString();
    updateBatchJob(jobId, job);

    // Generate summary
    const summary = generateBatchSummary(job);

    // Log completion
    logAudit({
      actionType: 'BATCH_MATCH_COMPLETE',
      description: `Completed batch matching job with ${job.progress.autoMatched} auto-matched records`,
      severity: 'info',
      entityType: 'batch',
      entityId: jobId,
      metadata: {
        ...summary.stats,
      },
    });

    if (onComplete) {
      onComplete(summary);
    }
  } catch (error) {
    const err = error as Error;
    job.status = 'error';
    updateBatchJob(jobId, job);

    logError(err, `Batch matching job ${jobId} failed`);
    throw error;
  }
}

/**
 * Cancel a running batch job
 */
export function cancelBatchJob(jobId: string): void {
  const job = loadBatchJobs().find(j => j.id === jobId);
  if (job && job.status === 'running') {
    job.status = 'cancelled';
    updateBatchJob(jobId, job);

    logAudit({
      actionType: 'BATCH_MATCH_CANCEL',
      description: `Cancelled batch matching job at ${job.progress.processedRecords}/${job.progress.totalRecords} records`,
      severity: 'warning',
      entityType: 'batch',
      entityId: jobId,
    });
  }
}

/**
 * Get batch job by ID
 */
export function getBatchJob(jobId: string): BatchMatchJob | undefined {
  return loadBatchJobs().find(j => j.id === jobId);
}

/**
 * Get all batch jobs
 */
export function getAllBatchJobs(): BatchMatchJob[] {
  return loadBatchJobs();
}

/**
 * Delete a batch job
 */
export function deleteBatchJob(jobId: string): void {
  const jobs = loadBatchJobs();
  const filteredJobs = jobs.filter(j => j.id !== jobId);
  saveBatchJobs(filteredJobs);
}

/**
 * Generate batch summary
 */
export function generateBatchSummary(job: BatchMatchJob): BatchMatchSummary {
  const totalDuration = job.progress.endTime && job.progress.startTime
    ? new Date(job.progress.endTime).getTime() - new Date(job.progress.startTime).getTime()
    : 0;

  const averageTimePerRecord = job.results.length > 0
    ? job.results.reduce((sum, r) => sum + r.processingTime, 0) / job.results.length
    : 0;

  const recordsPerSecond = totalDuration > 0
    ? (job.progress.processedRecords / totalDuration) * 1000
    : 0;

  // Calculate confidence distribution
  const confidenceDistribution = {
    high: 0,
    medium: 0,
    low: 0,
  };

  let totalConfidence = 0;
  job.results.forEach(r => {
    totalConfidence += r.confidence;
    if (r.confidence >= 80) {
      confidenceDistribution.high++;
    } else if (r.confidence >= 60) {
      confidenceDistribution.medium++;
    } else {
      confidenceDistribution.low++;
    }
  });

  const averageConfidence = job.results.length > 0
    ? totalConfidence / job.results.length
    : 0;

  // Calculate field match rates
  const fieldMatchRates: Record<string, number> = {};
  const fieldCounts: Record<string, { matched: number; total: number }> = {};

  job.results.forEach(r => {
    if (r.metadata?.fieldScores) {
      Object.entries(r.metadata.fieldScores).forEach(([field, score]) => {
        if (!fieldCounts[field]) {
          fieldCounts[field] = { matched: 0, total: 0 };
        }
        fieldCounts[field].total++;
        if (score >= 80) {
          fieldCounts[field].matched++;
        }
      });
    }
  });

  Object.entries(fieldCounts).forEach(([field, counts]) => {
    fieldMatchRates[field] = (counts.matched / counts.total) * 100;
  });

  // Get records needing review
  const recordsNeedingReview = job.results
    .filter(r => r.matchStatus === 'manual-review')
    .map(r => r.sourceRecordId);

  return {
    jobId: job.id,
    status: job.status,
    stats: {
      totalRecords: job.progress.totalRecords,
      autoMatched: job.progress.autoMatched,
      manualReviewNeeded: job.progress.manualReviewQueue,
      noMatchFound: job.progress.noMatchFound,
      errors: job.progress.errors,
      totalDuration,
      averageTimePerRecord,
      recordsPerSecond,
    },
    quality: {
      averageConfidence,
      confidenceDistribution,
      fieldMatchRates,
    },
    actions: {
      recordsNeedingReview,
    },
  };
}

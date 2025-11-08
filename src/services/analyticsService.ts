/**
 * Analytics Service
 * Track and analyze matching performance
 */

import {
  MatchQualityMetrics,
  UserPerformanceMetrics,
  FieldMatchStatistics,
  TimeSeriesDataPoint
} from '@/types/analytics';
import { MatchResult } from '@/types';

const ANALYTICS_KEY = 'analytics_data';

interface AnalyticsData {
  matchResults: MatchResult[];
  dailyMetrics: Record<string, MatchQualityMetrics>;
}

/**
 * Load analytics data
 */
function loadAnalyticsData(): AnalyticsData {
  try {
    const dataStr = localStorage.getItem(ANALYTICS_KEY);
    if (dataStr) {
      return JSON.parse(dataStr);
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }

  return {
    matchResults: [],
    dailyMetrics: {}
  };
}

/**
 * Save analytics data
 */
function saveAnalyticsData(data: AnalyticsData): void {
  try {
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

/**
 * Track match result
 */
export function trackMatchResult(result: MatchResult): void {
  const data = loadAnalyticsData();
  data.matchResults.push(result);

  // Update daily metrics
  const date = new Date(result.matchedAt).toISOString().split('T')[0];
  if (!data.dailyMetrics[date]) {
    data.dailyMetrics[date] = {
      period: date,
      totalMatches: 0,
      autoMatched: 0,
      manualReview: 0,
      rejected: 0,
      averageConfidence: 0,
      confidenceDistribution: { high: 0, medium: 0, low: 0 },
      algorithmUsed: 'deterministic'
    };
  }

  const metrics = data.dailyMetrics[date];
  metrics.totalMatches++;

  if (result.status === 'matched') {
    metrics.autoMatched++;
  } else if (result.status === 'manual-review') {
    metrics.manualReview++;
  } else if (result.status === 'rejected') {
    metrics.rejected++;
  }

  if (result.confidence >= 80) {
    metrics.confidenceDistribution.high++;
  } else if (result.confidence >= 60) {
    metrics.confidenceDistribution.medium++;
  } else {
    metrics.confidenceDistribution.low++;
  }

  // Recalculate average confidence
  const allConfidences = data.matchResults
    .filter(r => new Date(r.matchedAt).toISOString().split('T')[0] === date)
    .map(r => r.confidence);
  metrics.averageConfidence = allConfidences.reduce((a, b) => a + b, 0) / allConfidences.length;

  saveAnalyticsData(data);
}

/**
 * Get match quality trend
 */
export function getMatchQualityTrend(days: number = 30): TimeSeriesDataPoint[] {
  const data = loadAnalyticsData();
  const trend: TimeSeriesDataPoint[] = [];

  const endDate = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(endDate);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    const metrics = data.dailyMetrics[dateStr];
    trend.push({
      timestamp: dateStr,
      value: metrics ? metrics.averageConfidence : 0,
      label: dateStr
    });
  }

  return trend;
}

/**
 * Get field match statistics
 */
export function getFieldMatchStatistics(): FieldMatchStatistics[] {
  const data = loadAnalyticsData();
  const fieldStats: Record<string, { total: number; score: number }> = {};

  data.matchResults.forEach(result => {
    if (result.fieldScores) {
      Object.entries(result.fieldScores).forEach(([field, score]) => {
        if (!fieldStats[field]) {
          fieldStats[field] = { total: 0, score: 0 };
        }
        fieldStats[field].total++;
        fieldStats[field].score += score;
      });
    }
  });

  return Object.entries(fieldStats).map(([field, stats]) => ({
    fieldName: field,
    totalComparisons: stats.total,
    matchCount: stats.total,
    matchRate: 100,
    averageScore: stats.score / stats.total,
    contributionToOverallScore: (stats.score / stats.total) / 100,
    trending: 'stable' as const
  }));
}

/**
 * Get overall statistics
 */
export function getOverallStatistics() {
  const data = loadAnalyticsData();

  const total = data.matchResults.length;
  const matched = data.matchResults.filter(r => r.status === 'matched').length;
  const rejected = data.matchResults.filter(r => r.status === 'rejected').length;
  const manualReview = data.matchResults.filter(r => r.status === 'manual-review').length;

  const avgConfidence = data.matchResults.length > 0
    ? data.matchResults.reduce((sum, r) => sum + r.confidence, 0) / data.matchResults.length
    : 0;

  return {
    totalMatches: total,
    matched,
    rejected,
    manualReview,
    averageConfidence: avgConfidence,
    matchRate: total > 0 ? (matched / total) * 100 : 0
  };
}

/**
 * Enhanced Analytics Types
 * Comprehensive metrics and trend tracking
 */

export interface MatchQualityMetrics {
  period: string; // ISO date or period identifier
  totalMatches: number;
  autoMatched: number;
  manualReview: number;
  rejected: number;
  averageConfidence: number;
  confidenceDistribution: {
    high: number; // >= 80%
    medium: number; // 60-79%
    low: number; // < 60%
  };
  algorithmUsed: 'deterministic' | 'probabilistic' | 'both';
}

export interface UserPerformanceMetrics {
  userId: string;
  userName: string;
  period: string;
  matchesProcessed: number;
  matchesPerHour: number;
  averageProcessingTime: number; // seconds
  accuracy: number; // % of matches that were correct
  decisiveness: number; // % of matches not sent for manual review
  loginCount: number;
  totalSessionTime: number; // minutes
  lastActive: string;
}

export interface FieldMatchStatistics {
  fieldName: string;
  totalComparisons: number;
  matchCount: number;
  matchRate: number; // percentage
  averageScore: number;
  contributionToOverallScore: number; // percentage
  trending: 'up' | 'down' | 'stable';
}

export interface DataQualityIndicator {
  metric: string;
  value: number;
  threshold: number;
  status: 'good' | 'warning' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  recommendation?: string;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface MatchTrendData {
  label: string;
  data: TimeSeriesDataPoint[];
  color?: string;
}

export interface AlgorithmComparison {
  deterministic: {
    totalMatches: number;
    averageConfidence: number;
    averageProcessingTime: number; // ms
    falsePositiveRate?: number;
    falseNegativeRate?: number;
  };
  probabilistic: {
    totalMatches: number;
    averageConfidence: number;
    averageProcessingTime: number; // ms
    falsePositiveRate?: number;
    falseNegativeRate?: number;
  };
  recommendation: 'deterministic' | 'probabilistic' | 'hybrid';
}

export interface AnalyticsDashboardConfig {
  userId: string;
  role: 'admin' | 'manager' | 'user';
  widgets: DashboardWidget[];
  layout: WidgetLayout[];
  refreshInterval: number; // seconds
  dateRange: {
    start: string;
    end: string;
    preset?: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
  };
}

export interface DashboardWidget {
  id: string;
  type:
    | 'match_quality_trend'
    | 'user_performance'
    | 'field_statistics'
    | 'data_quality'
    | 'algorithm_comparison'
    | 'recent_activity'
    | 'summary_stats';
  title: string;
  description?: string;
  size: 'small' | 'medium' | 'large';
  enabled: boolean;
  config?: any;
}

export interface WidgetLayout {
  widgetId: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export interface AnalyticsReport {
  id: string;
  name: string;
  type:
    | 'match_quality'
    | 'user_performance'
    | 'data_quality'
    | 'comprehensive';
  generatedAt: string;
  generatedBy: string;
  period: {
    start: string;
    end: string;
  };
  data: {
    summary: any;
    details: any;
    charts: any[];
    tables: any[];
  };
  format: 'pdf' | 'excel' | 'json';
}

export interface PerformanceBenchmark {
  category: string;
  metric: string;
  currentValue: number;
  benchmarkValue: number;
  unit: string;
  status: 'above' | 'at' | 'below';
  percentDifference: number;
}

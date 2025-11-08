/**
 * Enhanced Analytics Page
 * Comprehensive matching analytics and trends
 */

import { useState, useEffect } from 'react';
import {
  getMatchQualityTrend,
  getFieldMatchStatistics,
  getOverallStatistics
} from '@/services/analyticsService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, Target, Award } from 'lucide-react';

export default function EnhancedAnalytics() {
  const [trendData, setTrendData] = useState<any[]>([]);
  const [fieldStats, setFieldStats] = useState<any[]>([]);
  const [overallStats, setOverallStats] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = () => {
    const trend = getMatchQualityTrend(30);
    setTrendData(trend);

    const stats = getFieldMatchStatistics();
    setFieldStats(stats);

    const overall = getOverallStatistics();
    setOverallStats(overall);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enhanced Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive insights into matching performance and quality
        </p>
      </div>

      {/* Overall Statistics Cards */}
      {overallStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallStats.totalMatches}</div>
              <p className="text-xs text-muted-foreground mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Match Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {overallStats.matchRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {overallStats.matched} matched
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {overallStats.averageConfidence.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Average score</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium">Manual Review</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {overallStats.manualReview}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Needs review</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Match Quality Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Match Quality Trend</CardTitle>
          <CardDescription>Average confidence score over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Confidence']}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                name="Average Confidence"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Field Match Statistics */}
      {fieldStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Field Match Performance</CardTitle>
            <CardDescription>Average scores by field</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={fieldStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fieldName" />
                <YAxis domain={[0, 100]} />
                <Tooltip formatter={(value: number) => value.toFixed(1)} />
                <Legend />
                <Bar dataKey="averageScore" fill="#82ca9d" name="Average Score" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {overallStats && (
              <>
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium">Overall Performance</p>
                    <p className="text-sm text-muted-foreground">
                      You have processed {overallStats.totalMatches} records with an average
                      confidence of {overallStats.averageConfidence.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {overallStats.matchRate < 50 && (
                  <div className="flex items-start gap-2">
                    <Target className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Low Match Rate</p>
                      <p className="text-sm text-muted-foreground">
                        Your match rate is {overallStats.matchRate.toFixed(1)}%. Consider adjusting
                        matching thresholds or reviewing data quality.
                      </p>
                    </div>
                  </div>
                )}

                {overallStats.manualReview > overallStats.matched && (
                  <div className="flex items-start gap-2">
                    <Users className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-medium">High Manual Review Queue</p>
                      <p className="text-sm text-muted-foreground">
                        You have more records in manual review than matched. Consider using batch
                        matching with adjusted thresholds.
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
